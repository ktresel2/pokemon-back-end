const express = require('express')
const passport = require('passport')

const Squad = require('../models/squad')
const Pokemon = require('../models/pokemon')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/squads', requireToken, (req, res, next) => {
  Squad.find({ owner: req.user.id })
    .populate('pokemon')
    .then(squads => {
      return squads.map(squad => squad.toObject())
    })
    .then(squads => res.status(200).json({ squads }))
    .catch(next)
})

router.get('/squads/:id', requireToken, (req, res, next) => {
  Squad.findById(req.params.id)
    .populate('pokemon')
    .then(squad => {
      return squad
    })
    .then(squad => res.status(200).json({ squad: squad.toObject() }))
    .catch(next)
})

router.post('/squads', requireToken, (req, res, next) => {
  req.body.squad.owner = req.user.id

  Squad.create(req.body.squad)
    .then(squad => {
      res.status(201).json({ squad: squad.toObject() })
    })
    .catch(next)
})

// Add to squad
router.patch('/squads/:id', requireToken, (req, res, next) => {
  console.log(req.body)
  console.log(req.params)

  let poke

  Pokemon.findById(req.body.pokemon.id)
    .then(pok => {
      poke = pok
    })
    .then(Squad.findById(req.params.id)
      .populate('pokemon')
      .then(squad => requireOwnership(req, squad))
      .then(squad => {
        squad.pokemon.push(poke)
        return squad.save()
      })
      .then(squad => {
        console.log(squad)
        res.status(200).json({ squad: squad.toObject() })
      })
      .catch(next)
    )
})

// Delete from squad
router.patch('/delete-from-squad/:id', requireToken, (req, res, next) => {
  Squad.findById(req.params.id)
    .then(res => {
      console.log(res)
      return res
    })
    .then(res => requireOwnership(req, res))
    .then(squad => {
      console.log('on 81', squad)
      const index = squad.pokemon.indexOf(req.body.pokemon.id)
      index > -1 && squad.pokemon.splice(index, 1)
      squad.save()
    })
    .then(squad => {
      res.sendStatus(200)
    })
    .catch(next)
})

router.delete('/squads/:id', requireToken, (req, res, next) => {
  Squad.findById(req.params.id)
    .then(handle404)
    .then(squad => {
      requireOwnership(req, squad)
      squad.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
