const axios = require('axios')

const populate = (num) => {
  let pokemon = {}
  return axios({
    url: `https://pokeapi.co/api/v2/pokemon/${num}`
  })
    .then(res => {
      pokemon.name = res.data.name
      pokemon.pokeId = res.data.id
      pokemon.image = res.data.sprites.front_shiny
      pokemon.type = res.data.types[0].type.name
<<<<<<< HEAD
      pokemon.moves = res.data.moves.map(move => move.move.name).slice(0, 3)
      pokemon.weight = res.data.weight
      pokemon.height = res.data.height
=======
>>>>>>> c4e5d3d (Add file for populating production db)
      return pokemon
    })
    .then(poke => axios({ method: 'POST', url: 'https://intense-sierra-55545.herokuapp.com/pokemon', data: { poke } }))
    .catch(console.error)
}

const getEmAll = () => {
<<<<<<< HEAD
  for (let i = 1; i < 2; i++) {
=======
  for (let i = 2; i < 152; i++) {
>>>>>>> c4e5d3d (Add file for populating production db)
    populate(i)
  }
}

getEmAll()
