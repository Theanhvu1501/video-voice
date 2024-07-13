import axios from "axios";
import { SexType } from "../../constants";

class VoiceService {
  getVoiceBase64 = async (text: string, sex: SexType) => {
    const apiKey: string = import.meta.env.VITE_GOOGLE_API_KEY;
    const url: string = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const name = sex === SexType.FEMALE ? "ko-KR-Neural2-A" : "ko-KR-Neural2-C";
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
