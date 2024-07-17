// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs/promises");

// Hàm đọc file và phân tích nội dung
async function parseTranscript(filePath, sexSpeaker1, sexSpeaker2) {
  const transcript = [];
  const data = await fs.readFile(filePath, "utf-8");
  const lines = data.split("\n");
  const regex = /(Speaker\d+): \[(\d{2}:\d{2}:\d{2}:\d{2})\] (.+)/;

  lines.forEach((line) => {
    const match = line.match(regex);
    if (match) {
      const speaker = match[1] === "Speaker1" ? "User" : "Other";
      const timestamp = match[2];
      const text = match[3];
      const sex = match[1] === "Speaker1" ? sexSpeaker1 : sexSpeaker2;
      const avatar = "https://noidia.b-cdn.net/thumbnails/726447699727.jpg";
      transcript.push({ speaker, timestamp, text, sex, avatar });
    }
  });

  return transcript;
}

// Đường dẫn tới file chứa nội dung
const inputFilePath = "./input.txt";
const outputFilePath = "./chat_data.json";

async function main() {
  try {
    const transcriptData = await parseTranscript(
      inputFilePath,
      "male",
      "female"
    );

    // Ghi dữ liệu đã phân tích vào file JSON
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(transcriptData, null, 2),
      "utf-8"
    );

    console.log("Dữ liệu đã được ghi vào file JSON.");
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
  }
}

main();
