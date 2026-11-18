<div align="center">

<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=180" width="180" alt="flynn · male · youth · asian" title="flynn · male · youth · asian">

<sub>☝️ <code>flynn</code>，由 <code>avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian</code> 实时生成</sub>

# hash-avatar

把名称或 email 经 SHA-256 映射成确定性的 SVG 头像。<br>88 个种族 · 10 种画风 · 由哈希驱动的动效 · 可选二维码<br>零依赖 · 同步执行 · 浏览器和 Node 通用

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

再看青年男性 `flynn` 在各个人类 `race` 取值下的样子。肤色是连续取值：哈希在 Monk 肤色量表上取一个位置，再叠加一种底色调，人种只决定取值区间（区间互相重叠）。人种还影响发色和发型质地的权重，但不改变五官几何。

<table align="center">
<tr><th><code>asian</code></th><th><code>white</code></th><th><code>black</code></th><th><code>brown</code></th><th><code>southasian</code></th><th><code>seasian</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=white&size=96" width="96" alt="flynn · male · youth · white" title="flynn · male · youth · white"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=black&size=96" width="96" alt="flynn · male · youth · black" title="flynn · male · youth · black"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=brown&size=96" width="96" alt="flynn · male · youth · brown" title="flynn · male · youth · brown"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=southasian&size=96" width="96" alt="flynn · male · youth · southasian" title="flynn · male · youth · southasian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=seasian&size=96" width="96" alt="flynn · male · youth · seasian" title="flynn · male · youth · seasian"></td></tr>
<tr><th><code>mideast</code></th><th><code>latino</code></th><th><code>indigenous</code></th><th><code>pacific</code></th><th><code>auto</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=mideast&size=96" width="96" alt="flynn · male · youth · mideast" title="flynn · male · youth · mideast"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=latino&size=96" width="96" alt="flynn · male · youth · latino" title="flynn · male · youth · latino"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=indigenous&size=96" width="96" alt="flynn · male · youth · indigenous" title="flynn · male · youth · indigenous"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=pacific&size=96" width="96" alt="flynn · male · youth · pacific" title="flynn · male · youth · pacific"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=auto&size=96" width="96" alt="flynn · male · youth · auto" title="flynn · male · youth · auto"></td></tr>
</table>

## 种族与生物

除了人类，`race` 还覆盖了来自各种文化的奇幻与神话形象、动物和科幻奇物。生物由部件配方组装（头型、耳朵、口鼻、花纹、附加部件），哈希决定耳朵大小、花纹、配色和配饰，所以两只猫不会是同一只猫。`race=any` 交给哈希来挑。

<p align="center"><b>奇幻与神话</b><br>
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=elf&size=64" width="64" alt="flynn · race=elf" title="flynn · race=elf">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=orc&size=64" width="64" alt="flynn · race=orc" title="flynn · race=orc">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=goblin&size=64" width="64" alt="flynn · race=goblin" title="flynn · race=goblin">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=troll&size=64" width="64" alt="flynn · race=troll" title="flynn · race=troll">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=vampire&size=64" width="64" alt="flynn · race=vampire" title="flynn · race=vampire">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=zombie&size=64" width="64" alt="flynn · race=zombie" title="flynn · race=zombie">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=mummy&size=64" width="64" alt="flynn · race=mummy" title="flynn · race=mummy">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=oni&size=64" width="64" alt="flynn · race=oni" title="flynn · race=oni">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=tengu&size=64" width="64" alt="flynn · race=tengu" title="flynn · race=tengu">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=demon&size=64" width="64" alt="flynn · race=demon" title="flynn · race=demon">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=angel&size=64" width="64" alt="flynn · race=angel" title="flynn · race=angel">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=fairy&size=64" width="64" alt="flynn · race=fairy" title="flynn · race=fairy">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=mermaid&size=64" width="64" alt="flynn · race=mermaid" title="flynn · race=mermaid">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=jinn&size=64" width="64" alt="flynn · race=jinn" title="flynn · race=jinn">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=dragon&size=64" width="64" alt="flynn · race=dragon" title="flynn · race=dragon">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=kitsune&size=64" width="64" alt="flynn · race=kitsune" title="flynn · race=kitsune">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=qilin&size=64" width="64" alt="flynn · race=qilin" title="flynn · race=qilin">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=phoenix&size=64" width="64" alt="flynn · race=phoenix" title="flynn · race=phoenix">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=unicorn&size=64" width="64" alt="flynn · race=unicorn" title="flynn · race=unicorn">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=nian&size=64" width="64" alt="flynn · race=nian" title="flynn · race=nian">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=tanuki&size=64" width="64" alt="flynn · race=tanuki" title="flynn · race=tanuki">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=yeti&size=64" width="64" alt="flynn · race=yeti" title="flynn · race=yeti">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=werewolf&size=64" width="64" alt="flynn · race=werewolf" title="flynn · race=werewolf">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=golem&size=64" width="64" alt="flynn · race=golem" title="flynn · race=golem">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=ghost&size=64" width="64" alt="flynn · race=ghost" title="flynn · race=ghost">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=skeleton&size=64" width="64" alt="flynn · race=skeleton" title="flynn · race=skeleton">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=slime&size=64" width="64" alt="flynn · race=slime" title="flynn · race=slime">
</p>

