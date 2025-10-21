import { useEffect, useState, useRef } from "react"; // ✅ Added useRef
import { io } from "socket.io-client";

import Navbar from "../components/Navbar";
import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
import { useClient } from "../hooks/useClient";
import { getAllClinics } from "../api/get-api/clinics/getClinicsService.js";
import { getClientById } from "../api/get-api/client/getClientById.js";

import { useChat } from "../context/ChatContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;

// ✅ Keep socket outside to prevent re-connection on every render
const socket = io(`${API_BASE}`, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { unreadCounts, setUnreadCounts, totalUnread } = useChat();

  const { client } = useClient();

  // ✅ Reference to bottom of message list
  const messagesEndRef = useRef(null);

  // ✅ Persist unread counts safely
  useEffect(() => {
    try {
      localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
    } catch (err) {
      console.warn("⚠️ Could not store unreadCounts:", err);
    }
  }, [unreadCounts]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const clientId = localStorage.getItem("client_id");
        if (!clientId) {
          setLoading(false);
          return;
        }

        setCurrentUser(clientId);

        // ✅ Fetch client details
        const response = await getClientById(clientId);
        setClientData(response?.client || response || null);

        // ✅ Connect socket
        if (!socket.connected) socket.connect();

        socket.on("connect", () => {
          socket.emit("registerUser", clientId);
          setIsConnected(true);
        });

        // ✅ Fetch clinics for sidebar
        const clinics = await getAllClinics();
        if (Array.isArray(clinics)) {
          const userConversations = clinics.map((clinic) => {
            const imagePath = clinic.image_url?.startsWith("http")
              ? clinic.image_url
              : `${API_BASE}${clinic.image_url?.startsWith("/") ? "" : "/"}${
                  clinic.image_url || ""
                }`;

            return {
              id: clinic.owner.user_id,
              name: clinic.clinic_name,
              avatar: imagePath || navProfile,
              lastMessage: "Start a conversation...",
            };
          });

          setConversations(userConversations);
          setUsers(clinics);

          // ✅ Client-side fix: join all clinic rooms safely
          const joinedRooms = new Set();
          clinics.forEach((clinic) => {
            const roomId = clinic.owner?.user_id;
            if (!roomId || joinedRooms.has(roomId)) return;
            joinedRooms.add(roomId);
            try {
              socket.emit("joinPrivate", {
                senderId: clientId,
                receiverId: roomId,
              });
            } catch (err) {
              console.warn("⚠️ Failed to join room:", roomId, err);
            }
          });
        } else {
          console.warn("⚠️ Unexpected clinic data format:", clinics);
          setConversations([]);
        }
      } catch (error) {
        console.error("❌ Error initializing chat:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      socket.off("connect");
      socket.disconnect();
      setIsConnected(false);
    };
  }, []);

  // ✅ Listen for socket events
  useEffect(() => {
    if (!isConnected) return;

    const handleLoadMessages = (oldMessages) => {
      setMessages(oldMessages || []);
    };

    const handleReceiveMessage = (message) => {
      if (!message) return;

      setMessages((prev) => [...prev, message]);

      if (message.senderId !== currentUser) {
        // ✅ Update conversation preview
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === message.senderId
              ? { ...conv, lastMessage: message.text }
              : conv
          )
        );

        // ✅ Increment unread count globally
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("loadMessages", handleLoadMessages);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("loadMessages", handleLoadMessages);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [isConnected, currentUser]);

  // ✅ Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const selectConversation = (conversation) => {
    if (!currentUser || !isConnected) {
      console.error("Cannot select conversation: socket not ready");
      return;
    }

    setActiveChat(conversation);

    // ✅ Join this room explicitly (safe even if already joined)
    try {
      socket.emit("joinPrivate", {
        senderId: currentUser,
        receiverId: conversation.id,
      });
    } catch (err) {
      console.warn("⚠️ joinPrivate failed:", err);
    }

    setMessages([]);

    // ✅ Reset unread count when opening conversation
    setUnreadCounts((prev) => ({
      ...prev,
      [conversation.id]: 0,
    }));
  };

  const sendMessage = () => {
    if (!input.trim() || !activeChat || !currentUser || !isConnected) return;

    const newMsg = {
      senderId: currentUser,
      receiverId: activeChat.id,
      text: input,
    };

    socket.emit("sendPrivateMessage", newMsg);
    setInput("");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
          <p className="text-sm text-gray-500">
            Socket: {isConnected ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Not Logged In
          </h2>
          <p className="text-gray-600">
            Please log in to use the chat feature.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profileImg =
    clientData?.mainImageUrl || clientData?.client?.mainImageUrl || navProfile;
  const username = clientData?.name || clientData?.client?.name || "Guest";

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar
        logo={navLogo}
        profileImg={profileImg}
        username={username}
        navItems={clientNavItems}
      />

      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <div
            className={`p-4 text-white font-bold text-lg ${
              isConnected ? "bg-indigo-600" : "bg-red-600"
            }`}
          >
            Messages
          </div>

          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clinics..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* ✅ Conversation List with unread badges */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                    activeChat?.id === conv.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="relative">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="h-12 w-12 rounded-full object-cover border"
                    />
                    {unreadCounts[conv.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
                        {unreadCounts[conv.id]}
                      </span>
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conv.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 text-sm">
                No matching clinics
              </p>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col h-full">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="flex items-center px-6 py-3 border-b border-gray-200 bg-white">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="h-10 w-10 rounded-full object-cover border"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {activeChat.name}
                  </p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                {messages.length > 0 ? (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex mb-4 ${
                        msg.senderId === currentUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-xs lg:max-w-md ${
                          msg.senderId === currentUser ? "flex-row-reverse" : ""
                        }`}
                      >
                        <img
                          src={
                            msg.senderId === currentUser
                              ? profileImg
                              : activeChat.avatar
                          }
                          alt="Avatar"
                          className="h-8 w-8 rounded-full object-cover border"
                        />
                        <div
                          className={`${
                            msg.senderId === currentUser ? "mr-2" : "ml-2"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              msg.senderId === currentUser
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-800 border border-gray-200"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <p
                            className={`text-xs text-gray-500 mt-1 ${
                              msg.senderId === currentUser
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString()
                              : new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={!isConnected}
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!isConnected || !input.trim()}
                    className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">Your messages</h3>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
