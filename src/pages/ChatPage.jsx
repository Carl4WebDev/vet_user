import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Navbar from "../components/Navbar";
import navLogo from "../assets/nav-logo.png";
import navProfile from "../assets/nav-profile.png";
import { clientNavItems } from "../config/navItems";
import { useClient } from "../hooks/useClient";
import { getAllClinics } from "../api/get-api/clinics/getClinicsService.js";
const API_BASE = import.meta.env.VITE_API_BASE;

// Create socket connection outside component to prevent reconnects
const socket = io(`${API_BASE}`, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // We'll manually connect after getting user ID
});

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const { client } = useClient();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);

        // Get client_id from localStorage (from your login system)
        const clientId = localStorage.getItem("client_id");

        if (!clientId) {
          setLoading(false);
          return;
        }

        setCurrentUser(clientId);

        // Always connect socket on mount
        if (!socket.connected) {
          socket.connect();
        }

        // Register user once socket is connected
        const onConnect = () => {
          socket.emit("registerUser", clientId);
          setIsConnected(true);
        };

        socket.on("connect", onConnect);

        // Fetch users you can chat with
        const availableUsers = await getAllClinics();
        setUsers(availableUsers);

        const userConversations = availableUsers.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar || null,
          lastMessage: "Start a conversation...",
        }));
        setConversations(userConversations);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.disconnect(); // important to avoid ghost connections
      setIsConnected(false);
    };
  }, []);

  // Listen for socket events
  useEffect(() => {
    if (!isConnected) return;

    const handleLoadMessages = (oldMessages) => {
      setMessages(oldMessages);
    };

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);

      if (message.senderId !== currentUser) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === message.senderId
              ? { ...conv, lastMessage: message.text }
              : conv
          )
        );
      }
    };

    socket.on("loadMessages", handleLoadMessages);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("loadMessages", handleLoadMessages);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [isConnected, currentUser]);

  const selectConversation = (conversation) => {
    if (!currentUser || !isConnected) {
      console.error(
        "Cannot select conversation: User not registered or socket not connected"
      );
      return;
    }

    setActiveChat(conversation);
    socket.emit("joinPrivate", {
      senderId: currentUser,
      receiverId: conversation.id,
    });
    setMessages([]);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeChat || !currentUser || !isConnected) {
      console.error("Cannot send message: Missing requirements");
      return;
    }

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
            User ID: {currentUser || "Not set"}
          </p>
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
  return (
    <div>
      <Navbar
        logo={navLogo}
        profileImg={navProfile}
        username={client?.name}
        navItems={clientNavItems}
      />

      <div className="flex h-screen bg-gray-100">
        {/* Connection status indicator */}

        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <div
            className={`p-4 text-white font-bold text-lg ${
              isConnected ? "bg-indigo-600" : "bg-red-600"
            }`}
          >
            Messages
          </div>
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  activeChat?.id === conv.id ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => selectConversation(conv)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="h-12 w-12 rounded-full"
                  />
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
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="flex items-center px-6 py-3 border-b border-gray-200 bg-white">
                <div className="flex-shrink-0">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {activeChat.name}
                  </p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    Today
                  </span>
                </div>

                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
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
                              ? "/user-avatar.png"
                              : activeChat.avatar
                          }
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
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
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4">
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
              <p className="text-xs mt-2">User ID: {currentUser}</p>
              <p className="text-xs">
                Status: {isConnected ? "Connected" : "Disconnected"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
