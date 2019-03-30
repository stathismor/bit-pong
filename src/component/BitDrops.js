import * as constants from '../constants';
import { cupCategory, tableCategory, dropCategory } from '../collision';

const DROPS_COUNT = 80;
const DROP_ROTATION_OFFSET = 0.35;
const DROP_VELOCITY = 5;
const DROP_VELOCITY_OFFSET = 1;
const DROP_POSITION_OFFSET_X = 12;
const DROP_POSITION_OFFSET_Y = 6;

export default class BitDrops {
  constructor(scene) {
    this.drops = [];
    const config = scene.sys.game.CONFIG;
    for (let i = 0; i < DROPS_COUNT; i += 1) {
      const drop = scene.matter.add.sprite(
        config.width * 2,
        config.height * 2,
        constants.TEXTURE_ATLAS,
        'drop',
        { shape: { type: 'rectangle', radius: 8 }, ignorePointer: true }
      );
      drop.setCollisionCategory(dropCategory);
      drop.setCollidesWith([tableCategory, cupCategory]);
      // drop.setActive(false);
      // drop.setStatic(true);
      this.drops[i] = drop;
    }
  }

  spill(x, y, rotation) {
    const dropStartPosY = y - 8;
    this.drops.forEach(drop => {
      const dropTemp = drop;
      dropTemp.setActive(true);
      dropTemp.setStatic(false);
      dropTemp.x = Phaser.Math.FloatBetween(
        x - DROP_POSITION_OFFSET_X,
        x + DROP_POSITION_OFFSET_X
      );
      dropTemp.y = Phaser.Math.FloatBetween(
        dropStartPosY,
        dropStartPosY - DROP_POSITION_OFFSET_Y
      );
      const dropX =
        Math.sin(
          Phaser.Math.FloatBetween(
            rotation - DROP_ROTATION_OFFSET,
            rotation + DROP_ROTATION_OFFSET
          )
        ) *
        Phaser.Math.FloatBetween(
          DROP_VELOCITY - DROP_VELOCITY_OFFSET,
          DROP_VELOCITY + DROP_VELOCITY_OFFSET
        );
      const dropY =
        -Math.cos(
          Phaser.Math.FloatBetween(
            rotation - DROP_ROTATION_OFFSET,
            rotation + DROP_ROTATION_OFFSET
          )
        ) *
        Phaser.Math.FloatBetween(
          DROP_VELOCITY - DROP_VELOCITY_OFFSET,
          DROP_VELOCITY + DROP_VELOCITY_OFFSET
        );
      drop.setVelocity(dropX, dropY);
    });
  }
}
