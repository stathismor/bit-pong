class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }

  preload() {
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('table', 'assets/images/table.png');
    this.load.image('full_life', 'assets/images/full_life.png');
    this.load.image('empty_life', 'assets/images/empty_life.png');

    this.load.audio('bounce', 'assets/sounds/bounce.mp3');
  }

  create() {
    this.scene.start('GameplayScene', { lives: 3 });
  }
}

export default BootScene;
