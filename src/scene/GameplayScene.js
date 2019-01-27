import _LEVELS from '../../config/levels.json';
import Ball from '../sprite/Ball';
import Table from '../sprite/Table';
import HealthBar from '../hud/HealthBar';

const MAX_LIVES = 3;

class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameplayScene',
    });
    this.levelNumber = 1;
    this.livesNumber = MAX_LIVES;
    this.tableIds = [];
    this.ball = null;
  }

  create(data) {
    const config = this.sys.game.CONFIG;
    this.levelNumber = this.getLevelNumber(data);
    this.livesNumber = this.getLivesNumber(data);
    if (this.livesNumber === 0) {
      this.scene.start('LevelMenuScene');
    }

    const level = _LEVELS[this.levelNumber - 1];
    const { tables: confTables = [] } = level;

    this.ball = new Ball(this, 125, config.centerY, 'ball');
    this.add.existing(this.ball);

    confTables.forEach(confTable => {
      const table = new Table(
        this,
        confTable.x,
        confTable.y,
        'table',
        confTable.angle
      );
      this.add.existing(table);
      this.tableIds.push(table.body.id);
    });

    new HealthBar(this, this.livesNumber, this.ball);

    if (__DEV__) {
      this.debug();
    }
  }

  update(time, delta) {
    this.ball.update();
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

  getLivesNumber(data) {
    const { result } = data;

    if (result === 'fail') {
      return this.livesNumber - 1;
    }

    return MAX_LIVES;
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
