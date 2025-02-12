import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import "../styles/register.css";

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { email, password } = credentials;
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.email ? user.email.split("@")[0] : ""
      });
      navigate("/chat");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {error && <p className="register-error">{error}</p>}
      <form className="register-form" onSubmit={handleRegister}>
        <input type="email" name="email" placeholder="Email" className="register-input" value={credentials.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="register-input" value={credentials.password} onChange={handleChange} />
        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="register-login">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Register;