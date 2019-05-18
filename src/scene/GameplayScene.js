import LEVELS from '../../config/levels.json';
import Ball from '../sprite/Ball';
import Cup from '../sprite/Cup';
import Table from '../sprite/Table';
import RetryLevelPopup from '../sprite/RetryLevelPopup';
import CompleteLevelPopup from '../sprite/CompleteLevelPopup';
import HealthBar from '../hud/HealthBar';
import LevelBar from '../hud/LevelBar';
import * as constants from '../constants';
import { initCategories } from '../collision';

class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameplayScene',
    });
    this.levelNumber = 1;
    this.tableIds = [];
    this.ball = null;
  }

  create(data) {
    const config = this.sys.game.CONFIG;
    this.levelNumber = this.getLevelNumber(data);

    const level = LEVELS[this.levelNumber - 1];
    const { tables: confTables = [], cup: confCup } = level;

    initCategories(this);

    this.ball = new Ball(
      this,
      125,
      config.centerY,
      constants.TEXTURE_ATLAS,
      'ball'
    );
    this.add.existing(this.ball);

    confTables.forEach(confTable => {
      const table = new Table(
        this,
        confTable.x,
        confTable.y,
        constants.TEXTURE_ATLAS,
        'table',
        Phaser.Math.DegToRad(confTable.angle)
      );
      this.add.existing(table);
      this.tableIds.push(table.body.id);
    });

    this.cup = new Cup(
      this,
      confCup.x,
      confCup.y,
      confCup.angle,
      this.ball.body.id,
      confCup.behaviours
    );
    this.add.existing(this.cup);

    (() => new LevelBar(this, this.levelNumber))();

    const healthBar = new HealthBar(this, this.ball.livesNumber);
    const retryLevelPopup = new RetryLevelPopup(
      this,
      config.centerX,
      config.centerY
    );

    this.ball.on('dead', () => {
      healthBar.update(this.ball.livesNumber);
      if (this.ball.livesNumber === 0) {
        retryLevelPopup.popup();
      }
    });

    const completeLevelPopup = new CompleteLevelPopup(
      this,
      config.centerX,
      config.centerY
    );

    this.cup.on('complete', () => {
      completeLevelPopup.popup();
    });

    if (__DEV__) {
      this.debug();
    }
  }

  update(time, delta) {
    this.ball.update();
    this.cup.update(delta);
  }

  getLevelNumber(data) {
    const { result, levelNumber } = data;

    if (levelNumber) {
      return levelNumber;
    }

    switch (result) {
      case 'fail':
        return this.levelNumber;
      case 'success':
        return this.levelNumber + 1;
      default:
        return this.levelNumber;
    }
  }

  debug() {
    // Add a red border
    const config = this.sys.game.CONFIG;
    const size = 2;
    const border = this.add.rectangle(
      config.centerX,
      config.centerY,
      config.width - size,
      config.height - size
    );
    border.setStrokeStyle(size, '0xFF0000');
  }
}

export default GameplayScene;
