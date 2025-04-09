import express from "express";
import routes from "./routes/bookRoutes.js";
import morgan from "morgan";


const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev", {
    skip: (req, res) => req.url.startsWith("/styles")
}));

app.use("/", routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});