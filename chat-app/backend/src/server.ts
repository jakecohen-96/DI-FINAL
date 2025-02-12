import express from "express"
import cors from "cors" 
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send('backend is running')
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

console.log("FIREBASE_ADMIN_SDK:", process.env.FIREBASE_ADMIN_SDK);
