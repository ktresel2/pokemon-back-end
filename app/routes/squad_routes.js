const express = require('express')
const passport = require('passport')

const Squad = require('../models/squad')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/squads', requireToken, (req, res, next) => {
  Squad.find()
    .then(squads => {
      return squads.map(squad => squad.toObject())
    })
    .then(squads => res.status(200).json({ squads: squads }))
    .catch(next)
})

router.get('/squads/:id', requireToken, (req, res, next) => {
  Squad.findById(req.params.id)
    .then(handle404)
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

router.patch('/squads:id', requireToken, (req, res, next) => {
  delete req.body.squad.owner

  Squad.findById(req.params.id)
    .then(handle404)
    .then(squad => {
      requireOwnership(req, squad)
      return squad.updateOne(req.body.squad)
    })
    .then(() => res.sendStatus(204))
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