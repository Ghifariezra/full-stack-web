import { join } from "path";
import { Validator, ArticleStorage } from "../config/modules/main.js";

const pathStyle = "./styles";
const contentData = {
  contentEJS: ["home", "article", "sign-in", "sign-up", "post-article"],
  styles: {
    home: join(pathStyle, "home.css"),
    article: join(pathStyle, "article.css"),
    "sign-in": join(pathStyle, "sign-in.css"),
    "sign-up": join(pathStyle, "sign-up.css"),
    "post-article": join(pathStyle, "post-article.css"),
  },
};

const articleStorage = new ArticleStorage();
const root = (req, res) => {
  res.render("index", { content: contentData.contentEJS[0], styles: contentData.styles.home });
};
const home = (req, res) => {
  res.render("index", { content: contentData.contentEJS[0], styles: contentData.styles.home });
};
const dashboard = (req, res) => {
  res.render("index", { content: contentData.contentEJS[0], styles: contentData.styles.home });
};
const article = (req, res) => {
  const articles = articleStorage.getArticles(); // Ambil data artikel dari penyimpanan
  res.render("index", {
    content: contentData.contentEJS[1],
    styles: contentData.styles.article,
    articles,
  });
};
const signIn = (req, res) => {
  res.render("index", { content: contentData.contentEJS[2], styles: contentData.styles["sign-in"] });
};
const signUp = (req, res) => {
  res.render("index", { content: contentData.contentEJS[3], styles: contentData.styles["sign-up"] });
};
const submitSignIn = (req, res, next) => {
  const validator = new Validator(req, res);
  const result = validator.loginValidation();
  if (result.success) {
    res.redirect("/dashboard");
  } else {
    res.render("index", {
      content: contentData.contentEJS[2],
      styles: contentData.styles["sign-in"],
      error: result.message,
    });
  }
};
const submitSignUp = (req, res, next) => {
  const validator = new Validator(req, res);
  const result = validator.registerValidation();
  if (result.success) {
    res.redirect("/home");
  } else {
    res.render("index", {
      content: contentData.contentEJS[3],
      styles: contentData.styles["sign-up"],
      error: result.message,
    });
  }
};
const postArticle = (req, res) => {
  res.render("index", { content: contentData.contentEJS[4], styles: contentData.styles["post-article"] });
};
const articlePost = (req, res) => {
  const success = articleStorage.saveArticleFromRequest(req);
  if (!success) {
    return res.status(400).send("Invalid article submission: Headline and description required");
  }
  res.redirect("/article");
};

export { root, home, article, signIn, signUp, submitSignIn, submitSignUp, dashboard, postArticle, articlePost };
