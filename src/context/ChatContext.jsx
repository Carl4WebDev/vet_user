import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [unreadCounts, setUnreadCounts] = useState(() => {
    try {
      const stored = localStorage.getItem("unreadCounts");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // ✅ Persist safely
  useEffect(() => {
    try {
      localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
    } catch (err) {
      console.warn("⚠️ Could not store unreadCounts:", err);
    }
  }, [unreadCounts]);

  const totalUnread = Object.values(unreadCounts).reduce(
    (a, b) => a + (typeof b === "number" ? b : 0),
    0
  );

  return (
    <ChatContext.Provider
      value={{ unreadCounts, setUnreadCounts, totalUnread }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
