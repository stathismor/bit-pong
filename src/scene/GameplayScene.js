import _LEVELS from '../../config/levels.json';
import Ball from '../sprite/Ball';
import Table from '../sprite/Table';
import HealthBar from '../hud/HealthBar';

class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameplayScene',
    });
    this.levelNumber = 0;
  }

  create(data) {
    const { reset, advance, lives } = data;
    const config = this.sys.game.CONFIG;

    if (reset) {
      this.levelNumber = 0;
    }

    if (advance) {
      this.levelNumber++;
    }

    const level = _LEVELS[this.levelNumber];
    const { tables: tables_data = [], cup: cup_data } = level;

    this.ball = new Ball(this, 125, config.centerY, 'ball', lives);
    this.add.existing(this.ball);

    const tables = tables_data.map((table_data, scene) => {
      return new Table(
        this,
        table_data.x,
        table_data.y,
        'table',
        table_data.angle
      );
    });
    tables.forEach(table => {
      this.add.existing(tables[0]);
    });
    this.tableIds = tables.map(t => t.body.id);

    new HealthBar(this, lives, this.ball);

    if (__DEV__) {
      this.debug();
    }
  }

  update(time, delta) {
    this.ball.update();
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
