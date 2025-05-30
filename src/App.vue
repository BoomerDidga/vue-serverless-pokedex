<template>
  <h1>Twitch Pokedex</h1>
  <input type="text" v-model="filterText" />
  <ul>
    <PokedexCard
      v-for="(pokemon, index) in pokemonStore.filteredList"
      :key="`poke-${index}`"
      :name="pokemon.pokemon_species.name"
      :number="pokemon.entry_number"
    />
  </ul>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
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

const pokemonList = ref([])
onMounted(async () => {
	const pokeData = await fetch('https://pokeapi/co/api/v2/pokedex/2/').then(response => response.json()
	)

  console.log(pokeData)

	pokemonStore.list = pokeData
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
