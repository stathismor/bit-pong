/* eslint-disable no-param-reassign */

import ProjectionLine from '../component/ProjectionLine';
import TraceLine from '../component/TraceLine';

const SPEED = 0.15;
const RESET_DISTANCE = 500;
const IMMOBILE_SPEED = 0.222;
const IMMOBILE_ANGULAR_SPPED = 0.03;
const GREY_BALL_SCALE = 1.6;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key) {
    super(scene.matter.world, x, y, key, null);
    this.touchesTable = false;
    this.hasConstraint = false;
    this.launched = false;

    this.startPos = { x, y };

    this.isPressed = false;
    this.dragX = x;
    this.dragY = y;

    this.setCircle();

    this.spring = scene.matter.add.mouseSpring({
      length: 0.1,
      stiffness: 1,
    });
    this.setInteractive({ draggable: true });

    const greyBall = scene.add.image(x, y, 'grey_ball');
    greyBall.setAlpha(0.12);
    greyBall.setScale(GREY_BALL_SCALE);

    const throwOffset = greyBall.width * GREY_BALL_SCALE - this.width;
    (() => new ProjectionLine(scene, x, y, SPEED, 100, throwOffset))();

    this.traceLine = new TraceLine(scene, this);

    this.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: this.body,
      stiffness: 0.05,
    });
    this.setStatic(true);

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.launched = false;

      gameObject.isPressed = true;
      gameObject.dragX = gameObject.x;
      gameObject.dragY = gameObject.y;

      if (gameObject.hasConstraint) {
        gameObject.scene.matter.world.removeConstraint(gameObject.constraint);
      }
      gameObject.setStatic(false);
    });

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.isPressed = true;
      gameObject.dragX = dragX;
      gameObject.dragY = dragY;
    });

    scene.input.on('dragend', (pointer, gameObject) => {
      gameObject.isPressed = false;
      const fromStartDistance = Phaser.Math.Distance.Between(
        x,
        y,
        gameObject.x,
        gameObject.y
      );

      if (fromStartDistance < throwOffset) {
        gameObject.scene.matter.world.add(gameObject.constraint);
        gameObject.hasConstraint = true;
        return;
      }

      gameObject.launched = true;

      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED
      );

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
    // Workaround for bug where when ball is clicked on the edge, it falls down
    if (this.isPressed) {
      this.x = this.dragX;
      this.y = this.dragY;
    }

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
      this.emit('dead');
      this.reset();
    }

    this.traceLine.update();
  }

  reset() {
    this.spring = this.scene.matter.add.mouseSpring({
      length: 0.1,
      stiffness: 1,
    });
    this.setInteractive({ draggable: true });

    this.launched = false;
    this.touchesTable = false;

    this.setStatic(true);
    this.x = this.startPos.x;
    this.y = this.startPos.y;
  }
}

export default Ball;
