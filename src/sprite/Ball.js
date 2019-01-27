const SPEED = 0.1;
const STIFFNESS = 0.0001;
const RESET_DISTANCE = 500;
const IMMOBILE_SPEED = 0.222;
const IMMOBILE_ANGULAR_SPPED = 0.03;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key) {
    super(scene.matter.world, x, y, key, null);
    this.startPos = { x, y };
    this.touchesTable = false;
    this.spring = scene.matter.add.mouseSpring();

    this.setCircle();
    this.setStatic(true);
    this.setInteractive({ draggable: true });
    scene.input.setDraggable(this);

    this.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: this.body,
      stiffness: STIFFNESS,
      damping: 1,
    });

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setStatic(false);
    });

    scene.input.on('dragend', (pointer, gameObject) => {
      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED
      );

      gameObject.scene.matter.world.removeConstraint(gameObject.constraint);
      gameObject.spring.destroy();
    });

    const context = this;
    scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      if (
        [bodyA.id, bodyB.id].includes(context.body.id) &&
        [bodyA.id, bodyB.id].some(r => context.scene.tableIds.includes(r))
      ) {
        context.scene.sound.play('table_bounce');
        context.touchesTable = true;
      }
    });

    scene.matter.world.on('collisionend', (event, bodyA, bodyB) => {
      if (
        [bodyA.id, bodyB.id].includes(context.body.id) &&
        [bodyA.id, bodyB.id].some(r => context.scene.tableIds.includes(r))
      ) {
        context.touchesTable = false;
      }
    });
  }

  update() {
    const isImmobile =
      this.body.speed < IMMOBILE_SPEED &&
      this.body.angularSpeed < IMMOBILE_ANGULAR_SPPED &&
      this.touchesTable;
    if (
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.cup.x,
        this.scene.cup.y
      ) > RESET_DISTANCE ||
      isImmobile
    ) {
      this.touchesTable = false;
      this.scene.scene.restart({ result: 'fail' });
    }
  }
}

export default Ball;
