const axios = require('axios')

const populate = (num) => {
  let pokemon = {}
  return axios({
    url: `https://pokeapi.co/api/v2/pokemon/${num}`,
  })
    .then((res) => {
      pokemon.name = res.data.name;
      pokemon.pokeId = res.data.id;
      pokemon.image = res.data.sprites.front_shiny;
      pokemon.type = res.data.types[0].type.name;
      pokemon.moves = res.data.moves.map((move) => move.move.name).slice(0, 3);
      pokemon.weight = res.data.weight;
      pokemon.height = res.data.height;
      return pokemon;
    })
    .then((poke) =>
      axios({
        method: "POST",
        url: "https://pokemon-squad.onrender.com/pokemon",
        data: { poke },
      })
    )
    .catch(console.error);
}

const getEmAll = () => {
  for (let i = 1; i < 152; i++) {
    populate(i)
  }
}

getEmAll()
