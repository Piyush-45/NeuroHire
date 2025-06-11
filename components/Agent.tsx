"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { configureInterviewAssistant } from "@/lib/vapiAssitant";
import { createFeedback } from "@/lib/interview.actions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
interface Message {
  type: string;
  transcriptType?: string;
  role: "user" | "assistant";
  transcript: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  type: "generate" | "feedback";
  name: string;
  feedbackId: string;
  role: string;
  difficulty: string;
  techstack: string;
  interviewType: string;
  experienceLevel: string;
  preferredFocus?: string;
  numberOfQuestions: number;
  duration: string;
  interviewId: string;
}
interface InterviewData {
  interviewId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  messages: SavedMessage[];
  callStatus: CallStatus;
  interviewConfig: {
    role: string;
    difficulty: string;
    techstack: string;
    interviewType: string;
    experienceLevel: string;
    numberOfQuestions: number;
  };
}


interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  role,
  interviewId,
  userId,
  difficulty,
  duration,
  techstack,
  interviewType,
  experienceLevel,
  preferredFocus,
  numberOfQuestions,
}: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");



  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
        setLastMessage(message.transcript);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("Vapi error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      console.log("✅ Call started successfully");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = (endedReason?: any) => {
      console.log("📞 Call ended:", endedReason);

      // Log specific end reasons for debugging
      if (endedReason) {
        console.log("End reason details:", {
          reason: endedReason.reason || endedReason,
          type: typeof endedReason,
          full: endedReason
        });
      }

      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      console.log("📨 Message received:", message);

      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role as "user" | "assistant",
          content: message.transcript
        };
        setMessages((prev) => [...prev, newMessage]);
        setLastMessage(message.transcript);
      }
    };

    const onSpeechStart = () => {
      console.log("🎤 Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("🔇 Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.error("❌ Vapi error details:", {
        error,
        type: typeof error,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        keys: error ? Object.keys(error) : 'no keys',
        stringified: JSON.stringify(error, null, 2)
      });

      // Check if it's a configuration error
      if (error?.message?.includes('assistant') || error?.code?.includes('assistant')) {
        console.error("🤖 Assistant configuration error detected");
      }

      // Set call status to finished on error
      setCallStatus(CallStatus.FINISHED);
    };

    // Add connection state handler
    const onConnectionStateChange = (state: any) => {
      console.log("🔌 Connection state changed:", state);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Add more event listeners for debugging
    vapi.on("volume-level", (volume: number) => {
      // Comment out if too noisy: console.log("🔊 Volume:", volume);
    });

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // Enhanced handleCall function with better error handling
  const handleCall = async () => {
    try {
      console.log("🚀 Starting call with config:", {
        userName,
        role,
        difficulty,
        duration,
        techstack,
        interviewType,
        experienceLevel,
        numberOfQuestions,
        preferredFocus,
      });

      setCallStatus(CallStatus.CONNECTING);

      const assistantOverrides = {
        variableValues: {
          userName,
          role,
          difficulty,
          duration,
          techstack,
          interviewType,
          experienceLevel,
          numberOfQuestions,
          preferredFocus,
        },
        clientMessages: ["transcript"],
        serverMessages: ["transcript"], // Add this
      };

      console.log("🔧 Assistant overrides:", assistantOverrides);

      const assistantConfig = configureInterviewAssistant();
      console.log("🤖 Assistant config:", assistantConfig);

      await vapi.start(assistantConfig, assistantOverrides);

    } catch (error) {
      console.error("💥 Failed to start call:", error);
      setCallStatus(CallStatus.FINISHED);

      // Show user-friendly error
      alert(`Failed to start call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);

  };

  // useEffect(() => {
  //   const handleGenerateFeedback = async () => {
  //     if (!messages.length) return;

  //     console.log("🛠 Generating feedback...");
  //     const { success, feedbackId: id } = await createFeedback({
  //       interviewId,
  //       userId,
  //       transcript: messages,
  //     });

  //     if (success && id) {
  //       router.push(`/interview/${interviewId}/feedback`);
  //     } else {
  //       router.push("/");
  //     }
  //   };

  //   if (callStatus === CallStatus.FINISHED) {
  //     handleGenerateFeedback();

  //   }
  // }, [callStatus, interviewId, userId, router,]);






  return (
    <>
      <div className="call-view">
        {/* Interviewer */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="AI" width={65} height={54} className="object-cover" />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="User"
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* Last message shown as transcript */}
      {lastMessage && (
        <div className="transcript-border">
          <div className="transcript">
            <p className={cn("transition-opacity animate-fadeIn")}>{lastMessage}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
