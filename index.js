const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");
const app = express();
const dotenv = require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

require("./routes/books")(app);
require("./routes/auth")(app);
//connect to DB cluster
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Mongodb connected....");
  })
  .catch(err => console.log(err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db...");
});

mongoose.connection.on("error", err => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected...");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose connection is disconnected due to app termination..."
    );
    process.exit(0);
  });
});
const PORT = process.env.PORT || 5000;
//Port listening callback when started
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT + '...');
  });
