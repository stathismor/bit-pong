# Bit Pong

![github_background](https://user-images.githubusercontent.com/908935/87860930-53889400-c939-11ea-853c-624406a8fd9d.png)

**A game about a ball and a cup.**

Bit Pong is a casual game where you only have one goal: put the ball in the cup. Start by dragging the ball and letting it go and adapt to the progressively surreal levels!

## Play

### Android

<a href='https://play.google.com/store/apps/details?id=strahius.bitpong&pcampaignid=github'>
    <img alt='Get it on Google Play' src='https://play.google.com/intl/en_gb/badges/static/images/badges/en-play-badge.png' height=70px/>
</a>

### Browser

Play the web version on [itch.io](https://strahius.itch.io/bit-pong) or on [gh-pages](https://strahius.github.io/bit-pong/).

### iOS

In development.

## Tech stack

Bit Pong is written in TypeScript, using the [Phaser](https://github.com/photonstorm/phaser) game engine, and [Matter.js](https://brm.io/matter-js/) for the physics part. [parcel](https://parceljs.org/) is used for bundling it all together. The game is built with mobile in mind, although it is primarily a web application. `cordova` is used for the conversion to a mobile app (using `WebView`).

## Requirements

You need to have [Node.js](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/en/docs/install) (or [npm](https://www.npmjs.com/) if you prefer) installed on your machine.

## Install

After you clone the repo, on the root directory just run:

`$ yarn`

## Run

Run:

`$ yarn start`

`parcel` will automatically open the game in your default browser, running on your local `Node.js` server.

## Deploy

If you want to deploy under your own [GitHub page](https://pages.github.com/), you can do that with:

`$ yarn deploy`

If your repo is setup to support `gh-pages`, then you should be able to access the game at `https://<username>.github.io/<repo-name>`. For this repo, the game is also available at https://strahius.github.io/bit-pong/.

## Architecture

You can read about the game architecture [here](ARCHITECTURE.md).

## Known issues

### Slowdown on high refresh rate screens

Unfortunately, `Matter.js` has [an issue](https://github.com/photonstorm/phaser/issues/3957) where its engine update is not refresh-rate-dependent. Since `Phaser` caps on the refresh rate of the screen, rendering and physics updates can be out of sync. This is happening on screens with refresh rate higher than 60Hz, and can cause a slowdown effect, with the ball not going towards the projected trajectory.

## License

### Source code

Bit Pong source code is released under the [GPLv3 license](https://opensource.org/licenses/GPL-3.0).

### Assets

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Bit Pong assets (images and audio)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/strahius/bit-pong" property="cc:attributionName" rel="cc:attributionURL">Stathis Moraitidis</a> are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
