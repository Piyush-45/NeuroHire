/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth.actions";
import { getInterviewsByUserId } from "@/lib/interview.actions";
import InterviewCard from "@/components/InterviewCard";

async function Home() {
    const user = await getCurrentUser();

    if (!user?.id) {
        console.error("User not logged in");
        return;
    }

    let interviews = [];

    try {
        interviews = await getInterviewsByUserId(user.id);
        console.log(interviews);
    } catch (error) {
        console.error("Failed to fetch interviews", error);
    }

    const handleRedirect = user ? '/interview/new' : '/sign-up';

    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice real interview questions & get instant feedback
                    </p>

                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href={handleRedirect}>Start an Interview</Link>
                    </Button>
                </div>

                <Image
                    src="/robot.png"
                    alt="robo-dude"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {interviews.length > 0 ? (
                        interviews.map((interview) => (
                            <h1 key={interview.id}>hello</h1>
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Take Interviews</h2>

                {/* Placeholder for future logic */}
            </section>
        </>
    );
}

export default Home;
