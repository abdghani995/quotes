var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nathan:james@cluster0.vj6xg.mongodb.net/quotes?retryWrites=true&w=majority";
var quotes_list = require("./quotes.json");

// console.log(quotes_list)

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("quotes");
  // var myobj = { name: "Company Inc", address: "Highway 37" };
  
  dbo.collection("quote").insertMany(quotes_list, function(err, res) {
    if (err) throw err;
    console.log(quotes_list.length + " documents inserted");
    db.close();
  });

});