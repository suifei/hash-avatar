<div align="center">

<img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?size=180" width="180" alt="suifei" title="suifei">

<sub>☝️ <code>suifei</code>，由 <code>hash-avatar.suifei.workers.dev/v1/suifei.svg</code> 实时生成</sub>

# hash-avatar

把名称或 email 经 SHA-256 映射成确定性的 SVG 头像。<br>零依赖 · 同步执行 · 浏览器和 Node 通用 · 每个头像约 0.1ms、约 6KB

[![npm](https://img.shields.io/npm/v/@suifei/hash-avatar?color=2f6feb&label=npm)](https://www.npmjs.com/package/@suifei/hash-avatar)
[![CI](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml)
[![size](https://img.shields.io/badge/deps-0-brightgreen)](package.json)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

<a href="https://suifei.github.io/hash-avatar/">在线演示</a> · <a href="#1-图片-url无需代码">作为图片嵌入</a> · <a href="#3-npm">npm</a> · <a href="#版本契约">版本契约</a>

[English](README.md) | 简体中文

</div>

## 同一身份，全部维度

性别、年龄、人种是**渲染参数，不参与哈希**，所以同一个人换了设置依然认得出来：外圈相同，配色相同，特征也相同。下面是 `suifei` 在 3 种性别 × 5 个年龄段下的全部 15 种组合：

<table align="center">
<tr><th></th><th>婴儿</th><th>少年</th><th>青年</th><th>中年</th><th>老年</th></tr>
<tr><th>男</th><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=male&age=baby&size=96" width="96" alt="suifei · male · baby" title="suifei · male · baby"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=male&age=teen&size=96" width="96" alt="suifei · male · teen" title="suifei · male · teen"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=male&age=youth&size=96" width="96" alt="suifei · male · youth" title="suifei · male · youth"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=male&age=middle&size=96" width="96" alt="suifei · male · middle" title="suifei · male · middle"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=male&age=old&size=96" width="96" alt="suifei · male · old" title="suifei · male · old"></td></tr>
<tr><th>女</th><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=female&age=baby&size=96" width="96" alt="suifei · female · baby" title="suifei · female · baby"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=female&age=teen&size=96" width="96" alt="suifei · female · teen" title="suifei · female · teen"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=female&age=youth&size=96" width="96" alt="suifei · female · youth" title="suifei · female · youth"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=female&age=middle&size=96" width="96" alt="suifei · female · middle" title="suifei · female · middle"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=female&age=old&size=96" width="96" alt="suifei · female · old" title="suifei · female · old"></td></tr>
<tr><th>中性</th><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=neutral&age=baby&size=96" width="96" alt="suifei · neutral · baby" title="suifei · neutral · baby"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=neutral&age=teen&size=96" width="96" alt="suifei · neutral · teen" title="suifei · neutral · teen"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=neutral&age=youth&size=96" width="96" alt="suifei · neutral · youth" title="suifei · neutral · youth"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=neutral&age=middle&size=96" width="96" alt="suifei · neutral · middle" title="suifei · neutral · middle"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?gender=neutral&age=old&size=96" width="96" alt="suifei · neutral · old" title="suifei · neutral · old"></td></tr>
</table>

再看 `race` 的各个取值（`auto` 会从全部调色板中取值）。人种只影响肤色、发色、瞳色的取值范围和发型质地的权重，不改变五官几何。

<table align="center">
<tr><th><code>asian</code></th><th><code>white</code></th><th><code>black</code></th><th><code>brown</code></th><th><code>auto</code></th></tr>
<tr><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?race=asian&size=96" width="96" alt="suifei · asian" title="suifei · asian"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?race=white&size=96" width="96" alt="suifei · white" title="suifei · white"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?race=black&size=96" width="96" alt="suifei · black" title="suifei · black"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?race=brown&size=96" width="96" alt="suifei · brown" title="suifei · brown"></td><td><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?race=auto&size=96" width="96" alt="suifei · auto" title="suifei · auto"></td></tr>
</table>

## 外圈指纹

外圈逐位画出哈希的前 **128 位**，从 12 点钟方向起顺时针。输入不同，外圈就不同，碰撞概率低于 UUIDv4。小于约 96px 时刻度会糊在一起，所以小尺寸下可以用 `fp=0` 关掉外圈。

<table align="center"><tr>
<td align="center" valign="bottom"><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?size=192" width="192" alt="suifei" title="suifei"><br><sub>开启外圈，192px</sub></td>
<td align="center" valign="bottom"><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?fp=0&size=192" width="192" alt="suifei" title="suifei"><br><sub>关闭外圈（<code>fp=0</code>）</sub></td>
<td align="center" valign="bottom"><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?size=96" width="96" alt="suifei" title="suifei"><br><sub>96px</sub></td>
<td align="center" valign="bottom"><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?size=48" width="48" alt="suifei" title="suifei"><br><sub>48px</sub></td>
<td align="center" valign="bottom"><img src="https://hash-avatar.suifei.workers.dev/v1/suifei.svg?fp=0&size=32" width="32" alt="suifei" title="suifei"><br><sub>32px</sub></td>
</tr></table>

## 画廊

48 个不同的名字，轮换覆盖所有性别、年龄和人种。每张图都只是一个指向线上服务的普通 `<img>`。

<p align="center">
<img src="https://hash-avatar.suifei.workers.dev/v1/alice.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="alice · male · baby · asian" title="alice · male · baby · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/bob.svg?gender=female&age=youth&race=white&size=80" width="80" alt="bob · female · youth · white" title="bob · female · youth · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/carol.svg?gender=neutral&age=old&race=black&size=80" width="80" alt="carol · neutral · old · black" title="carol · neutral · old · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/dave.svg?gender=male&age=teen&race=brown&size=80" width="80" alt="dave · male · teen · brown" title="dave · male · teen · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/eve.svg?gender=female&age=old&race=auto&size=80" width="80" alt="eve · female · old · auto" title="eve · female · old · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/frank.svg?gender=neutral&age=teen&race=asian&size=80" width="80" alt="frank · neutral · teen · asian" title="frank · neutral · teen · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/grace.svg?gender=male&age=middle&race=white&size=80" width="80" alt="grace · male · middle · white" title="grace · male · middle · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/heidi.svg?gender=female&age=baby&race=black&size=80" width="80" alt="heidi · female · baby · black" title="heidi · female · baby · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/ivan.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="ivan · neutral · middle · auto" title="ivan · neutral · middle · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/judy.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="judy · male · baby · asian" title="judy · male · baby · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/mallory.svg?gender=female&age=youth&race=white&size=80" width="80" alt="mallory · female · youth · white" title="mallory · female · youth · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/niaj.svg?gender=neutral&age=old&race=black&size=80" width="80" alt="niaj · neutral · old · black" title="niaj · neutral · old · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/olivia.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="olivia · male · youth · brown" title="olivia · male · youth · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/peggy.svg?gender=female&age=old&race=auto&size=80" width="80" alt="peggy · female · old · auto" title="peggy · female · old · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/rupert.svg?gender=neutral&age=teen&race=asian&size=80" width="80" alt="rupert · neutral · teen · asian" title="rupert · neutral · teen · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/sybil.svg?gender=male&age=middle&race=white&size=80" width="80" alt="sybil · male · middle · white" title="sybil · male · middle · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/trent.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="trent · female · teen · brown" title="trent · female · teen · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/victor.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="victor · neutral · middle · auto" title="victor · neutral · middle · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/walter.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="walter · male · baby · asian" title="walter · male · baby · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/xiao.ming.svg?gender=female&age=youth&race=white&size=80" width="80" alt="xiao.ming · female · youth · white" title="xiao.ming · female · youth · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/%E6%9D%8E%E4%BC%9F.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="李伟 · neutral · baby · black" title="李伟 · neutral · baby · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/%E7%8E%8B%E8%8A%B3.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="王芳 · male · youth · brown" title="王芳 · male · youth · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/%E5%BC%B5%E5%81%89.svg?gender=female&age=old&race=auto&size=80" width="80" alt="張偉 · female · old · auto" title="張偉 · female · old · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/yuki.svg?gender=neutral&age=teen&race=asian&size=80" width="80" alt="yuki · neutral · teen · asian" title="yuki · neutral · teen · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/amara.svg?gender=male&age=old&race=black&size=80" width="80" alt="amara · male · old · black" title="amara · male · old · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/kwame.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="kwame · female · teen · brown" title="kwame · female · teen · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/priya.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="priya · neutral · middle · auto" title="priya · neutral · middle · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/arjun.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="arjun · male · baby · asian" title="arjun · male · baby · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/sofia.svg?gender=female&age=middle&race=white&size=80" width="80" alt="sofia · female · middle · white" title="sofia · female · middle · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/mateo.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="mateo · neutral · baby · black" title="mateo · neutral · baby · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/noah.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="noah · male · youth · brown" title="noah · male · youth · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/zoe.svg?gender=female&age=old&race=auto&size=80" width="80" alt="zoe · female · old · auto" title="zoe · female · old · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/liam.svg?gender=neutral&age=youth&race=white&size=80" width="80" alt="liam · neutral · youth · white" title="liam · neutral · youth · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/emma.svg?gender=male&age=old&race=black&size=80" width="80" alt="emma · male · old · black" title="emma · male · old · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/chen.jie.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="chen.jie · female · teen · brown" title="chen.jie · female · teen · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/lin.mei.svg?gender=neutral&age=middle&race=auto&size=80" width="80" alt="lin.mei · neutral · middle · auto" title="lin.mei · neutral · middle · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/hiro.svg?gender=male&age=teen&race=asian&size=80" width="80" alt="hiro · male · teen · asian" title="hiro · male · teen · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/sakura.svg?gender=female&age=middle&race=white&size=80" width="80" alt="sakura · female · middle · white" title="sakura · female · middle · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/min-jun.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="min-jun · neutral · baby · black" title="min-jun · neutral · baby · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/ji-woo.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="ji-woo · male · youth · brown" title="ji-woo · male · youth · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/fatima.svg?gender=female&age=baby&race=asian&size=80" width="80" alt="fatima · female · baby · asian" title="fatima · female · baby · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/omar.svg?gender=neutral&age=youth&race=white&size=80" width="80" alt="omar · neutral · youth · white" title="omar · neutral · youth · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/chidi.svg?gender=male&age=old&race=black&size=80" width="80" alt="chidi · male · old · black" title="chidi · male · old · black">
<img src="https://hash-avatar.suifei.workers.dev/v1/ngozi.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="ngozi · female · teen · brown" title="ngozi · female · teen · brown">
<img src="https://hash-avatar.suifei.workers.dev/v1/lucas.svg?gender=neutral&age=old&race=auto&size=80" width="80" alt="lucas · neutral · old · auto" title="lucas · neutral · old · auto">
<img src="https://hash-avatar.suifei.workers.dev/v1/ines.svg?gender=male&age=teen&race=asian&size=80" width="80" alt="ines · male · teen · asian" title="ines · male · teen · asian">
<img src="https://hash-avatar.suifei.workers.dev/v1/olaf.svg?gender=female&age=middle&race=white&size=80" width="80" alt="olaf · female · middle · white" title="olaf · female · middle · white">
<img src="https://hash-avatar.suifei.workers.dev/v1/freya.svg?gender=neutral&age=baby&race=black&size=80" width="80" alt="freya · neutral · baby · black" title="freya · neutral · baby · black">
</p>

## 用法

有三种用法：

| | 适用场景 | 需要 |
|---|---|---|
| [图片 URL](#1-图片-url无需代码) | README、Markdown、任意 `<img>` | 什么都不用 |
| [CDN 脚本](#2-浏览器cdn) | 在网页里渲染 | 一个 `<script>` 标签 |
| [npm 包](#3-npm) | Node、打包工具、服务端渲染 | `npm i @suifei/hash-avatar` |

### 1. 图片 URL（无需代码）

用法和 shields.io 徽章一样，凡是能填图片 URL 的地方都能用：

```html
<img src="https://hash-avatar.suifei.workers.dev/v1/octocat.svg?gender=male&size=128" width="128" alt="octocat">
```

```markdown
![avatar](https://hash-avatar.suifei.workers.dev/v1/octocat.svg?size=128)
```

| URL | 行为 |
|---|---|
| `/v1/<name>.svg` | 锁定契约 v1，**推荐**。缓存一年 |
| `/<name>.svg` | 跟随最新的契约版本，缓存一天 |
| `/avatar.svg?name=<name>` | 查询参数形式，适合不方便放进路径的名称 |

查询参数有 `gender`、`age`、`race`、`size`（16–1024）和 `fp=0`（隐藏外圈指纹），取值与下面的[选项](#选项)相同。名称需要 URL 编码（`encodeURIComponent`），长度上限 256 个字符。

> 不要把真实 email 放进公开的图片 URL，它会出现在服务器日志和 `Referer` 头里。详见[隐私](#已知限制)。

> **中国大陆访问：** 不挂代理时无法访问 `*.workers.dev`。GitHub README 不受影响，因为 GitHub 会通过自己的 `camo` 代理加载 README 里的图片。在你自己的网站上使用时，可以给 Worker 绑定自定义域名（`wrangler.toml` 中的 `routes`），或者用 [CDN 脚本](#2-浏览器cdn)在浏览器端生成头像，这个脚本也可以放到自己的服务器上。

这个服务是一个很小的 Cloudflare Worker（[`worker/index.js`](worker/index.js)）。如果要自建，运行 `npx wrangler deploy`。

### 2. 浏览器（CDN）

```html
<script src="https://cdn.jsdelivr.net/npm/@suifei/hash-avatar@1/src/hash-avatar.js"></script>
<div id="me"></div>
<script>
  document.getElementById('me').innerHTML =
    HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', size: 96 });
</script>
```

也可以用 unpkg：`https://unpkg.com/@suifei/hash-avatar@1/src/hash-avatar.js`。脚本会定义全局的 `window.HashAvatar`。

### 3. npm

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
