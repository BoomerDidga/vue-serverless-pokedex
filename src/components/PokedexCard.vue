<template>
    <h1>Twitch Pokedex</h1>
    <input type="text" v-model="filterText" />
    <ul>
        <PokedexCard
            v-for="( pokemon, index ) in pokemonStore.filteredList"
            :key="`pokemon-${index}`"
            :name="pokemon.pokemon_species.name"
            :number="pokemon.entry_number"
        />
    </ul>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
})

console.log(props.name)
</script>

<template>
    <li>({{ number }})- {{ name }}</li>
</template>

<style></style>