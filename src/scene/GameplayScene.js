import _LEVELS from '../../config/levels.json';
import Ball from '../sprite/Ball';
import Table from '../sprite/Table';
import HealthBar from '../hud/HealthBar';

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
    const { lives } = data;
    const config = this.sys.game.CONFIG;
    this.levelNumber = this.getLevelNumber(data);

    const level = _LEVELS[this.levelNumber - 1];
    const { tables: confTables = [] } = level;

    this.ball = new Ball(this, 125, config.centerY, 'ball', lives);
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

    new HealthBar(this, lives, this.ball);

    if (__DEV__) {
      this.debug();
    }
  }

  update(time, delta) {
    this.ball.update();
  }

  getLevelNumber(data) {
    const { reset, advance, levelNumber } = data;

    if (levelNumber) {
      return levelNumber;
    }

    if (reset) {
      return 1;
    }

    if (advance) {
      return this.levelNumber + 1;
    }

    return this.levelNumber;
  }

  getLivesNumber(data) {
    const { lives } = data;

    if (lives) {
      return lives;
    }

    return;
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
