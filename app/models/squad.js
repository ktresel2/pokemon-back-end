const mongoose = require('mongoose')

const pokemonSchema = require('./pokemon')

const squadSchema = new mongoose.Schema({
  pokemon: {
    type: Array,
    children: [pokemonSchema],
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Squad', squadSchema)
