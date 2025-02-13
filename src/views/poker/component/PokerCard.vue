<template>
<div class="poker-card" @click="selectCard">
  <div class="card-inner">
    <div class="card-value">{{ value }}</div>
  </div>
</div>
</template>

<script>
export default {
name: 'PokerCard',
props: {
  value: {
    type: String,
    required: true
  }
},
methods: {
  selectCard() {
    this.$emit('card-selected', this.value)
  }
}
}
</script>

<style scoped>
.poker-card {
width: 80px;
height: 120px;
background: white;
border: 1px solid #e5e7eb;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
font-size: 1.5rem;
font-weight: bold;
color: #1f2937;
transition: all 0.2s;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
cursor: pointer;
}

.poker-card::before {
content: '';
position: absolute;
top: 6px;
left: 6px;
right: 6px;
bottom: 6px;
border: 2px solid #e5e7eb;
border-radius: 6px;
pointer-events: none;
}

.poker-card:hover {
transform: translateY(-2px);
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-inner {
display: flex;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
}

.card-value {
font-size: 1.25rem;
font-weight: bold;
}
</style>