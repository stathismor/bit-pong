class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }
  preload() {
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('table', 'assets/images/table.png');

    this.load.audio('bounce', 'assets/sounds/bounce.mp3');
  }

  create() {
    this.scene.start('GameplayScene');
  }
}

export default BootScene;
