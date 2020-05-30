import { cupCategory, tableCategory, dropCategory } from "../collision";
import { uuidv4 } from "../utils";
import * as constants from "../constants";

const DROPS_COUNT = 80;
const DROP_ROTATION_OFFSET = 0.35;
const DROP_VELOCITY = 5;
const DROP_VELOCITY_OFFSET = 1;
const DROP_POSITION_OFFSET_X = 12;
const DROP_POSITION_OFFSET_Y = 6;
const EMITTER_OFFSET = 35;

export default class BitDrops {
  constructor(scene) {
    this.drops = [];
    this.scene = scene;
    const dropTextures = ["drop_light", "drop_dark"];
    const config = scene.sys.game.CONFIG;
    for (let i = 0; i < DROPS_COUNT; i += 1) {
      const dropTexture = dropTextures[Phaser.Math.Between(0, 1)];
      const drop = scene.matter.add.sprite(
        config.width * 2,
        config.height * 2,
        constants.TEXTURE_ATLAS,
        dropTexture,
        { shape: { type: "rectangle", radius: 8 }, ignorePointer: true }
      );
      drop.setData("name", "drop_" + uuidv4());
      drop.setCollisionCategory(dropCategory);
      drop.setCollidesWith([tableCategory]);
      drop.setActive(false);
      drop.setStatic(true);
      this.drops[i] = drop;
    }

    const particles = scene.add.particles(constants.TEXTURE_ATLAS);
    this.emitter = particles.createEmitter({
      alpha: { start: 1, end: 0, ease: "Quint.easeIn" },
      speed: { min: 290, max: 320 },
      accelerationY: 800,
      lifespan: { min: 500, max: 700 },
      quantity: 10,
      maxParticles: 50,
      on: false,
    });
    this.emitter.setFrame(["drop_dark", "drop_light"]);
    this.emitter.setPosition(400, 160);
    const angle = Phaser.Math.RadToDeg(0.34) - 90;
    this.emitter.setAngle({
      min: angle - EMITTER_OFFSET,
      max: angle + EMITTER_OFFSET,
    });

    scene.events.once("shutdown", particles.destroy);
  }

  emitParticles(x, y, rotation): void {
    this.emitter.setPosition(x, y);
    const angle = Phaser.Math.RadToDeg(rotation) - 90;
    this.emitter.setAngle({
      min: angle - EMITTER_OFFSET,
      max: angle + EMITTER_OFFSET,
    });
    this.emitter.start();
  }

  spill(x, y, rotation): void {
    this.emitParticles(x, y, rotation);

    const dropStartPosY = y - 8;
    this.drops.forEach((drop) => {
      const dropTemp = drop;
      dropTemp.setActive(true);
      dropTemp.setStatic(false);
      dropTemp.x = Phaser.Math.FloatBetween(
        x - DROP_POSITION_OFFSET_X,
        x + DROP_POSITION_OFFSET_X
      );
      dropTemp.y = Phaser.Math.FloatBetween(
        dropStartPosY,
        dropStartPosY - DROP_POSITION_OFFSET_Y
      );
      const dropX =
        Math.sin(
          Phaser.Math.FloatBetween(
            rotation - DROP_ROTATION_OFFSET,
            rotation + DROP_ROTATION_OFFSET
          )
        ) *
        Phaser.Math.FloatBetween(
          DROP_VELOCITY - DROP_VELOCITY_OFFSET,
          DROP_VELOCITY + DROP_VELOCITY_OFFSET
        );
      const dropY =
        -Math.cos(
          Phaser.Math.FloatBetween(
            rotation - DROP_ROTATION_OFFSET,
            rotation + DROP_ROTATION_OFFSET
          )
        ) *
        Phaser.Math.FloatBetween(
          DROP_VELOCITY - DROP_VELOCITY_OFFSET,
          DROP_VELOCITY + DROP_VELOCITY_OFFSET
        );

      drop.setVelocity(dropX, dropY);
      this.scene.time.delayedCall(
        25,
        () => drop.setCollidesWith([tableCategory, cupCategory]),
        null,
        null
      );
    });
  }
}
