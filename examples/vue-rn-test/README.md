# vue-rn 示例（examples/vue-rn-test）

`@cat5th/vue-rn` 的完整示例应用：路由（Home / About）+ **Components Lab**（覆盖全部组件与事件）。

## 通过 degit 预览（推荐，无需 clone 整个仓库）

本示例是一个独立的 React Native 应用，可以直接用 degit 下载：

```bash
npx degit harvey-woo/vue-rn/examples/vue-rn-test my-app
cd my-app

# （可选）注入项目名 / 显示名
node init.mjs --name MyApp --display-name "My App"

npm install
cd ios && pod install && cd ..
npm run ios      # 或 npm run android
```

> 依赖 `@cat5th/vue-rn`（^0.1.0）与 `@rasenjs/rn-dom`（^0.2.0）均从 npm registry 安装。

## 在仓库内本地开发

本示例是 vue-rn 仓库的一部分（`examples/vue-rn-test`）。本地调试时把依赖切到仓库源码：

```json
"@cat5th/vue-rn": "file:../.."
```

- **线上模式**（提交版 / degit 用户）：`"@cat5th/vue-rn": "^0.1.0"`
- **本地模式**（仓库内开发）：`"@cat5th/vue-rn": "file:../.."`

改完依赖后重新 `npm install` 即可切换。两种模式**不要同时提交**（以线上模式为准）。

## Components Lab

进入 App 的 **Lab** 标签，覆盖：
- Press 系列（pressIn/pressMove/pressOut/longPress + 严格/宽松 pressRectOffset）
- TextInput / Switch / ScrollView / Image / Modal
- Touch 冒泡、Layout、补充组件（SafeAreaView / ActivityIndicator）
- 按压组件（Pressable/Touchable* 等价 View+事件实现）
- Android 专用组件（AndroidSwitch / ProgressBarAndroid 等，仅 Android 显示）
