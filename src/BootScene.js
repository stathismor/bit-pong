class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }
  preload() {
    // this.load.image('cup', 'assets/images/cup.png');
    // this.load.image('ball', 'assets/images/ball.png');
    // this.load.image('table', 'assets/images/table.png');
    // this.load.image('trace_point', 'assets/images/trace_point.png');
  }

  update() {
    // this.scene.start('CupScene', { reboot: true });
  }
}

export default BootScene;
