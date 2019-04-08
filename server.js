var express = require("express");
var logger = require("morgan");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 4000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

  ////////////////////////////////////////////
 // --------------- DATABASE ------------- //
////////////////////////////////////////////
// const MongoClient = require('mongodb').MongoClient;

var mongoose = require("mongoose");
const assert = require('assert');
// Connection URL
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// Create a new MongoClient
// const client = new mongoose(MONGODB_URI);

// Use connect method to connect to the Server
mongoose.connect(MONGODB_URI, function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
}, { useNewUrlParser: true });

require("./routes/routes")(app, db);
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });