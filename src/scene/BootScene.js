class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }
  preload() {
    this.load.image('ball', 'assets/images/ball.png');
  }

  create() {
    this.scene.start('GameplayScene');
  }
}

export default BootScene;
