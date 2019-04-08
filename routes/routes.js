var axios = require('axios');
var cheerio = require('cheerio');
var path = require('path');

module.exports = function (app, db) {

  app.get('/', (req, res) => {
    console.log('Home Okay');
    res.sendFile(__dirname, './index.html');
  });

  //Grabbing recent articles about technology from the NewYorkTimes
  app.get("/api/scrape", function (req, res) {

    axios.get("https://www.nytimes.com/section/technology#stream-panel").then(function (response) {

      var $ = cheerio.load(response.data);
      // var test = $(".css-4jyr1y a").children();
      // console.log(test);

      $(".css-4jyr1y").each(function (i, element) {
        // console.log(this.text());
        var result = {};
        result.link = "https://www.nytimes.com"+$(this)
          .children("a")
          .attr("href");

        var articles_link = $(this).children("a");

        result.title = $(articles_link)
          .children("h2")
          .text();
        result.summary = $(articles_link)
          .children("p")
          .text();

        db.Articles.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });

      res.send(result);
    });
  });

  //Getting all Articles from the db
  app.get("/articles", function (req, res) {
    db.Articles.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    db.Articles.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //Clearing the db: Caution!!!!
  app.get('/clear', function (req, res) {
    db.Articles.remove({}, function (err) {
      console.log('articles' + err);
    });
    db.Notes.remove({}, function (err) {
      console.log('Notes' + err);
    });
  });

  // Saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    db.Notes.create(req.body)
      .then(function (dbNote) {
        return db.Articles.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });


}