<p align="center"><b>动物</b><br>
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&size=64" width="64" alt="flynn · race=cat" title="flynn · race=cat">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=dog&size=64" width="64" alt="flynn · race=dog" title="flynn · race=dog">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=fox&size=64" width="64" alt="flynn · race=fox" title="flynn · race=fox">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=wolf&size=64" width="64" alt="flynn · race=wolf" title="flynn · race=wolf">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=tiger&size=64" width="64" alt="flynn · race=tiger" title="flynn · race=tiger">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=lion&size=64" width="64" alt="flynn · race=lion" title="flynn · race=lion">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=leopard&size=64" width="64" alt="flynn · race=leopard" title="flynn · race=leopard">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=panda&size=64" width="64" alt="flynn · race=panda" title="flynn · race=panda">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=redpanda&size=64" width="64" alt="flynn · race=redpanda" title="flynn · race=redpanda">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=bear&size=64" width="64" alt="flynn · race=bear" title="flynn · race=bear">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=koala&size=64" width="64" alt="flynn · race=koala" title="flynn · race=koala">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=raccoon&size=64" width="64" alt="flynn · race=raccoon" title="flynn · race=raccoon">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=rabbit&size=64" width="64" alt="flynn · race=rabbit" title="flynn · race=rabbit">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=mouse&size=64" width="64" alt="flynn · race=mouse" title="flynn · race=mouse">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=hamster&size=64" width="64" alt="flynn · race=hamster" title="flynn · race=hamster">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=hedgehog&size=64" width="64" alt="flynn · race=hedgehog" title="flynn · race=hedgehog">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=capybara&size=64" width="64" alt="flynn · race=capybara" title="flynn · race=capybara">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=monkey&size=64" width="64" alt="flynn · race=monkey" title="flynn · race=monkey">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=ox&size=64" width="64" alt="flynn · race=ox" title="flynn · race=ox">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=horse&size=64" width="64" alt="flynn · race=horse" title="flynn · race=horse">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=zebra&size=64" width="64" alt="flynn · race=zebra" title="flynn · race=zebra">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=giraffe&size=64" width="64" alt="flynn · race=giraffe" title="flynn · race=giraffe">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=deer&size=64" width="64" alt="flynn · race=deer" title="flynn · race=deer">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=goat&size=64" width="64" alt="flynn · race=goat" title="flynn · race=goat">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=sheep&size=64" width="64" alt="flynn · race=sheep" title="flynn · race=sheep">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=pig&size=64" width="64" alt="flynn · race=pig" title="flynn · race=pig">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=elephant&size=64" width="64" alt="flynn · race=elephant" title="flynn · race=elephant">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=snake&size=64" width="64" alt="flynn · race=snake" title="flynn · race=snake">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=frog&size=64" width="64" alt="flynn · race=frog" title="flynn · race=frog">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=octopus&size=64" width="64" alt="flynn · race=octopus" title="flynn · race=octopus">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=owl&size=64" width="64" alt="flynn · race=owl" title="flynn · race=owl">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=penguin&size=64" width="64" alt="flynn · race=penguin" title="flynn · race=penguin">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=rooster&size=64" width="64" alt="flynn · race=rooster" title="flynn · race=rooster">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=chick&size=64" width="64" alt="flynn · race=chick" title="flynn · race=chick">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=duck&size=64" width="64" alt="flynn · race=duck" title="flynn · race=duck">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=parrot&size=64" width="64" alt="flynn · race=parrot" title="flynn · race=parrot">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=bee&size=64" width="64" alt="flynn · race=bee" title="flynn · race=bee">
</p>

