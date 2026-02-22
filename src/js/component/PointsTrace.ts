import * as constants from "../constants";

const TRACE_POINTS_DISTANCE = 30;
const TRACE_ALPHA = 0.25;
const TRACE_FADE_OUT_DURARION = 600;

export default class PointsTrace {
  ball: Phaser.Physics.Matter.Sprite;
  prevTracePos: { x: number; y: number };
  launched: boolean;
  tracePointsGroup: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, ball: Phaser.Physics.Matter.Sprite, container: Phaser.GameObjects.Image, player: Phaser.Physics.Matter.Sprite) {
    this.ball = ball;
    this.prevTracePos = { x: ball.x, y: ball.y };

    this.launched = false;
    let fadeOutTween: Phaser.Tweens.Tween | null = null;

    this.tracePointsGroup = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "trace_point",
      repeat: 140,
      active: false,
      visible: false,
    });

    scene.input.on("dragstart", (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
      this.launched = false;
      const points = this.tracePointsGroup.getChildren().filter(
        (point) => point.active,
      );
      if (points.length) {
        if (fadeOutTween) {
          fadeOutTween.stop();
        }
        fadeOutTween = gameObject.scene!.add.tween({
          targets: points,
          ease: "Sine.easeOut",
          duration: TRACE_FADE_OUT_DURARION,
          delay: 0,
          alpha: {
            getStart: (): number => (points[0] as Phaser.GameObjects.Image).alpha,
            getEnd: (): number => TRACE_ALPHA,
          },
        });
      }
    });

    scene.input.on("dragend", () => {
      if (
        Phaser.Geom.Rectangle.ContainsRect(
          container.getBounds(),
          player.getBounds(),
        )
      ) {
        return;
      }

      this.launched = true;

      if (fadeOutTween) {
        fadeOutTween.stop();
      }

      this.tracePointsGroup.getChildren().forEach((point) => {
        (point as Phaser.GameObjects.Image).setVisible(false);
        (point as Phaser.GameObjects.Image).setActive(false);
        (point as Phaser.GameObjects.Image).alpha = 1;
      });
    });
  }

  update(): void {
    if (
      this.launched &&
      Phaser.Math.Distance.Between(
        this.prevTracePos.x,
        this.prevTracePos.y,
        this.ball.x,
        this.ball.y,
      ) > TRACE_POINTS_DISTANCE
    ) {
      const tracePoint = this.tracePointsGroup.getFirstDead() as Phaser.GameObjects.Image | null;
      if (tracePoint) {
        tracePoint.x = this.ball.x;
        tracePoint.y = this.ball.y;
        tracePoint.setActive(true);
        tracePoint.setVisible(true);

        this.prevTracePos = { x: this.ball.x, y: this.ball.y };
      }
    }
  }
}
