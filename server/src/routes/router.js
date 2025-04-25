import express from "express";
import templateController from "../controllers/template.controller.js";
import chatController from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/template").post(templateController);
router.route("/chat").post(chatController);
export default router;
