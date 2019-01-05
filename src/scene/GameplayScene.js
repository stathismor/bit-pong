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
    this.add.existing(new Phaser.GameObjects.Sprite(this, config.centerX, config.centerY, 'ball'));
  }
}

export default GameplayScene;
