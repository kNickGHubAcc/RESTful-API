const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://127.0.0.1:27017/myWikipediaDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo err", err));


const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = new mongoose.model('Article', articleSchema);



app.route('/articles')
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Article added successfully!");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("All articles deleted successfully!");
      }
    });
  });


app.route('/articles/:articleTitle')
  .get(function (req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("There isn't article with this title");
      }
    });
  })
  .put(function (req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function (err) {
        if (!err) {
          res.send("Article updated successfully!");
        }
      });
  })
  .patch(function (req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Article updated successfully!");
        }
      });
  })
  .delete(function (req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Article deleted successfully!");
      }
    });
  });


app.listen(3000, function () {
  console.log("Server started on port 3000...");
});