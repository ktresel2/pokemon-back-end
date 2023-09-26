const express = require('express')
const passport = require('passport')

const Squad = require('../models/squad')
const Pokemon = require('../models/pokemon')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const auth = require('../../lib/auth')

const router = express.Router()

router.get("/squads", auth, async (req, res, next) => {
  Squad.find({ owner: req.user.id})
    .populate("pokemon")
    .then((squads) => {
      return squads.map((squad) => squad.toObject());
    })
    .then((squads) => res.status(200).json({ squads }))
    .catch(next);
});

router.get("/squads/:id", auth, (req, res, next) => {
  Squad.findById(req.params.id)
    .populate("pokemon")
    .then((squad) => {
      return squad;
    })
    .then((squad) => res.status(200).json({ squad: squad.toObject() }))
    .catch(next);
});

router.post("/squads", auth, (req, res, next) => {

  Squad.create(req.body.squad)
    .then((squad) => {
      res.status(201).json({ squad: squad.toObject() });
    })
    .catch(next);
});

// Add to squad
router.patch("/squads/:id", auth, (req, res, next) => {
  let poke;

  Pokemon.findById(req.body.pokemon.id)
    .then((pok) => {
      poke = pok;
    })
    .then(
      Squad.findById(req.params.id)
        .populate("pokemon")
        .then((squad) => requireOwnership(req, squad))
        .then((squad) => {
          console.log(squad)
          const hasPokemon = squad.pokemon.some((poke) =>
            poke._id.equals(req.body.pokemon.id)
          );
          if (hasPokemon) {
            throw new Error("Already exists");
          }
          squad.pokemon.push(poke);
          return squad.save();
        })
        .then((squad) => {
          res.status(200).json({ squad: squad.toObject() });
        })
        .catch(next)
    );
});

// Delete from squad
router.patch("/delete-from-squad/:id", auth, (req, res, next) => {
  Squad.findById(req.params.id)
    .then((res) => requireOwnership(req, res))
    .then((squad) => {
      const index = squad.pokemon.indexOf(req.body.pokemon.id);
      index > -1 && squad.pokemon.splice(index, 1);
      squad.save();
    })
    .then((squad) => {
      res.sendStatus(200);
    })
    .catch(next);
});

router.delete("/squads/:id", auth, (req, res, next) => {
  Squad.findById(req.params.id)
    .then(handle404)
    .then((squad) => {
      requireOwnership(req, squad);
      squad.deleteOne();
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router
