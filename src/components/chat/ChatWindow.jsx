// src/components/chat/ChatWindow.jsx
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ messages, onSend }) {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg flex flex-col h-[500px]">
      <div className="p-3 border-b font-semibold text-gray-700">
        Simple Chat
      </div>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  );
}
