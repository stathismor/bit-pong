import 'phaser';
import BootScene from './scene/BootScene';
import GameplayScene from './scene/GameplayScene';
import LevelMenuScene from './scene/LevelMenuScene';
import ScaleManager from './ScaleManager';

const WIDTH = 640;
const HEIGHT = 360;

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  title: 'Bit Pong',
  width: WIDTH,
  height: HEIGHT,
  scaleMode: 0, // Phaser.ScaleManager.EXACT_FIT,
  backgroundColor: '#ffffff',
  pixelArt: false,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0.8 },
      debug: false,
    },
  },

  scene: [BootScene, LevelMenuScene, GameplayScene],
  callbacks: {
    postBoot: () => {
      (() => new ScaleManager(WIDTH, HEIGHT))();
    },
  },
};

const game = new Phaser.Game(config);

game.CONFIG = {
  width: config.width,
  height: config.height,
  centerX: Math.round(0.5 * config.width),
  centerY: Math.round(0.5 * config.height),
};
