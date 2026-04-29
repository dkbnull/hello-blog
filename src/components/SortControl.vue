<template>
  <div class="sort-control">
    <button class="sort-btn" :class="{ active: sortOrder === 'desc' }" @click="$emit('change', 'desc')">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <polyline points="19 12 12 19 5 12"/>
      </svg>
      最新
    </button>
    <button class="sort-btn" :class="{ active: sortOrder === 'asc' }" @click="$emit('change', 'asc')">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
      </svg>
      最早
    </button>
  </div>
</template>

<script setup>
defineProps({
  sortOrder: {
    type: String,
    required: true
  }
});

defineEmits(['change']);
</script>
