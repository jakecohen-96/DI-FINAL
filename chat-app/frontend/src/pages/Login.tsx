import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { email, password } = credentials;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const response = await fetch("https://di-final.onrender.com/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      if (response.ok) {
        await response.json();
        navigate("/chat");
      } else {
        setError("Unable to verify token with backend.");
      }
    } catch (error: any) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <input type="email" name="email" className="login-input" placeholder="Email" value={credentials.email} onChange={handleChange} />
        <input type="password" name="password" className="login-input" placeholder="Password" value={credentials.password} onChange={handleChange} />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="login-register">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;