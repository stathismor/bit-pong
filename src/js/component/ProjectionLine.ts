import * as constants from "../constants";

const MAX_PROJECTION_POINTS = 30;
const PROJECTION_LINE_LENGTH = 500;
const SKIP_UPDATE_NUM = 2;

export default class ProjectionLine {
  constructor(scene, x, y, speed, dragLength, container, player) {
    this.projectionPointsGroup = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "projection_point",
      repeat: MAX_PROJECTION_POINTS,
      active: false,
      visible: false,
    });
    this.hiddenPlayer = scene.matter.add.sprite(x, y, null, null, {
      visible: false,
    });
    this.hiddenPlayer.setVisible(false);
    this.hiddenPlayer.setStatic(true);
    this.hideHiddenPlayer(); // Needs to be done here because it interacts with constraint

    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      this.updateProjectionPoints(
        gameObject,
        dragX,
        dragY,
        speed,
        x,
        y,
        container,
        player
      );
    });

    scene.input.on("dragend", () => {
      this.projectionPointsGroup.children.each((point) => {
        point.setVisible(false);
        point.setActive(false);
      });
    });
  }

  updateProjectionPoints(
    gameObject,
    dragX,
    dragY,
    speed,
    startX,
    startY,
    container,
    player
  ): void {
    this.projectionPointsGroup.children.each((point) => {
      point.setVisible(false);
      point.setActive(false);
    });

    // @TODO: Skip check after a certain distance
    // const fromStartDistance = Phaser.Math.Distance.Between(
    //   startX,
    //   startY,
    //   gameObject.x,
    //   gameObject.y
    // );

    if (
      Phaser.Geom.Rectangle.ContainsRect(
        container.getBounds(),
        player.getBounds()
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

    this.hiddenPlayer.body.force.y = 0;
    this.hiddenPlayer.body.force.x = 0;
    this.hiddenPlayer.setVelocity(
      (startX - gameObject.x) * speed,
      (startY - gameObject.y) * speed
    );

    const projectionLineData = [
      {
        x: [this.hiddenPlayer.x],
        y: [this.hiddenPlayer.y],
      },
    ];
    let projectionLineLength = 0;
    let updateCounter = 0;
    do {
      updateCounter += 1;
      this.hiddenPlayer.body.force.y +=
        this.hiddenPlayer.body.mass * 0.8 * 0.001; // gravityScale;

      // Run matterjs engine's update on our body
      Phaser.Physics.Matter.Matter.Body.update(
        this.hiddenPlayer.body,
        16.666666666666668 * constants.TIME_SCALE,
        1,
        1
      );

      this.hiddenPlayer.body.force.x = 0;
      this.hiddenPlayer.body.force.y = 0;
      this.hiddenPlayer.body.torque = 0;

      if (updateCounter >= SKIP_UPDATE_NUM) {
        const ballUpdateDistance = Phaser.Math.Distance.Between(
          previousPos.x,
          previousPos.y,
          this.hiddenPlayer.x,
          this.hiddenPlayer.y
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
      const projectionPoint = this.projectionPointsGroup.getFirstDead();
      if (projectionPoint) {
        projectionPoint.x = point.x;
        projectionPoint.y = point.y;
        projectionPoint.setVisible(true);
        projectionPoint.setActive(true);
      }
    }
  }

  hideHiddenPlayer(): void {
    // HACK: Move the object further away, to use it later (cannot find away to temporarily remove)
    this.hiddenPlayer.x = this.hiddenPlayer.scene.sys.game.CONFIG.width * 2;
    this.hiddenPlayer.y = this.hiddenPlayer.scene.sys.game.CONFIG.height * 2;
  }
}
