const mongoose = require('mongoose')

const squadSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pokemon: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pokemon'
    }],
    maxItems: 6
  },
  current: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Squad', squadSchema)
