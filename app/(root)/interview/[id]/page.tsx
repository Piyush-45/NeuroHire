import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/auth.actions";
import { getInterviewById } from "@/lib/interview.actions";
import { redirect } from "next/navigation";


const Page = async ({ params }: RouteParams) => {
    const { id } = await params;

    const interview = await getInterviewById(id); // this is async
    const user = await getCurrentUser();

    if (!interview) redirect("/");
    if (!user) redirect("/sign-up");

    return (
        <>
            <h3>{interview.role} Interview</h3>
            <Agent
                {...interview}
                interviewId={id}
                name={user.name}
                userId={user.id}


            />
        </>
    );
};

export default Page;
