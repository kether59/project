<template>
  <div class="poker-cards-container">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="flex flex-nowrap overflow-x-auto gap-2 pb-4">
      <PokerCard 
        v-for="value in ['0', '½', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕']" 
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

.poker-cards-container :deep(.poker-card) {
  flex-shrink: 0;
}
</style>