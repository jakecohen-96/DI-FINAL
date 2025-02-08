import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { format } from "date-fns";

interface PrivateChatProps {
  selectedUser: {
    id: string;
    displayName: string;
  };
}

const PrivateChat: React.FC<PrivateChatProps> = ({ selectedUser }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selectedUserTyping, setSelectedUserTyping] = useState(false);
  const currentUserId = auth.currentUser?.uid;
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!currentUserId) return <div>Loading...</div>;

  // Generate a unique chat ID for the conversation
  const chatId = [currentUserId, selectedUser.id].sort().join("_");

  // Subscribe to chat messages
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return unsubscribe;
  }, [chatId]);

  // Subscribe to the selected user's typing indicator
  useEffect(() => {
    const typingDocRef = doc(db, "typingIndicators", selectedUser.id);
    const unsubscribe = onSnapshot(typingDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedUserTyping(data.isTyping);
      } else {
        setSelectedUserTyping(false);
      }
    });
    return unsubscribe;
  }, [selectedUser.id]);

  // Function to update the current user's typing status in Firestore
  const updateTypingStatus = async (isTyping: boolean) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, "typingIndicators", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        isTyping,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  // Handle input change and update typing indicator with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    updateTypingStatus(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 5000);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        text: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      updateTypingStatus(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="private-chat">
      <h3 className="chat-title">Chat with {selectedUser.displayName}</h3>
      {selectedUserTyping && (
        <p className="typing-indicator">{selectedUser.displayName} is typing...</p>
      )}
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}>
            <p className="message-text">{msg.text}</p>
            <span className="message-timestamp">
              {msg.timestamp?.seconds
                ? format(new Date(msg.timestamp.seconds * 1000), "HH:mm")
                : ""}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default PrivateChat;