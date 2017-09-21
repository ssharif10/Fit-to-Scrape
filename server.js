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
  // First, we grab the body of the html with request
  request("http://www.huffingtonpost.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {

	Article.find({}, function(error, doc) {

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











