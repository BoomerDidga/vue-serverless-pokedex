<template>
  <li class="pokedex-card">
    <div class="pokemon-image">
      <img
        :src="imageUrl"
        :alt="name"
        @error="handleImageError"
        class="pokemon-img"
      />
    </div>
    <div class="pokemon-info">
      <span class="pokemon-number">#{{ number.toString().padStart(3, '0') }}</span>
      <span class="pokemon-name">{{ name }}</span>

      <!-- 🆕 ปุ่มเพิ่มเข้า Group -->
      <button class="add-btn" @click="addToGroup">➕ เพิ่มเข้า Group</button>

      <!-- ✅ ปุ่มดูรายละเอียด -->
      <button class="view-btn" @click="viewDetail">👁️ ดูรายละเอียด</button>
    </div>
  </li>
</template>

<script setup>
import { computed, ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['add-to-group', 'view-detail'])

/*const props = defineProps({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  localImage: {
    type: String,
    default: null
  },
  spriteUrl: {
    type: String,
    default: null
  }
})*/

const props = defineProps({
  name: String,
  number: Number,
  localImage: String,
  spriteUrl: String
})

const imageError = ref(false)

const imageUrl = computed(() => {
  if (imageError.value) {
    return props.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.number}.png`
  }
  return props.localImage || props.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.number}.png`
})

const handleImageError = () => {
  imageError.value = true
}

const addToGroup = () => {
  emit('add-to-group', {
    pokemon_species: { name: props.name },
    entry_number: props.number,
    sprite_url: props.spriteUrl,
    local_image: props.localImage
  })
}

const viewDetail = () => {
  emit('view-detail', {
    pokemon_species: { name: props.name },
    entry_number: props.number,
    sprite_url: props.spriteUrl,
    local_image: props.localImage
  })
}

</script>

<style scoped>
.pokedex-card {
  /*
  list-style: none;
  padding: 15px;
  margin: 10px;
  border: 2px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  max-width: 250px;
  */

  /* ... เดิม ... */
}

/*.pokedex-card:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-color: #007bff;
}*/

/*.pokemon-image {
  margin-bottom: 10px;
}*/

/*.pokemon-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 10px;
}*/

/*.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}*/

/*.pokemon-number {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}*/

/*.pokemon-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}*/

.pokemon-info {
  display: flex;
  /*gap: 6px;*/
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
  gap: 6px;
}

.add-btn {
  margin-top: 10px;
  background: #007bff;
  border: none;
  color: white;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-btn:hover {
  background: #0056b3;
}

.view-btn {
  margin-top: 5px;
  background: #28a745;
  border: none;
  color: white;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-btn:hover {
  background: #1e7e34;
}

</style>