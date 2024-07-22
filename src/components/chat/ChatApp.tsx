import React, { useEffect, useRef, useState } from "react";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { ChatMessage } from "../../app/app";
import bgVideo from "../../asset/bg.mp4";
import imgHeader from "../../asset/header.png";
import styles from "./ChatApp.module.css";

interface ChatAppProps {
  chatData: ChatMessage[];
}

const ChatApp: React.FC<ChatAppProps> = ({ chatData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousMessageRef = useRef<ChatMessage | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when component mounts

    return () => {
      setIsMounted(false); // Set isMounted to false when component unmounts
    };
  }, []);

  useEffect(() => {
    const displayMessages = async () => {
      if (isMounted && currentIndex < chatData.length) {
        // Check if component is mounted before executing
        const currentMessage = chatData[currentIndex];
        if (currentIndex === 0) {
          // Delay for 2 seconds before displaying the first message
          await new Promise((resolve) => setTimeout(resolve, 4000));
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
        if (currentMessage.voiceBase64) {
          const audio = new Audio(
            `data:audio/wav;base64,${currentMessage.voiceBase64}`
          );
          audio.play();
          audio.onended = () => {
            setTimeout(() => {
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 500);
          };
        }
        previousMessageRef.current = currentMessage;
      }
    };

    displayMessages();
  }, [currentIndex, chatData, isMounted]);

  return (
    <div
      className="relative flex items-center justify-center  mx-auto border border-gray-300 shadow-lg overflow-hidden"
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
          {messages.map((msg) => (
            <div
              key={msg.timestamp}
              className={`flex ${
                msg.speaker === "Speaker1" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex ${
                  msg.speaker === "Speaker1" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.speaker !== "Speaker1" && (
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
                  position={msg.speaker === "Speaker1" ? "right" : "left"}
                  styles={{
                    backgroundColor:
                      msg.speaker === "Speaker1" ? "#FAE100" : "",
                    padding: 20,
                    borderRadius: 20,
                    borderTopLeftRadius: msg.speaker === "Speaker1" ? 20 : 0,
                    borderTopRightRadius: msg.speaker === "Speaker1" ? 0 : 20,
                  }}
                  notchStyle={{
                    fill: msg.speaker === "Speaker1" ? "#FAE100" : "",
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
