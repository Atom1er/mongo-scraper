var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedArticlesSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var SavedArticles = mongoose.model("SavedArticle", SavedArticlesSchema);

// Export the Article model
module.exports = SavedArticles;