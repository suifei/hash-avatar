<div align="center">

<img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=180" width="180" alt="flynn · male · youth · asian" title="flynn · male · youth · asian">

<sub>☝️ <code>flynn</code>, generated live from <code>avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian</code></sub>

# hash-avatar

Deterministic SVG avatars from a name or email, via SHA-256.<br>88 races, 10 art styles, hash-driven animation, optional QR code.<br>Zero dependencies · synchronous · browser & Node.

[![npm](https://img.shields.io/npm/v/@suifei/hash-avatar?color=2f6feb&label=npm)](https://www.npmjs.com/package/@suifei/hash-avatar)
[![CI](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/suifei/hash-avatar/actions/workflows/ci.yml)
[![size](https://img.shields.io/badge/deps-0-brightgreen)](package.json)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

<a href="https://suifei.github.io/hash-avatar/?lang=en">Live demo</a> · <a href="#1-image-url-no-code">Embed as an image</a> · <a href="#3-npm">npm</a> · <a href="#versioning-contract">Contract</a>

English | [简体中文](README.zh-CN.md)

</div>

## One identity, every dimension

Gender, age and race are **rendering parameters, not hash input**, so the same person stays recognisable: same ring, same colours, same traits. Here is `flynn` (race `asian`) in all 15 gender × age combinations:

<table align="center">
<tr><th></th><th>baby</th><th>teen</th><th>youth</th><th>middle</th><th>old</th></tr>
<tr><th>male</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=baby&race=asian&size=96" width="96" alt="flynn · male · baby · asian" title="flynn · male · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=teen&race=asian&size=96" width="96" alt="flynn · male · teen · asian" title="flynn · male · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=middle&race=asian&size=96" width="96" alt="flynn · male · middle · asian" title="flynn · male · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=old&race=asian&size=96" width="96" alt="flynn · male · old · asian" title="flynn · male · old · asian"></td></tr>
<tr><th>female</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=baby&race=asian&size=96" width="96" alt="flynn · female · baby · asian" title="flynn · female · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=teen&race=asian&size=96" width="96" alt="flynn · female · teen · asian" title="flynn · female · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=youth&race=asian&size=96" width="96" alt="flynn · female · youth · asian" title="flynn · female · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=middle&race=asian&size=96" width="96" alt="flynn · female · middle · asian" title="flynn · female · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=female&age=old&race=asian&size=96" width="96" alt="flynn · female · old · asian" title="flynn · female · old · asian"></td></tr>
<tr><th>neutral</th><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=baby&race=asian&size=96" width="96" alt="flynn · neutral · baby · asian" title="flynn · neutral · baby · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=teen&race=asian&size=96" width="96" alt="flynn · neutral · teen · asian" title="flynn · neutral · teen · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=youth&race=asian&size=96" width="96" alt="flynn · neutral · youth · asian" title="flynn · neutral · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=middle&race=asian&size=96" width="96" alt="flynn · neutral · middle · asian" title="flynn · neutral · middle · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=neutral&age=old&race=asian&size=96" width="96" alt="flynn · neutral · old · asian" title="flynn · neutral · old · asian"></td></tr>
</table>

And `flynn` as a young man across the human `race` values. Skin tone is continuous: the hash picks a point on the Monk Skin Tone scale plus an undertone, and race only sets the (overlapping) range. Race also shifts hair colour and hair-texture weights. It never changes facial geometry.

<table align="center">
<tr><th><code>asian</code></th><th><code>white</code></th><th><code>black</code></th><th><code>brown</code></th><th><code>southasian</code></th><th><code>seasian</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn · male · youth · asian" title="flynn · male · youth · asian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=white&size=96" width="96" alt="flynn · male · youth · white" title="flynn · male · youth · white"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=black&size=96" width="96" alt="flynn · male · youth · black" title="flynn · male · youth · black"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=brown&size=96" width="96" alt="flynn · male · youth · brown" title="flynn · male · youth · brown"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=southasian&size=96" width="96" alt="flynn · male · youth · southasian" title="flynn · male · youth · southasian"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=seasian&size=96" width="96" alt="flynn · male · youth · seasian" title="flynn · male · youth · seasian"></td></tr>
<tr><th><code>mideast</code></th><th><code>latino</code></th><th><code>indigenous</code></th><th><code>pacific</code></th><th><code>auto</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=mideast&size=96" width="96" alt="flynn · male · youth · mideast" title="flynn · male · youth · mideast"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=latino&size=96" width="96" alt="flynn · male · youth · latino" title="flynn · male · youth · latino"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=indigenous&size=96" width="96" alt="flynn · male · youth · indigenous" title="flynn · male · youth · indigenous"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=pacific&size=96" width="96" alt="flynn · male · youth · pacific" title="flynn · male · youth · pacific"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=auto&size=96" width="96" alt="flynn · male · youth · auto" title="flynn · male · youth · auto"></td></tr>
</table>

## Races and creatures

Beyond humans, `race` covers fantasy and myth from many cultures, animals, and sci-fi oddities. Creatures are assembled from part recipes (head shape, ears, muzzle, markings, extras), and the hash varies ear size, markings, colourway and accessories, so two cats are not the same cat. `race=any` lets the hash pick one.

<p align="center"><b>Fantasy & myth</b><br>
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

<p align="center"><b>Animals</b><br>
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

<p align="center"><b>Sci-fi & oddities</b><br>
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

## Art styles

Every style is an SVG filter over the same drawing, so it costs a few lines of code instead of a new renderer. Use `art=<style>`.

<table align="center">
<tr><th><code>flat</code></th><th><code>pixel</code></th><th><code>ink</code></th><th><code>comic</code></th><th><code>sketch</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=flat&size=96" width="96" alt="flynn · art=flat" title="flynn · art=flat"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=pixel&size=96" width="96" alt="flynn · art=pixel" title="flynn · art=pixel"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=ink&size=96" width="96" alt="flynn · art=ink" title="flynn · art=ink"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=comic&size=96" width="96" alt="flynn · art=comic" title="flynn · art=comic"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&art=sketch&size=96" width="96" alt="flynn · art=sketch" title="flynn · art=sketch"></td></tr>
<tr><th><code>neon</code></th><th><code>pop</code></th><th><code>mood</code></th><th><code>watercolor</code></th><th><code>glitch</code></th></tr>
<tr><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=neon&size=96" width="96" alt="flynn · race=cat · art=neon" title="flynn · race=cat · art=neon"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=pop&size=96" width="96" alt="flynn · race=cat · art=pop" title="flynn · race=cat · art=pop"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=mood&size=96" width="96" alt="flynn · race=cat · art=mood" title="flynn · race=cat · art=mood"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=watercolor&size=96" width="96" alt="flynn · race=cat · art=watercolor" title="flynn · race=cat · art=watercolor"></td><td><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=cat&art=glitch&size=96" width="96" alt="flynn · race=cat · art=glitch" title="flynn · race=cat · art=glitch"></td></tr>
</table>

## QR code

Pass `qr=<text>` to put the avatar in the middle of a QR code (error correction level H, so the covered centre still scans). Without `qr` you get the plain avatar.

<p align="center"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&qr=https%3A%2F%2Fgithub.com%2Fsuifei%2Fhash-avatar&size=200" width="200" alt="flynn · qr" title="flynn · qr"></p>

## The fingerprint ring

The outer ring draws the first **128 bits** of the hash, one tick per bit, clockwise from 12 o'clock. Different input means a different ring, with collision odds below a UUIDv4. Below about 96 px the ticks blur together, so `fp=0` turns the ring off for small sizes.

<table align="center"><tr>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=192" width="192" alt="flynn" title="flynn"><br><sub>ring on, 192 px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&fp=0&size=192" width="192" alt="flynn" title="flynn"><br><sub>ring off (<code>fp=0</code>)</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=96" width="96" alt="flynn" title="flynn"><br><sub>96 px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&size=48" width="48" alt="flynn" title="flynn"><br><sub>48 px</sub></td>
<td align="center" valign="bottom"><img src="https://avatar.onrpc.com/v1/flynn.svg?gender=male&age=youth&race=asian&fp=0&size=32" width="32" alt="flynn" title="flynn"><br><sub>32 px</sub></td>
</tr></table>

## Gallery

48 different names, rotating through genders, ages, races and a few art styles. Each image is a plain `<img>` pointing at the live service.

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

## Usage

There are three ways to use it:

| | Use when | Needs |
|---|---|---|
| [Image URL](#1-image-url-no-code) | READMEs, Markdown, any `<img>` | nothing |
| [CDN script](#2-browser-via-cdn) | rendering in a web page | one `<script>` tag |
| [npm package](#3-npm) | Node, bundlers, server-side rendering | `npm i @suifei/hash-avatar` |

### 1. Image URL (no code)

Works anywhere an image URL works, the same way shields.io badges do:

```html
<img src="https://avatar.onrpc.com/v1/octocat.svg?gender=male&size=128" width="128" alt="octocat">
```

```markdown
![avatar](https://avatar.onrpc.com/v1/octocat.svg?size=128)
```

| URL | Behaviour |
|---|---|
| `/v1/<name>.svg` | Pinned to contract v1. **Recommended.** Cached for a week. |
| `/<name>.svg` | Follows the latest contract version. Cached for a day. |
| `/avatar.svg?name=<name>` | Query-string form, for names that are awkward in a path. |

Query parameters: `gender`, `age`, `race`, `art`, `size` (16–1024), `fp=0` (hide the fingerprint ring), `anim=0` (static image) and `qr=<text>` (put the avatar inside a QR code that encodes `<text>`, up to 512 characters). They take the same values as the [options](#options) below. URL-encode the name and the QR text (`encodeURIComponent`). Names are limited to 256 characters.

Animations play inside `<img>` too, including on GitHub. Hover effects only work when the SVG is inlined into the page.

> Avoid putting real email addresses in public image URLs: they end up in server logs and `Referer` headers. See [Privacy](#known-limitations).

> **Hosts and mainland China:** the service runs on two hosts with identical output. `avatar.onrpc.com` is the primary host and is reachable from mainland China. `hash-avatar.suifei.workers.dev` is a mirror, but `*.workers.dev` is blocked in mainland China without a proxy. GitHub READMEs work with either host, because GitHub serves README images through its own `camo` proxy.

The service is a small Cloudflare Worker ([`worker/index.js`](worker/index.js)). To self-host it, run `npx wrangler deploy`.

### 2. Browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@suifei/hash-avatar@1/src/hash-avatar.min.js"></script>
<div id="me"></div>
<script>
  document.getElementById('me').innerHTML =
    HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', size: 96 });
</script>
```

unpkg works too: `https://unpkg.com/@suifei/hash-avatar@1/src/hash-avatar.min.js`. The script defines `window.HashAvatar`. The minified build is about 94 KB (32 KB gzipped); the unminified `src/hash-avatar.js` is in the package too.

### 3. npm

```sh
npm i @suifei/hash-avatar
```

```js
const HashAvatar = require('@suifei/hash-avatar');

const svg = HashAvatar.svg('alice@example.com', { gender: 'female', age: 'youth', race: 'auto', size: 128 });
// => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" ...>'

// Use as a data URL:
const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
```

## API

### `svg(input, options?) → string`

Returns a complete SVG document as a string.

#### Options

| Option | Values | Default |
|---|---|---|
| `gender` | `male` · `female` · `neutral` | `neutral` |
| `age` | `baby` · `teen` · `youth` · `middle` · `old` | `youth` |
| `race` | 88 values including `any`. Humans `asian` · `white` · `black` · `brown` · `southasian` · `seasian` · `mideast` · `latino` · `indigenous` · `pacific` · `auto`; fantasy & myth `elf` · `orc` · `goblin` · `troll` · `vampire` · `zombie` · `mummy` · `oni` · `tengu` · `demon` · `angel` · `fairy` · `mermaid` · `jinn` · `dragon` · `kitsune` · `qilin` · `phoenix` · `unicorn` · `nian` · `tanuki` · `yeti` · `werewolf` · `golem` · `ghost` · `skeleton` · `slime`; animals `cat` · `dog` · `fox` · `wolf` · `tiger` · `lion` · `leopard` · `panda` · `redpanda` · `bear` · `koala` · `raccoon` · `rabbit` · `mouse` · `hamster` · `hedgehog` · `capybara` · `monkey` · `ox` · `horse` · `zebra` · `giraffe` · `deer` · `goat` · `sheep` · `pig` · `elephant` · `snake` · `frog` · `octopus` · `owl` · `penguin` · `rooster` · `chick` · `duck` · `parrot` · `bee`; sci-fi & oddities `cyborg` · `android` · `hologram` · `robot` · `ai` · `alien` · `insectoid` · `mushroom` · `pumpkin` · `snowman` · `cactus` · `star`; `any` (picked from the hash). The grouped lists are exported as `GROUPS` | `auto` |
| `art` | `flat` · `pixel` · `ink` · `comic` · `sketch` · `neon` · `pop` · `mood` · `watercolor` · `glitch` | `flat` |
| `size` | width/height in px (the viewBox is always 256) | `256` |
| `salt` | any string, mixed into the hash | `''` |
| `fingerprint` | draw the 128-bit fingerprint ring | `true` |
| `animate` | hash-driven CSS animation (respects `prefers-reduced-motion`) | `true` |
| `qr` | text to encode in a QR code (level H) with the avatar in the centre; empty means no QR code | none |

Invalid values fall back to the defaults.

### `hash(input, salt?) → { input, bytes, hex }`

The normalized input, the 32-byte SHA-256 digest (`Uint8Array`) and its hex string.

### `normalize(input) → string`

NFC, trim, then collapse runs of whitespace to one space. Only email-like input (`x@y`) is lowercased, so `Alice@Example.com` and `alice@example.com` give the same avatar, but `Alice` and `alice` do not.

### `sha256(bytes) → Uint8Array`

The built-in synchronous SHA-256.

### `qrMatrix(text, minVersion?) → number[][]`

The built-in QR encoder (byte mode, error correction level H, versions 1–40). Returns rows of 0/1 modules without the quiet zone. Throws `RangeError` above 1273 bytes.

### `GENDERS`, `AGES`, `RACES`, `ARTS`, `GROUPS`, `version`

The accepted option values, the races grouped as `{ human, fantasy, animal, scifi }`, and the contract version (`'v1'`).

## Why avatars are unique

Facial features, hairstyles and accessories only have a finite number of combinations, so they cannot make avatars unique on their own. Each avatar therefore has an outer ring of **128 ticks**, one per bit of the first 128 bits of the hash. Ticks are drawn most significant bit first, clockwise from 12 o'clock. A long tick means 1 and a faint dot means 0.

If the first 128 bits differ, the rings differ. Two different inputs share a ring only when SHA-256 truncated to 128 bits collides, which is **less likely than a UUIDv4 collision** (122 random bits).

Gender, age, race and art style are **not** hashed. They are rendering parameters, so the same identity keeps the same ring and recognisable traits when they change.

The animation is unique per identity as well. A PRNG seeded from the hash picks the head motion and its amplitude and tempo, the blink timing (sometimes a double blink), the speed, direction and number of crests of the light wave that runs over the ring's bits, the orbit of the background light and the position of each sparkle. All class names and keyframes carry the avatar's id, so any number of inline avatars can share a page. Inline avatars also get a card effect on hover: nine invisible hover zones tell CSS where the pointer is, the avatar tilts in 3D away from it, and a glare follows it.

## Known limitations

- **Small sizes.** Below about 96 px the ring ticks cannot be told apart by eye. Uniqueness then becomes probabilistic and rests on the combination of features.
- **Privacy.** The ring is the hash in plain sight. For emails, anyone can read those 128 bits and run a dictionary lookup. When you display avatars publicly, render them on your server with a secret `salt`. The public image service cannot do this, because a salt in a URL is not secret, so pass it a username or opaque ID rather than an email.
- **What race changes.** For the human values, race only sets the skin-tone range on the Monk Skin Tone scale (ranges overlap), the range of hair and eye colours, and the weighting of hair textures. **Facial geometry is never changed.** This is deliberate, to avoid drawing stereotypes. Fantasy races and creatures do have their own head shapes.
- **Hover only works inline.** Browsers do not deliver mouse events to an SVG loaded through `<img>`, so hover effects need inline SVG. The animation itself plays either way.
- **Filters cost CPU.** Art styles other than `flat` are SVG filters. A page with dozens of animated, filtered avatars repaints those filters every frame; pass `animate: false` for large grids.

## Versioning contract

Once an avatar has been shown to someone, the mapping from input to picture is a public contract. Under contract v1:

1. The hash input is `'hash-avatar/v1\0' + salt + '\0' + normalize(input)`.
2. Bytes 0–15 are drawn as the fingerprint ring. Bytes 16–31 drive the main features through fixed slots. Secondary features reuse bytes 0–15.
3. Gender, age and race are not part of the hash.

Any change to **slot assignment, the contents or order of any list** (picking uses modulo, so even appending an item breaks existing avatars), **palettes or geometry** changes existing avatars. Such a change requires a **v2** release with a new hash tag and a CHANGELOG entry. Golden snapshot tests (`test/golden.json`) enforce this rule.

One exception has been made: release 1.1.0 redrew contract v1 (animation on by default, new races, art styles), while the project had almost no users. The hash input and the ring are unchanged, so the identity behind every avatar is the same.

The npm major version follows the contract version: `1.x` is always contract v1.

## Development

```sh
npm test             # node:test, runs in a few seconds
npm run build:demo   # inlines the library into a single-file dist/index.html
npm run sheet        # renders every hair / hat / beard / clothing / glasses variant (needs rsvg-convert)
npm run worker:dev   # run the image service locally
```

## License

[Apache-2.0](LICENSE)
