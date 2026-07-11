import Phaser from "phaser";
import ProjectionLine from "../component/ProjectionLine";
import { ComponentManager } from "../behaviour/ComponentManager";
import { RandomPosition } from "../behaviour/RandomPosition";
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
const DRAGGABLE_SCALE_MULTIPLIER_Y = 4;

// As a failsafe, level ends after 12 seconds of throwing the ball
const LEVEL_TIMEOUT = 12000;

interface DraggableSprite extends Phaser.Physics.Matter.Sprite {
  hasConstraint: boolean;
  isDead: boolean;
  launched: boolean;
  startPos: { x: number; y: number };
  isPressed: boolean;
  dragX: number;
  dragY: number;
  constraint: MatterJS.ConstraintType;
  livesNumber: number;
  pointsTrace: PointsTrace;
  ballTrace: OwnerTrace;
  configDepth: number;
  overrideDepth(useConfig?: boolean): void;
  touchesTable: boolean;
}

interface GameplaySceneInterface extends Phaser.Scene {
  getStatus(): GameplaySceneStatus;
  matter: Phaser.Physics.Matter.MatterPhysics;
}

export class Drag {
  scene: Phaser.Scene;
  owner: DraggableSprite;
  angleRad: number;
  dragStartedAt: Date | null;
  previousX: number;
  checkImmobileTime: Date;

  constructor(scene: Phaser.Scene, owner: Phaser.Physics.Matter.Sprite, x: number, y: number, frame: string, angleRad: number) {
    this.scene = scene;
    this.owner = owner as DraggableSprite;
    this.angleRad = angleRad;
    this.dragStartedAt = null;

    this.owner.hasConstraint = false;
    this.owner.isDead = false;
    this.owner.launched = false;

    this.owner.startPos = { x, y };
    this.previousX = x;
    this.checkImmobileTime = new Date();

    this.owner.isPressed = false;
    this.owner.dragX = x;
    this.owner.dragY = y;
    this.owner.rotation = angleRad;

    this.setInteractive();

    const greyBall = scene.add.image(x, y, constants.TEXTURE_ATLAS, frame);
    greyBall.setScale(owner.scale * GREY_BALL_SCALE);
    greyBall.setAlpha(0.1);
    greyBall.tint = 0xd9d9d9;
    greyBall.rotation = angleRad;

    void new ProjectionLine(scene, x, y, SPEED, 100, greyBall, owner);

    this.owner.pointsTrace = new PointsTrace(scene, owner, greyBall, owner);
    this.owner.ballTrace = new OwnerTrace(scene, owner, frame);

    this.owner.constraint = (scene as GameplaySceneInterface).matter.constraint.create({
      pointA: { x, y },
      bodyB: owner.body as MatterJS.BodyType,
      stiffness: 0.05,
    });
    this.owner.setStatic(true);

    scene.input.on("dragstart", (_pointer: Phaser.Input.Pointer, gameObject: DraggableSprite) => {
      gameObject.isPressed = true;
      gameObject.launched = false;
      gameObject.dragX = gameObject.x;
      gameObject.dragY = gameObject.y;

      if (gameObject.hasConstraint) {
        (gameObject.scene as GameplaySceneInterface).matter.world.removeConstraint(gameObject.constraint);
      }
      gameObject.setStatic(false);
    });

    scene.input.on("drag", (_pointer: Phaser.Input.Pointer, gameObject: DraggableSprite, dragX: number, dragY: number) => {
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

    scene.input.on("dragend", (_pointer: Phaser.Input.Pointer, gameObject: DraggableSprite) => {
      gameObject.isPressed = false;
      gameObject.launched = true;

      if (
        Phaser.Geom.Rectangle.ContainsRect(
          greyBall.getBounds(),
          this.owner.getBounds(),
        )
      ) {
        (gameObject.scene as GameplaySceneInterface).matter.world.add(gameObject.constraint);
        gameObject.hasConstraint = true;
        gameObject.launched = false;
        return;
      }

      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED,
      );

      gameObject.removeInteractive();
      this.dragStartedAt = new Date();

      // @HACK: This assumer the owner is a player, and is here just for those
      // trick levels where the owner needs to overlay the HUD.
      this.owner.overrideDepth();

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
    const timeDiff = now.getTime() - this.checkImmobileTime.getTime();

    if (timeDiff > IMMOBILE_CHECK_PERIOD) {
      this.checkImmobileTime = new Date();

      // @HACK: Because of level where balls fall like rain, we consider that every time
      // a RandomPosition behaviour exists, we do not check those sprites
      const hasRandomPosition = ComponentManager.GetComponents().some(
        (c) => c instanceof RandomPosition,
      );
      const sprites = hasRandomPosition
        ? [this.owner]
        : [...SpriteManager.GetBalls(), this.owner];

      areSpritesInactive = sprites.every(
        (ball) => isSpriteImmobile(ball) || isOutsideWorld(ball),
      );

      if (!areSpritesInactive) {
        this.previousX = this.owner.x;
      }
    }

    const levelExpired = this.dragStartedAt ? now.getTime() - this.dragStartedAt.getTime() > LEVEL_TIMEOUT : false;

    if (levelExpired || areSpritesInactive) {
      if ((this.owner.scene as GameplaySceneInterface).getStatus() === GameplaySceneStatus.PLAY) {
        this.owner.isDead = true;
        this.owner.scene.time.delayedCall(DEATH_DELAY, () => this.kill());
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
    // increase the hit area a bit.
    const scale =
      DRAGGABLE_SCALE_CIRCLE_CONSTANT +
      DRAGGABLE_SCALE_CIRCLE_MULTIPLIER / this.owner.scale;
    if (
      (this.owner.getData("name") as string).startsWith("ball") ||
      (this.owner.getData("name") as string).startsWith("drop")
    ) {
      this.owner.setInteractive(
        new Phaser.Geom.Circle(
          this.owner.width / 2,
          this.owner.height / 2,
          scale,
        ),
        Phaser.Geom.Circle.Contains,
      );
    } else if (
      (this.owner.getData("name") as string).startsWith("table") ||
      (this.owner.getData("name") as string).startsWith("cup")
    ) {
      const draggableWidth = this.owner.width * DRAGGABLE_SCALE_MULTIPLIER_X;
      const draggableHeight = (this.owner.getData("name") as string).startsWith("table")
        ? this.owner.height * DRAGGABLE_SCALE_MULTIPLIER_Y
        : this.owner.height * DRAGGABLE_SCALE_MULTIPLIER_X;
      const diffX = draggableWidth - this.owner.width;
      const diffY = draggableHeight - this.owner.height;
      this.owner.setInteractive(
        new Phaser.Geom.Rectangle(
          -diffX / 2,
          -diffY / 2,
          draggableWidth,
          draggableHeight,
        ),
        Phaser.Geom.Rectangle.Contains,
      );
    } else {
      this.owner.setInteractive({ draggable: true });
    }
    this.scene.input.setDraggable(this.owner);
  }

  reset(): void {
    this.setInteractive();

    this.owner.setStatic(true);
    this.owner.x = this.owner.startPos.x;
    this.owner.y = this.owner.startPos.y;
    this.owner.rotation = this.angleRad;
    this.owner.launched = false;
    this.owner.overrideDepth(true);

    SpriteManager.ResetPositions();
  }
}
