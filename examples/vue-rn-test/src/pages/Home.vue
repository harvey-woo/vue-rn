<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useStyleModule } from '@cat5th/vue-rn'
import TodoItem from '../../TodoItem.vue'

const draft = ref('')
const nextId = ref(1)
type TodoItem_t = { id: number; label: string; done: boolean }
const todos: TodoItem_t[] = reactive([])

const total = computed(() => todos.length)
const completed = computed(() => todos.filter(t => t.done).length)
const remaining = computed(() => total.value - completed.value)

// Test useStyleModule() — the $style object is a Record<string, style-object>
const cssStyle = useStyleModule()
const cardBg = computed(() => cssStyle?.card?.backgroundColor ?? '#1a1a2e')

function onInputChange(text: string) {
  draft.value = text ?? ''
}

// ── Press 事件演示（RN Pressable 语义：pressIn → pressMove → [longPress] → pressOut → press）──
const pressLog = ref('')
let pressMoveCount = 0
const isLong = ref(false)

function onPressIn() { isLong.value = false; pressLog.value = 'pressed in 👇' }
function onPressMove() { pressLog.value = `moved ×${++pressMoveCount} 👆` }
function onLongPress() { isLong.value = true; pressLog.value = '长按触发 ⏱ 松手时 onPress 被抑制，不会添加' }
function onPressOut() { pressLog.value = isLong.value ? 'released ✋（长按，onPress 已抑制）' : 'released ✋' }

function addTodo() {
  // 长按后 RN 会抑制 onPress，正常情况下走不到这里
  const text = draft.value.trim()
  if (!text) return
  todos.push({ id: nextId.value++, label: text, done: false })
  draft.value = ''
  pressMoveCount = 0
}

function toggle(todo: TodoItem_t) { todo.done = !todo.done }

function remove(todo: TodoItem_t) {
  const idx = todos.findIndex(t => t.id === todo.id)
  if (idx !== -1) todos.splice(idx, 1)
}

// ── Clear done 反馈 ──
const clearLog = ref('')

function clearDone() {
  const before = todos.length
  for (let i = todos.length - 1; i >= 0; i--)
    if (todos[i].done) todos.splice(i, 1)
  const removed = before - todos.length
  clearLog.value = removed > 0 ? `已清除 ${removed} 项 ✅` : '没有已完成项'
}
</script>

<template>
  <View :style="{ flex: 1, paddingHorizontal: 16 }">
    <Text :style="$style.title">Vue RN Todos ✨ (style module)</Text>

    <!-- Test useStyleModule() — cardBg is read from the script, not $style -->
    <View :style="{ backgroundColor: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }">
      <Text :style="{ fontSize: 14, color: '#b0b0c0', textAlign: 'center' }">useStyleModule() ✅ — card bg from script</Text>
    </View>

    <!-- Input row -->
    <View class="flex-row mb-4">
      <TextInput
        class="flex-1"
        :style="{ backgroundColor: '#1a1a2e', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#e0e0ee', height: 48 }"
        :text="draft"
        placeholder="Add todo..."
        placeholderTextColor="#666"
        :editable="true"
        @changeText="onInputChange"
      />
      <View class="justify-center" :style="{ backgroundColor: '#16c79a', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, height: 48, marginLeft: 8 }" @pressIn="onPressIn" @pressMove="onPressMove" @pressOut="onPressOut" @press="addTodo" @longPress="onLongPress">
        <Text class="font-bold" :style="{ fontSize: 16, color: '#ffffff' }">Add</Text>
      </View>
    </View>

    <!-- 实时显示输入内容（验证 @changeText → draft 更新） -->
    <Text v-if="draft" :style="{ fontSize: 14, color: '#16c79a', marginBottom: 8 }">输入中: {{ draft }}</Text>

    <!-- Press 事件日志（onPressMove 走 rn-dom 合成） -->
    <Text v-if="pressLog" :style="{ fontSize: 13, color: '#16c79a', textAlign: 'center', marginBottom: 8 }">{{ pressLog }}</Text>

    <!-- Clear done 反馈 -->
    <Text v-if="clearLog" :style="{ fontSize: 13, color: '#e94560', textAlign: 'center', marginBottom: 8 }">{{ clearLog }}</Text>

    <!-- Stats -->
    <View class="flex-row justify-between items-center mb-4">
      <Text :style="{ fontSize: 14, color: '#888899' }">{{ remaining }} of {{ todos.length }} remaining</Text>
      <View :style="{ backgroundColor: '#2a2a3e', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6 }" @touchEnd="clearDone">
        <Text :style="{ fontSize: 13, color: '#e94560' }">Clear done</Text>
      </View>
    </View>

    <!-- List -->
    <Text v-if="todos.length === 0" class="pt-16" :style="{ fontSize: 16, color: '#555566', textAlign: 'center' }">No todos yet. Add one above!</Text>
    <View v-else class="flex-1">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :onToggle="() => toggle(todo)"
        :onRemove="() => remove(todo)"
      />
    </View>
  </View>
</template>

<style module>
.title {
  color: #16c79a;
  font-size: 22;
  font-weight: bold;
  text-align: center;
  padding-top: 16;
  margin-bottom: 20;
}
.card {
  background-color: #1a1a2e;
  border-radius: 10;
  padding: 16;
}
</style>
