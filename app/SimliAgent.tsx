import React, { useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoBox from "@/app/Components/VideoBox";
import cn from "./utils/TailwindMergeAndClsx";
import IconSparkleLoader from "@/media/IconSparkleLoader";

interface SimliAgentProps {
  simli_faceid: string;
  initialPrompt: string;
  onStart: () => void;
  onClose: () => void;
  showDottedFace: boolean;
}

// Get your Simli API key from https://app.simli.com/
const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY;

const SimliAgent: React.FC<SimliAgentProps> = ({ 
  simli_faceid, 
  initialPrompt, 
  onStart, 
  onClose,
  showDottedFace
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const [tempRoomUrl, setTempRoomUrl] = useState<string>("");
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const myCallObjRef = useRef<DailyCall | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  /**
   * Create a new Simli room and join it using Daily
   */
  const handleJoinRoom = async () => {
    // Set loading state
    setIsLoading(true);

    try {
      // Create a session with the Simli API
      const response = await fetch("https://api.simli.ai/startE2ESession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: SIMLI_API_KEY,
          faceId: simli_faceid,
          voiceId: "63406bbd-ce1b-4fff-8beb-86d3da9891b9",
          firstMessage: "Hello, miben segíthetek?",
          systemPrompt: initialPrompt,
          language: "hu",
        }),
      });

      const data = await response.json();
      
      // Ellenőrizzük, hogy a roomUrl létezik és string típusú
      if (!data.roomUrl || typeof data.roomUrl !== 'string') {
        console.error("Invalid roomUrl received from API:", data);
        setError("Invalid room URL received from the server.");
        setIsLoading(false);
        return;
      }
      
      const roomUrl = data.roomUrl;
      console.log("Room URL:", roomUrl);

      // Print the API response 
      console.log("API Response", data);

      // Create a new Daily call object
      let newCallObject = DailyIframe.getCallInstance();
      if (newCallObject === undefined) {
        newCallObject = DailyIframe.createCallObject({
          videoSource: false,
        });
      }

      // Setting my default username
      newCallObject.setUserName("User");

      // Join the Daily room
      await newCallObject.join({ url: roomUrl });
      myCallObjRef.current = newCallObject;
      console.log("Joined the room with callObject", newCallObject);
      setCallObject(newCallObject);

      // Start checking if Simli's Chatbot Avatar is available
      loadChatbot();
    } catch (error) {
      console.error("Error joining room:", error);
      setIsLoading(false);
    }
  };  

  /**
   * Checking if Simli's Chatbot avatar is available then render it
   */
  const loadChatbot = async () => {
    if (myCallObjRef.current) {
      let chatbotFound: boolean = false;

      const participants = myCallObjRef.current.participants();
      for (const [key, participant] of Object.entries(participants)) {
        if (participant.user_name === "Chatbot") {
          setChatbotId(participant.session_id);
          chatbotFound = true;
          setIsLoading(false);
          setIsAvatarVisible(true);
          onStart();
          break; // Stop iteration if you found the Chatbot
        }
      }
      if (!chatbotFound) {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  };  

  /**
   * Leave the room
   */
  const handleLeaveRoom = async () => {
    if (callObject) {
      await callObject.leave();
      setCallObject(null);
      onClose();
      setIsAvatarVisible(false);
      setIsLoading(false);
    } else {
      console.log("CallObject is null");
    }
  };

  /**
   * Mute participant audio
   */
  const handleMute = async () => {
    if (callObject) {
      callObject.setLocalAudio(false);
    } else {
      console.log("CallObject is null");
    }
  };

  // Hibaüzenet megjelenítésére
  const [error, setError] = useState<string>("");

  return (
    <>
      {isAvatarVisible && (
        <div className="h-[350px] w-[350px]">
          {callObject && (
            <DailyProvider callObject={callObject}>
              {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
            </DailyProvider>
          )}
        </div>
      )}
      <div className="flex flex-col items-center">
        {error && (
          <div className="text-red-500 mb-2 text-center">{error}</div>
        )}
        {!isAvatarVisible ? (
          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
            className={cn(
              "w-full h-[52px] mt-4 disabled:bg-[#343434] disabled:text-white disabled:hover:rounded-[100px] bg-simliblue text-white py-3 px-6 rounded-[100px] transition-all duration-300 hover:text-black hover:bg-white hover:rounded-sm",
              "flex justify-center items-center"
            )}
          >
            {isLoading ? (
              <IconSparkleLoader className="h-[20px] animate-loader" />
            ) : (
              <span className="font-abc-repro-mono font-bold w-[164px]">
                Test Interaction
              </span>
            )}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={handleLeaveRoom}
                className={cn(
                  "mt-4 group text-white flex-grow bg-red hover:rounded-sm hover:bg-white h-[52px] px-6 rounded-[100px] transition-all duration-300"
                )}
              >
                <span className="font-abc-repro-mono group-hover:text-black font-bold w-[164px] transition-all duration-300">
                  Stop Interaction
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SimliAgent;
