import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { format } from "date-fns";
import "../styles/global.css";

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp?: any;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to chat messages in real-time
  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to typing indicators
  useEffect(() => {
    const typingRef = collection(db, "typingIndicators");
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const usersTyping = snapshot.docs
        .map((doc) => doc.data() as { email: string; isTyping: boolean })
        .filter(
          (data) =>
            data.isTyping && data.email !== auth.currentUser?.email
        )
        .map((data) => data.email);
      setTypingUsers(usersTyping);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup: clear the typing status when the component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      updateTypingStatus(false);
    };
  }, []);

  // Update the current user's typing status in Firestore
  const updateTypingStatus = async (isTyping: boolean) => {
    if (!auth.currentUser || !auth.currentUser.email) return;
    const userEmail = auth.currentUser.email;
    try {
      await setDoc(doc(db, "typingIndicators", userEmail), {
        email: userEmail,
        isTyping,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  // Handle input changes with a debounce to update typing status
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    updateTypingStatus(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Clear typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000);
  };

  // Send the message and clear the typing status
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: trimmedMessage,
        user: auth.currentUser?.email,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      updateTypingStatus(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="messages-container">
        {messages.map((msg) => (
          <p key={msg.id} className="message">
            <strong>{msg.user}:</strong> {msg.text}{" "}
            <span className="timestamp">
              {msg.timestamp?.seconds
                ? format(new Date(msg.timestamp.seconds * 1000), "HH:mm")
                : "No Timestamp"}
            </span>
          </p>
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Display typing indicators (exclude the current user) */}
      {typingUsers.length > 0 && (
        <p className="typing-indicator">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
        </p>
      )}
      <form onSubmit={handleSendMessage} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <button onClick={() => auth.signOut()} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Chat;