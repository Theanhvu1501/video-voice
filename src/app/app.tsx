import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  message,
  Row,
  Select,
  Spin,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { voiceService } from "../api";
import ChatApp from "../components/chat/ChatApp";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export interface ChatMessage {
  speaker: string;
  text: string;
  voiceName: string;
  timestamp: string;
  avatar?: string;
  voiceBase64?: string;
}

const voices = ["ko-KR-Neural2-A", "ko-KR-Neural2-B", "ko-KR-Neural2-C"];
function App() {
  const [form] = useForm();
  const [data, setData] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);

  async function parseTranscript() {
    const formValues = await form.getFieldsValue();
    const { speaker1, speaker2, speaker3, avatar2, avatar3, data } = formValues;
    const transcript: unknown[] = [];

    const lines = data.split("\n");
    const regex = /(Speaker\d+): \[(\d{2}:\d{2}:\d{2}:\d{2})\] (.+)/;

    lines.forEach((line: string) => {
      const match = line.match(regex);
      if (match) {
        const speaker = match[1];
        const timestamp = match[2];
        const text = match[3];
        const voiceName = speaker?.includes("1")
          ? speaker1
          : speaker.includes("2")
          ? speaker2
          : speaker3;

        const avatar = speaker?.includes("1")
          ? avatar2
          : speaker.includes("2")
          ? avatar2
          : avatar3;
        transcript.push({ speaker, timestamp, text, voiceName, avatar });
      }
    });
    return transcript as ChatMessage[];
  }

  const onConfig = async () => {
    try {
      setLoading(true);
      const transcript = await parseTranscript();
      const token = await form.getFieldValue("token");
      const voices = await Promise.all(
        transcript?.map((i: ChatMessage) =>
          voiceService.getVoiceBase64(i.text, i.voiceName, token)
        )
      );
      transcript.forEach((message, index) => {
        message.voiceBase64 = voices[index];
      });
      setData(transcript);
      message.success("Config thành công!");
    } catch (error) {
      message.error("Config thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return !isStart ? (
    <Spin spinning={loading}>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card
          title="Cấu hình"
          className="w-5/6"
          actions={[
            <Button
              className="w-4/6"
              type="default"
              key={"1"}
              onClick={onConfig}
            >
              Config
            </Button>,
            <Button
              className="w-4/6"
              type="default"
              key={"2"}
              onClick={() => setIsStart(true)}
            >
              Start
            </Button>,
          ]}
        >
          <Form form={form} {...formItemLayout} labelAlign="left">
            <Row gutter={32}>
              <Col span={8}>
                <Alert
                  className="mb-5"
                  message="Chú ý"
                  description={
                    <>
                      <div>ko-KR-Neural2-A: Giọng Nữ</div>
                      <div>ko-KR-Neural2-B: Giọng Nữ</div>
                      <div>ko-KR-Neural2-C: Giọng Nam</div>
                    </>
                  }
                  type="warning"
                />
                <Form.Item name="token" label="Token">
                  <Input />
                </Form.Item>
                {["speaker1", "speaker2", "speaker3"].map((i, index) => {
                  return (
                    <>
                      <Form.Item key={i} name={i} label={`Voice ${index + 1}`}>
                        <Select>
                          {voices.map((v) => (
                            <Select.Option key={v} value={v}>
                              {v}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  );
                })}
                {["speaker2", "speaker3"].map((i, index) => {
                  return (
                    <>
                      <Form.Item
                        key={i}
                        name={`avatar${index + 2}`}
                        label={`Avatar ${index + 2}`}
                        initialValue={
                          "https://noidia.b-cdn.net/thumbnails/726447699727.jpg"
                        }
                      >
                        <Input />
                      </Form.Item>
                    </>
                  );
                })}
              </Col>
              <Col span={16}>
                <Form.Item
                  name="data"
                  label="Data"
                  labelCol={{
                    sm: { span: 2 },
                  }}
                >
                  <TextArea rows={22} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </Spin>
  ) : (
    <ChatApp chatData={data} />
  );
}

export default App;
