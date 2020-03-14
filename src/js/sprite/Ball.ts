/* eslint-disable no-param-reassign */
import ProjectionLine from "../component/ProjectionLine";
import PointsTrace from "../component/PointsTrace";
import BallTrace from "../component/BallTrace";
import * as constants from "../constants";
import { isInCircle, closestPointToCircle } from "../utils";

const SPEED = 0.15;
const RESET_DISTANCE = 650;
const IMMOBILE_SPEED = 0.2222222222229;
const IMMOBILE_ANGULAR_SPPED = 0.03;
const GREY_BALL_SCALE = 1.6;
const DEATH_DELAY = 650;
const DRAG_RADIUS = 95;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene.matter.world, x, y, texture, frame);
    this.livesNumber = constants.MAX_LIVES;
    this.touchesTable = false;
    this.hasConstraint = false;
    this.isDead = false;
    this.launched = false;

    this.startPos = { x, y };

    this.isPressed = false;
    this.dragX = x;
    this.dragY = y;

    this.setCircle();

    this.setInteractive({ draggable: true });

    const greyBall = scene.add.image(
      x,
      y,
      constants.TEXTURE_ATLAS,
      "grey_ball"
    );
    greyBall.setAlpha(0.12);
    greyBall.setScale(GREY_BALL_SCALE);

    const throwOffset = greyBall.width * GREY_BALL_SCALE - this.width;
    (() => new ProjectionLine(scene, x, y, SPEED, 100, throwOffset))();

    this.pointsTrace = new PointsTrace(scene, this, throwOffset);
    this.ballTrace = new BallTrace(scene, this);

    this.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: this.body,
      stiffness: 0.05
    });
    this.setStatic(true);

    scene.input.on("dragstart", (pointer, gameObject) => {
      gameObject.isPressed = true;
      gameObject.launched = false;
      gameObject.dragX = gameObject.x;
      gameObject.dragY = gameObject.y;

      if (gameObject.hasConstraint) {
        gameObject.scene.matter.world.removeConstraint(gameObject.constraint);
      }
      gameObject.setStatic(false);
    });

    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.isPressed = true;
      let pointX = dragX;
      let pointY = dragY;

      if (!isInCircle(x, y, dragX, dragY, DRAG_RADIUS)) {
        const position = closestPointToCircle(x, y, dragX, dragY, DRAG_RADIUS);
        pointX = position.x;
        pointY = position.y;
      }

      gameObject.dragX = pointX;
      gameObject.dragY = pointY;
    });

    scene.input.on("dragend", (pointer, gameObject) => {
      gameObject.isPressed = false;
      gameObject.launched = true;
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

      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED
      );

      gameObject.removeInteractive();
    });

    const context = this;
    scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (context.isDead || !context.launched) {
        return;
      }

      if (
        [bodyA.id, bodyB.id].includes(context.body.id) &&
        [bodyA.id, bodyB.id].some(r => context.scene.tableIds.includes(r))
      ) {
        context.scene.sound.play("table_bounce");
        context.touchesTable = true;
      }

      const { pairs } = event;
      for (let i = 0; i < pairs.length; i += 1) {
        //  We only want sensor collisions
        if (pairs[i].isSensor) {
          if (bodyA.id === context.body.id) {
            context.destroy();
            context.isDead = true;
          }
        }
      }
    });

    scene.matter.world.on("collisionend", (event, bodyA, bodyB) => {
      if (context.isDead || !context.launched) {
        return;
      }

      if (
        !isInCircle(
          x,
          y,
          context.body.position.x,
          context.body.position.y,
          DRAG_RADIUS
        )
      ) {
        if (
          [bodyA.id, bodyB.id].includes(context.body.id) &&
          [bodyA.id, bodyB.id].some(r => context.scene.tableIds.includes(r))
        ) {
          context.touchesTable = false;
        }
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

    this.pointsTrace.update();
    this.ballTrace.update();
  }

  kill() {
    this.livesNumber -= 1;
    this.emit("dead");
    if (this.livesNumber !== 0) {
      this.reset();
    }
    this.isDead = false;
  }

  reset() {
    this.setInteractive({ draggable: true });

    this.touchesTable = false;

    this.setStatic(true);
    this.x = this.startPos.x;
    this.y = this.startPos.y;
  }
}

export default Ball;
