const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const connectDB = require("./db/connect");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening on port: ${PORT}....`));
  } catch (error) {
    console.log(error);
  }
};

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    const indexPath = path.join(__dirname, "client", "build", "index.html");
    res.sendFile(indexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running");
  });
}

start();
