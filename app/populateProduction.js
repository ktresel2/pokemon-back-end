const axios = require("axios");

const populate = (num) => {
  let pokemon = {};
  return axios({
    url: `https://pokeapi.co/api/v2/pokemon/${num}`,
  })
    .then((res) => {
      pokemon.name = res.data.name;
      pokemon.pokeId = res.data.id;
      pokemon.image = res.data.sprites.front_shiny;
      pokemon.type = res.data.types[0].type.name;
      return pokemon;
    })
    .then((poke) =>
      axios({
        method: "POST",
        url: "https://pokemon-squad.onrender.com/pokemon",
        data: { poke },
      })
    );
  // .catch(console.error.data);
};

const getEmAll = () => {
  for (let i = 1; i < 152; i++) {
    populate(i);
  }
};

getEmAll();
