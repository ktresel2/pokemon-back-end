const express = require('express')

const Pokemon = require('../models/pokemon')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const router = express.Router()

router.get('/pokemon', (req, res, next) => {
  Pokemon.find()
    .then(pokemons => {
      return pokemons.map(pokemon => pokemon.toObject())
    })
    .then(pokemons => res.status(200).json({ pokemons: pokemons }))
    .catch(next)
})

router.get('/pokemon/:id', (req, res, next) => {
  Pokemon.findById(req.params.id)
    .then(handle404)
    .then(pokemon => res.status(200).json({ pokemon: pokemon.toObject() }))
    .catch(next)
})

router.post('/pokemon', (req, res, next) => {
  Pokemon.create(req.body.poke)
    .then(pokemon => {
      res.status(201).json({ pokemon })
    })
    .catch(next)
})

module.exports = router
