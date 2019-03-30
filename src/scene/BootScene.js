import * as constants from '../constants';

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }

  preload() {
    // Textures
    this.load.multiatlas(
      constants.TEXTURE_ATLAS,
      'assets/images/bit_pong.json',
      'assets/images'
    );

    // Audio
    this.load.audio('table_bounce', 'assets/sounds/table_bounce.mp3');
    this.load.audio('cup_bounce', 'assets/sounds/cup_bounce.mp3');
    this.load.audio('splash', 'assets/sounds/splash.mp3');
  }

  create() {
    this.scene.start('StartMenuScene');
  }
}

export default BootScene;
