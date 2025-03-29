import { root, home, article, signIn, signUp, submitSignIn, submitSignUp, dashboard, postArticle, articlePost } from "../controller/mainController.js";
import { apiUsers } from "../controller/apiController.js";
import express from "express";
import multer from "multer";

const upload = multer({ dest: "public/uploads/" });
const router = express.Router();

router.get("/", root);
router.get("/home", home);
router.get("/dashboard", dashboard);
router.get("/article", article);
router.get("/sign-in", signIn);
router.get("/sign-up", signUp);
router.get("/post-blog", postArticle);
router.get("/api/users", apiUsers);
router.post("/article", upload.single("image"), articlePost);
router.post("/sign-in", submitSignIn);
router.post("/sign-up", submitSignUp);

export default router;
