import ProjectionLine from "../component/ProjectionLine";
import PointsTrace from "../component/PointsTrace";
import { OwnerTrace } from "../component/OwnerTrace";
import * as constants from "../constants";
import { GameplaySceneStatus } from "../scene/GameplayScene";
import { isInCircle, closestPointToCircle } from "../utils";
import { SpriteManager } from "../sprite/SpriteManager";

const SPEED = 0.185;
const RESET_DISTANCE = 1200;
const GREY_BALL_SCALE = 1.6;
const DEATH_DELAY = 650;
const DRAG_RADIUS = 170;
const IMMOBILE_CHECK_PERIOD = 200;
const IMMOBILE_DIST = 40;
const IMMOBILE_SPEED = 0.362;
const IMMOBILE_ANGULAR_SPEED = 0.0006;

export class Drag {
  constructor(scene, owner, x, y, frame, angleRad) {
    this.scene = scene;
    this.owner = owner;
    this.angleRad = angleRad;

    owner.hasConstraint = false;
    owner.isDead = false;
    owner.launched = false;

    owner.startPos = { x, y };
    this.previousX = x;
    this.checkImmobileTime = new Date();

    owner.isPressed = false;
    owner.dragX = x;
    owner.dragY = y;
    owner.rotation = angleRad;

    this.setInteractive();

    // TODO: REMOVE grey asseets
    const greyBall = scene.add.image(x, y, constants.TEXTURE_ATLAS, frame);
    greyBall.setScale(owner.scale * GREY_BALL_SCALE);
    greyBall.setAlpha(0.07);
    greyBall.tint = "#d9d9d9";
    greyBall.rotation = angleRad;

    ((): void =>
      new ProjectionLine(scene, x, y, SPEED, 100, greyBall, owner))();

    owner.pointsTrace = new PointsTrace(scene, owner, greyBall, owner);
    owner.ballTrace = new OwnerTrace(scene, owner, frame);

    owner.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: owner.body,
      stiffness: 0.05,
    });
    owner.setStatic(true);

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

      if (
        Phaser.Geom.Rectangle.ContainsRect(
          greyBall.getBounds(),
          owner.getBounds()
        )
      ) {
        gameObject.scene.matter.world.add(gameObject.constraint);
        gameObject.hasConstraint = true;
        gameObject.launched = false;
        return;
      }

      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED
      );

      gameObject.removeInteractive();

      gameObject.scene.sound.play("swoosh");
    });
  }

  update(): void {
    if (this.owner.isDead || this.owner.livesNumber === 0) {
      return;
    }

    // Workaround for bug where when ball is clicked on the edge, it falls down
    if (this.owner.isPressed) {
      this.owner.x = this.owner.dragX;
      this.owner.y = this.owner.dragY;
    }

    if (!this.owner.launched) {
      return;
    }

    let isImmobile = false;
    const timeDiff = new Date() - this.checkImmobileTime;
    if (timeDiff > IMMOBILE_CHECK_PERIOD) {
      this.checkImmobileTime = new Date();
      const immobileDist = Math.abs(this.owner.x - this.previousX);

      if (
        immobileDist < IMMOBILE_DIST &&
        this.owner.body.speed < IMMOBILE_SPEED &&
        this.owner.body.angularVelocity < IMMOBILE_ANGULAR_SPEED
      ) {
        isImmobile = true;
      } else {
        this.previousX = this.owner.x;
      }
    }

    if (
      Phaser.Math.Distance.Between(
        this.owner.x,
        this.owner.y,
        this.owner.scene.sys.game.CONFIG.centerX,
        this.owner.scene.sys.game.CONFIG.centerY
      ) > RESET_DISTANCE ||
      isImmobile
    ) {
      if (this.owner.scene.getStatus() === GameplaySceneStatus.PLAY) {
        this.owner.isDead = true;
        this.owner.scene.time.delayedCall(DEATH_DELAY, this.kill, null, this);
      }
    }

    this.owner.pointsTrace.update();
    this.owner.ballTrace.update();
  }

  kill(): void {
    this.owner.livesNumber -= 1;
    this.owner.emit("dead");
    if (this.owner.livesNumber !== 0) {
      this.reset();
    }
    this.owner.isDead = false;
  }

  setInteractive(): void {
    // @HACK: A major one! I think Phaser/matter is buggy when setting
    // the hitArea (definidely enableDebug is) and it's hard to find
    // a consistent way of setting a larget hit area.
    if (this.scene.levelNumber === 35) {
      this.owner.setInteractive(
        new Phaser.Geom.Circle(55, 55, 110),
        Phaser.Geom.Circle.Contains
      );
      // this.scene.input.enableDebug(this.owner, 0xff00ff);
      this.scene.input.setDraggable(this.owner);
    } else {
      this.owner.setInteractive({ draggable: true });
    }
  }

  reset(): void {
    this.setInteractive({ draggable: true });

    this.owner.setStatic(true);
    this.owner.x = this.owner.startPos.x;
    this.owner.y = this.owner.startPos.y;
    this.owner.rotation = this.angleRad;
    this.owner.launched = false;

    SpriteManager.ResetPositions();
  }
}
