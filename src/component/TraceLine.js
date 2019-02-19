/* eslint-disable no-param-reassign */

const TRACE_POINTS_DISTANCE = 30;
const TRACE_ALPHA = 0.25;
const TRACE_FADE_OUT_DURARION = 600;

export default class TraceLine {
  constructor(scene, ball) {
    this.ball = ball;
    this.previousTracePos = { x: ball.x, y: ball.y };

    let fadeOutTween = null;

    this.tracePointsGroup = scene.add.group({
      key: 'trace_point',
      repeat: 140,
      active: false,
      visible: false,
    });

    const context = this;
    scene.input.on('dragstart', (pointer, gameObject) => {
      const points = context.tracePointsGroup.children.entries.filter(
        point => point.active
      );
      if (points.length) {
        if (fadeOutTween) {
          fadeOutTween.stop();
        }
        fadeOutTween = gameObject.scene.add.tween({
          targets: points,
          ease: 'Sine.easeOut',
          duration: TRACE_FADE_OUT_DURARION,
          delay: 0,
          alpha: {
            getStart: () => 1,
            getEnd: () => TRACE_ALPHA,
          },
        });
      }
    });

    scene.input.on('dragend', () => {
      // Remove previous attempt's trace points
      // TODO: Need to stop the previous tween, this is a race condition.
      context.tracePointsGroup.children.each(point => {
        point.setVisible(false);
        point.setActive(false);
        point.alpha = 1;
      });
    });
  }

  update() {
    if (
      this.ball.launched &&
      Phaser.Math.Distance.Between(
        this.previousTracePos.x,
        this.previousTracePos.y,
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

        this.previousTracePos = { x: this.ball.x, y: this.ball.y };
      }
    }
  }
}
