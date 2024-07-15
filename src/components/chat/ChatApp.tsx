import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { voiceService } from "../../api";
import bgVideo from "../../asset/bg.mp4";
import imgHeader from "../../asset/header.png";
import { SexType } from "../../constants";
import styles from "./ChatApp.module.css";
import audioUrl from '../../../audio_files/audio_0.wav'

interface ChatMessage {
  speaker: string;
  text: string;
  sex: SexType;
  timestamp: string;
  avatar?: string;
  voiceBase64?: string;
  audioFile?:string;
}

interface ChatAppProps {
  chatData: ChatMessage[];
}

const ChatApp: React.FC<ChatAppProps> = ({ chatData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousMessageRef = useRef<ChatMessage | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when component mounts

    return () => {
      setIsMounted(false); // Set isMounted to false when component unmounts
    };
  }, []);

  useEffect(() => {
    const displayMessages = async () => {
      if (isMounted && currentIndex < chatData.length && hasUserInteracted) {
        // Check if component is mounted before executing
        const currentMessage = chatData[currentIndex];
        if (currentIndex === 0) {
          // Delay for 2 seconds before displaying the first message
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, currentMessage];
          if (updatedMessages.length > 3) {
            updatedMessages.shift();
            updatedMessages.shift();
            updatedMessages.shift();
          }
          return updatedMessages;
        });
        if (currentMessage.audioFile) {
          const audio = new Audio(
            `../../../${currentMessage.audioFile}`
          );
          audio.play().catch(error => console.error('Error playing audio:', error));;
          audio.onended = () => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
          };
        }
        previousMessageRef.current = currentMessage;
      }
    };

    displayMessages();
  }, [currentIndex, chatData, isMounted, hasUserInteracted]);

  const loadVoice = useCallback(async () => {
    const voices = await Promise.all(
      chatData.map((voice) => {
        return voiceService.getVoiceBase64(voice.text, voice.sex);
      })
    );
    chatData.forEach((message, index) => {
      message.voiceBase64 = voices[index];
    });
  }, [chatData]);

  return !hasUserInteracted ? (
    <>
      <button
        onClick={() => setHasUserInteracted(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Chat
      </button>
      <button
        onClick={loadVoice}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        LoadVoice
      </button>
    </>
  ) : (
    <div
      className="relative  mx-auto border border-gray-300 shadow-lg overflow-hidden"
      style={{
        height: 720,
        width: 1280,
      }}
    >
      <video
        className="absolute top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover z-0"
        autoPlay
        muted
        loop
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className="relative z-10  mx-auto border border-gray-300 shadow-lg"
        style={{
          height: 720,
          width: 1280,
        }}
      >
        <img src={imgHeader} className={styles.animatedImage} />
        <div className=" mb-4 p-4">
          {messages.map((msg, index) => (
            <div
              key={msg.timestamp} 
              className={`flex ${
                msg.speaker === "User" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex ${
                  msg.speaker === "User" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.speaker !== "User" && (
                  <img
                    src={msg.avatar || ""}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full mr-2"
                  />
                )}
                <MessageBox
                  type="text"
                  text={msg?.text}
                  date={new Date(msg.timestamp)}
                  position={msg.speaker === "User" ? "right" : "left"}
                  styles={{
                    backgroundColor: msg.speaker === "User" ? "#4FDE53" : "",
                    padding: 20,
                    borderRadius: 50,
                    borderTopLeftRadius: msg.speaker === "Other" ? 0 : 50,
                    borderTopRightRadius: msg.speaker === "User" ? 0 : 50,
                  }}
                  notchStyle={{
                    fill: msg.speaker === "User" ? "#4FDE53" : "",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
