const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    unique:true,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  author_id: {
    type: String,
    required: true,
    trim: true,
  },
  author_name:{
    type: String,
    required: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  viewers: [{
    type: Number,
    default: 0,
  }],
  likes: [{
    
        type: Number,
        default: 0,
    
}],
  ratings:{
    type:Number,
    default:0
  },
  comments: [
    {
      author: {
        type: String,
        default:0
      },
      text: {
        type: String,
        default:0
      },
    },
  ]
})


const Blog=mongoose.model("Blog", blogSchema);
module.exports = Blog
