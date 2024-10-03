import express from "express";
import { getUsers } from "../controller/users.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { addUser } from "../controller/users.controller.js";

const router = express.Router();

router.get("/getsidebar",protectRoute,getUsers);

router.post("/adduser",protectRoute,addUser);

export default router;