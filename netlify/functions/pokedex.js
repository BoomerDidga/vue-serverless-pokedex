const fetch = require('node-fetch')

// Mapping of Pokemon numbers to local image files
const localImages = {
  "1": "/Pokemon Pictures/1. Bulbasaur-Pokemon-PNG-Isolated-HD.png",
  "2": "/Pokemon Pictures/2. ivysaur-256x256.png"
}

exports.handler = async function () {
  try {
    const pokeApiData = await fetch('https://pokeapi.co/api/v2/pokedex/2/').then(
      response => response.json()
    )

    // Enhance Pokemon data with local images
    const pokeData = pokeApiData.pokemon_entries.map(pokemon => {
      const pokemonNumber = pokemon.entry_number
      const localImage = localImages[pokemonNumber]

      return {
        ...pokemon,
        local_image: localImage || null,
        // Also include the official sprite as fallback
        sprite_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber}.png`
      }
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pokeData)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Pokemon data' })
    }
  }
}

/*const fetch = require('node-fetch')

exports.handler = async () => {
  const pokedexResponse = await fetch('https://pokeapi.co/api/v2/pokedex/1')
  const data = await pokedexResponse.json()

  const originalPokedex = data.pokemon_entries.slice(0, 151)

  return {
    statusCode: 200,
    body: JSON.stringify(originalPokedex)
  }
}*/
