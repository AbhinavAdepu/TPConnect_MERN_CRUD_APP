const mongoose = require("mongoose");

//Schema for Book based on which the collections refers

/*
ORM:
   OBJECT RELATIONAL MAPPING based 
   Denormalization Technique - 
   (EMBEDED DATA MODELs)
*/
var BookSchema = new mongoose.Schema({
  userAccess: String,
  isbn: String,
  title: String,
  author: String,
  description: String,
  published_date: { type: Date },
  publisher: String,
  updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Book", BookSchema);
