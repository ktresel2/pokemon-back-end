const mongoose = require('mongoose')

const pokemonSchema = require('./pokemon')

const squadSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pokemon: {
    type: Array,
    children: [pokemonSchema],
    required: true,
    validate: this.children.length < 7
  },
  current: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Squad', squadSchema)
