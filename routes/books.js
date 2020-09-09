module.exports = app => {
  const Book = require("../models/Book.js");
  const passport = require("passport");
  require("../services/passport")(passport);

  getToken = function(headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(" ");
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  /* GET ALL BOOKS */
  app.get(
    "/api/book",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const userAccess = req.query.userAccess;
      var token = getToken(req.headers);
      if (token) {
        Book.find({ userAccess }, function(err, books) {
          if (err) return next(err);
          res.json(books);
        });
      } else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
      }
    }
  );

  /* Find One Book */
  app.get(
    "/api/book/:id",
    passport.authenticate("jwt", { session: false }),
    function(req, res, next) {
      console.log({ req });
      var token = getToken(req.headers);
      if (token) {
        Book.findById({ _id: req.body.id }, function(err, books) {
          if (err) return next(err);
          res.json(books);
        });
      } else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
      }
    }
  );

  app.delete(
    "/api/book/",
    passport.authenticate("jwt", { session: false }),
    function(req, res, next) {
      var token = getToken(req.headers);
      // console.log({req})
      Book.findByIdAndRemove(req.body.id, (err, book) => {
        // As always, handle any potential errors:
        if (err) return res.status(500).send(err);
        // creates a simple object to send back with a message and the id of the document that was removed
        const response = {
          message: "Todo successfully deleted",
          id: book._id
        };
        return res.status(200).send(response);
      });
    }
  );

  /* CREATE BOOK */
  app.post(
    "/api/book",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      // console.log({req})
      var token = getToken(req.headers);
      if (token) {
        Book.create(req.body, function(err, post) {
          if (err) return next(err);
          res.json(post);
        });
      } else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
      }
    }
  );

  app.put(
    "/api/book",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      console.log("body", req.body);
      const { title, author, isbn, id, userAccess } = req.body;
      var token = getToken(req.headers);
      if (token) {
        Book.findOneAndUpdate(
          { _id: id },
          { $set: { title: title, author: author, isbn: isbn } },
          function(err, post) {
            if (err) return next(err);
            res.json(post);
          }
        );
      } else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
      }
    }
  );
};
