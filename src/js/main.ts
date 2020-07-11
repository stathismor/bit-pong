import { Game } from "phaser";

import { BootScene } from "./scene/BootScene";
import { GameplayScene } from "./scene/GameplayScene";
import { LevelMenuScene } from "./scene/LevelMenuScene";
import { StartMenuScene } from "./scene/StartMenuScene";
import { CreditsScene } from "./scene/CreditsScene";
import { ScaleManager } from "./ScaleManager";
import { mobileAndTabletCheck } from "./utils";

const WIDTH = 640 * 2;
const HEIGHT = 360 * 2;

const scale = mobileAndTabletCheck()
  ? {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    }
  : {};

const game = new Game({
  type: Phaser.AUTO,
  parent: "content",
  title: "Bit Pong",
  width: WIDTH,
  height: HEIGHT,
  scale,
  backgroundColor: "#ffffff",
  pixelArt: true,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0.8 },
      debug: false,
    },
  },

  scene: [
    BootScene,
    StartMenuScene,
    CreditsScene,
    LevelMenuScene,
    GameplayScene,
  ],
  // callbacks: {
  //   postBoot: (): void => {
  //     ((): void => new ScaleManager(WIDTH, HEIGHT, game.device.os.desktop))();
  //   },
  // },
  audio: {
    disableWebAudio: false,
  },
});

game.CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  centerX: Math.round(0.5 * WIDTH),
  centerY: Math.round(0.5 * HEIGHT),
};
