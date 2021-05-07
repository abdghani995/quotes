const express = require("express")
const app = express()
let bodyParser = require('body-parser');


//configure bodyparser to hande the post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get("/", function(req, res) {
    res.send({
    	"hello": "world"
    })
})

app.use('/api', require("./routes/quotes"))



app.listen(3000)