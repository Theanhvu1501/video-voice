import axios from "axios";
import React, { useState } from "react";

const TextToVoice: React.FC = () => {
  const [text, setText] = useState<string>("");

  function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const handleSubmit = async () => {
    const apiKey: string = ""; // Thay thế với API key của bạn
    const url: string = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const request = {
      input: { text: text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Journey-D",
      },
      audioConfig: {
        audioEncoding: "MP3",
        effectsProfileId: ["small-bluetooth-speaker-class-device"],
        pitch: 0,
        speakingRate: 1,
      },
    };

    try {
      const response = await axios.post(url, request);
      const arrayBuffer = base64ToArrayBuffer(response?.data?.audioContent);
      const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio();
      audio.src = blobUrl;
      audio.play();
    } catch (error) {
      console.error("Error calling Text-to-Speech API:", error);
    }
  };

  return (
    <div>
      <h1>Text-to-Speech</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        cols={50}
      />
      <button onClick={handleSubmit}>Convert to Speech</button>
    </div>
  );
};

export default TextToVoice;
