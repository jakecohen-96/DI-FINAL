import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
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
  const currentUserId = auth.currentUser?.uid;
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  if (!currentUserId) return <div>Loading...</div>;

  // Generate a unique chatId based on the two user IDs
  const chatId = [currentUserId, selectedUser.id].sort().join("_");

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return unsubscribe;
  }, [chatId]);

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
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}>
            <p className="message-text">{msg.text}</p>
            <span className="message-timestamp">
              {msg.timestamp?.seconds ? format(new Date(msg.timestamp.seconds * 1000), "HH:mm") : ""}
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
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default PrivateChat;