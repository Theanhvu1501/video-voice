import json
import os
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav

# Set environment variables for Bark
os.environ["SUNO_OFFLOAD_CPU"] = "True"
os.environ["SUNO_USE_SMALL_MODELS"] = "True"

# Load all models
preload_models()

# Input data
json_file = './chat_data.json'
with open(json_file, 'r', encoding='utf-8') as f:
    chatData = json.load(f)

# Create a directory for audio files if it doesn't exist
audio_dir = 'audio_files'
os.makedirs(audio_dir, exist_ok=True)

# Iterate over each item in chatData
for index, data in enumerate(chatData):
    # Get text content from the dictionary
    text_prompt = data["text"]
    speaker = data["speaker"]
    sex = data["sex"]
    
    # Select voice preset based on sex
    if sex == "MALE":
        voice_preset = "v2/ko_speaker_6"
    else:
        voice_preset = "v2/ko_speaker_0"
    
    # Generate audio from text
    audio_array = generate_audio(text_prompt, voice_preset)
    
    # Define the path for the audio file
    audio_filename = f'{audio_dir}/audio_{index}.wav'
    
    # Save the audio to a WAV file
    write_wav(audio_filename, SAMPLE_RATE, audio_array)
    
    # Update the JSON data with the path to the audio file
    data["audioFile"] = audio_filename

# Write updated chatData to the JSON file
with open('chat_data.json', 'w', encoding='utf-8') as f:
    json.dump(chatData, f, ensure_ascii=False, indent=4)

print("Dữ liệu đã được ghi vào file chat_data.json và các tệp âm thanh đã được lưu trong thư mục audio_files.")
