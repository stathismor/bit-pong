class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }

  preload() {
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('cup', 'assets/images/cup.png');
    this.load.image('table', 'assets/images/table.png');
    this.load.image('full_life', 'assets/images/full_life.png');
    this.load.image('empty_life', 'assets/images/empty_life.png');

    this.load.audio('table_bounce', 'assets/sounds/table_bounce.mp3');
    this.load.audio('cup_bounce', 'assets/sounds/cup_bounce.mp3');
  }

  create() {
    this.scene.start('LevelMenuScene');
  }
}

export default BootScene;
