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
    this.load.image('projection_point', 'assets/images/projection_point.png');
    this.load.image('trace_point', 'assets/images/trace_point.png');
    this.load.image('grey_ball', 'assets/images/grey_ball.png');
    this.load.image('level_completed', 'assets/images/level_completed.png');
    this.load.image('level_locked', 'assets/images/level_locked.png');
    this.load.image('level_empty', 'assets/images/level_empty.png');
    this.load.image('retry_popup', 'assets/images/retry_popup.png');

    this.load.audio('table_bounce', 'assets/sounds/table_bounce.mp3');
    this.load.audio('cup_bounce', 'assets/sounds/cup_bounce.mp3');
  }

  create() {
    this.scene.start('LevelMenuScene');
  }
}

export default BootScene;
