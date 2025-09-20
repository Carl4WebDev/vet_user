import React, { useState, useRef, useEffect } from "react";
import useVetClinicAI from "../hooks/useVetClinicAI";

const VetClinicChatbot = () => {
  const { messages, isLoading, error, sendMessage } = useVetClinicAI();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle chat"
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.9L3 20l1.224-3.674A7.966 7.966 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed bottom-20 right-6 z-50
            w-[90vw] h-[80vh] 
            sm:w-[360px] sm:h-[600px]
            flex flex-col border rounded-lg shadow-lg overflow-hidden bg-white
            "
        >
          <header className="bg-blue-600 text-white p-3 sm:p-4 font-semibold text-base sm:text-lg flex justify-between items-center">
            VetConnect Chat
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white hover:text-gray-300 focus:outline-none text-lg sm:text-xl font-bold"
            >
              &#x2715;
            </button>
          </header>

          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 bg-gray-50 text-sm sm:text-base">
            {messages.length === 0 && !isLoading && (
              <p className="text-gray-500 text-center">
                Ask me anything about your pet care or our clinic services!
              </p>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-lg whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 rounded-bl-none px-3 py-2 animate-pulse max-w-[50%]">
                  VetCareBot is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 bg-white border-t flex items-center gap-2"
          >
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-2 py-2 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-2 sm:px-4 sm:py-2 rounded transition text-sm sm:text-base"
            >
              Send
            </button>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 text-center text-xs sm:text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VetClinicChatbot;
