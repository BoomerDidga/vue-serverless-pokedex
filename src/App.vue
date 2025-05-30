<template>
  <div id="app">
    <h1>Twitch Pokedex</h1>
    <input type="text" v-model="filterText" />
    <div class="pokemon-grid">
      <PokedexCard
        v-for="(pokemon, index) in pokemonStore.filteredList"
        :key="`poke-${index}`"
        :name="pokemon.pokemon_species.name"
        :number="pokemon.entry_number"
        :local-image="pokemon.local_image"
        :sprite-url="pokemon.sprite_url"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import PokedexCard from './components/PokedexCard.vue'

const filterText = ref('')

const pokemonStore = reactive({
  list: [],
  filteredList: computed(() =>
    pokemonStore.list.filter(pokemon =>
      pokemon.pokemon_species.name.includes(filterText.value)
    )
  )
})

onMounted(async () => {
  try {
    // Try to use the Netlify function first, fallback to direct API call
    let response
    let pokeData

    try {
      response = await fetch('/.netlify/functions/pokedex')
      pokeData = await response.json()
      pokemonStore.list = pokeData
    } catch (netlifyError) {
      console.warn('Netlify function not available, using direct API call:', netlifyError)
      // Fallback to direct API call
      response = await fetch('https://pokeapi.co/api/v2/pokedex/2/')
      const apiData = await response.json()
      // Transform the data to match our expected format
      pokemonStore.list = apiData.pokemon_entries.map(pokemon => ({
        ...pokemon,
        local_image: null,
        sprite_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.entry_number}.png`
      }))
    }
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

input[type="text"] {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  width: 300px;
  max-width: 90%;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  outline: none;
  transition: box-shadow 0.3s ease;
}

input[type="text"]:focus {
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  input[type="text"] {
    width: 250px;
  }
}
</style>
