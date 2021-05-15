let mongoPool = require('../util/mongo');
let perpage = 20;

module.exports = {
  // get the first quote
  getQuote: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      dbo.collection("quote").findOne({}, {
        "id": 0
      }, (err, quote) => {
        res.json(quote);
      })
    })
  },

  // get list of authors
  authorList: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      dbo.collection("quote").distinct('Author', {}, (err, quote) => {
        res.json(quote);
      })
    })
  },

  // get list of categories
  categoryList: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      dbo.collection("quote").distinct('Category', {}, (err, categories) => {
        let unique_categories = [...new Set(categories)]
        res.json(unique_categories);
      })
    });
  },

  // get list of tags
  tagList: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      dbo.collection("quote").distinct('Tags', {}, (err, tags) => {
        let unique_tags = [...new Set(tags)]
        res.json(unique_tags);
      })
    })
  },

  // list of quotes
  quoteList: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      let page = parseInt(req.query['page']) || 1;
      let limit = parseInt(req.query['limit']) || perpage;
      dbo.collection("quote").find({}).skip(page * perpage).limit(limit)
        .toArray((err, quote) => {
          res.json(quote);
        })
    })
  },

  // list of quotes from a category
  quotesOfCategories: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      let page = parseInt(req.query['page']) || 0;
      let limit = parseInt(req.query['limit']) || perpage;
      let category = req.params.category.trim();
      if (category.length == 0) {
        retur("Category must be provided");
      } else {
        dbo.collection("quote").find({
            "Category": category
          }).skip(page * perpage).limit(limit)
          .toArray((err, quote) => {
            res.json(quote);
          })
      }
    })
  },

  // list of quotes from authors
  quotesOfAuthor: (req, res) => {
    mongoPool.getInstance((db) => {
      let dbo = db.db("quotes");
      let page = parseInt(req.query['page']) || 0;
      let limit = parseInt(req.query['limit']) || perpage;
      let author = req.params.author.trim();
      if (author.length == 0) {
        retur("Author must be provided");
      } else {
        dbo.collection("quote").find({
            "Author": author
          }).skip(page * perpage).limit(limit)
          .toArray((err, quote) => {
            res.json(quote);
          })
      }
    })
  }
};
