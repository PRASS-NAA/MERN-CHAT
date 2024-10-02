import dotenv from 'dotenv';
import findConfig from 'find-config';

// Load the .env file
dotenv.config({ path: findConfig('.env') });
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "../BACKEND/routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import bodyParser from "body-parser";
import messagerouter from "./routes/message.routes.js";



const app = express();

console.log("Mongo ui : ", process.env.MONGO_DB_URI);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

connectToMongoDB();


app.use("/api/auth", authRoutes);
app.use("/api/message", messagerouter);

app.listen(PORT, () => {
    
    console.log(`Server Running On PORT ${PORT}`);
});
