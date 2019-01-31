import _LEVELS from '../../config/levels.json';

const LEVELS_PER_ROW = 3;
const ROW_HEIGHT = 96;

export default class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelMenuScene',
    });
  }

  create() {
    const config = this.sys.game.CONFIG;
    const levelWidthDistance = config.width / LEVELS_PER_ROW;
    const levelPos = { x: levelWidthDistance, y: 96 };
    const completedLevels =
      JSON.parse(localStorage.getItem('completed-levels')) || [];

    for (let levelNumber = 1; levelNumber <= _LEVELS.length; levelNumber += 1) {
      let colour = 'black';
      if (completedLevels.includes(levelNumber)) {
        colour = 'green';
      }
      const levelText = this.add.text(0, 0, levelNumber.toString(), {
        fontFamily: 'Arial',
        fill: colour,
        fontSize: 64,
      });
      levelText.setPosition(
        levelPos.x - levelWidthDistance / 2 - levelText.width / 2,
        levelPos.y - levelText.height
      );

      // make the text interactive
      levelText.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, levelText.width, levelText.height),
        Phaser.Geom.Rectangle.Contains
      );

      if (levelNumber % LEVELS_PER_ROW === 0) {
        levelPos.x = levelWidthDistance;
        levelPos.y += ROW_HEIGHT;
      } else {
        levelPos.x += levelWidthDistance;
      }

      const { scene } = this;
      levelText.on('pointerdown', () =>
        scene.start('GameplayScene', { levelNumber })
      );
    }
  }
}
