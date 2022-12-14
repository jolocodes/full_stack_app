"use strict";

const express = require("express");
const morgan = require("morgan");
const { sequelize } = require("./models");

const courseRoutes = require("./routes/routesForCourse");
const userRoutes = require("./routes/routesForUser");

const cors = require("cors"); //talks to client folder

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

//use express.json() on the app
app.use(express.json());

//middleware for cors
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan("dev"));

//setup routes{routesForCourse} for /api/course {routesForUser} for /api/user
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);


// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project! :D",
  });
});

//test connection to database
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully");
} catch (error) {
  console.error("Unable to connect ot the database", error);
}

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});