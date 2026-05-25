<template>
  <DatePicker
    v-model="dueDate"
    mode="date"
    :popover="{ placement: 'bottom-end' }"
    :min-date="new Date()"
    @update:model-value="focusInput"
    @dayclick="onDayClick"
  >
    <template #default="{ togglePopover }">
      <div class="relative">
        <input
          type="text"
          class="form-control form-control-lg padding-right-lg"
          placeholder="+ Add new task. Press enter to save."
          @keydown.enter="addNewTask"
          ref="inputRef"
        />
        <div class="action-buttons">
          <SelectPriority @change="setPriority" />
          <button
            class="btn btn-sm btn-light"
            @click="togglePopover"
            type="button"
            title="Set due date"
          >
            <IconCalendar />
          </button>
        </div>
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useTaskStore } from '../../stores/task'
import SelectPriority from './SelectPriority.vue'
import IconCalendar from '../icons/IconCalendar.vue'
import { useFocusInput } from '../../composables/useFocusInput'
import { useDateFormatter } from '../../composables/useDateFormatter'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const store = useTaskStore()
const { handleAddedTask } = store

const inputRef = ref()
const { focusInput } = useFocusInput(inputRef)
const { formatDateLocal } = useDateFormatter()

const dueDate = ref(null)

const onDayClick = (_, event) => {
  event.target.blur()
}

const newTask = reactive({
  name: '',
  is_completed: false,
  priority_id: null,
})

const setPriority = (id) => {
  newTask.priority_id = id
  focusInput()
}

const addNewTask = async (event) => {
  if (event.target.value.trim()) {
    newTask.name = event.target.value
    event.target.value = ''
    await handleAddedTask({
      ...newTask,
      due_date: formatDateLocal(dueDate.value),
    })
    dueDate.value = null
    newTask.priority_id = null
  }
}
</script>

<style>
.relative {
  position: relative;
}

.action-buttons {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  padding-left: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
