#!/usr/bin/env node
/**
 * 项目初始化脚本（degit 克隆后运行）
 *
 * 用法：
 *   node init.mjs --name MyApp --display-name "My App"
 *
 * 做了什么：
 *   1. package.json  name  → 注入的 --name（转成 kebab-case）
 *   2. app.json     displayName → 注入的 --display-name（应用显示名）
 *   3. 校验依赖已指向线上包（@cat5th/vue-rn ^0.1.0、@rasenjs/rn-dom ^0.2.0）
 *
 * 注：本脚本只注入 JS 层（包名 / 显示名）。iOS/Android 原生工程名保持默认
 *     （VueRnTest），如要修改原生工程名请手动同步 ios/android 目录。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const args = process.argv.slice(2)

function arg(name) {
  const i = args.indexOf(name)
  return i !== -1 ? args[i + 1] : undefined
}

const name = arg('--name')
const displayName = arg('--display-name') ?? name

// ── package.json ──────────────────────────────────────────────
const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
if (name) {
  pkg.name = name.toLowerCase().replace(/\s+/g, '-')
}
// 校验依赖为线上包（degit 场景）
const warns = []
if (!pkg.dependencies['@cat5th/vue-rn'] || pkg.dependencies['@cat5th/vue-rn'].startsWith('file:')) {
  pkg.dependencies['@cat5th/vue-rn'] = '^0.1.0'
  warns.push('@cat5th/vue-rn → ^0.1.0（线上）')
}
if (!pkg.dependencies['@rasenjs/rn-dom'] || pkg.dependencies['@rasenjs/rn-dom'] === '^0.1.0') {
  pkg.dependencies['@rasenjs/rn-dom'] = '^0.2.0'
  warns.push('@rasenjs/rn-dom → ^0.2.0（线上）')
}
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

// ── app.json ──────────────────────────────────────────────────
const appJsonPath = path.join(root, 'app.json')
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))
if (displayName) appJson.displayName = displayName
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n')

console.log('✓ 初始化完成')
console.log(`  package name : ${pkg.name}`)
console.log(`  display name : ${appJson.displayName}`)
for (const w of warns) console.log(`  (已修正依赖) ${w}`)

console.log('\n下一步：')
console.log('  npm install')
console.log('  cd ios && pod install && cd ..')
console.log('  npm run ios      # 或 npm run android')
console.log('\n提示：原生工程名保持默认 VueRnTest；如需修改请手动同步 ios/android。')
