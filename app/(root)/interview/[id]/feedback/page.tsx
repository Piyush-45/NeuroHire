import { getCurrentUser } from '@/lib/auth.actions';
import { getInterviewById } from '@/lib/interview.actions';
import { redirect } from 'next/navigation';
import React from 'react'

const FeedbackPage = async ({ params }: RouteParams) => {
    const { id } = await params

    const user = await getCurrentUser()
    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    // const feedback = await getFeedbackByInterviewId({
    //     interviewId: id,
    //     userId: user?.id!,
    // });

    console.log(id)
    return (
        <div>FeedbackPage</div>
    )
}

export default FeedbackPage