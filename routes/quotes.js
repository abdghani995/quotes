let MongoClient = require('mongodb').MongoClient;
let router = require('express').Router();
let url = "mongodb+srv://nathan:james@cluster0.vj6xg.mongodb.net/quotes?retryWrites=true&w=majority";

let perpage = 20;

var getDb = function(cb){
	MongoClient.connect(url, function(err, db) {
	  if (err) cb(err);
	  else cb(null, db);
	})
}

router.get('/quote', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			dbo.collection("quote").findOne({}, {"id":0},(err, quote ) => {
				res.send(quote);
				db.close();
				return next()
			})
		}else{
			return next(err);
		}
	})
})


router.get('/quote/authors', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			dbo.collection("quote").distinct('Author', {} ,(err, quote ) => {
				res.send(quote);
				db.close();
				return next()
			})
		}else{
			return next(err);
		}
	})
})

router.get('/quotes', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			let page = parseInt(req.query['page']) || 1;
			let limit = parseInt(req.query['limit']) || perpage;
			dbo.collection("quote").find({}).skip(page * perpage).limit(limit)
				.toArray((err, quote ) => {
					res.send(quote);
					db.close();
					return next()
				})
		}else{
			return next(err);
		}
	})
})

module.exports = router;
