import LEVELS from '../../../config/levels.json';
import * as constants from '../constants';

const LEVELS_PER_ROW = 4;
const ROW_HEIGHT = 96;

export class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelMenuScene'
    });
  }

  create() {
    const config = this.sys.game.CONFIG;
    const levelWidthDistance = config.width / LEVELS_PER_ROW;
    const levelPos = { x: levelWidthDistance, y: 128 };
    const completedLevels = JSON.parse(
      localStorage.getItem(constants.LOGAL_STORAGE_KEY)
    ) || [0];
    const nextLevel = Math.max(...completedLevels) + 1;

    for (let levelNumber = 1; levelNumber <= LEVELS.length; levelNumber += 1) {
      const isCompleted = completedLevels.includes(levelNumber);
      const isNextLevel = levelNumber === nextLevel;

      const colour = isCompleted ? '#1b8b1b' : 'black';
      let imageKey = '';
      if (isCompleted) {
        imageKey = 'level_completed';
      } else if (isNextLevel) {
        imageKey = 'level_empty';
      } else {
        imageKey = 'level_locked';
      }

      const levelImage = this.add.image(
        0,
        0,
        constants.TEXTURE_ATLAS,
        imageKey
      );
      levelImage.x = levelPos.x - levelWidthDistance / 2;
      levelImage.y = levelPos.y - levelImage.height;

      const levelText = this.add.text(0, 0, levelNumber.toString(), {
        fontFamily: 'Arial',
        fill: colour,
        fontSize: 32
      });
      levelText.setPosition(
        levelPos.x - levelWidthDistance / 2 - levelText.width / 2,
        levelImage.y - levelImage.height / 2
      );

      if (levelNumber % LEVELS_PER_ROW === 0) {
        levelPos.x = levelWidthDistance;
        levelPos.y += ROW_HEIGHT;
      } else {
        levelPos.x += levelWidthDistance;
      }

      // Only allow click if it's completed or it's the next level
      if (isCompleted || isNextLevel || process.env.DEBUG) {
        // Make the text interactive
        levelImage.setInteractive(
          new Phaser.Geom.Rectangle(0, 0, levelImage.width, levelImage.height),
          Phaser.Geom.Rectangle.Contains
        );

        levelImage.on('pointerdown', () =>
          this.scene.start('GameplayScene', { levelNumber })
        );
      }
    }
  }
}
