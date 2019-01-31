import ProjectionLine from '../component/ProjectionLine';

const SPEED = 0.15;
const RESET_DISTANCE = 500;
const IMMOBILE_SPEED = 0.222;
const IMMOBILE_ANGULAR_SPPED = 0.03;
const GREY_BALL_SCALE = 1.6;

const LOW_STIFFNESS = 0.0001;
const HIGH_STIFFNESS = 0.05;
const DRAG_LENGTH = 100;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key) {
    super(scene.matter.world, x, y, key, null);
    this.startPos = { x, y };
    this.touchesTable = false;
    this.spring = scene.matter.add.mouseSpring();

    this.setCircle();
    this.setInteractive({ draggable: true });
    scene.input.setDraggable(this);

    const greyBall = scene.add.image(x, y, 'grey_ball');
    greyBall.setAlpha(0.12);
    greyBall.setScale(GREY_BALL_SCALE);

    const throwOffset = greyBall.width * GREY_BALL_SCALE - this.width;
    new ProjectionLine(scene, x, y, SPEED, DRAG_LENGTH, throwOffset);

    this.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: this.body,
      stiffness: HIGH_STIFFNESS,
    });
    scene.matter.world.add(this.constraint);

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setStatic(false);
    });

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const { constraint } = gameObject;
      if (Phaser.Math.Distance.Between(x, y, dragX, dragY) > DRAG_LENGTH) {
        constraint.stiffness = 1;
        constraint.length = DRAG_LENGTH;
      } else {
        constraint.stiffness = LOW_STIFFNESS;
      }
    });

    scene.input.on('dragend', (pointer, gameObject) => {
      const fromStartDistance = Phaser.Math.Distance.Between(
        x,
        y,
        gameObject.x,
        gameObject.y
      );

      const { constraint } = gameObject;
      if (fromStartDistance < throwOffset) {
        constraint.stiffness = HIGH_STIFFNESS;
        constraint.length = 0;
        return;
      }

      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED
      );

      gameObject.scene.matter.world.removeConstraint(gameObject.constraint);
      gameObject.spring.destroy();
      gameObject.removeInteractive();
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
