const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  imageUrl: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Blog', blogSchema);
