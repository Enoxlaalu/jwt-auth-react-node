require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
