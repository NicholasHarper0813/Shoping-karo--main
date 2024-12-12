require("dotenv").config();
const express = require("express");
const PageNotFound = require("./helper/NotFound");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const bodyParser = require("body-parser");
const User = require("./models/user");
const mongoose = require("mongoose");
const path = require("path");
const mongo_DB_URI = process.env.MONGO_DB_URI;
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("65aaa79a8945687d161ef472")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(PageNotFound);

mongoose
  .connect(mongo_DB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Database connected");
      User.findOne().then((user) => {
        if (!user) {
          const user = new User({
            name: "David",
            email: "david@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        } else {
          console.log("User Already Exist");
        }
      });
      console.log("App is running on the port http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
