<template>
  <main style="min-height: 50vh; margin-top: 2rem">
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <!-- Task order -->
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="text-body mb-0">Tasks</h3>
            <SortTasks />
          </div>

          <!-- Add new Task -->
          <NewTask />

          <!-- List of uncompleted tasks -->
          <Tasks :tasks="uncompletedTasks" />

          <!-- Show toggle button -->
          <div class="text-center my-3" v-show="showToggleCompleteBtn">
            <button
              class="btn btn-sm btn-secondary"
              @click="() => (showCompletedTasks = !showCompletedTasks)"
            >
              <span v-if="!showCompletedTasks" class="badge bg-secondary ms-1">Show completed</span>
              <span v-else class="badge bg-secondary ms-1">Hide completed</span>
            </button>
          </div>
          <!-- List of completed tasks -->
          <Tasks :tasks="completedTasks" :show="completedTasksIsVisible && showCompletedTasks" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Tasks from '@/components/tasks/Tasks.vue'
import NewTask from '@/components/tasks/NewTask.vue'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import SortTasks from '@/components/tasks/SortTasks.vue'

const store = useTaskStore()
const { completedTasks, uncompletedTasks } = storeToRefs(store)
const { fetchAllTasks } = store

const route = useRoute()

watch(
  () => route.query,
  async (query) => await fetchAllTasks(query),
  { immediate: true },
)

const showToggleCompleteBtn = computed(
  () => uncompletedTasks.value.length > 0 && completedTasks.value.length > 0,
)
const completedTasksIsVisible = computed(
  () => uncompletedTasks.value.length === 0 || completedTasks.value.length > 0,
)
const showCompletedTasks = ref(false)
</script>
