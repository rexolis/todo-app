import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { allPriorities } from '../http/priority-api'

export const usePriorityStore = defineStore('priorityStore', () => {
  const priorities = ref([])

  const listPriorities = computed(() => {
    const flagMaps = {
      high: 'text-danger',
      medium: 'text-warning',
      low: 'text-primary',
    }

    const noPriority = {
      id: null,
      name: 'none',
      description: 'No Priority',
      color: 'text-secondary',
    }

    return priorities.value
      .map((priority) => {
        priority['color'] = flagMaps[priority.name]
        return priority
      })
      .concat(noPriority)
  })

  const fetchAllPriorities = async () => {
    try {
      const { data } = await allPriorities()
      priorities.value = data.data
    } catch (error) {
      console.error('Error fetching priorities:', error)
    }
  }

  return {
    listPriorities,
    fetchAllPriorities,
  }
})
