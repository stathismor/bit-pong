import behaviour from '../behaviour';
import * as constants from '../constants';

const M = Phaser.Physics.Matter.Matter;
const SIDE_WITH = 10;
const SENSOR_WIDTH = 25;

export default class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, angleRad, ballId, behaviourName) {
    super(scene.matter.world, x, y, constants.TEXTURE_ATLAS, 'cup');
    this.behaviour = behaviour[behaviourName];

    // The player's body is going to be a compound body.
    const cupLeft = M.Bodies.rectangle(
      this.width / 2 - SIDE_WITH,
      0,
      SIDE_WITH,
      this.height,
      { angle: 0.2, chamfer: { radius: 10 } }
    );
    const cupRight = M.Bodies.rectangle(
      -this.width / 2 + SIDE_WITH,
      0,
      SIDE_WITH,
      this.height,
      { angle: -0.2, chamfer: { radius: 10 } }
    );
    const sensor = M.Bodies.rectangle(
      0,
      this.height - 2 * SENSOR_WIDTH,
      this.width / 2,
      SENSOR_WIDTH,
      { isStatic: true }
    );

    const compoundBody = M.Body.create({
      parts: [cupLeft, cupRight, sensor],
    });

    this.setExistingBody(compoundBody)
      .setAngle(angleRad)
      .setPosition(x, y)
      .setFriction(0)
      .setStatic(true);

    const context = this;
    scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      if ([bodyA.id, bodyB.id].every(r => [sensor.id, ballId].includes(r))) {
        const currentLevel = scene.levelNumber;
        const completedLevels =
          JSON.parse(localStorage.getItem('completed-levels')) || [];
        if (!completedLevels.includes(currentLevel)) {
          localStorage.setItem(
            'completed-levels',
            JSON.stringify([currentLevel, ...completedLevels])
          );
        }
        scene.scene.start('LevelMenuScene');
      }

      if (
        [bodyA.id, bodyB.id].includes(ballId) &&
        [bodyA.id, bodyB.id].some(r => [cupLeft.id, cupRight.id].includes(r))
      ) {
        context.scene.sound.play('cup_bounce');
      }
    });
  }

  update(delta) {
    if (this.behaviour) {
      this.behaviour(this, delta);
    }
  }
}
