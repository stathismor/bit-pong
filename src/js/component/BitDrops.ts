import Phaser from "phaser";
import { cupCategory, tableCategory, dropCategory } from "../collision";
import { uuidv4 } from "../utils";
import * as constants from "../constants";

const DROPS_COUNT = 80;
const DROP_ROTATION_OFFSET = 0.35;
const MULTI = 1.5;
const DROP_VELOCITY = 5 * MULTI;
const DROP_VELOCITY_OFFSET = 1;
const DROP_POSITION_OFFSET_X = 24;
const DROP_POSITION_OFFSET_Y = 12;
const EMITTER_OFFSET = 35;

export default class BitDrops {
  drops: Phaser.Physics.Matter.Sprite[];
  scene: Phaser.Scene;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.drops = [];
    this.scene = scene;
    const dropTextures = ["drop_light", "drop_dark"];
    const config = (scene.sys.game as GameWithConfig).CONFIG;
    for (let i = 0; i < DROPS_COUNT; i += 1) {
      const dropTexture = dropTextures[Phaser.Math.Between(0, 1)];
      const drop = (scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics }).matter.add.sprite(
        config.width * 2,
        config.height * 2,
        constants.TEXTURE_ATLAS,
        dropTexture,
        { shape: { type: "rectangle", radius: 8 }, ignorePointer: true },
      );
      drop.setData("name", "drop_" + uuidv4());
      drop.setCollisionCategory(dropCategory);
      drop.setCollidesWith([tableCategory]);
      drop.setActive(false);
      drop.setStatic(true);
      this.drops[i] = drop;
    }

    // Phaser 4: scene.add.particles returns a ParticleEmitter directly
    const initAngle = Phaser.Math.RadToDeg(0.34) - 90;
    this.emitter = scene.add.particles(400, 160, constants.TEXTURE_ATLAS, {
      frame: ["drop_dark", "drop_light"],
      alpha: { start: 1, end: 0, ease: "Quint.easeIn" },
      speed: { min: 290 * MULTI, max: 320 * MULTI },
      angle: { min: initAngle - EMITTER_OFFSET, max: initAngle + EMITTER_OFFSET },
      accelerationY: 800,
      lifespan: { min: 500, max: 700 },
      quantity: 10,
      maxParticles: 50,
      emitting: false,
    });

    scene.events.once("shutdown", () => this.emitter.destroy());
  }

  emitParticles(x: number, y: number, rotation: number): void {
    this.emitter.setPosition(x, y);
    const angle = Phaser.Math.RadToDeg(rotation) - 90;
    // Directly update the angle op's start/end range since setEmitterAngle's
    // onChange only updates 'current', not the min/max range used by method 6.
    const angleOp = this.emitter.ops.angle;
    angleOp.start = angle - EMITTER_OFFSET;
    angleOp.end = angle + EMITTER_OFFSET;
    this.emitter.start();
  }

  spill(x: number, y: number, rotation: number): void {
    this.emitParticles(x, y, rotation);

    const dropStartPosY = y - 16;
    this.drops.forEach((drop) => {
      drop.setActive(true);
      drop.setStatic(false);
      drop.x = Phaser.Math.FloatBetween(
        x - DROP_POSITION_OFFSET_X,
        x + DROP_POSITION_OFFSET_X,
      );
      drop.y = Phaser.Math.FloatBetween(
        dropStartPosY,
        dropStartPosY - DROP_POSITION_OFFSET_Y,
      );
      const dropX =
        Math.sin(
          Phaser.Math.FloatBetween(
            rotation - DROP_ROTATION_OFFSET,
            rotation + DROP_ROTATION_OFFSET,
          ),
        ) *
        Phaser.Math.FloatBetween(
          DROP_VELOCITY - DROP_VELOCITY_OFFSET,
          DROP_VELOCITY + DROP_VELOCITY_OFFSET,
        );
      const dropY =
        -Math.cos(
          Phaser.Math.FloatBetween(
            rotation - DROP_ROTATION_OFFSET,
            rotation + DROP_ROTATION_OFFSET,
          ),
        ) *
        Phaser.Math.FloatBetween(
          DROP_VELOCITY - DROP_VELOCITY_OFFSET,
          DROP_VELOCITY + DROP_VELOCITY_OFFSET,
        );

      drop.setVelocity(dropX, dropY);
      this.scene.time.delayedCall(25, () =>
        drop.setCollidesWith([tableCategory, cupCategory]),
      );
    });
  }
}
