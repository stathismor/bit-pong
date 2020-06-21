import * as constants from "../constants";
import { SpriteManager } from "../sprite/SpriteManager";

const EMITTER_OFFSET = 24;
const MULTI = 1.3;

export class Fountain {
  constructor(scene, owner) {
    this.owner = owner;
    const balls = [...SpriteManager.GetBalls(), SpriteManager.GetPlayer()];

    const source = {
      contains: (x, y): void => {
        const ball = balls.filter((ball) => {
          return scene.matter.containsPoint(ball.body, x, y);
        })[0];
        if (ball) {
          const angle = owner.angle - 90;
          const rotation = Phaser.Math.DegToRad(angle);
          const speed = 0.017;
          const beerVelocity = new Phaser.Math.Vector2(
            Math.cos(rotation) * speed,
            Math.sin(rotation) * speed
          );
          const ballVelocity = new Phaser.Math.Vector2(
            ball.body.velocity.x,
            ball.body.velocity.y
          );
          const newVelocity = ballVelocity.add(beerVelocity);
          ball.setVelocity(newVelocity.x, newVelocity.y);
        }
      },
    };

    const particles = scene.add.particles(constants.TEXTURE_ATLAS);
    this.emitter = particles.createEmitter({
      alpha: { start: 1, end: 0, ease: "Quint.easeIn" },
      speed: { min: 200 * MULTI, max: 300 * MULTI },
      accelerationY: 500,
      lifespan: { min: 500, max: 700 },
      quantity: 20,
      on: false,
      follow: owner,
      deathZone: { type: "onEnter", source: source },
    });
    this.emitter.setFrame(["drop_dark", "drop_light"]);

    const angle = owner.angle - 90;
    this.emitter.setAngle({
      min: angle - EMITTER_OFFSET,
      max: angle + EMITTER_OFFSET,
    });

    scene.events.once("shutdown", particles.destroy);
    this.emitter.start();
  }

  update(): void {
    const angle = this.owner.angle - 90;
    this.emitter.setAngle({
      min: angle - EMITTER_OFFSET,
      max: angle + EMITTER_OFFSET,
    });
  }
}
