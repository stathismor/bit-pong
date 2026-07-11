import Phaser from "phaser";
import * as constants from "../constants";

const MAX_PROJECTION_POINTS = 30;
const PROJECTION_LINE_LENGTH = 500;
const SKIP_UPDATE_NUM = 2;

export default class ProjectionLine {
  projectionPointsGroup: Phaser.GameObjects.Group;
  hiddenPlayer: Phaser.Physics.Matter.Sprite;
  matterScene: Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics };

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number, _dragLength: number, container: Phaser.GameObjects.Image, player: Phaser.Physics.Matter.Sprite) {
    this.matterScene = scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics };
    const matterScene = this.matterScene;

    this.projectionPointsGroup = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "projection_point",
      repeat: MAX_PROJECTION_POINTS,
      active: false,
      visible: false,
    });
    this.hiddenPlayer = matterScene.matter.add.sprite(x, y, constants.TEXTURE_ATLAS);
    this.hiddenPlayer.setVisible(false);
    this.hiddenPlayer.setStatic(true);
    this.hideHiddenPlayer();

    scene.input.on("drag", (_pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Matter.Sprite) => {
      this.updateProjectionPoints(
        gameObject,
        speed,
        x,
        y,
        container,
        player,
      );
    });

    scene.input.on("dragend", () => {
      this.projectionPointsGroup.getChildren().forEach((point) => {
        (point as Phaser.GameObjects.Image).setVisible(false);
        (point as Phaser.GameObjects.Image).setActive(false);
      });
    });
  }

  updateProjectionPoints(
    gameObject: Phaser.Physics.Matter.Sprite,
    speed: number,
    startX: number,
    startY: number,
    container: Phaser.GameObjects.Image,
    player: Phaser.Physics.Matter.Sprite,
  ): void {
    this.projectionPointsGroup.getChildren().forEach((point) => {
      (point as Phaser.GameObjects.Image).setVisible(false);
      (point as Phaser.GameObjects.Image).setActive(false);
    });

    if (
      Phaser.Geom.Rectangle.ContainsRect(
        container.getBounds(),
        player.getBounds(),
      )
    ) {
      return;
    }

    this.hiddenPlayer.x = gameObject.x;
    this.hiddenPlayer.y = gameObject.y;
    this.hiddenPlayer.setVisible(false);

    this.hiddenPlayer.setStatic(false);
    const previousPos = {
      x: this.hiddenPlayer.x,
      y: this.hiddenPlayer.y,
    };

    const body = this.hiddenPlayer.body as MatterJS.BodyType;
    body.force.y = 0;
    body.force.x = 0;
    this.hiddenPlayer.setVelocity(
      (startX - gameObject.x) * speed,
      (startY - gameObject.y) * speed,
    );

    const projectionLineData: { x: number; y: number }[] = [
      {
        x: this.hiddenPlayer.x,
        y: this.hiddenPlayer.y,
      },
    ];
    let projectionLineLength = 0;
    let updateCounter = 0;
    do {
      updateCounter += 1;
      body.force.y +=
        body.mass * 0.8 * 0.001;

      this.matterScene.matter.body.update(
        body,
        16.666666666666668 * constants.TIME_SCALE,
      );

      body.force.x = 0;
      body.force.y = 0;
      body.torque = 0;

      if (updateCounter >= SKIP_UPDATE_NUM) {
        const ballUpdateDistance = Phaser.Math.Distance.Between(
          previousPos.x,
          previousPos.y,
          this.hiddenPlayer.x,
          this.hiddenPlayer.y,
        );

        projectionLineData.push({
          x: this.hiddenPlayer.x,
          y: this.hiddenPlayer.y,
        });

        previousPos.x = this.hiddenPlayer.x;
        previousPos.y = this.hiddenPlayer.y;

        projectionLineLength += ballUpdateDistance;
        updateCounter = 0;
      }
    } while (projectionLineLength < PROJECTION_LINE_LENGTH);

    this.hideHiddenPlayer();

    for (let index = 0; index < projectionLineData.length - 1; index += 1) {
      const point = projectionLineData[index];
      const projectionPoint = this.projectionPointsGroup.getFirstDead() as Phaser.GameObjects.Image | null;
      if (projectionPoint) {
        projectionPoint.x = point.x;
        projectionPoint.y = point.y;
        projectionPoint.setVisible(true);
        projectionPoint.setActive(true);
      }
    }
  }

  hideHiddenPlayer(): void {
    const config = (this.hiddenPlayer.scene.sys.game as GameWithConfig).CONFIG;
    this.hiddenPlayer.x = config.width * 2;
    this.hiddenPlayer.y = config.height * 2;
  }
}
