const dotenv = require("dotenv");
//connect dotenv file
dotenv.config({ path: "./.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const users = require("./routes/users");
const morgan = require("morgan");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;

// body parser middleware cant handle form data so we used multer to do this

app.use(express.json());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
// app.use(express.static("assests/signatures"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");

  next();
});

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB Connection Build Sucessfully!");
  });

app.use("/api/v1", users);

app.get("/", (req, res) => {
  res.write("<h1>welcome</h1>");
  res.write("<h2>Main Page</h2>");
  res.end();
});

app.use((error, req, res, next) => {
  return res.status(error.code || 401).json({ message: error.message });
});
app.all("*", function (req, res) {
  res.status(404).json({ message: "Not Found" });
});

app.listen(PORT, console.log(`server is running at http://localhost:${PORT}`));

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shuting Down");
  // server.close(() => {
  //   process.exit(1);
  // });
});