<p align="center"><b>科幻与奇物</b><br>
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cyborg&size=64" width="64" alt="flynn · race=cyborg" title="flynn · race=cyborg">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=android&size=64" width="64" alt="flynn · race=android" title="flynn · race=android">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=hologram&size=64" width="64" alt="flynn · race=hologram" title="flynn · race=hologram">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=robot&size=64" width="64" alt="flynn · race=robot" title="flynn · race=robot">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=ai&size=64" width="64" alt="flynn · race=ai" title="flynn · race=ai">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=alien&size=64" width="64" alt="flynn · race=alien" title="flynn · race=alien">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=insectoid&size=64" width="64" alt="flynn · race=insectoid" title="flynn · race=insectoid">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=mushroom&size=64" width="64" alt="flynn · race=mushroom" title="flynn · race=mushroom">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=pumpkin&size=64" width="64" alt="flynn · race=pumpkin" title="flynn · race=pumpkin">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=snowman&size=64" width="64" alt="flynn · race=snowman" title="flynn · race=snowman">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cactus&size=64" width="64" alt="flynn · race=cactus" title="flynn · race=cactus">
<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=star&size=64" width="64" alt="flynn · race=star" title="flynn · race=star">
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
<img src="https://avatar.onrpc.com/v1/carol.svg?gender=neutral&age=old&race=mummy&size=80" width="80" alt="carol · neutral · old · mummy" title="carol · neutral · old · mummy">
<img src="https://avatar.onrpc.com/v1/dave.svg?gender=male&age=teen&race=brown&size=80" width="80" alt="dave · male · teen · brown" title="dave · male · teen · brown">
<img src="https://avatar.onrpc.com/v1/eve.svg?gender=female&age=old&race=dragon&size=80" width="80" alt="eve · female · old · dragon" title="eve · female · old · dragon">
<img src="https://avatar.onrpc.com/v1/frank.svg?gender=neutral&age=teen&race=seasian&art=pixel&size=80" width="80" alt="frank · neutral · teen · seasian · pixel" title="frank · neutral · teen · seasian · pixel">
<img src="https://avatar.onrpc.com/v1/grace.svg?gender=male&age=middle&race=pig&size=80" width="80" alt="grace · male · middle · pig" title="grace · male · middle · pig">
<img src="https://avatar.onrpc.com/v1/heidi.svg?gender=female&age=baby&race=latino&size=80" width="80" alt="heidi · female · baby · latino" title="heidi · female · baby · latino">
<img src="https://avatar.onrpc.com/v1/ivan.svg?gender=neutral&age=middle&race=zebra&size=80" width="80" alt="ivan · neutral · middle · zebra" title="ivan · neutral · middle · zebra">
<img src="https://avatar.onrpc.com/v1/judy.svg?gender=male&age=baby&race=auto&size=80" width="80" alt="judy · male · baby · auto" title="judy · male · baby · auto">
<img src="https://avatar.onrpc.com/v1/mallory.svg?gender=female&age=youth&race=insectoid&size=80" width="80" alt="mallory · female · youth · insectoid" title="mallory · female · youth · insectoid">
<img src="https://avatar.onrpc.com/v1/niaj.svg?gender=neutral&age=old&race=white&art=ink&size=80" width="80" alt="niaj · neutral · old · white · ink" title="niaj · neutral · old · white · ink">
<img src="https://avatar.onrpc.com/v1/olivia.svg?gender=male&age=youth&race=goblin&size=80" width="80" alt="olivia · male · youth · goblin" title="olivia · male · youth · goblin">
<img src="https://avatar.onrpc.com/v1/peggy.svg?gender=female&age=old&race=brown&size=80" width="80" alt="peggy · female · old · brown" title="peggy · female · old · brown">
<img src="https://avatar.onrpc.com/v1/rupert.svg?gender=neutral&age=teen&race=rabbit&size=80" width="80" alt="rupert · neutral · teen · rabbit" title="rupert · neutral · teen · rabbit">
<img src="https://avatar.onrpc.com/v1/sybil.svg?gender=male&age=middle&race=seasian&size=80" width="80" alt="sybil · male · middle · seasian" title="sybil · male · middle · seasian">
<img src="https://avatar.onrpc.com/v1/trent.svg?gender=female&age=teen&race=ox&size=80" width="80" alt="trent · female · teen · ox" title="trent · female · teen · ox">
<img src="https://avatar.onrpc.com/v1/victor.svg?gender=neutral&age=middle&race=indigenous&art=comic&size=80" width="80" alt="victor · neutral · middle · indigenous · comic" title="victor · neutral · middle · indigenous · comic">
<img src="https://avatar.onrpc.com/v1/walter.svg?gender=male&age=baby&race=hamster&size=80" width="80" alt="walter · male · baby · hamster" title="walter · male · baby · hamster">
<img src="https://avatar.onrpc.com/v1/xiao.ming.svg?gender=female&age=youth&race=auto&size=80" width="80" alt="xiao.ming · female · youth · auto" title="xiao.ming · female · youth · auto">
<img src="https://avatar.onrpc.com/v1/%E6%9D%8E%E4%BC%9F.svg?gender=neutral&age=baby&race=unicorn&size=80" width="80" alt="李伟 · neutral · baby · unicorn" title="李伟 · neutral · baby · unicorn">
<img src="https://avatar.onrpc.com/v1/%E7%8E%8B%E8%8A%B3.svg?gender=male&age=youth&race=white&size=80" width="80" alt="王芳 · male · youth · white" title="王芳 · male · youth · white">
<img src="https://avatar.onrpc.com/v1/%E5%BC%B5%E5%81%89.svg?gender=female&age=old&race=vampire&size=80" width="80" alt="張偉 · female · old · vampire" title="張偉 · female · old · vampire">
<img src="https://avatar.onrpc.com/v1/yuki.svg?gender=neutral&age=teen&race=brown&art=sketch&size=80" width="80" alt="yuki · neutral · teen · brown · sketch" title="yuki · neutral · teen · brown · sketch">
<img src="https://avatar.onrpc.com/v1/amara.svg?gender=male&age=old&race=hologram&size=80" width="80" alt="amara · male · old · hologram" title="amara · male · old · hologram">
<img src="https://avatar.onrpc.com/v1/kwame.svg?gender=female&age=teen&race=mideast&size=80" width="80" alt="kwame · female · teen · mideast" title="kwame · female · teen · mideast">
<img src="https://avatar.onrpc.com/v1/priya.svg?gender=neutral&age=middle&race=ai&size=80" width="80" alt="priya · neutral · middle · ai" title="priya · neutral · middle · ai">
<img src="https://avatar.onrpc.com/v1/arjun.svg?gender=male&age=baby&race=indigenous&size=80" width="80" alt="arjun · male · baby · indigenous" title="arjun · male · baby · indigenous">
<img src="https://avatar.onrpc.com/v1/sofia.svg?gender=female&age=middle&race=wolf&size=80" width="80" alt="sofia · female · middle · wolf" title="sofia · female · middle · wolf">
<img src="https://avatar.onrpc.com/v1/mateo.svg?gender=neutral&age=baby&race=auto&art=neon&size=80" width="80" alt="mateo · neutral · baby · auto · neon" title="mateo · neutral · baby · auto · neon">
<img src="https://avatar.onrpc.com/v1/noah.svg?gender=male&age=youth&race=capybara&size=80" width="80" alt="noah · male · youth · capybara" title="noah · male · youth · capybara">
<img src="https://avatar.onrpc.com/v1/zoe.svg?gender=female&age=old&race=white&size=80" width="80" alt="zoe · female · old · white" title="zoe · female · old · white">
<img src="https://avatar.onrpc.com/v1/liam.svg?gender=neutral&age=youth&race=pumpkin&size=80" width="80" alt="liam · neutral · youth · pumpkin" title="liam · neutral · youth · pumpkin">
<img src="https://avatar.onrpc.com/v1/emma.svg?gender=male&age=old&race=southasian&size=80" width="80" alt="emma · male · old · southasian" title="emma · male · old · southasian">
<img src="https://avatar.onrpc.com/v1/chen.jie.svg?gender=female&age=teen&race=mermaid&size=80" width="80" alt="chen.jie · female · teen · mermaid" title="chen.jie · female · teen · mermaid">
<img src="https://avatar.onrpc.com/v1/lin.mei.svg?gender=neutral&age=middle&race=mideast&art=pop&size=80" width="80" alt="lin.mei · neutral · middle · mideast · pop" title="lin.mei · neutral · middle · mideast · pop">
<img src="https://avatar.onrpc.com/v1/hiro.svg?gender=male&age=teen&race=owl&size=80" width="80" alt="hiro · male · teen · owl" title="hiro · male · teen · owl">
<img src="https://avatar.onrpc.com/v1/sakura.svg?gender=female&age=middle&race=indigenous&size=80" width="80" alt="sakura · female · middle · indigenous" title="sakura · female · middle · indigenous">
<img src="https://avatar.onrpc.com/v1/min-jun.svg?gender=neutral&age=baby&race=snake&size=80" width="80" alt="min-jun · neutral · baby · snake" title="min-jun · neutral · baby · snake">
<img src="https://avatar.onrpc.com/v1/ji-woo.svg?gender=male&age=youth&race=auto&size=80" width="80" alt="ji-woo · male · youth · auto" title="ji-woo · male · youth · auto">
<img src="https://avatar.onrpc.com/v1/fatima.svg?gender=female&age=baby&race=duck&size=80" width="80" alt="fatima · female · baby · duck" title="fatima · female · baby · duck">
<img src="https://avatar.onrpc.com/v1/omar.svg?gender=neutral&age=youth&race=black&art=mood&size=80" width="80" alt="omar · neutral · youth · black · mood" title="omar · neutral · youth · black · mood">
<img src="https://avatar.onrpc.com/v1/chidi.svg?gender=male&age=old&race=tanuki&size=80" width="80" alt="chidi · male · old · tanuki" title="chidi · male · old · tanuki">
<img src="https://avatar.onrpc.com/v1/ngozi.svg?gender=female&age=teen&race=southasian&size=80" width="80" alt="ngozi · female · teen · southasian" title="ngozi · female · teen · southasian">
<img src="https://avatar.onrpc.com/v1/lucas.svg?gender=neutral&age=old&race=oni&size=80" width="80" alt="lucas · neutral · old · oni" title="lucas · neutral · old · oni">
<img src="https://avatar.onrpc.com/v1/ines.svg?gender=male&age=teen&race=mideast&size=80" width="80" alt="ines · male · teen · mideast" title="ines · male · teen · mideast">
<img src="https://avatar.onrpc.com/v1/olaf.svg?gender=female&age=middle&race=dog&size=80" width="80" alt="olaf · female · middle · dog" title="olaf · female · middle · dog">
<img src="https://avatar.onrpc.com/v1/freya.svg?gender=neutral&age=baby&race=indigenous&art=watercolor&size=80" width="80" alt="freya · neutral · baby · indigenous · watercolor" title="freya · neutral · baby · indigenous · watercolor">
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
<script src="https://cdn.jsdelivr.net/npm/@suifei/hash-avatar@1/src/hash-avatar.min.js"></script>
<div id="me"></div>
<script>
  document.getElementById('me').innerHTML =
    HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', size: 96 });
