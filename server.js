var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

//scraping tools
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

//Initialize express
var app = express();


//use morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

//create public static directory
app.use(express.static("public"));

//configuring database with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

//display any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

//display a success message once logged into db through mongoose
db.once("open", function() {
	console.log("You have successfully connected to Mongoose")
});

//Routes

//A Get request to scrape website
app.get("/scrape", function(req, res) {
	//grabbing body of html with request
	request("http://.com/", function (error, response, html) {

		var $ = cheerio.load(html);

		$("article h2").each(function(i, element) {

			var result = {}

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");


			var entry = new Article(result);

			entry.save(function(err, doc) {

				if (err) {
					console.log(err);
				}

				else {
					console.log(doc);
				}
			});
		});
	});

	res.send("Scrap is now complete");
});

app.get("/articles/:id", function(req, res) {

	Article.findOne({ "_id" req.params.id })

	.populate("note")

	.exec(function(error, doc) {

		if (error) {
			console.log(error);
		}

		else {
			res.json(doc);
		}
	});
});

app.post("/articles/:id", function(req, res) {

	var newNote = new Note(req.body);

	newNote.save(function(error, doc) {

		if (error) {
			console.log(error);
		}

		else {
			Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id})

			.exec(function(err, doc) {

				if (err) {
					console.log(err);
				}

				else {
					res.send(doc);
				}
			});
		}
	});
});


app.listen(3000, function() {
	console.log("App is now running on port 3000!");
});











