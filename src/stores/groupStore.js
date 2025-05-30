// groupStore.js
import { reactive } from 'vue'

const savedGroups = JSON.parse(localStorage.getItem('pokemon-groups') || '{}')

export const groupStore = reactive({
  groups: savedGroups,

  addGroup(name) {
    if (!this.groups[name]) this.groups[name] = []
    this.save()
  },

  addToGroup(name, pokemon) {
    if (!this.groups[name]) this.groups[name] = []
    const exists = this.groups[name].some(p => p.entry_number === pokemon.entry_number)
    if (!exists) this.groups[name].push(pokemon)
    this.save()
  },

  save() {
    localStorage.setItem('pokemon-groups', JSON.stringify(this.groups))
  }
})
