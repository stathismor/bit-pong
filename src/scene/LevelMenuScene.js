import _LEVELS from '../../config/levels.json';

const LEVEL_NUMBERS_DISTANCE = 64;

export default class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelMenuScene',
    });
  }

  create() {
    for (let index = 1; index <= _LEVELS.length; index += 1) {
      const levelText = this.add.text(0, 0, index.toString(), {
        fontFamily: 'Arial',
        fill: 'black',
        fontSize: 64,
      });
      levelText.setPosition(index * LEVEL_NUMBERS_DISTANCE, 16);

      // make the text interactive
      levelText.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, levelText.width, levelText.height),
        Phaser.Geom.Rectangle.Contains
      );

      const { scene } = this;
      levelText.on('pointerdown', () =>
        scene.start('GameplayScene', { levelNumber: index })
      );
    }
  }
}
