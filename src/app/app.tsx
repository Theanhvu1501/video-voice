import ChatApp from "../components/chat/ChatApp";
import { SexType } from "../constants";

import chatData from '../../chat_data.json'

function App() {
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ChatApp chatData={chatData as any} />
      </div>
    </>
  );
}

export default App;
