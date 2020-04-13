import BEHAVIOUR_MAPPER from "../behaviour";
import * as constants from "../constants";
import BitDrops from "../component/BitDrops";
import { SetBody } from "../behaviour/SetBody";
import { ComponentManager } from "../behaviour/ComponentManager";

const COLLISION_PERIOD = 200;
const LEVEL_MENU_DELAY = 3000;

export class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, angleRad, ballIds, behaviourNames) {
    super(scene.matter.world, x, y, constants.TEXTURE_ATLAS, "cup");

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, "cup", x, y, angleRad, true)
    );

    if (behaviourNames) {
      behaviourNames.forEach((behaviourName) =>
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviourName](scene, this)
        )
      );
    }

    let collisionTime = new Date();

    const bitDrops = new BitDrops(scene);

    this.setFriction(0);
    this.setStatic(true);
    this.setBounce(0.6);

    scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      const { pairs } = event;
      const partIds = this.body.parts.map((part) => part.id);

      for (let i = 0; i < pairs.length; i += 1) {
        //  We only want sensor collisions
        const pair = pairs[i];
        if (pair.isSensor && partIds.includes(bodyB.id)) {
          const currentLevel = scene.levelNumber;
          const completedLevels =
            JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || [];

          if ([bodyA.id, bodyB.id].some((r) => ballIds.includes(r))) {
            this.scene.sound.play("splash");

            bitDrops.spill(this.x, this.y, this.rotation);

            if (!completedLevels.includes(currentLevel)) {
              localStorage.setItem(
                constants.LOGAL_STORAGE_KEY,
                JSON.stringify([currentLevel, ...completedLevels])
              );
            }
          }

          this.scene.time.delayedCall(
            LEVEL_MENU_DELAY,
            () => this.emit("complete"),
            null,
            null
          );
        }
      }

      if (
        [bodyA.id, bodyB.id].some((r) => ballIds.includes(r)) &&
        [bodyA.id, bodyB.id].some((r) => partIds.includes(r))
      ) {
        const timeDiff = new Date() - collisionTime;
        if (timeDiff > COLLISION_PERIOD) {
          this.scene.sound.play("cup_bounce");
        }
        collisionTime = new Date();
      }
    });
  }
}
