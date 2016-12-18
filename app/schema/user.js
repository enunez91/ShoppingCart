var mongoose = require('mongoose') , Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
  profile:{
    username:{
      type: String,
      required: true,
      lowercase: true
    },
    picture:{
      type: String,
      match: /^http:\/\//i
    }
  },
  data:{
    oauth:{ type: String, required: true },
    cart: [{
        product:{
          type:Schema.Types.ObjectId
        },
        quantity:{
          type: Number,
          default: 1,
          min: 1
        }
    }]
  }
})
