import axios from "axios";

class VoiceService {
  getVoiceBase64 = async (text: string, name: string, apiKey: string) => {
    const url: string = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const request = {
      input: { text: text },
      voice: {
        languageCode: "ko-KR",
        name,
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
      return response?.data?.audioContent;
    } catch (error) {
      console.error("Error calling Text-to-Speech API:", error);
    }
  };
}

export const voiceService = new VoiceService();
