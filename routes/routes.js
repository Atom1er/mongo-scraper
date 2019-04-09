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
      var result = {};
      var length = 0;
      $(".css-4jyr1y").each(function (i, element) {
        length++;
        // console.log(this.text());
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

          // res.send(result);

      });

      res.send(length+" New articles added!!!");
      console.log("we got here!");
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
  app.get("/api/articles/:id", function (req, res) {
    db.Articles.findOne({ _id: req.params.id })
      // .populate("note")
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
    res.json("Database Cleared!!!")
  });

  //Saving Article
  app.post('/api/save', function(req, res){
    console.log(req.body._id);
    var test = db.SavedArticle.findOne({_id: req.body._id})
    .then(function(){
      if(test.name === undefined){
      db.SavedArticle.create(req.body)
      .then(function(){
        res.send("Article Saved!");
      });
    }else  if(test.name !== undefined){
      res.send("You have already saved this articles!");
    }
    }); 
    
  });

  // Grabbing Saved Article
  app.get("/api/saved", function(req, res){
    db.SavedArticle.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  })


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