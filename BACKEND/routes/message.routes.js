import express from "express";
import { getMessages, sendMessage } from "../controller/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const messagerouter = express.Router();

messagerouter.get("/:id", protectRoute, getMessages)
messagerouter.post("/send/:id",protectRoute,sendMessage);

export default messagerouter;