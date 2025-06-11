"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createInterviewSession } from "@/lib/interview.actions"; // call server action/API

const jobRoles = ["Frontend Developer", "Backend Developer", "Data Scientist", "UI/UX Designer", "Product Manager", "FullStack Developer"];
const experienceLevels = ["fresher", "1-3", "3-5", "5+"];
const interviewTypes = ["technical", "behavioral", "mixed"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

const formSchema = z.object({
    name: z.string().optional(),
    role: z.string().min(1, { message: "Job role is required" }),
    difficulty: z.string().min(1, { message: "Difficulty is required" }),
    duration: z.coerce.number().min(1, { message: "Duration is required" }),
    techstack: z.string().min(1, { message: "Tech stack is required" }),
    interviewType: z.enum(["technical", "behavioral", "mixed"]),
    experienceLevel: z.enum(["fresher", "1-3", "3-5", "5+"]),
    preferredFocus: z.string().optional(),
    numberOfQuestions: z.coerce.number().min(1, { message: "At least 1 question" }),
});

export default function InterviewForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            role: "",
            difficulty: "",
            duration: 15,
            techstack: "",
            interviewType: "technical",
            experienceLevel: "fresher",
            preferredFocus: "",
            numberOfQuestions: 5,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const session = await createInterviewSession(values);
            if (session?.id) {
                router.push(`/interview/${session.id}`);
            } else {
                console.error("Session not created");
            }
        } catch (error) {
            console.error("Error creating interview session:", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Name (Optional)</FormLabel>
                            <FormControl><Input placeholder="Piyush" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Role</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                                    <SelectContent>
                                        {jobRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Select experience" /></SelectTrigger>
                                    <SelectContent>
                                        {experienceLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="interviewType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interview Type</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        {interviewTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                                    <SelectContent>
                                        {difficulties.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="techstack"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tech Stack</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., React, Node.js, MongoDB" rows={2} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="preferredFocus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Focus (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Avoid frontend basics, focus on API testing" rows={2} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 5" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interview Duration (minutes)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 15" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Start Interview</Button>
            </form>
        </Form>
    );
}
