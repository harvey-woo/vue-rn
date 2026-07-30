# 路由集成

`@cat5th/vue-rn` 深度集成了 `vue-router`，提供 RN 环境下的导航方案。

## 配置路由

```ts
// router.ts
import { createRouter } from 'vue-router'
import { createRNHistory } from '@cat5th/vue-rn/router'
import Home from './pages/Home.vue'
import About from './pages/About.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
]

export const router = createRouter({
  history: createRNHistory(),
  routes,
})
```

## 注册到应用

```ts
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(router)
  .register('MyApp')

// 从初始路由开始导航
router.push('/')
```

## RouterLink 组件

`RouterLink` 是一个 RN 兼容的导航链接组件，从 `@cat5th/vue-rn/router` 导出。

### 基本用法

```vue
<RouterLink to="/about">
  关于我们
</RouterLink>
```

默认模式（`custom={false}`）：

- 文本内容自动包裹 `<Text>`
- 整个链接包裹在可点击的 `<View>` 中
- 通过 `style` prop 控制文本样式

### 自定义模式

```vue
<RouterLink to="/about" custom>
  <View :style="{ padding: 16, backgroundColor: '#16162a', borderRadius: 8 }">
    <Text :style="{ color: '#e0e0ee' }">关于我们</Text>
  </View>
</RouterLink>
```

### 作用域插槽

```vue
<RouterLink v-slot="{ isActive, navigate }" to="/about" custom>
  <View @touchEnd="navigate">
    <Text :style="{ color: isActive ? '#16c79a' : '#e0e0ee' }">
      {{ isActive ? '当前页' : '关于我们' }}
    </Text>
    <View v-if="isActive" :style="{ height: 2, backgroundColor: '#16c79a' }" />
  </View>
</RouterLink>
```

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `to` | `string \| RouteLocationRaw` | 必填 | 目标路由 |
| `replace` | `boolean` | `false` | 是否替换历史记录 |
| `custom` | `boolean` | `false` | 是否使用自定义渲染 |
| `style` | `object \| array` | — | 文本样式（仅默认模式） |

### 插槽作用域

| 属性 | 类型 | 说明 |
|------|------|------|
| `route` | `RouteLocation` | 目标路由对象 |
| `href` | `string` | 解析后的路径 |
| `isActive` | `Ref<boolean>` | 是否匹配当前路由 |
| `isExactActive` | `Ref<boolean>` | 是否精确匹配 |
| `navigate` | `function` | 导航函数 |
