const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const router = require("./routes/router.js");
app.use("/user", router);

app.listen(port, () => {
  console.log("App running on: https://localhost:", port);
});

module.exports = app;
