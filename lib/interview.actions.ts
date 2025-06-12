

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
         You are an AI interviewer analyzing a mock interview. Your task is to critically evaluate the candidate’s performance across the categories below, based solely on the content of the transcript.

If the candidate does not provide clear, complete, or relevant responses—even if the transcript is short—your analysis must reflect that. Avoid giving average or above-average scores without strong justification. Do not assume intent or skill—only evaluate what's clearly demonstrated.

Your evaluation should be honest, fair, and grounded in realistic interview expectations. Be detailed and constructive in your feedback, pointing out specific weaknesses, gaps, or red flags. Also highlight strong moments, if any.

Transcript:
${formattedTranscript}

Please score the candidate from 0 to 100 **in each** of the following categories. Justify each score with a paragraph that includes direct observations from the transcript. Do not add or remove categories.

- **Communication Skills**: Clarity, structure, and articulation of responses.
- **Technical Knowledge**: Understanding and application of key concepts relevant to the role.
- **Problem-Solving**: Logical thinking, problem breakdown, and solution approach.
- **Cultural & Role Fit**: Alignment with the company’s values, team compatibility, and suitability for the role.
- **Confidence & Clarity**: Overall confidence in responses, self-assuredness, and how clearly ideas were expressed.

End with a brief overall summary and recommendation (e.g., Strong candidate / Needs improvement / Not suitable yet).

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

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}
