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


router.get('/authors', function (req, res, next) {
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

router.get('/tags', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			dbo.collection("quote").distinct('Tags', {} ,(err, tags ) => {
				let unique_tags = [...new Set(tags)]
				res.send(unique_tags);
				db.close();
				return next()
			})
		}else{
			return next(err);
		}
	})
})

router.get('/categories', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			dbo.collection("quote").distinct('Category', {} ,(err, categories ) => {
				let unique_categories = [...new Set(categories)]
				res.send(unique_categories);
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

router.get('/quotes/category/:category', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			let page = parseInt(req.query['page']) || 0;
			let limit = parseInt(req.query['limit']) || perpage;
			let category = req.params.category.trim();
			if (category.length == 0){
				return next("Category must be provided");
			}else{
				dbo.collection("quote").find({"Category": category}).skip(page * perpage).limit(limit)
					.toArray((err, quote ) => {
						res.send(quote);
						db.close();
						return next()
					})
			}
		}else{
			return next(err);
		}
	})
})

router.get('/quotes/author/:author', function (req, res, next) {
	getDb((err, db) => {
		if(!err){
			let dbo = db.db("quotes");
			let page = parseInt(req.query['page']) || 0;
			let limit = parseInt(req.query['limit']) || perpage;
			let author = req.params.author.trim();
			if (author.length == 0){
				return next("Author must be provided");
			}else{
				dbo.collection("quote").find({"Author": author}).skip(page * perpage).limit(limit)
					.toArray((err, quote ) => {
						res.send(quote);
						db.close();
						return next()
					})
			}
		}else{
			return next(err);
		}
	})
})

module.exports = router;
