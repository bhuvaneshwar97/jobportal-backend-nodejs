const express = require("express");
const routes = require("./src/routes/routes");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({limit:"25mb"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

const db = mongoose.connect("mongodb://localhost/jobportal");
db.then(()=> console.log("Connected to Mongodb database"))
  .catch(()=> console.log("Database connection error"));
  
app.listen(3005, function(){
    console.log("Job portal backend application running on port 3005");
})

module.exports = db;