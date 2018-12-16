import 'phaser';
import BootScene from './BootScene';
// import CupScene from './CupScene';

let config = {
  type: Phaser.CANVAS,
  parent: 'content',
  width: 1280,
  height: 800,
  scaleMode: 0, //Phaser.ScaleManager.EXACT_FIT,
  backgroundColor: '#ffffff',
  pixelArt: true,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0.8 },
      debug: false,
    },
  },
  scene: [BootScene],
};

new Phaser.Game(config);
