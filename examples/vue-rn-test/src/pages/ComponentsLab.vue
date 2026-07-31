<script setup lang="ts">
/**
 * Components Lab — 覆盖 rn-dom 的全部 props 与事件。
 * 每个区块对应一组 RN 对外 API，日志区实时显示触发的事件。
 */
import { ref, onMounted, onErrorCaptured } from 'vue'
import { Platform } from 'react-native'
import { useStyleModule } from '@cat5th/vue-rn'

const $style = useStyleModule()

onMounted(() => {
  console.log('[Lab] mounted')
  log('Lab mounted', new Date().toLocaleTimeString())
})

// 捕获子组件渲染错误，显示到日志区（避免整页空白）
onErrorCaptured((err) => {
  console.error('[Lab] error captured:', err)
  log('ERROR', String((err as Error)?.message ?? err).slice(0, 120))
  return false // 阻止错误继续向上传播，避免 Vue 中断组件树
})

// ── 日志 ──────────────────────────────────────────────────────────
const logs = ref<string[]>([])
function log(tag: string, detail = '') {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${tag}${detail ? ' ' + detail : ''}`)
  if (logs.value.length > 30) logs.value.length = 30
}
function clearLogs() { logs.value = [] }

// ── Press 实验室 ─────────────────────────────────────────────────
const pressLog = ref('')
// move 单独显示，不覆盖 in/out/press 状态（避免 move 刷屏导致 out 看不清）
const pressMoveState = ref('')
let pressMoveCount = 0
function onPressIn() { pressLog.value = 'pressIn 👇'; log('pressIn') }
function onPressMove() { pressMoveState.value = `pressMove ×${++pressMoveCount} 👆` }
function onPressOut() { pressLog.value = 'pressOut ✋'; log('pressOut') }
function onPress() { pressLog.value = 'press ✅'; log('press') }
function onLongPress() { pressLog.value = 'longPress ⏱'; log('longPress') }

const pressDisabled = ref(false)
const pressRectOffset = ref(40) // 大一点，避免轻微手指移动导致 press 被取消

// ── TextInput 实验室 ─────────────────────────────────────────────
const text = ref('')
const textEvents = ref('')
function onChangeText(v: string) { text.value = v; log('changeText', `"${v}"`) }
function onChange(e: unknown) { log('change', `nativeEvent: ${JSON.stringify((e as any)?.nativeEvent ?? {}).slice(0, 80)}`) }
function onFocus() { textEvents.value = 'focused 🔵'; log('focus') }
function onBlur() { textEvents.value = 'blurred ⚪'; log('blur') }
function onSubmitEditing() { textEvents.value = 'submitted ⏎'; log('submitEditing') }
function onKeyPress(e: unknown) { log('keyPress', `key=${(e as any)?.nativeEvent?.key}`) }
function onSelectionChange(e: unknown) { log('selectionChange', JSON.stringify((e as any)?.nativeEvent?.selection ?? {})) }
function onEndEditing() { log('endEditing') }

// ── Switch 实验室 ────────────────────────────────────────────────
const switchOn = ref(false)
function onSwitchChange(v: boolean) { switchOn.value = v; log('valueChange', `→ ${v}`) }
function onSwitchEvent(e: unknown) { log('switchChange', `value=${(e as any)?.nativeEvent?.value}`) }

// ── ScrollView 实验室 ────────────────────────────────────────────
const scrollLog = ref('')
function onScroll(e: unknown) {
  const y = (e as any)?.nativeEvent?.contentOffset?.y
  scrollLog.value = `scroll y=${typeof y === 'number' ? y.toFixed(0) : '?'}`
  // 日志节流：scroll 高频，只记录第一次
  if (!scrollLog.value.includes('scroll')) log('scroll')
}
let scrolled = false
function onScrollBeginDrag() { scrolled = true; log('scrollBeginDrag') }
function onScrollEndDrag() { scrolled = false; log('scrollEndDrag') }
function onMomentumBegin() { log('momentumBegin') }
function onMomentumEnd() { log('momentumEnd') }
function onContentSizeChange() { log('contentSizeChange') }

// ScrollView 内按下的按钮 — 滚动时 onPress 应被中断
const scrollPressCount = ref(0)
function onScrollPress() { scrollPressCount.value++; log('scrollPress', `×${scrollPressCount.value}`) }

// ── Touch 冒泡实验室 ─────────────────────────────────────────────
function onChildTouchEnd() { log('childTouchEnd') }
function onParentTouchEnd() { log('parentTouchEnd (bubbled)') }
function onGrandTouchEnd() { log('grandTouchEnd (bubbled)') }

// ── Image 实验室 ─────────────────────────────────────────────────
const imageStatus = ref('loading…')
function onLoadStart() { imageStatus.value = 'loading…'; log('loadStart') }
function onLoad() { imageStatus.value = 'loaded ✅'; log('load') }
function onLoadEnd() { imageStatus.value = 'loadEnd'; log('loadEnd') }
function onError() { imageStatus.value = 'error ❌'; log('imageError') }

// ── Layout ───────────────────────────────────────────────────────
const layoutInfo = ref('')
function onLayout(e: unknown) {
  const { width, height } = (e as any)?.nativeEvent?.layout ?? {}
  if (width && height) layoutInfo.value = `${Math.round(width)}×${Math.round(height)}`
  log('layout', layoutInfo.value)
}

// ── Modal 实验室 ─────────────────────────────────────────────────
const modalVisible = ref(false)
const modalLog = ref('')
function onModalShow() { modalLog.value = 'shown ✅'; log('modalShow') }
function onModalDismiss() { modalLog.value = 'dismissed ✋'; log('modalDismiss') }
function onModalRequestClose() { modalLog.value = 'requestClose (back)'; log('modalRequestClose') }

// ── 补充组件 ─────────────────────────────────────────────────
const isAndroid = Platform.OS === 'android'

// ActivityIndicator
const spinnerAnimating = ref(true)
function onSpinnerToggle() { spinnerAnimating.value = !spinnerAnimating.value }

// 按压组件（RN 标签 rn-dom 暂用 View+事件实现）
function onPressablePress() { log('pressable', 'pressed') }
const pressOpacity = ref(1)
function onTouchableOpacityPress() { log('touchableOpacity', 'pressed'); pressOpacity.value = 0.4; setTimeout(() => { pressOpacity.value = 1 }, 200) }
const pressHighlight = ref(false)
function onTouchableHighlightPress() { log('touchableHighlight', 'pressed'); pressHighlight.value = true; setTimeout(() => { pressHighlight.value = false }, 200) }
function onTouchableWFPress() { log('touchableWithoutFeedback', 'pressed') }

// Android 专用
const androidSwitchOn = ref(false)
</script>

<template>
  <ScrollView class="flex-1" :style="{ padding: 16 }"
    @scroll="onScroll" @scrollBeginDrag="onScrollBeginDrag" @scrollEndDrag="onScrollEndDrag"
    @momentumScrollBegin="onMomentumBegin" @momentumScrollEnd="onMomentumEnd" @contentSizeChange="onContentSizeChange">
    <Text :style="$style.h1">🧪 Components Lab</Text>
    <Text :style="$style.sub">覆盖 rn-dom 全部 props 与事件</Text>

    <!-- ── Press 实验室 ─────────────────────────────────────── -->
    <View :style="$style.card">
      <Text :style="$style.cardTitle">Press（点击）</Text>
      <View :style="{ flexDirection: 'row', alignItems: 'center' }">
        <View :style="[$style.pressBtn, { opacity: pressDisabled ? 0.4 : 1 }]"
          :pressRectOffset="pressRectOffset"
          :disabled="pressDisabled"
          @pressIn="onPressIn" @pressMove="onPressMove" @pressOut="onPressOut"
          @press="onPress" @longPress="onLongPress">
          <Text :style="{ color: '#fff', fontSize: 16, fontWeight: 'bold' }">Press me</Text>
        </View>
        <View :style="{ marginLeft: 12, flex: 1 }">
          <Text :style="$style.logLine">{{ pressLog || '— 点击试试 —' }}</Text>
          <Text :style="[$style.logLine, { color: '#8ab4f8', marginTop: 2 }]">{{ pressMoveState || '' }}</Text>
        </View>
      </View>
      <View :style="{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }">
        <Text :style="$style.label">disabled</Text>
        <Switch :value="pressDisabled" @valueChange="(v: boolean) => { pressDisabled = v; log('pressDisabled', `→ ${v}`) }" />
        <Text :style="[$style.label, { marginLeft: 16 }]">严格 pressRectOffset</Text>
        <Switch :value="pressRectOffset === 10" @valueChange="(v: boolean) => { pressRectOffset = v ? 10 : 40; log('pressRectOffset', `→ ${pressRectOffset}`) }" />
      </View>
      <Text :style="$style.hint">按住拖动离开再松手 → press 被抑制；长按 → longPress</Text>
    </View>

    <!-- ── TextInput 实验室 ─────────────────────────────────── -->
    <View :style="$style.card">
      <Text :style="$style.cardTitle">TextInput</Text>
      <TextInput
        :style="$style.input"
        :value="text"
        placeholder="输入试试（changeText 受控）"
        placeholderTextColor="#666"
        @changeText="onChangeText" @change="onChange"
        @focus="onFocus" @blur="onBlur"
        @submitEditing="onSubmitEditing" @endEditing="onEndEditing"
        @keyPress="onKeyPress" @selectionChange="onSelectionChange"
      />
      <Text :style="$style.logLine">值: "{{ text }}" — {{ textEvents || '—' }}</Text>
    </View>

    <!-- ── Switch 实验室 ────────────────────────────────────── -->
    <View :style="$style.card">
      <Text :style="$style.cardTitle">Switch（valueChange 布尔变换）</Text>
      <View :style="{ flexDirection: 'row', alignItems: 'center' }">
        <Switch :value="switchOn" @valueChange="onSwitchChange" @change="onSwitchEvent" />
        <Text :style="[$style.logLine, { marginLeft: 12 }]">→ {{ switchOn ? 'ON' : 'OFF' }}</Text>
      </View>
    </View>

    <!-- ── ScrollView 实验室 ────────────────────────────────── -->
    <View :style="$style.card">
      <Text :style="$style.cardTitle">ScrollView（滚动事件 + 滚动中断 press）</Text>
      <Text :style="$style.logLine">{{ scrollLog || '— 上下滑动试试 —' }}</Text>
      <View :style="[$style.pressBtn, { marginTop: 8 }]" @press="onScrollPress">
        <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">滚动时按我（onPress 应中断）×{{ scrollPressCount }}</Text>
      </View>
      <View :style="{ height: 120, marginTop: 8, borderRadius: 8, overflow: 'hidden' }">
        <ScrollView :style="{ flex: 1 }" nestedScrollEnabled>
          <!-- 用简单文本代替复杂表达式，排除文本渲染问题 -->
          <Text :style="{ color: '#888899' }">内部 ScrollView（滚动测试区）</Text>
          <Text :style="{ color: '#666677' }">第 2 行 — 下拉触发 momentum/drag</Text>
          <Text :style="{ color: '#666677' }">第 3 行 — 继续滚动</Text>
          <Text :style="{ color: '#666677' }">第 4 行 — 滚动事件会记录</Text>
        </ScrollView>
      </View>
    </View>

    <!-- ── Touch 冒泡实验室 ─────────────────────────────────── -->
    <View :style="$style.card" @touchEnd="onGrandTouchEnd">
      <Text :style="$style.cardTitle">Touch 冒泡（onTouchEnd 逐层向上）</Text>
      <View :style="{ backgroundColor: '#2a2a3e', borderRadius: 8, padding: 12 }" @touchEnd="onParentTouchEnd">
        <View :style="{ backgroundColor: '#3a3a5e', borderRadius: 8, padding: 12 }" @touchEnd="onChildTouchEnd">
          <Text :style="{ color: '#c0c0d0' }">点我 → child → parent → grand 都触发</Text>
        </View>
      </View>
    </View>

    <!-- ── Image 实验室 ─────────────────────────────────────── -->
    <View :style="$style.card">
      <Text :style="$style.cardTitle">Image（load 系列事件）</Text>
      <Image
        source="https://picsum.photos/300/150"
        :style="{ width: 300, height: 150, borderRadius: 8, backgroundColor: '#2a2a3e' }"
        resizeMode="cover"
        @loadStart="onLoadStart" @load="onLoad" @loadEnd="onLoadEnd" @error="onError"
      />
      <Text :style="$style.logLine">{{ imageStatus }}</Text>
    </View>

    <!-- ── Layout ───────────────────────────────────────────── -->
    <View :style="$style.card" @layout="onLayout">
      <Text :style="$style.cardTitle">Layout（direct 事件）</Text>
      <Text :style="$style.logLine">{{ layoutInfo || '— 测量中 —' }}</Text>
    </View>

    <!-- ── Modal 实验室 ─────────────────────────────────────── -->
    <View :style="$style.card">
      <Text :style="$style.cardTitle">Modal（show/dismiss）</Text>
      <View :style="[$style.pressBtn, { marginTop: 4 }]" @press="() => { modalVisible = true; log('openModal') }">
        <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">打开 Modal</Text>
      </View>
      <Text :style="$style.logLine">{{ modalLog || '—' }}</Text>
    </View>

    <!-- ── 补充组件 ─────────────────────────────────────────── -->
    <Text :style="[$style.h1, { fontSize: 18, marginTop: 12 }]">补充组件</Text>

    <SafeAreaView :style="$style.card">
      <Text :style="$style.cardTitle">SafeAreaView（安全区）</Text>
      <Text :style="$style.hint">容器避开刘海与 Home 指示条，此卡即 SafeAreaView 内部。</Text>
    </SafeAreaView>

    <View :style="$style.card">
      <Text :style="$style.cardTitle">ActivityIndicator（加载指示器）</Text>
      <View :style="{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 8 }">
        <ActivityIndicator size="small" :animating="spinnerAnimating" />
        <ActivityIndicator size="large" :animating="spinnerAnimating" color="#16c79a" />
      </View>
      <View :style="[$style.pressBtn, { marginTop: 8 }]" @press="onSpinnerToggle">
        <Text :style="{ color: '#fff', fontSize: 13, fontWeight: 'bold' }">{{ spinnerAnimating ? '停止动画' : '开始动画' }}</Text>
      </View>
    </View>

    <!-- ── 按压组件（RN 标签，rn-dom 暂用 View+事件实现）────── -->
    <Text :style="[$style.h1, { fontSize: 18, marginTop: 12 }]">按压组件（rn-dom 暂用 View+事件实现）</Text>

    <View :style="$style.card">
      <Text :style="$style.cardTitle">Pressable（等价 View + @press）</Text>
      <View :style="$style.pressBtn" @press="onPressablePress">
        <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">按我（Pressable）</Text>
      </View>
      <Text :style="$style.hint">rn-dom 尚未支持 Pressable 标签，用 View + press 事件等价实现</Text>
    </View>

    <View :style="$style.card">
      <Text :style="$style.cardTitle">TouchableOpacity（按下变透明）</Text>
      <View :style="[$style.pressBtn, { opacity: pressOpacity }]" @press="onTouchableOpacityPress">
        <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">按我（TouchableOpacity）</Text>
      </View>
    </View>

    <View :style="$style.card">
      <Text :style="$style.cardTitle">TouchableHighlight（按下高亮）</Text>
      <View :style="[$style.pressBtn, { backgroundColor: pressHighlight ? '#0d8f6f' : '#16c79a' }]" @press="onTouchableHighlightPress">
        <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">按我（TouchableHighlight）</Text>
      </View>
    </View>

    <View :style="$style.card">
      <Text :style="$style.cardTitle">TouchableWithoutFeedback（无视觉反馈）</Text>
      <View :style="$style.pressBtn" @press="onTouchableWFPress">
        <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">按我（TouchableWithoutFeedback）</Text>
      </View>
    </View>

    <!-- ── Android 专用（Android 设备）─────────────────────── -->
    <Text v-if="isAndroid" :style="[$style.h1, { fontSize: 18, marginTop: 12 }]">Android 专用组件</Text>

    <View v-if="isAndroid" :style="$style.card">
      <Text :style="$style.cardTitle">AndroidSwitch</Text>
      <View :style="{ flexDirection: 'row', alignItems: 'center' }">
        <AndroidSwitch :value="androidSwitchOn" @valueChange="(v: boolean) => { androidSwitchOn = v; log('androidSwitch', `→ ${v}`) }" />
        <Text :style="[$style.logLine, { marginLeft: 12 }]">→ {{ androidSwitchOn ? 'ON' : 'OFF' }}</Text>
      </View>
    </View>

    <View v-if="isAndroid" :style="$style.card">
      <Text :style="$style.cardTitle">ProgressBarAndroid</Text>
      <ProgressBarAndroid :progress="0.6" styleAttr="Horizontal" color="#16c79a" />
      <Text :style="$style.hint">Horizontal 进度条，progress=0.6</Text>
    </View>

    <View v-if="isAndroid" :style="$style.card">
      <Text :style="$style.cardTitle">AndroidHorizontalScrollView</Text>
      <AndroidHorizontalScrollView :style="{ height: 90, marginTop: 8 }">
        <View :style="{ flexDirection: 'row' }">
          <View v-for="i in 8" :key="i" :style="{ width: 120, height: 80, backgroundColor: '#2a2a3e', borderRadius: 8, marginRight: 8, alignItems: 'center', justifyContent: 'center' }">
            <Text :style="{ color: '#c0c0d0' }">横向 {{ i }}</Text>
          </View>
        </View>
      </AndroidHorizontalScrollView>
    </View>

    <View v-if="isAndroid" :style="$style.card">
      <Text :style="$style.cardTitle">DrawerLayoutAndroid / AndroidSwipeRefreshLayout</Text>
      <Text :style="$style.hint">抽屉导航与下拉刷新在 Android 设备上可用。</Text>
      <Text :style="$style.hint">AndroidTextInput 的 rn-dom 注册名暂缺，待补充。</Text>
    </View>

    <!-- ── 日志区 ───────────────────────────────────────────── -->
    <View :style="$style.card">
      <View :style="{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }">
        <Text :style="$style.cardTitle">事件日志</Text>
        <View :style="$style.pressBtn" @press="clearLogs">
          <Text :style="{ color: '#fff', fontSize: 12 }">清空</Text>
        </View>
      </View>
      <Text v-for="(l, i) in logs" :key="i" :style="[$style.logLine, { fontSize: 11 }]">{{ l }}</Text>
      <Text v-if="logs.length === 0" :style="$style.hint">操作上方组件，事件会记录在这里</Text>
    </View>

    <!-- ── Modal 本体 ───────────────────────────────────────── -->
    <Modal
      :visible="modalVisible"
      transparent
      animationType="fade"
      @show="onModalShow" @dismiss="onModalDismiss" @requestClose="onModalRequestClose">
      <View :style="{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }">
        <View :style="{ backgroundColor: '#1a1a2e', borderRadius: 16, padding: 24, width: 280 }">
          <Text :style="[$style.cardTitle, { textAlign: 'center' }]">Modal</Text>
          <Text :style="{ color: '#b0b0c0', textAlign: 'center', marginVertical: 12 }">
            这是 Modal。onShow 应已触发。
          </Text>
          <View :style="[$style.pressBtn, { marginTop: 4 }]" @press="() => { modalVisible = false; log('closeModal') }">
            <Text :style="{ color: '#fff', fontSize: 14, fontWeight: 'bold' }">关闭</Text>
          </View>
        </View>
      </View>
    </Modal>
  </ScrollView>
</template>

<style module>
.h1 {
  font-size: 24;
  font-weight: bold;
  color: #e0e0ee;
  margin-bottom: 4;
}
.sub {
  font-size: 14;
  color: #888899;
  margin-bottom: 16;
}
.card {
  background-color: #1a1a2e;
  border-radius: 12;
  padding: 16;
  margin-bottom: 12;
}
.cardTitle {
  font-size: 16;
  font-weight: bold;
  color: #16c79a;
  margin-bottom: 10;
}
.pressBtn {
  background-color: #16c79a;
  border-radius: 8;
  padding-horizontal: 16;
  padding-vertical: 10;
  align-items: center;
}
.logLine {
  font-size: 13;
  color: #b0b0c0;
  margin-top: 4;
}
.label {
  font-size: 13;
  color: #888899;
}
.hint {
  font-size: 12;
  color: #555566;
  margin-top: 6;
}
.input {
  background-color: #0f0f1a;
  border-radius: 8;
  padding-horizontal: 12;
  padding-vertical: 10;
  font-size: 14;
  color: #e0e0ee;
  height: 44;
  border-width: 1;
  border-color: #2a2a3e;
}
</style>
