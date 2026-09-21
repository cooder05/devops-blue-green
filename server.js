const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || "v1";

app.get("/", (req, res) => {
  res.send(`Hello from Node.js Application(new feature green) - ${VERSION}`);
});

app.listen(PORT, () => {
  console.log(`Application ${VERSION} running on port ${PORT}`);
});
