var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({

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
var Articles = mongoose.model("Article", ArticlesSchema);

// Export the Article model
module.exports = Articles;
