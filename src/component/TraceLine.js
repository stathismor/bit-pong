/* eslint-disable no-param-reassign */

const TRACE_POINTS_DISTANCE = 30;
const TRACE_ALPHA = 0.25;
const TRACE_FADE_OUT_DURARION = 600;

export default class TraceLine {
  constructor(scene, ball, offset) {
    this.ball = ball;
    this.previousTracePos = { x: ball.x, y: ball.y };

    this.launched = false;
    let fadeOutTween = null;

    this.tracePointsGroup = scene.add.group({
      key: 'trace_point',
      repeat: 140,
      active: false,
      visible: false,
    });

    const context = this;
    scene.input.on('dragstart', (pointer, gameObject) => {
      context.launched = false;
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
            getStart: () => points[0].alpha,
            getEnd: () => TRACE_ALPHA,
          },
        });
      }
    });

    scene.input.on('dragend', (pointer, gameObject) => {
      const fromStartDistance = Phaser.Math.Distance.Between(
        ball.startPos.x,
        ball.startPos.y,
        gameObject.x,
        gameObject.y
      );

      if (fromStartDistance < offset) {
        return;
      }

      context.launched = true;

      context.tracePointsGroup.children.each(point => {
        point.setVisible(false);
        point.setActive(false);
        point.alpha = 1;
      });
    });
  }

  update() {
    if (
      this.launched &&
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
