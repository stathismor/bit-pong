import 'phaser';
import BootScene from './scene/BootScene';
import GameplayScene from './scene/GameplayScene';
import LevelMenuScene from './scene/LevelMenuScene';
import ScaleManager from './ScaleManager';

const _WIDTH = 640;
const _HEIGHT = 360;

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  title: 'Weird Pong',
  width: _WIDTH,
  height: _HEIGHT,
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
      new ScaleManager(_WIDTH, _HEIGHT);
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
