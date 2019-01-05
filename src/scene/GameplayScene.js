import   Ball from '../sprite/Ball';

class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameplayScene',
    });
  }

  create() {
    const config = this.sys.game.CONFIG;

    // Add a red border
    if (__DEV__) {
      const size = 2;
      const border = this.add.rectangle(config.centerX,
                                        config.centerY,
                                        config.width - size,
                                        config.height - size);
      border.setStrokeStyle(size, "0xFF0000");
    }

    const ball = new Ball(this, config.centerX, config.centerY, 'ball');
    this.add.existing(ball);
  }
}

export default GameplayScene;
