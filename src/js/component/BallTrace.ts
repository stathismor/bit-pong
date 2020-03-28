/* eslint-disable no-param-reassign */
import * as constants from "../constants";

const BALL_TRACE_DISTANCE = 30;

export default class BallTrace {
  constructor(scene, ball) {
    this.scene = scene;
    this.ball = ball;
    this.prevBallTracePos = { x: ball.x, y: ball.y };

    this.ballTraceGroup = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "ball",
      repeat: 12,
      active: false,
      visible: false,
    });
  }

  update() {
    if (
      this.ball.launched &&
      this.ball.body.speed > 3 &&
      Phaser.Math.Distance.Between(
        this.prevBallTracePos.x,
        this.prevBallTracePos.y,
        this.ball.x,
        this.ball.y
      ) > BALL_TRACE_DISTANCE
    ) {
      const ballTrace = this.ballTraceGroup.getFirstDead();
      if (ballTrace) {
        ballTrace.x = this.ball.x;
        ballTrace.y = this.ball.y;
        ballTrace.setActive(true);
        ballTrace.setVisible(true);

        this.scene.tweens.add({
          targets: ballTrace,
          ease: "Sine.easeOut",
          duration: 550,
          delay: 0,
          pause: false,
          onComplete: BallTrace.onComplete,
          alpha: {
            getStart: () => 0.17,
            getEnd: () => 0,
          },
        });
        this.prevBallTracePos = { x: this.ball.x, y: this.ball.y };
      }
    }
  }

  static onComplete(tween) {
    const target = tween.targets[0];
    target.setVisible(false);
    target.setActive(false);
  }
}
