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
    </div>
  </li>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
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
</script>

<style scoped>
.pokedex-card {
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
}

.pokedex-card:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-color: #007bff;
}

.pokemon-image {
  margin-bottom: 10px;
}

.pokemon-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 10px;
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.pokemon-number {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.pokemon-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}
</style>