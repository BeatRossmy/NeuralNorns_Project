const express = require("express");
var path = require('path')

const app = express();

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});



app.listen(3000, function () {
  console.log("Server is running on localhost3000");
});