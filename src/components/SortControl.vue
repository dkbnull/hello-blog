<template>
  <div class="sort-control">
    <button class="sort-btn" :class="{ active: sortOrder === 'desc' }" @click="$emit('change', 'desc')">
      <Icon icon="sortDesc" :size="14" />
      最新
    </button>
    <button class="sort-btn" :class="{ active: sortOrder === 'asc' }" @click="$emit('change', 'asc')">
      <Icon icon="sortAsc" :size="14" />
      最早
    </button>
  </div>
</template>

<script setup>
import Icon from '@/components/Icon.vue'

defineProps({
  sortOrder: {
    type: String,
    required: true
  }
})

defineEmits(['change'])
</script>