</script>
```

也可以用 unpkg：`https://unpkg.com/@suifei/hash-avatar@1/src/hash-avatar.min.js`。脚本会定义全局的 `window.HashAvatar`。压缩版约 94 KB（gzip 后 32 KB），包里同时保留未压缩的 `src/hash-avatar.js`。

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
| `race` | 共 88 个取值（含 `any`）。人类 `asian` · `white` · `black` · `brown` · `southasian` · `seasian` · `mideast` · `latino` · `indigenous` · `pacific` · `auto`；奇幻与神话 `elf` · `orc` · `goblin` · `troll` · `vampire` · `zombie` · `mummy` · `oni` · `tengu` · `demon` · `angel` · `fairy` · `mermaid` · `jinn` · `dragon` · `kitsune` · `qilin` · `phoenix` · `unicorn` · `nian` · `tanuki` · `yeti` · `werewolf` · `golem` · `ghost` · `skeleton` · `slime`；动物 `cat` · `dog` · `fox` · `wolf` · `tiger` · `lion` · `leopard` · `panda` · `redpanda` · `bear` · `koala` · `raccoon` · `rabbit` · `mouse` · `hamster` · `hedgehog` · `capybara` · `monkey` · `ox` · `horse` · `zebra` · `giraffe` · `deer` · `goat` · `sheep` · `pig` · `elephant` · `snake` · `frog` · `octopus` · `owl` · `penguin` · `rooster` · `chick` · `duck` · `parrot` · `bee`；科幻与奇物 `cyborg` · `android` · `hologram` · `robot` · `ai` · `alien` · `insectoid` · `mushroom` · `pumpkin` · `snowman` · `cactus` · `star`；`any`（由哈希挑选）。分组列表导出为 `GROUPS` | `auto` |
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

