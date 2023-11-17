# Pokemon Card Database - Back End API

## About the app

### Setup and Installation

1. Fork and clone this repository.
2. Install dependencies with `npm install`.
3. Checkout to a new branch to start working.
4. Create a pull request to submit your work.

### Description

This is a back-end API serving visitors with an index of all 151 G1 Pokemon. It allows registered users to create different squads to collect Pokemon. Pokemon can be added and removed from squads.

[Front end Repo](https://github.com/ktresel2/pokemon-front-end)

### Technologies used:

- JavaScript
- Express
- MongoDB
- Mongoose
- Git
- Heroku

### ERD

![ERD](https://i.imgur.com/JXGuEXY.jpg)

## Deployed sites:

### Back End

<a href="https://pokemon-squad.onrender.com/" target="_blank">Back-End API</a>


### Front End

<a href="https://pokemon-front-ndjy.onrender.com/#/pokemon" target="_blank">Front End Client</a>



## API Routes

| HTTP Method   | URL Path     | Action           | CRUD     |
|:--------------|:-------------|:-----------------|----------|
| POST          | /squads        | create squad         | `C`reate |
| GET           | /pokemon        | index pokemon   | `R`ead   |
| GET           | /pokemon/`:id`        | show pokemon    | `R`ead   |
| GET           | /squads        | index squads    | `R`ead   |
| GET           | /squads/`:id`  | show squad | `R`ead   |
| PATCH         | /squads/`:id`  | add pokemon to a squad           | `U`pdate |
| PATCH         | /delete-from-squad/`:id`  | removes pokemon from squad         | `U`pdate |
| DELETE         | /squads/`:id`  | Delete a squad           | `D`pdate |
