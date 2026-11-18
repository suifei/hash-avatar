<div align="center">

<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=180" width="180" alt="flynn · male · youth · asian" title="flynn · male · youth · asian">

<sub>☝️ <code>flynn</code>，由 <code>avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian</code> 实时生成</sub>

# hash-avatar

把名称或 email 经 SHA-256 映射成确定性的 SVG 头像。<br>31 个种族 · 10 种画风 · 由哈希驱动的动效 · 可选二维码<br>零依赖 · 同步执行 · 浏览器和 Node 通用

[![npm](https://img.shields.io/npm/v/@suifei/hash-avatar?color=2f6feb&label=npm)](https://www.npmjs.com/package/@suifei/hash-avatar)
[![CI](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml)
[![size](https://img.shields.io/badge/deps-0-brightgreen)](package.json)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

<a href="https://suifei.github.io/hash-avatar/?lang=zh">在线演示</a> · <a href="#1-图片-url无需代码">作为图片嵌入</a> · <a href="#3-npm">npm</a> · <a href="#版本契约">版本契约</a>

[English](README.md) | 简体中文

</div>

## 同一身份，全部维度

性别、年龄、人种是**渲染参数，不参与哈希**，所以同一个人换了设置依然认得出来：外圈相同，配色相同，特征也相同。下面是 `flynn`（人种 `asian`）在 3 种性别 × 5 个年龄段下的全部 15 种组合：

<table align="center">
<tr><th></th><th>婴儿</th><th>少年</th><th>青年</th><th>中年</th><th>老年</th></tr>
<tr><th>男</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=baby&race=asian&size=96" width="96" alt="flynn · male · baby · asian" title="flynn · male · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=teen&race=asian&size=96" width="96" alt="flynn · male · teen · asian" title="flynn · male · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=middle&race=asian&size=96" width="96" alt="flynn · male · middle · asian" title="flynn · male · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=old&race=asian&size=96" width="96" alt="flynn · male · old · asian" title="flynn · male · old · asian"></td></tr>
<tr><th>女</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=baby&race=asian&size=96" width="96" alt="flynn · female · baby · asian" title="flynn · female · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=teen&race=asian&size=96" width="96" alt="flynn · female · teen · asian" title="flynn · female · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=youth&race=asian&size=96" width="96" alt="flynn · female · youth · asian" title="flynn · female · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=middle&race=asian&size=96" width="96" alt="flynn · female · middle · asian" title="flynn · female · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=old&race=asian&size=96" width="96" alt="flynn · female · old · asian" title="flynn · female · old · asian"></td></tr>
<tr><th>中性</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=baby&race=asian&size=96" width="96" alt="flynn · neutral · baby · asian" title="flynn · neutral · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=teen&race=asian&size=96" width="96" alt="flynn · neutral · teen · asian" title="flynn · neutral · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=youth&race=asian&size=96" width="96" alt="flynn · neutral · youth · asian" title="flynn · neutral · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=middle&race=asian&size=96" width="96" alt="flynn · neutral · middle · asian" title="flynn · neutral · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=old&race=asian&size=96" width="96" alt="flynn · neutral · old · asian" title="flynn · neutral · old · asian"></td></tr>
</table>

再看青年男性 `flynn` 在 `race` 各个取值下的样子（`auto` 会从全部调色板中取值）。人种只影响肤色、发色、瞳色的取值范围和发型质地的权重，不改变五官几何。

<table align="center">
<tr><th><code>asian</code></th><th><code>white</code></th><th><code>black</code></th><th><code>brown</code></th><th><code>auto</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=white&size=96" width="96" alt="flynn · male · youth · white" title="flynn · male · youth · white"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=black&size=96" width="96" alt="flynn · male · youth · black" title="flynn · male · youth · black"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=brown&size=96" width="96" alt="flynn · male · youth · brown" title="flynn · male · youth · brown"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=auto&size=96" width="96" alt="flynn · male · youth · auto" title="flynn · male · youth · auto"></td></tr>
</table>

## 种族与生物

除了人类的几种肤色，`race` 还包括奇幻种族和各种生物。背景、衣服和眼型依然来自 `flynn` 的哈希。`race=any` 交给哈希来挑。

<p align="center">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=elf&size=72" width="72" alt="flynn · race=elf" title="flynn · race=elf">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=orc&size=72" width="72" alt="flynn · race=orc" title="flynn · race=orc">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=vampire&size=72" width="72" alt="flynn · race=vampire" title="flynn · race=vampire">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=zombie&size=72" width="72" alt="flynn · race=zombie" title="flynn · race=zombie">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=oni&size=72" width="72" alt="flynn · race=oni" title="flynn · race=oni">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=demon&size=72" width="72" alt="flynn · race=demon" title="flynn · race=demon">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=angel&size=72" width="72" alt="flynn · race=angel" title="flynn · race=angel">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cyborg&size=72" width="72" alt="flynn · race=cyborg" title="flynn · race=cyborg">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&size=72" width="72" alt="flynn · race=cat" title="flynn · race=cat">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=dog&size=72" width="72" alt="flynn · race=dog" title="flynn · race=dog">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=fox&size=72" width="72" alt="flynn · race=fox" title="flynn · race=fox">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=kitsune&size=72" width="72" alt="flynn · race=kitsune" title="flynn · race=kitsune">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=panda&size=72" width="72" alt="flynn · race=panda" title="flynn · race=panda">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=rabbit&size=72" width="72" alt="flynn · race=rabbit" title="flynn · race=rabbit">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=bear&size=72" width="72" alt="flynn · race=bear" title="flynn · race=bear">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=owl&size=72" width="72" alt="flynn · race=owl" title="flynn · race=owl">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=penguin&size=72" width="72" alt="flynn · race=penguin" title="flynn · race=penguin">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=frog&size=72" width="72" alt="flynn · race=frog" title="flynn · race=frog">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=monkey&size=72" width="72" alt="flynn · race=monkey" title="flynn · race=monkey">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=dragon&size=72" width="72" alt="flynn · race=dragon" title="flynn · race=dragon">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=robot&size=72" width="72" alt="flynn · race=robot" title="flynn · race=robot">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=ai&size=72" width="72" alt="flynn · race=ai" title="flynn · race=ai">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=alien&size=72" width="72" alt="flynn · race=alien" title="flynn · race=alien">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=ghost&size=72" width="72" alt="flynn · race=ghost" title="flynn · race=ghost">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=skeleton&size=72" width="72" alt="flynn · race=skeleton" title="flynn · race=skeleton">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=slime&size=72" width="72" alt="flynn · race=slime" title="flynn · race=slime">
</p>

## 画风

每种画风都是套在同一张图上的 SVG 滤镜，只需几行代码，不用重写渲染器。用 `art=<画风>` 指定。

<table align="center">
<tr><th><code>flat</code></th><th><code>pixel</code></th><th><code>ink</code></th><th><code>comic</code></th><th><code>sketch</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=flat&size=96" width="96" alt="flynn · art=flat" title="flynn · art=flat"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=pixel&size=96" width="96" alt="flynn · art=pixel" title="flynn · art=pixel"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=ink&size=96" width="96" alt="flynn · art=ink" title="flynn · art=ink"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=comic&size=96" width="96" alt="flynn · art=comic" title="flynn · art=comic"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=sketch&size=96" width="96" alt="flynn · art=sketch" title="flynn · art=sketch"></td></tr>
<tr><th><code>neon</code></th><th><code>pop</code></th><th><code>mood</code></th><th><code>watercolor</code></th><th><code>glitch</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=neon&size=96" width="96" alt="flynn · race=cat · art=neon" title="flynn · race=cat · art=neon"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=pop&size=96" width="96" alt="flynn · race=cat · art=pop" title="flynn · race=cat · art=pop"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=mood&size=96" width="96" alt="flynn · race=cat · art=mood" title="flynn · race=cat · art=mood"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=watercolor&size=96" width="96" alt="flynn · race=cat · art=watercolor" title="flynn · race=cat · art=watercolor"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=glitch&size=96" width="96" alt="flynn · race=cat · art=glitch" title="flynn · race=cat · art=glitch"></td></tr>
</table>

## 二维码

传入 `qr=<文本>`，头像会放进二维码正中（H 级纠错，中间被遮住也能扫）。不传 `qr` 就是普通头像。

<p align="center"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&qr=https%3A%2F%2Fgithub.com%2Fsuifei%2Fhash-avatar&size=200" width="200" alt="flynn · qr" title="flynn · qr"></p>

## 外圈指纹

外圈逐位画出哈希的前 **128 位**，从 12 点钟方向起顺时针。输入不同，外圈就不同，碰撞概率低于 UUIDv4。小于约 96px 时刻度会糊在一起，所以小尺寸下可以用 `fp=0` 关掉外圈。

<table align="center"><tr>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=192" width="192" alt="flynn" title="flynn"><br><sub>开启外圈，192px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&fp=0&size=192" width="192" alt="flynn" title="flynn"><br><sub>关闭外圈（<code>fp=0</code>）</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn" title="flynn"><br><sub>96px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=48" width="48" alt="flynn" title="flynn"><br><sub>48px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&fp=0&size=32" width="32" alt="flynn" title="flynn"><br><sub>32px</sub></td>
</tr></table>

## 画廊

48 个不同的名字，轮换覆盖各种性别、年龄、种族和几种画风。每张图都只是一个指向线上服务的普通 `<img>`。

<p align="center">
<img src="https://avatar.onrpc.com/v1/alice.svg?gender=male&age=baby&race=elf&size=80" width="80" alt="alice · male · baby · elf" title="alice · male · baby · elf">
<img src="https://avatar.onrpc.com/v1/bob.svg?gender=female&age=youth&race=white&size=80" width="80" alt="bob · female · youth · white" title="bob · female · youth · white">
<img src="https://avatar.onrpc.com/v1/carol.svg?gender=neutral&age=old&race=bear&size=80" width="80" alt="carol · neutral · old · bear" title="carol · neutral · old · bear">
<img src="https://avatar.onrpc.com/v1/dave.svg?gender=male&age=teen&race=brown&size=80" width="80" alt="dave · male · teen · brown" title="dave · male · teen · brown">
<img src="https://avatar.onrpc.com/v1/eve.svg?gender=female&age=old&race=vampire&size=80" width="80" alt="eve · female · old · vampire" title="eve · female · old · vampire">
<img src="https://avatar.onrpc.com/v1/frank.svg?gender=neutral&age=teen&race=asian&art=pixel&size=80" width="80" alt="frank · neutral · teen · asian · pixel" title="frank · neutral · teen · asian · pixel">
<img src="https://avatar.onrpc.com/v1/grace.svg?gender=male&age=middle&race=penguin&size=80" width="80" alt="grace · male · middle · penguin" title="grace · male · middle · penguin">
<img src="https://avatar.onrpc.com/v1/heidi.svg?gender=female&age=baby&race=black&size=80" width="80" alt="heidi · female · baby · black" title="heidi · female · baby · black">
<img src="https://avatar.onrpc.com/v1/ivan.svg?gender=neutral&age=middle&race=oni&size=80" width="80" alt="ivan · neutral · middle · oni" title="ivan · neutral · middle · oni">
<img src="https://avatar.onrpc.com/v1/judy.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="judy · male · baby · asian" title="judy · male · baby · asian">
<img src="https://avatar.onrpc.com/v1/mallory.svg?gender=female&age=youth&race=monkey&size=80" width="80" alt="mallory · female · youth · monkey" title="mallory · female · youth · monkey">
<img src="https://avatar.onrpc.com/v1/niaj.svg?gender=neutral&age=old&race=black&art=ink&size=80" width="80" alt="niaj · neutral · old · black · ink" title="niaj · neutral · old · black · ink">
<img src="https://avatar.onrpc.com/v1/olivia.svg?gender=male&age=youth&race=angel&size=80" width="80" alt="olivia · male · youth · angel" title="olivia · male · youth · angel">
<img src="https://avatar.onrpc.com/v1/peggy.svg?gender=female&age=old&race=auto&size=80" width="80" alt="peggy · female · old · auto" title="peggy · female · old · auto">
<img src="https://avatar.onrpc.com/v1/rupert.svg?gender=neutral&age=teen&race=robot&size=80" width="80" alt="rupert · neutral · teen · robot" title="rupert · neutral · teen · robot">
<img src="https://avatar.onrpc.com/v1/sybil.svg?gender=male&age=middle&race=white&size=80" width="80" alt="sybil · male · middle · white" title="sybil · male · middle · white">
<img src="https://avatar.onrpc.com/v1/trent.svg?gender=female&age=teen&race=cat&size=80" width="80" alt="trent · female · teen · cat" title="trent · female · teen · cat">
<img src="https://avatar.onrpc.com/v1/victor.svg?gender=neutral&age=middle&race=auto&art=comic&size=80" width="80" alt="victor · neutral · middle · auto · comic" title="victor · neutral · middle · auto · comic">
<img src="https://avatar.onrpc.com/v1/walter.svg?gender=male&age=baby&race=alien&size=80" width="80" alt="walter · male · baby · alien" title="walter · male · baby · alien">
<img src="https://avatar.onrpc.com/v1/xiao.ming.svg?gender=female&age=youth&race=white&size=80" width="80" alt="xiao.ming · female · youth · white" title="xiao.ming · female · youth · white">
<img src="https://avatar.onrpc.com/v1/%E6%9D%8E%E4%BC%9F.svg?gender=neutral&age=baby&race=fox&size=80" width="80" alt="李伟 · neutral · baby · fox" title="李伟 · neutral · baby · fox">
<img src="https://avatar.onrpc.com/v1/%E7%8E%8B%E8%8A%B3.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="王芳 · male · youth · brown" title="王芳 · male · youth · brown">
<img src="https://avatar.onrpc.com/v1/%E5%BC%B5%E5%81%89.svg?gender=female&age=old&race=skeleton&size=80" width="80" alt="張偉 · female · old · skeleton" title="張偉 · female · old · skeleton">
<img src="https://avatar.onrpc.com/v1/yuki.svg?gender=neutral&age=teen&race=asian&art=sketch&size=80" width="80" alt="yuki · neutral · teen · asian · sketch" title="yuki · neutral · teen · asian · sketch">
<img src="https://avatar.onrpc.com/v1/amara.svg?gender=male&age=old&race=panda&size=80" width="80" alt="amara · male · old · panda" title="amara · male · old · panda">
<img src="https://avatar.onrpc.com/v1/kwame.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="kwame · female · teen · brown" title="kwame · female · teen · brown">
<img src="https://avatar.onrpc.com/v1/priya.svg?gender=neutral&age=middle&race=elf&size=80" width="80" alt="priya · neutral · middle · elf" title="priya · neutral · middle · elf">
<img src="https://avatar.onrpc.com/v1/arjun.svg?gender=male&age=baby&race=asian&size=80" width="80" alt="arjun · male · baby · asian" title="arjun · male · baby · asian">
<img src="https://avatar.onrpc.com/v1/sofia.svg?gender=female&age=middle&race=bear&size=80" width="80" alt="sofia · female · middle · bear" title="sofia · female · middle · bear">
<img src="https://avatar.onrpc.com/v1/mateo.svg?gender=neutral&age=baby&race=black&art=neon&size=80" width="80" alt="mateo · neutral · baby · black · neon" title="mateo · neutral · baby · black · neon">
<img src="https://avatar.onrpc.com/v1/noah.svg?gender=male&age=youth&race=vampire&size=80" width="80" alt="noah · male · youth · vampire" title="noah · male · youth · vampire">
<img src="https://avatar.onrpc.com/v1/zoe.svg?gender=female&age=old&race=auto&size=80" width="80" alt="zoe · female · old · auto" title="zoe · female · old · auto">
<img src="https://avatar.onrpc.com/v1/liam.svg?gender=neutral&age=youth&race=penguin&size=80" width="80" alt="liam · neutral · youth · penguin" title="liam · neutral · youth · penguin">
<img src="https://avatar.onrpc.com/v1/emma.svg?gender=male&age=old&race=black&size=80" width="80" alt="emma · male · old · black" title="emma · male · old · black">
<img src="https://avatar.onrpc.com/v1/chen.jie.svg?gender=female&age=teen&race=oni&size=80" width="80" alt="chen.jie · female · teen · oni" title="chen.jie · female · teen · oni">
<img src="https://avatar.onrpc.com/v1/lin.mei.svg?gender=neutral&age=middle&race=auto&art=pop&size=80" width="80" alt="lin.mei · neutral · middle · auto · pop" title="lin.mei · neutral · middle · auto · pop">
<img src="https://avatar.onrpc.com/v1/hiro.svg?gender=male&age=teen&race=monkey&size=80" width="80" alt="hiro · male · teen · monkey" title="hiro · male · teen · monkey">
<img src="https://avatar.onrpc.com/v1/sakura.svg?gender=female&age=middle&race=white&size=80" width="80" alt="sakura · female · middle · white" title="sakura · female · middle · white">
<img src="https://avatar.onrpc.com/v1/min-jun.svg?gender=neutral&age=baby&race=angel&size=80" width="80" alt="min-jun · neutral · baby · angel" title="min-jun · neutral · baby · angel">
<img src="https://avatar.onrpc.com/v1/ji-woo.svg?gender=male&age=youth&race=brown&size=80" width="80" alt="ji-woo · male · youth · brown" title="ji-woo · male · youth · brown">
<img src="https://avatar.onrpc.com/v1/fatima.svg?gender=female&age=baby&race=robot&size=80" width="80" alt="fatima · female · baby · robot" title="fatima · female · baby · robot">
<img src="https://avatar.onrpc.com/v1/omar.svg?gender=neutral&age=youth&race=white&art=mood&size=80" width="80" alt="omar · neutral · youth · white · mood" title="omar · neutral · youth · white · mood">
<img src="https://avatar.onrpc.com/v1/chidi.svg?gender=male&age=old&race=cat&size=80" width="80" alt="chidi · male · old · cat" title="chidi · male · old · cat">
<img src="https://avatar.onrpc.com/v1/ngozi.svg?gender=female&age=teen&race=brown&size=80" width="80" alt="ngozi · female · teen · brown" title="ngozi · female · teen · brown">
<img src="https://avatar.onrpc.com/v1/lucas.svg?gender=neutral&age=old&race=alien&size=80" width="80" alt="lucas · neutral · old · alien" title="lucas · neutral · old · alien">
<img src="https://avatar.onrpc.com/v1/ines.svg?gender=male&age=teen&race=asian&size=80" width="80" alt="ines · male · teen · asian" title="ines · male · teen · asian">
<img src="https://avatar.onrpc.com/v1/olaf.svg?gender=female&age=middle&race=fox&size=80" width="80" alt="olaf · female · middle · fox" title="olaf · female · middle · fox">
<img src="https://avatar.onrpc.com/v1/freya.svg?gender=neutral&age=baby&race=black&art=watercolor&size=80" width="80" alt="freya · neutral · baby · black · watercolor" title="freya · neutral · baby · black · watercolor">
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
<img src="https://avatar.onrpc.com/v1/octocat.svg?gender=male&size=128" width="128" alt="octocat">
```

```markdown
![avatar](https://avatar.onrpc.com/v1/octocat.svg?size=128)
```

| URL | 行为 |
|---|---|
| `/v1/<name>.svg` | 锁定契约 v1，**推荐**。缓存一周 |
| `/<name>.svg` | 跟随最新的契约版本，缓存一天 |
| `/avatar.svg?name=<name>` | 查询参数形式，适合不方便放进路径的名称 |

查询参数有 `gender`、`age`、`race`、`art`、`size`（16–1024）、`fp=0`（隐藏外圈指纹）、`anim=0`（静态图）和 `qr=<文本>`（把头像放进编码了该文本的二维码中间，上限 512 个字符），取值与下面的[选项](#选项)相同。名称和二维码文本需要 URL 编码（`encodeURIComponent`），名称长度上限 256 个字符。

用 `<img>` 引用时动效同样会播放，GitHub 上也一样；鼠标悬停效果只在 SVG 直接嵌入页面时生效。

> 不要把真实 email 放进公开的图片 URL，它会出现在服务器日志和 `Referer` 头里。详见[隐私](#已知限制)。

> **域名与中国大陆访问：** 服务部署在两个域名上，输出完全相同。`avatar.onrpc.com` 是主域名，中国大陆可以直接访问。`hash-avatar.suifei.workers.dev` 是备用域名，但 `*.workers.dev` 在中国大陆不挂代理无法访问。GitHub README 用哪个域名都可以，因为 GitHub 会通过自己的 `camo` 代理加载 README 里的图片。

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
| `race` | 人类 `asian` · `white` · `black` · `brown` · `auto`（不指定）；奇幻 `elf` 精灵 · `orc` 兽人 · `vampire` 吸血鬼 · `zombie` 僵尸 · `oni` 鬼 · `demon` 恶魔 · `angel` 天使 · `cyborg` 赛博格；生物与机械 `cat` · `dog` · `fox` · `kitsune` 九尾狐 · `panda` · `rabbit` · `bear` · `owl` · `penguin` · `frog` · `monkey` · `dragon` 龙 · `robot` · `ai` · `alien` · `ghost` · `skeleton` · `slime`；`any`（由哈希挑选） | `auto` |
| `art` | `flat` · `pixel` · `ink` · `comic` · `sketch` · `neon` · `pop` · `mood` · `watercolor` · `glitch`（扁平、像素、水墨、漫画、素描、霓虹、波普、心情、水彩、故障） | `flat` |
| `size` | 宽高像素（viewBox 固定为 256） | `256` |
| `salt` | 任意字符串，会混入哈希 | `''` |
| `fingerprint` | 是否绘制 128 位外圈指纹 | `true` |
| `animate` | 由哈希驱动的 CSS 动效（遵守系统的「减少动态效果」设置） | `true` |
| `qr` | 要编码进二维码（H 级纠错）的文本，头像放在中间；为空则不生成二维码 | 无 |

传入非法值时使用默认值。

### `hash(input, salt?) → { input, bytes, hex }`

返回规范化后的输入、32 字节 SHA-256 摘要（`Uint8Array`）和它的十六进制字符串。

### `normalize(input) → string`

依次做 NFC、去掉首尾空白、把连续空白合并成一个空格。只有形如 email（`x@y`）的输入才转小写。所以 `Alice@Example.com` 和 `alice@example.com` 得到同一个头像，`Alice` 和 `alice` 则不同。

### `sha256(bytes) → Uint8Array`

内置的同步 SHA-256。

### `qrMatrix(text, minVersion?) → number[][]`

内置的二维码编码器（字节模式，H 级纠错，版本 1–40）。返回由 0/1 组成的模块矩阵，不含静区。超过 1273 字节时抛出 `RangeError`。

### `GENDERS`、`AGES`、`RACES`、`ARTS`、`version`

各选项的合法取值，以及契约版本号（`'v1'`）。

## 唯一性原理

五官、发型、配饰等特征的组合是有限的，单靠它们做不到唯一。所以每个头像的外圈有 **128 个刻度**，逐位画出哈希的前 128 位：高位在前，从 12 点钟方向起顺时针，长刻度表示 1，暗点表示 0。

哈希前 128 位不同，外圈就一定不同。两个不同输入得到相同外圈，需要 SHA-256 截断到 128 位后发生碰撞，这个概率**低于 UUIDv4 的碰撞概率**（122 位随机）。

性别、年龄、种族、画风**不参与哈希**，只是渲染参数。所以同一身份切换这些维度后，外圈和特征依然可以辨认。

动效同样因人而异。一个以哈希为种子的伪随机数生成器决定头部动作及其幅度和节奏、眨眼时机（有时眨两下）、光波扫过外圈各个比特的速度、方向和波峰数、背景光斑的轨道和每颗星光的位置。所有 class 名和 keyframes 都带上头像 id，同一页面内联多少个头像都不会互相干扰。内联头像悬停时还有卡牌效果：九块透明感应区让 CSS 知道鼠标在哪，头像朝反方向 3D 倾斜，高光跟着鼠标走。

## 已知限制

- **小尺寸**：头像小于约 96px 时，外圈刻度肉眼分辨不清。此时唯一性退化为概率性的，靠特征组合来区分。
- **隐私**：外圈相当于哈希明文。对 email 而言，别人可以读出这 128 位后做字典反查。公开展示时，应在服务端使用保密的 `salt` 渲染。公共图片服务做不到这一点，因为写在 URL 里的 salt 不是秘密，所以应该传用户名或不透明 ID，而不是 email。
- **人种的作用范围**：对人类的几个取值，人种只影响肤色、发色、瞳色的取值范围和发型质地的权重，**不改变五官几何**。这是刻意的设计，避免画成刻板印象。奇幻种族和生物则有各自的头部造型。
- **悬停只在内联时有效**：浏览器不会把鼠标事件传给 `<img>` 加载的 SVG，所以悬停效果需要内联 SVG。动效本身两种方式都会播放。
- **滤镜消耗 CPU**：`flat` 以外的画风都是 SVG 滤镜。页面上有几十个带动效的滤镜头像时，每一帧都要重绘滤镜，大网格建议传 `animate: false`。

## 版本契约

头像一旦对外展示，输入到图像的映射就是公开契约。v1 契约规定：

1. 哈希输入为 `'hash-avatar/v1\0' + salt + '\0' + normalize(input)`。
2. 字节 0–15 画成外圈指纹，字节 16–31 通过固定槽位驱动主特征，次要特征复用字节 0–15。
3. 性别、年龄、人种不参与哈希。

改动以下任何一项都会改变已有头像：**槽位分配**、**任何列表的内容或顺序**（`pick` 用的是取模，往列表里追加一项也算）、**调色板**、**几何参数**。这类改动必须发布 **v2**，换用新的哈希标签，并写进 CHANGELOG。golden 快照测试（`test/golden.json`）负责守住这一条。

有过一次例外：1.1.0 在项目几乎没有用户时重绘了契约 v1（默认开启动效、新增种族和画风）。哈希输入和外圈没有变，所以每个头像背后的身份不变。

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
