class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }
  preload() {
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('table', 'assets/images/table.png');
  }

  create() {
    this.scene.start('GameplayScene');
  }
}

export default BootScene;
