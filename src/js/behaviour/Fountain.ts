import Phaser from "phaser";
import * as constants from "../constants";
import { SpriteManager } from "../sprite/SpriteManager";

const EMITTER_OFFSET = 24;
const MULTI = 1.3;

export class Fountain {
  owner: Phaser.Physics.Matter.Sprite;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, owner: Phaser.Physics.Matter.Sprite) {
    this.owner = owner;
    const balls = [...SpriteManager.GetBalls(), SpriteManager.GetPlayer()]
      .filter((ball): ball is Phaser.Physics.Matter.Sprite => ball !== undefined);

    const matterScene = scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics };

    const source = {
      contains: (x: number, y: number): boolean => {
        const ball = balls.filter((b) => {
          return b.body && matterScene.matter.containsPoint(b.body as MatterJS.BodyType, x, y);
        })[0];
        if (ball) {
          const angle = owner.angle - 90;
          const rotation = Phaser.Math.DegToRad(angle);
          const speed = 0.017;
          const beerVelocity = new Phaser.Math.Vector2(
            Math.cos(rotation) * speed,
            Math.sin(rotation) * speed,
          );
          const ballVelocity = new Phaser.Math.Vector2(
            (ball.body as MatterJS.BodyType).velocity.x,
            (ball.body as MatterJS.BodyType).velocity.y,
          );
          const newVelocity = ballVelocity.add(beerVelocity);
          ball.setVelocity(newVelocity.x, newVelocity.y);

          const fountainCollidedAt = ball.getData("fountain_collided_at") as Date | undefined;
          const fountainDuration = (ball.getData("fountain_duration") as number) || 0;
          const now = new Date();
          const timeDiff = fountainCollidedAt ? now.getTime() - fountainCollidedAt.getTime() : Infinity;
          let newDuration = 0;

          if (timeDiff < constants.FOUNTAIN_TIME_DIFF) {
            newDuration = fountainDuration + timeDiff;
          }

          ball.setData("fountain_collided_at", now);
          ball.setData("fountain_duration", newDuration);
        }
        return false;
      },
    };

    // Phaser 4: create emitter directly as a game object
    const angle = owner.angle - 90;
    this.emitter = scene.add.particles(0, 0, constants.TEXTURE_ATLAS, {
      frame: ["drop_dark", "drop_light"],
      alpha: { start: 1, end: 0, ease: "Quint.easeIn" },
      speed: { min: 200 * MULTI, max: 300 * MULTI },
      angle: { min: angle - EMITTER_OFFSET, max: angle + EMITTER_OFFSET },
      accelerationY: 500,
      lifespan: { min: 500, max: 700 },
      quantity: 20,
      emitting: false,
      follow: owner,
      deathZone: { type: "onEnter", source: source },
    });
    this.emitter.setDepth(10);

    this.emitter.start();
  }

  update(): void {
    const angle = this.owner.angle - 90;
    // Directly update the angle op's start/end range since setEmitterAngle's
    // onChange only updates 'current', not the min/max range used by method 6.
    const angleOp = this.emitter.ops.angle;
    angleOp.start = angle - EMITTER_OFFSET;
    angleOp.end = angle + EMITTER_OFFSET;
  }
}
