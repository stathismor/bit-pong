import _LEVELS from '../../config/levels.json';
import Ball from '../sprite/Ball';
import Table from '../sprite/Table';

class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameplayScene',
    });
    this.levelNumber = 0;
  }

  create(data) {
    const { reset, advance } = data;
    const config = this.sys.game.CONFIG;

    if (reset) {
      this.levelNumber = 0;
    }

    if (advance) {
      this.levelNumber++;
    }

    const level = _LEVELS[this.levelNumber];
    const { tables: tables_data = [], cup: cup_data } = level;

    const ball = new Ball(this, 125, config.centerY, 'ball');
    this.add.existing(ball);

    const tables = tables_data.map(
      (table_data, scene) =>
        new Table({
          scene: this,
          key: 'table',
          x: table_data.x,
          y: table_data.y,
          angle: table_data.angle,
        })
    );

    if (__DEV__) {
      this.debug();
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
