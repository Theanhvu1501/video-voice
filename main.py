import json
import io
import base64
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav

# Tải và load tất cả các model
preload_models()

# Dữ liệu đầu vào
json_file = './chat_data.json'
with open(json_file, 'r', encoding='utf-8') as f:
    chatData = json.load(f)

# Lặp qua từng phần tử trong chatData
for index, data in enumerate(chatData):
    # Lấy nội dung text từ từ điển
    text_prompt = data["text"]
    speaker = data["speaker"]
    sex = data["sex"]
    # Chọn giọng nói
    if sex == "MALE":
        voice_preset = "v2/ko_speaker_1"
    else:
        voice_preset = "v2/ko_speaker_0"
    
    # Tạo âm thanh từ văn bản
    audio_array = generate_audio(text_prompt, voice_preset)
    
    bytes_io = io.BytesIO()
    write_wav(bytes_io, SAMPLE_RATE, audio_array)
    bytes_io.seek(0)  # Đặt con trỏ về đầu file
    audio_base64 = base64.b64encode(bytes_io.read()).decode('utf-8')

    # Thêm base64 vào mục data của từng mục trong chatData
    data["voiceBase64"] = audio_base64


# Ghi chatData vào file JSON
with open('chat_data.json', 'w', encoding='utf-8') as f:
    json.dump(chatData, f, ensure_ascii=False, indent=4)

print("Dữ liệu đã được ghi vào file chat_data.json và các tệp âm thanh đã được lưu trong thư mục audio_files.")
