# hash-avatar

[![npm](https://img.shields.io/npm/v/@suifei/hash-avatar?color=2f6feb&label=npm)](https://www.npmjs.com/package/@suifei/hash-avatar)
[![CI](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

[English](README.md) | 简体中文

把名称或 email 经 SHA-256 映射成确定性的 SVG 头像。零依赖、同步执行，浏览器和 Node 都能用。每个头像约 0.1ms、约 6KB。

<p>
<img src="https://__HOST__/v1/alice.svg?gender=female&size=96" width="96" alt="">
<img src="https://__HOST__/v1/bob.svg?gender=male&age=middle&race=black&size=96" width="96" alt="">
<img src="https://__HOST__/v1/carol.svg?gender=female&age=old&race=asian&size=96" width="96" alt="">
<img src="https://__HOST__/v1/dave.svg?gender=male&age=teen&race=brown&size=96" width="96" alt="">
<img src="https://__HOST__/v1/eve.svg?age=baby&size=96" width="96" alt="">
<img src="https://__HOST__/v1/octocat.svg?gender=male&race=white&size=96" width="96" alt="">
</p>

**在线演示：** https://suifei.github.io/hash-avatar/

有三种用法：

| | 适用场景 | 需要 |
|---|---|---|
| [图片 URL](#1-图片-url无需代码) | README、Markdown、任意 `<img>` | 什么都不用 |
| [CDN 脚本](#2-浏览器cdn) | 在网页里渲染 | 一个 `<script>` 标签 |
| [npm 包](#3-npm) | Node、打包工具、服务端渲染 | `npm i @suifei/hash-avatar` |

## 1. 图片 URL（无需代码）

用法和 shields.io 徽章一样，凡是能填图片 URL 的地方都能用：

```html
<img src="https://__HOST__/v1/octocat.svg?gender=male&size=128" width="128" alt="octocat">
```

```markdown
![avatar](https://__HOST__/v1/octocat.svg?size=128)
```

| URL | 行为 |
|---|---|
| `/v1/<name>.svg` | 锁定契约 v1，**推荐**。缓存一年 |
| `/<name>.svg` | 跟随最新的契约版本，缓存一天 |
| `/avatar.svg?name=<name>` | 查询参数形式，适合不方便放进路径的名称 |

查询参数有 `gender`、`age`、`race`、`size`（16–1024）和 `fp=0`（隐藏外圈指纹），取值与下面的[选项](#选项)相同。名称需要 URL 编码（`encodeURIComponent`），长度上限 256 个字符。

> 不要把真实 email 放进公开的图片 URL，它会出现在服务器日志和 `Referer` 头里。详见[隐私](#已知限制)。

这个服务是一个很小的 Cloudflare Worker（[`worker/index.js`](worker/index.js)）。如果要自建，运行 `npx wrangler deploy`。

## 2. 浏览器（CDN）

```html
<script src="https://cdn.jsdelivr.net/npm/@suifei/hash-avatar@1/src/hash-avatar.js"></script>
<div id="me"></div>
<script>
  document.getElementById('me').innerHTML =
    HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', size: 96 });
</script>
```

也可以用 unpkg：`https://unpkg.com/@suifei/hash-avatar@1/src/hash-avatar.js`。脚本会定义全局的 `window.HashAvatar`。

## 3. npm

```sh
npm i @suifei/hash-avatar
```

```js
const HashAvatar = require('@suifei/hash-avatar');

const svg = HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', race: 'auto', size: 128 });

// 作为 data URL 使用：
const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
```

## API

### `svg(input, options?) → string`

返回完整的 SVG 文档字符串。

#### 选项

| 选项 | 取值 | 默认 |
|---|---|---|
| `gender` | `male` · `female` · `neutral` | `neutral` |
| `age` | `baby` · `teen` · `youth` · `middle` · `old` | `youth` |
| `race` | `asian` · `white` · `black` · `brown` · `auto`（不指定） | `auto` |
| `size` | 宽高像素（viewBox 固定为 256） | `256` |
| `salt` | 任意字符串，会混入哈希 | `''` |
| `fingerprint` | 是否绘制 128 位外圈指纹 | `true` |

传入非法值时使用默认值。

### `hash(input, salt?) → { input, bytes, hex }`

返回规范化后的输入、32 字节 SHA-256 摘要（`Uint8Array`）和它的十六进制字符串。

### `normalize(input) → string`

依次做 NFC、去掉首尾空白、把连续空白合并成一个空格。只有形如 email（`x@y`）的输入才转小写。所以 `Alice@Example.com` 和 `alice@example.com` 得到同一个头像，`Alice` 和 `alice` 则不同。

### `sha256(bytes) → Uint8Array`

内置的同步 SHA-256。

### `GENDERS`、`AGES`、`RACES`、`version`

各选项的合法取值，以及契约版本号（`'v1'`）。

## 唯一性原理

五官、发型、配饰等特征的组合是有限的，单靠它们做不到唯一。所以每个头像的外圈有 **128 个刻度**，逐位画出哈希的前 128 位：高位在前，从 12 点钟方向起顺时针，长刻度表示 1，暗点表示 0。

哈希前 128 位不同，外圈就一定不同。两个不同输入得到相同外圈，需要 SHA-256 截断到 128 位后发生碰撞，这个概率**低于 UUIDv4 的碰撞概率**（122 位随机）。

性别、年龄、人种**不参与哈希**，只是渲染参数。所以同一身份切换这些维度后，外圈和特征依然可以辨认。

## 已知限制

- **小尺寸**：头像小于约 96px 时，外圈刻度肉眼分辨不清。此时唯一性退化为概率性的，靠特征组合来区分。
- **隐私**：外圈相当于哈希明文。对 email 而言，别人可以读出这 128 位后做字典反查。公开展示时，应在服务端使用保密的 `salt` 渲染。公共图片服务做不到这一点，因为写在 URL 里的 salt 不是秘密，所以应该传用户名或不透明 ID，而不是 email。
- **人种的作用范围**：人种只影响肤色、发色、瞳色的取值范围和发型质地的权重，**不改变五官几何**。这是刻意的设计，避免画成刻板印象。

## 版本契约

头像一旦对外展示，输入到图像的映射就是公开契约。v1 契约规定：

1. 哈希输入为 `'hash-avatar/v1\0' + salt + '\0' + normalize(input)`。
2. 字节 0–15 画成外圈指纹，字节 16–31 通过固定槽位驱动主特征，次要特征复用字节 0–15。
3. 性别、年龄、人种不参与哈希。

改动以下任何一项都会改变已有头像：**槽位分配**、**任何列表的内容或顺序**（`pick` 用的是取模，往列表里追加一项也算）、**调色板**、**几何参数**。这类改动必须发布 **v2**，换用新的哈希标签，并写进 CHANGELOG。golden 快照测试（`test/golden.json`）负责守住这一条。

npm 主版本号与契约版本对应：`1.x` 永远是契约 v1。

## 开发

```sh
npm test             # node:test，几秒内跑完
npm run build:demo   # 把库内联进单文件 dist/index.html
npm run sheet        # 渲染全部发型、帽子、胡须、衣物、眼镜（需要 rsvg-convert）
npm run worker:dev   # 在本地运行图片服务
```

## 许可证

[Apache-2.0](LICENSE)
