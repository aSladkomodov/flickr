const express = require("express");
const api = require("./api");

const app = express();
app.set("port", 8080);
app.use("/api", api);

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
