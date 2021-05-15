let quoteController = require("../controller/quote");
let router = require('express').Router();

router.get('', quoteController.getQuote);
router.get('/authors',quoteController.authorList);
router.get('/categories', quoteController.categoryList);
router.get('/tags', quoteController.tagList);
router.get('/quotes', quoteController.quoteList);
router.get('/category/:category', quoteController.quotesOfCategories);
router.get('/author/:author', quoteController.quotesOfAuthor);
module.exports = router;
