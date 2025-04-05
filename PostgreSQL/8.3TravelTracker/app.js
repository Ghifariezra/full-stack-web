import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import countryRoutes from './routes/countryRoutes.js';
import apiRoutes from './routes/apiRouters.js';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(morgan("dev", {
  skip: (req, res) => req.url.startsWith("/favicon.ico") || req.url.startsWith("/styles"),
}));

// Routes
app.use("/", countryRoutes);
app.use("/api", apiRoutes);

export default app;