### `GENDERS`、`AGES`、`RACES`、`ARTS`、`GROUPS`、`version`

各选项的合法取值，以及契约版本号（`'v1'`）。 `GROUPS` 是按 `{ human, fantasy, animal, scifi }` 分组的种族列表。

## 唯一性原理

五官、发型、配饰等特征的组合是有限的，单靠它们做不到唯一。所以每个头像的外圈有 **128 个刻度**，逐位画出哈希的前 128 位：高位在前，从 12 点钟方向起顺时针，长刻度表示 1，暗点表示 0。

哈希前 128 位不同，外圈就一定不同。两个不同输入得到相同外圈，需要 SHA-256 截断到 128 位后发生碰撞，这个概率**低于 UUIDv4 的碰撞概率**（122 位随机）。

性别、年龄、种族、画风**不参与哈希**，只是渲染参数。所以同一身份切换这些维度后，外圈和特征依然可以辨认。

动效同样因人而异。一个以哈希为种子的伪随机数生成器决定头部动作及其幅度和节奏、眨眼时机（有时眨两下）、光波扫过外圈各个比特的速度、方向和波峰数、背景光斑的轨道和每颗星光的位置。所有 class 名和 keyframes 都带上头像 id，同一页面内联多少个头像都不会互相干扰。内联头像悬停时还有卡牌效果：九块透明感应区让 CSS 知道鼠标在哪，头像朝反方向 3D 倾斜，高光跟着鼠标走。

## 已知限制

- **小尺寸**：头像小于约 96px 时，外圈刻度肉眼分辨不清。此时唯一性退化为概率性的，靠特征组合来区分。
- **隐私**：外圈相当于哈希明文。对 email 而言，别人可以读出这 128 位后做字典反查。公开展示时，应在服务端使用保密的 `salt` 渲染。公共图片服务做不到这一点，因为写在 URL 里的 salt 不是秘密，所以应该传用户名或不透明 ID，而不是 email。
- **人种的作用范围**：对人类的各个取值，人种只决定肤色在 Monk 肤色量表上的取值区间（区间互相重叠），以及发色、瞳色的范围和发型质地的权重，**不改变五官几何**。这是刻意的设计，避免画成刻板印象。奇幻种族和生物则有各自的头部造型。
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
