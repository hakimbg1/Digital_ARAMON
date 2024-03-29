require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`,
});
require("./config/db-connection");

const express = require("express");
const expressSession = require("express-session");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");

const { infoLogger } = require("./helpers/logger");
const { rateLimiter } = require("./helpers/rate-limiter");

const app = express();

const path = require("path");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
app.use(infoLogger);
app.use(rateLimiter);

const users_route = require("./routes/user");

app.use("/user", users_route);


const StoredUrl_route = require("./routes/StoredUrl");

app.use("/StoredUrl", StoredUrl_route);

// Serve images from the "icons" directory
app.use(express.static(path.join(__dirname, "icons")));

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404);
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`\nServer Started on ${port}`);
});