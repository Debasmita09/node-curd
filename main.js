// import
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
// const { CLIENT_RENEG_LIMIT } = require("tls");

const app = express();
// this port is coming from .env file
const PORT = process.env.PORT || 4000;   

// for testing
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

//database connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
 
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the database!"));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);
// storing session message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// app.use(express.static("uploads"));

//set template engine from ejs
app.set("view engine", "ejs");

//route prefix
app.use("", require("./routes"));

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
