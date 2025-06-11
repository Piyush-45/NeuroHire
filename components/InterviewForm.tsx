// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"

// import { redirect } from "next/navigation"


// const jobRoles = ["Frontend Developer", "Backend Developer", "Data Scientist", "UI/UX Designer", "Product Manager", "FullStack Developer"]
// const difficultyLevels = ["Beginner", "Intermediate", "Advanced"]

// const formSchema = z.object({
//     name: z.string().min(1, { message: "Name is required." }),
//     role: z.string().min(1, { message: "Job role is required." }),
//     language: z.string().min(1, { message: "coding language is required." }),
//     difficulty: z.string().min(1, { message: "Difficulty is required." }),
//     voice: z.string().min(1, { message: "Voice is required." }),
//     tone: z.string().min(1, { message: "Tone is required." }),
//     duration: z.coerce.number().min(1, { message: "Duration is required." }),
//     // context: z.string().optional(),
// })

// const InterviewForm = () => {
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             name: "",
//             role: "",
//             language: "",
//             difficulty: "",
//             voice: "",
//             tone: "",
//             duration: 15,
//             // context: "",
//         },
//     })

//     // const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     //     const session = await createInterviewSession(values)

//     //     if (session) {
//     //         redirect(`/companions/${session.id}`)
//     //     } else {
//     //         console.error("Failed to create interview session")
//     //         redirect("/")
//     //     }
//     // }

//     return (
//         <Form {...form}>
//             <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
//                 <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Interviewee Name</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     placeholder="Enter name"
//                                     {...field}
//                                     className="input"
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="role"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Job Role</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input capitalize">
//                                         <SelectValue placeholder="Select role" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {jobRoles.map((role) => (
//                                             <SelectItem
//                                                 key={role}
//                                                 value={role}
//                                                 className="capitalize"
//                                             >
//                                                 {role}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="language"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Language Name</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     placeholder="Enter name"
//                                     {...field}
//                                     className="input"
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="difficulty"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Difficulty Level</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input capitalize">
//                                         <SelectValue placeholder="Select difficulty" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {difficultyLevels.map((level) => (
//                                             <SelectItem
//                                                 key={level}
//                                                 value={level}
//                                                 className="capitalize"
//                                             >
//                                                 {level}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="voice"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Voice</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input">
//                                         <SelectValue placeholder="Select voice" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="male">Male</SelectItem>
//                                         <SelectItem value="female">Female</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="tone"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Tone</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input">
//                                         <SelectValue placeholder="Select tone" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="formal">Formal</SelectItem>
//                                         <SelectItem value="friendly">Friendly</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="duration"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Duration (minutes)</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     type="number"
//                                     placeholder="15"
//                                     {...field}
//                                     className="input"
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />


//                 <Button type="submit" className="w-full cursor-pointer">
//                     Start Interview
//                 </Button>
//             </form>
//         </Form>
//     )
// }

// export default InterviewForm


"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { redirect } from "next/navigation"
import { configureInterviewAssistant } from "@/lib/vapiAssitant"
import { createInterviewSession } from "@/lib/interview.actions"

// Constants
const jobRoles = ["Frontend Developer", "Backend Developer", "Data Scientist", "UI/UX Designer", "Product Manager", "FullStack Developer"]
const experienceLevels = ["Fresher", "1-2 years", "2-4 years", "5+ years"]
const interviewTypes = ["technical", "behavioral", "mixed"]

// Schema
const formSchema = z.object({
    name: z.string().optional(),
    role: z.string().min(1, { message: "Role is required." }),
    experience: z.string().min(1, { message: "Experience level is required." }),
    type: z.enum(["technical", "behavioral", "mixed"]),
    techstack: z.string().min(1, { message: "Tech stack is required." }),
    amount: z.coerce.number().min(1, { message: "Number of questions required." }),
})

const InterviewForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            role: "",
            experience: "",
            type: "technical",
            techstack: "",
            amount: 5,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const session = await createInterviewSession(values)

        if (session) {
            redirect(`/interviews/${session.id}`)
        } else {
            console.error("Failed to create interview session")
            redirect("/")
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                            </FormControl>
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {experienceLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interview Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {interviewTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
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
                                <Textarea
                                    placeholder="e.g. React, Node.js, PostgreSQL"
                                    {...field}
                                    rows={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g. 5" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Start Interview
                </Button>
            </form>
        </Form>
    )
}

export default InterviewForm
