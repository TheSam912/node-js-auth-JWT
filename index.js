const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const Routes = require("./routes/Route");
app.use(express.json());
app.use(Routes);

mongoose
  .connect(
    "mongodb+srv://admin:33931376@samuser.vt3fgbu.mongodb.net/myNodeApiTest?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((r) => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
