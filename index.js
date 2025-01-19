import express from "express";
// import { Db } from "mongodb";
// import mongoose from "mongoose";
// import monitor form "express-status-monitor"

const app = express();
app.use(express.json());
let PORT = process.env.PORT || 3000;

// try {
//   mongoose
//     .connect("mongodb://mongo:27017/testing")
//     .then(() => console.log("database is connected"))
//     .catch((err) => console.log(`error ${err}`));
// } catch {
//   console.log("not connected error");
// }
app.get("/", async (req, res) => {
  res.json({
    ok: true,
    name: "harshith",
    from: "hello from docker app",
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
