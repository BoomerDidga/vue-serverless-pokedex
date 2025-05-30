<template>
  <div id="app">
    <!--<h1>Twitch Pokedex</h1>
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
    </div>-->

    <h1>Twitch Pokedex Panel</h1>
    <div class="container">
      <!-- 🔹 ซ้าย: Search List -->
      <div class="left-pane">
        <input type="text" v-model="filterText" placeholder="ค้นหาโปเกม่อน" />
        <div class="pokemon-grid">
          <PokedexCard
            v-for="(pokemon, index) in pokemonStore.filteredList"
            :key="`poke-${index}`"
            :name="pokemon.pokemon_species.name"
            :number="pokemon.entry_number"
            :local-image="pokemon.local_image"
            :sprite-url="pokemon.sprite_url"
            @add-to-group="handleAddToGroup(pokemon)"
          />
        </div>
      </div>

      <!-- 🔹 ขวา: Group Management (เตรียมไว้ก่อน) -->
      <div class="right-pane">
        <h2>🎴 Pokémon Groups</h2>
        <p>คุณสามารถจัดกลุ่มโปเกม่อนได้ที่นี่</p>
        <!-- กลุ่มจะมาแสดงตรงนี้ในอนาคต -->
        <form @submit.prevent="createGroup">
          <input v-model="newGroupName" placeholder="ตั้งชื่อกลุ่มใหม่" />
          <button type="submit">➕ สร้างกลุ่ม</button>
        </form>
        <div v-if="Object.keys(groupStore.groups).length === 0">
          <p>ยังไม่มีกลุ่ม กรุณาสร้างกลุ่มก่อน</p>
        </div>
        <div v-for="(pokemons, groupName) in groupStore.groups" :key="groupName" class="group-box">
          <h3>{{ groupName }}</h3>
          <ul>
            <li v-for="poke in pokemons" :key="poke.entry_number">
              {{ poke.pokemon_species.name }} (#{{ poke.entry_number }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import PokedexCard from './components/PokedexCard.vue'
import { groupStore } from './stores/groupStore.js'

const filterText = ref('')
const newGroupName = ref('')

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

function createGroup() {
  if (!newGroupName.value.trim()) return
  groupStore.addGroup(newGroupName.value.trim())
  newGroupName.value = ''
}

function handleAddToGroup(pokemon) {
  const groupNames = Object.keys(groupStore.groups)
  if (groupNames.length === 0) {
    alert('กรุณาสร้างกลุ่มก่อน')
    return
  }
  const selectedGroup = prompt('เพิ่มเข้า Group ไหน?', groupNames[0])
  if (selectedGroup && groupStore.groups[selectedGroup]) {
    groupStore.addToGroup(selectedGroup, pokemon)
  }
}

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

.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.left-pane, .right-pane {
  width: 50%;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow-y: auto;
}

input[type="text"] {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  width: 90%;
  margin-bottom: 20px;
  /*max-width: 20px; */
  /*margin-bottom: 30px; */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  outline: none;
  transition: box-shadow 0.3s ease;
}

input[type="text"]:focus {
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  /*max-width: 1200px;
  margin: 0 auto;
  padding: 20px;*/
}

.group-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: left;
}

.group-box h3 {
  margin: 0 0 8px;
}

.group-box ul {
  list-style: none;
  padding-left: 0;
}

.group-box li {
  padding: 2px 0;
}

@media (max-width: 768px) {
  /*.pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 10px;
  }*/

  .container {
    flex-direction: column;
  }

  h1 {
    font-size: 2rem;
  }

  .left-pane, .right-pane {
    width: 100%;
  }

  /*input[type="text"] {
    width: 250px;
  }*/
}
</style>