<template>
  <div class="poker-cards-container">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="grid grid-cols-3 gap-4">
      <PokerCard 
        v-for="value in ['1', '2', '3', '5', '8', '13']" 
        :key="value"
        :value="value"
        @card-selected="handleCardSelected"
      />
    </div>
  </div>
</template>

<script>
import PokerCard from "./PokerCard.vue"

export default {
  name: 'PokerCards',
  components: { PokerCard },
  props: {
    title: String
  },
  methods: {
    handleCardSelected(value) {
      this.$emit('card-selected', value)
    }
  }
}
</script>

<style scoped>
.poker-cards-container {
  margin: 20px 0;
}
</style>