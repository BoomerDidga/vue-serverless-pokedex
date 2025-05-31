<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">✖</button>
      <div class="modal-body">
        <img
          :src="pokemon.local_image || pokemon.sprite_url"
          :alt="pokemon.pokemon_species.name"
          class="pokemon-image"
        />
        <h2>#{{ pokemon.entry_number.toString().padStart(3, '0') }} {{ pokemon.pokemon_species.name }}</h2>
        
        
        <!-- <p><em>※ เตรียมพร้อมสำหรับข้อมูลภาษาไทย/ญี่ปุ่น / สเตตัส / วิวัฒนาการ / ท่าไม้ตาย</em></p> -->
        
        <div v-if="isLoading">
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <div v-else-if="pokemonDetail">
          <p><strong>ชื่อ:</strong> {{ pokemonDetail.name }}</p>
          <p><strong>ประเภท (Types):</strong>
            <span v-for="t in pokemonDetail.types" :key="t.type.name">{{ t.type.name }} </span>
          </p>
          <p><strong>สเตตัส:</strong></p>
          <ul>
            <li v-for="stat in pokemonDetail.stats" :key="stat.stat.name">
              {{ stat.stat.name }}: {{ stat.base_stat }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>ไม่พบข้อมูล</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

/*defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})*/

import { onMounted, ref } from 'vue'
import axios from 'axios'

const props = defineProps({ pokemon: Object })
const emit = defineEmits(['close'])

const pokemonDetail = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${props.pokemon.pokemon_species.name}`)
    pokemonDetail.value = res.data
  } catch (err) {
    console.error('Failed to fetch detail', err)
  } finally {
    isLoading.value = false
  }
})

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  text-align: center;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pokemon-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 15px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>