import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import PrivateChat from "../components/PrivateChat";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  displayName: string;
}

const Chat: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) return;
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as User))
          .filter(user => user.id !== currentUserId);
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  if (loading) {
    return <div>Loading users...</div>;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-left">
          <h2>Jake's Chat App (Under construction)</h2>
          <p className="greeting">
            Hello, {auth.currentUser?.displayName || auth.currentUser?.email}
          </p>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <div className="chat-content">
        <aside className="users-list">
          <h3>Users</h3>
          {users.length > 0 ? (
            users.map(user => (
              <button
                key={user.id}
                className="user-button"
                onClick={() => setSelectedUser(user)}
              >
                {user.displayName}
              </button>
            ))
          ) : (
            <p>No other users available.</p>
          )}
        </aside>
        <main className="chat-window">
          {selectedUser ? (
            <PrivateChat selectedUser={selectedUser} />
          ) : (
            <p className="chat-placeholder">Select a user to start chatting</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;