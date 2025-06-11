

'use server';

import { db } from '@/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { getCurrentUser } from './auth.actions';
import { feedbackSchema } from '@/constants';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';

type InterviewData = {
    name: string;
    role: string;
    difficulty: string;
    duration: number;
    context?: string;
    type?: string;
    techstack?: string;
    interviewType?: string;
    experienceLevel?: string;
    preferredFocus?: string;
    numberOfQuestions?: number;
    userId?: string;
};

type GetLatestInterviewsParams = {
    userId: string;
    limit?: number;
};

export async function createInterviewSession(data: InterviewData) {
    const userId = await getCurrentUser()
    console.log(userId)
    try {
        const docRef = await db.collection('interviews').add({
            ...data,
            userId: userId?.id,
            createdAt: Timestamp.now(),
            status: 'pending',
        });

        return { id: docRef.id };
    } catch (err) {
        console.error('Error creating session:', err);
        throw new Error('Failed to create interview session');
    }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const doc = await db.collection('interviews').doc(id).get();
    const data = doc.data();

    if (!data) return null;

    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
    } as Interview;
}

export async function getLatestInterviews(
    params: GetLatestInterviewsParams
): Promise<Interview[]> {
    const { userId, limit = 20 } = params;
    const interviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

// interview.actions.ts
export async function getInterviewsByUserId(userId: string): Promise<Interview[]> {
    const snapshot = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}



// ! feedback actions

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    try {
        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`
            )
            .join("");

        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
          You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
          Transcript:
          ${formattedTranscript}
  
          Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
          - **Communication Skills**: Clarity, articulation, structured responses.
          - **Technical Knowledge**: Understanding of key concepts for the role.
          - **Problem-Solving**: Ability to analyze problems and propose solutions.
          - **Cultural & Role Fit**: Alignment with company values and job role.
          - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
          `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const feedback = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };

        let feedbackRef;

        if (feedbackId) {
            feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = db.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);

        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}