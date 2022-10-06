// models/Book.model.js
 
const { Schema, model } = require('mongoose');
 
const bookSchema = new Schema(
  {
    title: String,
    description: String,
    rating: Number,
    author: {
      type: Schema.Types.ObjectID, 
      ref: 'Author'
    },
    
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Book', bookSchema);