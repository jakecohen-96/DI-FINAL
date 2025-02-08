import { useState, useEffect, useRef } from "react";
import { db, auth } from "../config/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { format } from "date-fns"; // Import date formatting library

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string; user: string; timestamp?: any }[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc")); // Ensure sorting works
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; text: string; user: string; timestamp?: any }[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll to the latest message
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        user: auth.currentUser?.email,
        timestamp: serverTimestamp(), // Fix: Ensure timestamp is correctly stored
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg) => (
          <p key={msg.id} style={{ padding: "5px", borderBottom: "1px solid #eee" }}>
            <strong>{msg.user}:</strong> {msg.text}{" "}
            <span style={{ fontSize: "0.8em", color: "gray" }}>
              {msg.timestamp?.seconds ? format(new Date(msg.timestamp.seconds * 1000), "HH:mm") : "No Timestamp"}
            </span>
          </p>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "5px" }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>Send</button>
      </form>
      <button onClick={() => auth.signOut()} style={{ marginTop: "10px" }}>Logout</button>
    </div>
  );
};

export default Chat;