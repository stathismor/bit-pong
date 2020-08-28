import ProjectionLine from "../component/ProjectionLine";
import PointsTrace from "../component/PointsTrace";
import { OwnerTrace } from "../component/OwnerTrace";
import * as constants from "../constants";
import { GameplaySceneStatus } from "../scene/GameplayScene";
import { isInCircle, closestPointToCircle } from "../utils";
import { SpriteManager } from "../sprite/SpriteManager";
import { isSpriteImmobile, isOutsideWorld } from "../utils";

const SPEED = 0.185;
const GREY_BALL_SCALE = 1.6;
const DEATH_DELAY = 650;
const DRAG_RADIUS = 170;
const IMMOBILE_CHECK_PERIOD = 200;
const DRAGGABLE_SCALE_CIRCLE_CONSTANT = 45;
const DRAGGABLE_SCALE_CIRCLE_MULTIPLIER = 12;
const DRAGGABLE_SCALE_MULTIPLIER_X = 1.5;
const DRAGGABLE_SCALE_MULTIPLIER_Y = 2.6;

// As a failsafe, level ends after 12 seconds of throwing the ball
const LEVEL_TIMEOUT = 12000;

export class Drag {
  constructor(scene, owner, x, y, frame, angleRad) {
    this.scene = scene;
    this.owner = owner;
    this.angleRad = angleRad;
    this.dragStartedAt = null;

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
    greyBall.setAlpha(0.1);
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
      this.dragStartedAt = new Date();

      // @HACK: This assumer the owner is a player, and is here just for those
      // trick levels where the owner needs to overlay the HUD.
      owner.overrideDepth();

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

    // Are all sprites non being considered again for this behaviour's checks
    let areSpritesInactive = false;
    const now = new Date();
    const timeDiff = now - this.checkImmobileTime;

    if (timeDiff > IMMOBILE_CHECK_PERIOD) {
      this.checkImmobileTime = new Date();

      const sprites = [...SpriteManager.GetBalls(), this.owner];

      areSpritesInactive = sprites.every(
        (ball) => isSpriteImmobile(ball) || isOutsideWorld(ball)
      );

      if (!areSpritesInactive) {
        this.previousX = this.owner.x;
      }
    }

    const levelExpired = now - this.dragStartedAt > LEVEL_TIMEOUT;

    if (levelExpired || areSpritesInactive) {
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
    // @HACK: And a major one! Small sprites are hard to drag on mobile, so we
    // increase the hit area a bit. But I think Phaser/matter is buggy when setting
    // the hitArea (definidely enableDebug is, shows different area than actual one)
    // and it's hard to find a consistent way of setting a larger hit area, so we
    // hard-code one. At the time of writing this, this only exists for level 35.
    const scale =
      DRAGGABLE_SCALE_CIRCLE_CONSTANT +
      DRAGGABLE_SCALE_CIRCLE_MULTIPLIER / this.owner.scale;
    if (
      this.owner.getData("name").startsWith("ball") ||
      this.owner.getData("name").startsWith("drop")
    ) {
      this.owner.setInteractive(
        new Phaser.Geom.Circle(
          this.owner.width / 2,
          this.owner.height / 2,
          scale
        ),
        Phaser.Geom.Circle.Contains
      );
    } else if (
      this.owner.getData("name").startsWith("table") ||
      this.owner.getData("name").startsWith("cup")
    ) {
      const draggableWidth = this.owner.width * DRAGGABLE_SCALE_MULTIPLIER_X;
      const draggableHeight = this.owner.getData("name").startsWith("table")
        ? this.owner.height * DRAGGABLE_SCALE_MULTIPLIER_Y
        : this.owner.height * DRAGGABLE_SCALE_MULTIPLIER_X;
      const diffX = draggableWidth - this.owner.width;
      const diffY = draggableHeight - this.owner.height;
      this.owner.setInteractive(
        new Phaser.Geom.Rectangle(
          -diffX / 2,
          -diffY / 2,
          draggableWidth,
          draggableHeight
        ),
        Phaser.Geom.Rectangle.Contains
      );
    } else {
      this.owner.setInteractive({ draggable: true });
    }
    this.scene.input.setDraggable(this.owner);
    // @DEBUG
    // this.scene.input.enableDebug(this.owner, 0xff00ff); // Buggy :(
  }

  reset(): void {
    this.setInteractive({ draggable: true });

    this.owner.setStatic(true);
    this.owner.x = this.owner.startPos.x;
    this.owner.y = this.owner.startPos.y;
    this.owner.rotation = this.angleRad;
    this.owner.launched = false;
    this.owner.overrideDepth(true);

    SpriteManager.ResetPositions();
  }
}
