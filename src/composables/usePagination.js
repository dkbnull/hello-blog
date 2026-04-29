import {computed, ref} from 'vue';

const PAGE_SIZE = 10;

export const usePagination = (itemsGetter) => {
    const currentPage = ref(1);
    const sortOrder = ref('desc');

    const sortedItems = computed(() => {
        const items = typeof itemsGetter === 'function' ? itemsGetter() : itemsGetter.value;
        const multiplier = sortOrder.value === 'asc' ? 1 : -1;
        return [...items].sort((a, b) => multiplier * (new Date(a.date) - new Date(b.date)));
    });

    const totalPages = computed(() => Math.ceil(sortedItems.value.length / PAGE_SIZE));

    const pagedItems = computed(() => {
        const start = (currentPage.value - 1) * PAGE_SIZE;
        return sortedItems.value.slice(start, start + PAGE_SIZE);
    });

    const setSortOrder = (order) => {
        sortOrder.value = order;
        currentPage.value = 1;
    };

    const resetPage = () => {
        currentPage.value = 1;
    };

    return {
        currentPage,
        sortOrder,
        sortedItems,
        totalPages,
        pagedItems,
        setSortOrder,
        resetPage
    };
};
