import { useState } from "react";

export default function DiscussionPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { user: "Priya", text: "Let's complete today's tasks!" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { user: "You", text: message }]);
    setMessage("");
  };

  return (
    <div className="card-color p-6 rounded-xl border border-gray-700 flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <span className="text-blue-400">{msg.user}:</span>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent border border-gray-600 p-2 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}