class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameplayScene',
    });
  }

  create() {
    this.add.existing(new Phaser.GameObjects.Sprite(this, 30, 30, 'ball'));
  }
}

export default GameplayScene;
