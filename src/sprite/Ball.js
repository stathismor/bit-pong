/* eslint-disable no-param-reassign */

import ProjectionLine from '../component/ProjectionLine';
import TraceLine from '../component/TraceLine';
import * as constants from '../constants';
import util from '../utils';

const SPEED = 0.15;
const RESET_DISTANCE = 500;
const IMMOBILE_SPEED = 0.2222222222229;
const IMMOBILE_ANGULAR_SPPED = 0.03;
const GREY_BALL_SCALE = 1.6;
const DEATH_DELAY = 650;
const DRAG_LENGTH = 95;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key) {
    super(scene.matter.world, x, y, key, null);
    this.livesNumber = constants.MAX_LIVES;
    this.touchesTable = false;
    this.hasConstraint = false;
    this.launched = false;
    this.isDead = false;

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

    this.traceLine = new TraceLine(scene, this, throwOffset);

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
      let pointX = dragX;
      let pointY = dragY;

      if (Phaser.Math.Distance.Between(x, y, dragX, dragY) >= DRAG_LENGTH) {
        const position = util.closestPointToCircle(
          x,
          y,
          dragX,
          dragY,
          DRAG_LENGTH
        );
        pointX = position.x;
        pointY = position.y;
      }

      gameObject.dragX = pointX;
      gameObject.dragY = pointY;
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
    if (this.isDead || this.livesNumber === 0) {
      return;
    }

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
      this.isDead = true;
      this.scene.time.delayedCall(DEATH_DELAY, this.kill, null, this);
    }

    this.traceLine.update();
  }

  kill() {
    this.livesNumber -= 1;
    this.emit('dead');
    if (this.livesNumber !== 0) {
      this.reset();
    }
    this.isDead = false;
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
