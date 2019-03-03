import * as constants from '../constants';

export default class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'StartMenuScene',
    });
  }

  create() {
    const config = this.sys.game.CONFIG;
    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      'start_menu_logo'
    );

    const startButton = this.add.image(
      config.centerX,
      config.centerY + 50,
      constants.TEXTURE_ATLAS,
      'start_menu_start'
    );

    startButton.setInteractive();

    const { scene } = this;
    startButton.on('pointerdown', () => scene.start('LevelMenuScene'));
  }
}
