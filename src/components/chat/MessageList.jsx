export default function MessageList({ messages }) {
  return (
    <div className="flex-1 p-3 overflow-y-auto">
      {messages.map((msg, idx) => (
        <div key={idx} className="my-2">
          <div className="text-xs text-gray-500">{msg.user}</div>
          <div className="p-2 rounded-md bg-gray-200 text-gray-800 text-sm">
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
