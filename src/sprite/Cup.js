import behaviour from '../behaviour';
import * as constants from '../constants';

const M = Phaser.Physics.Matter.Matter;
const SIDE_WITH = 10;
const SIDES_ANGLE = 13;
const OFFSET = 2;
const CHAMFER_RADIUS = 7;
const COLLISION_PERIOD = 200;

export default class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, angleRad, ballId, behaviourName) {
    super(scene.matter.world, x, y, constants.TEXTURE_ATLAS, 'cup');
    this.behaviour = behaviour[behaviourName];
    let collisionTime = new Date();

    // The player's body is going to be a compound body.
    const cupLeft = M.Bodies.rectangle(
      -this.width / 2 + SIDE_WITH + OFFSET,
      0,
      SIDE_WITH,
      this.height,
      {
        angle: Phaser.Math.DegToRad(-SIDES_ANGLE),
        chamfer: { radius: CHAMFER_RADIUS },
      }
    );
    const cupRight = M.Bodies.rectangle(
      this.width / 2 - SIDE_WITH - OFFSET,
      0,
      SIDE_WITH,
      this.height,
      {
        angle: Phaser.Math.DegToRad(SIDES_ANGLE),
        chamfer: { radius: CHAMFER_RADIUS },
      }
    );
    const sensor = M.Bodies.rectangle(0, 15, 20, 25, { isSensor: true });

    const compoundBody = M.Body.create({
      parts: [cupLeft, cupRight, sensor],
    });

    this.setExistingBody(compoundBody)
      .setAngle(angleRad)
      .setPosition(x, y)
      .setFriction(0)
      .setStatic(true);

    const context = this;
    scene.matter.world.on('collisionstart', (event, firstBodyA, firstBodyB) => {
      const { pairs } = event;

      for (let i = 0; i < pairs.length; i += 1) {
        //  We only want sensor collisions
        if (pairs[i].isSensor) {
          const currentLevel = scene.levelNumber;
          const completedLevels =
            JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || [];
          if (!completedLevels.includes(currentLevel)) {
            localStorage.setItem(
              constants.LOGAL_STORAGE_KEY,
              JSON.stringify([currentLevel, ...completedLevels])
            );
          }
          scene.scene.start('LevelMenuScene');
        }
      }

      if (
        [firstBodyA.id, firstBodyB.id].includes(ballId) &&
        [firstBodyA.id, firstBodyB.id].some(r =>
          [cupLeft.id, cupRight.id].includes(r)
        )
      ) {
        const timeDiff = new Date() - collisionTime;
        if (timeDiff > COLLISION_PERIOD) {
          context.scene.sound.play('cup_bounce');
        }
        collisionTime = new Date();
      }
    });
  }

  update(delta) {
    if (this.behaviour) {
      this.behaviour(this, delta);
    }
  }
}