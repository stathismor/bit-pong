import 'phaser';
import BootScene from './scene/BootScene';
import GameplayScene from './scene/GameplayScene';
import ScaleManager from './ScaleManager';

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  title: 'Weird Pong',
  width: 640,
  height: 360,
  backgroundColor: '#ffffff',
  pixelArt: true,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0.8 },
      debug: false,
    },
  },
  scene: [BootScene, GameplayScene],
  callbacks: {
    postBoot: () => {
      new ScaleManager();
    }
  }
};

const game = new Phaser.Game(config);

game.CONFIG = {
  width: config.width,
  height: config.height,
  centerX: Math.round(0.5 * config.width),
  centerY: Math.round(0.5 * config.height),
};
