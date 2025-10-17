import React, { useState, useRef, useEffect } from "react";
import useVetClinicAI from "../hooks/useVetClinicAI";

const VetClinicChatbot = () => {
  const { messages, isLoading, error, sendMessage } = useVetClinicAI();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // 🧲 Icon position
  const [iconPos, setIconPos] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  });

  // ✅ Keep icon visible when screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIconPos((prev) => {
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // 🧠 Drag refs
  const iconRef = useRef(null);
  const dragRef = useRef({
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    dragging: false,
    tapStart: 0,
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // ✅ Cleanup on unmount (prevents duplicate listeners)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", endDrag);
    };
  }, [messages, isLoading, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  // ✅ Helper to remove listeners before adding new ones
  const cleanupDragListeners = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", endDrag);
  };

  // 🧲 Start dragging (both mouse & touch)
  const startDrag = (clientX, clientY) => {
    const box = iconRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    dragRef.current.offsetX = clientX - rect.left;
    dragRef.current.offsetY = clientY - rect.top;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.dragging = false;
    dragRef.current.tapStart = Date.now();

    // ✅ Remove previous listeners first
    cleanupDragListeners();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", endDrag);
  };

  const doDrag = (clientX, clientY) => {
    const deltaX = Math.abs(clientX - dragRef.current.startX);
    const deltaY = Math.abs(clientY - dragRef.current.startY);

    // 📱 Raise drag threshold so small finger moves don't count as drag
    if (deltaX > 15 || deltaY > 15) {
      dragRef.current.dragging = true;
    }

    const newX = clientX - dragRef.current.offsetX;
    const newY = clientY - dragRef.current.offsetY;

    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    const boundedX = Math.min(Math.max(newX, 10), maxX);
    const boundedY = Math.min(Math.max(newY, 10), maxY);

    setIconPos({ x: boundedX, y: boundedY });
  };

  const endDrag = () => {
    cleanupDragListeners();

    // 🧠 Detect short taps (under 200ms)
    const tapDuration = Date.now() - (dragRef.current.tapStart || 0);
    const isQuickTap = tapDuration < 200;

    // 🖐 If no drag happened or it’s a quick tap → toggle
    if (!dragRef.current.dragging || isQuickTap) {
      setIsOpen((prev) => !prev);
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };
  const handleMouseMove = (e) => {
    e.preventDefault();
    doDrag(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    doDrag(touch.clientX, touch.clientY);
  };

  // 📐 Popup positioning (responsive)
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const popupWidth = vw < 400 ? vw * 0.9 : 360;
  const popupHeight = vh < 650 ? vh * 0.75 : 520;

  const iconSize = 60;
  const spaceBelow = vh - (iconPos.y + iconSize);
  const openBelow = spaceBelow > popupHeight + 20;

  const popupTop = openBelow
    ? iconPos.y + iconSize + 10
    : Math.max(10, iconPos.y - popupHeight - 10);

  const popupLeft = Math.max(
    10,
    Math.min(iconPos.x - popupWidth + iconSize, vw - popupWidth - 10)
  );

  return (
    <>
      {/* 🟦 Floating Icon (Draggable) */}
      <div
        ref={iconRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: "fixed",
          top: iconPos.y,
          left: iconPos.x,
          zIndex: 60,
          // ❌ Removed touchAction: "none" – allows taps on mobile
        }}
      >
        <div className="bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition">
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
        </div>
      </div>

      {/* 🟦 Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: popupTop,
            left: popupLeft,
            width: popupWidth,
            height: popupHeight,
            zIndex: 50,
          }}
        >
          <div className="flex flex-col border rounded-lg shadow-lg overflow-hidden bg-white w-full h-full">
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
        </div>
      )}
    </>
  );
};

export default VetClinicChatbot;
