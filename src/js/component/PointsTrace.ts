/* eslint-disable no-param-reassign */
import * as constants from "../constants";

const TRACE_POINTS_DISTANCE = 30;
const TRACE_ALPHA = 0.25;
const TRACE_FADE_OUT_DURARION = 600;

export default class PointsTrace {
  constructor(scene, ball, container, player) {
    this.ball = ball;
    this.prevTracePos = { x: ball.x, y: ball.y };

    this.launched = false;
    let fadeOutTween = null;

    this.tracePointsGroup = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "trace_point",
      repeat: 140,
      active: false,
      visible: false,
    });

    scene.input.on("dragstart", (pointer, gameObject) => {
      this.launched = false;
      const points = this.tracePointsGroup.children.entries.filter(
        (point) => point.active
      );
      if (points.length) {
        if (fadeOutTween) {
          fadeOutTween.stop();
        }
        fadeOutTween = gameObject.scene.add.tween({
          targets: points,
          ease: "Sine.easeOut",
          duration: TRACE_FADE_OUT_DURARION,
          delay: 0,
          alpha: {
            getStart: (): void => points[0].alpha,
            getEnd: (): void => TRACE_ALPHA,
          },
        });
      }
    });

    scene.input.on("dragend", () => {
      if (
        Phaser.Geom.Rectangle.ContainsRect(
          container.getBounds(),
          player.getBounds()
        )
      ) {
        return;
      }

      this.launched = true;

      this.tracePointsGroup.children.each((point) => {
        point.setVisible(false);
        point.setActive(false);
        point.alpha = 1;
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
        this.ball.y
      ) > TRACE_POINTS_DISTANCE
    ) {
      const tracePoint = this.tracePointsGroup.getFirstDead();
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
