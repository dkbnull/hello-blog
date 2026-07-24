/**
 * 分页组合式函数
 * 提供列表数据的排序、分页功能
 */

import { computed, ref, watch } from 'vue'

const PAGE_SIZE = 10

export const usePagination = (itemsGetter, options = {}) => {
  const { route, router, pageParam = 'page' } = options
  // 从 URL 读取初始页码，支持 F5 刷新后保持当前页
  const initialPage = route ? (parseInt(route.query[pageParam]) || 1) : 1

  const currentPage = ref(initialPage)
  const sortOrder = ref('desc')

  const sortedItems = computed(() => {
    const items = typeof itemsGetter === 'function' ? itemsGetter() : itemsGetter.value
    const multiplier = sortOrder.value === 'asc' ? 1 : -1
    return [...items].sort((a, b) => multiplier * (new Date(a.date) - new Date(b.date)))
  })

  const totalPages = computed(() => Math.ceil(sortedItems.value.length / PAGE_SIZE))

  const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    return sortedItems.value.slice(start, start + PAGE_SIZE)
  })

  const setSortOrder = (order) => {
    sortOrder.value = order
    currentPage.value = 1
  }

  const resetPage = () => {
    currentPage.value = 1
  }

  // 页码变化时同步到 URL，便于刷新与分享
  if (route && router) {
    watch(currentPage, (newPage) => {
      const query = { ...route.query }
      if (newPage > 1) {
        query[pageParam] = String(newPage)
      } else {
        delete query[pageParam]
      }
      router.replace({ query })
    })
  }

  return {
    currentPage,
    sortOrder,
    sortedItems,
    totalPages,
    pagedItems,
    setSortOrder,
    resetPage
  }
}
