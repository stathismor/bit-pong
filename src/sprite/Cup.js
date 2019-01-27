const M = Phaser.Physics.Matter.Matter;
const SIDE_WITH = 10;
const SENSOR_WIDTH = 25;

export default class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, angle, ballId) {
    super(scene.matter.world, x, y, 'cup');

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
      .setAngle(angle)
      .setPosition(x, y)
      .setFriction(0)
      .setStatic(true);

    scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      for (let i = 0; i < event.pairs.length; i += 1) {
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
      }
    });
  }
}
