const MAX_PROJECTION_POINTS = 30;
const PROJECTION_LINE_LENGTH = 300;
const SKIP_UPDATE_NUM = 2;

export default class ProjectionLine {
  constructor(scene, x, y, speed) {
    this.projectionPointsGroup = scene.add.group({
      key: 'projection_point',
      repeat: MAX_PROJECTION_POINTS,
      active: false,
      visible: false,
    });
    this.startPos = { x, y };
    this.hiddenBall = scene.matter.add.sprite(x, y, null, null, {
      visible: false,
    });
    this.hiddenBall.setVisible(false);
    this.hiddenBall.setCircle();
    this.hiddenBall.setStatic(true);

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      this.updateProjectionPoints(gameObject, dragX, dragY, speed);
    });
  }

  updateProjectionPoints(gameObject, dragX, dragY, speed) {
    this.hiddenBall.x = gameObject.x;
    this.hiddenBall.y = gameObject.y;
    this.hiddenBall.setVisible(false);
    this.hiddenBall.setCircle();
    this.hiddenBall.setStatic(false);
    const previousPos = {
      x: this.hiddenBall.x,
      y: this.hiddenBall.y,
    };

    this.projectionPointsGroup.children.each(point => {
      point.setVisible(false);
      point.setActive(false);
    });

    this.hiddenBall.body.force.y = 0;
    this.hiddenBall.body.force.x = 0;
    this.hiddenBall.setVelocity(
      (this.startPos.x - dragX) * speed,
      (this.startPos.y - dragY) * speed
    );

    const projectionLineData = [
      {
        x: [this.hiddenBall.x],
        y: [this.hiddenBall.y],
      },
    ];
    let projectionLineLength = 0;
    let updateCounter = 0;
    do {
      updateCounter += 1;
      this.hiddenBall.body.force.y += this.hiddenBall.body.mass * 0.8 * 0.001; // gravityScale;

      // Run matterjs engine's update on our body
      Phaser.Physics.Matter.Matter.Body.update(
        this.hiddenBall.body,
        16.666666666666668,
        1,
        1
      );

      this.hiddenBall.body.force.x = 0;
      this.hiddenBall.body.force.y = 0;
      this.hiddenBall.body.torque = 0;

      if (updateCounter >= SKIP_UPDATE_NUM) {
        const ballUpdateDistance = Phaser.Math.Distance.Between(
          previousPos.x,
          previousPos.y,
          this.hiddenBall.x,
          this.hiddenBall.y
        );

        projectionLineData.push({ x: this.hiddenBall.x, y: this.hiddenBall.y });

        previousPos.x = this.hiddenBall.x;
        previousPos.y = this.hiddenBall.y;

        projectionLineLength += ballUpdateDistance;
        updateCounter = 0;
      }
    } while (projectionLineLength < PROJECTION_LINE_LENGTH);

    // HACK: Move the object further away, to use it later (cannot find away to temporarily remove)
    this.hiddenBall.x = gameObject.scene.sys.game.CONFIG.width * 2;
    this.hiddenBall.y = gameObject.scene.sys.game.CONFIG.height * 2;

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
}
