import BEHAVIOUR_MAPPER from "../behaviour";
import * as constants from "../constants";
import BitDrops from "../component/BitDrops";
import SetBody from "../behaviour/SetBody";

const COLLISION_PERIOD = 200;
const LEVEL_MENU_DELAY = 3000;

export default class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, angleRad, ballIds, behaviourNames) {
    super(scene.matter.world, x, y, constants.TEXTURE_ATLAS, "cup");

    this.behaviours = [SetBody(scene, this, "cup", x, y, angleRad, true)];

    this.behaviours = [];
    if (behaviourNames) {
      behaviourNames.forEach((behaviourName) =>
        this.behaviours.push(new BEHAVIOUR_MAPPER[behaviourName](scene, this))
      );
    }
    let collisionTime = new Date();

    const bitDrops = new BitDrops(scene);

    this.setFriction(0);
    this.setStatic(true);
    this.setBounce(0.6);

    scene.matter.world.on("collisionstart", (event, firstBodyA, firstBodyB) => {
      const { pairs } = event;

      for (let i = 0; i < pairs.length; i += 1) {
        //  We only want sensor collisions
        if (pairs[i].isSensor) {
          const currentLevel = scene.levelNumber;
          const completedLevels =
            JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || [];

          if (ballIds.includes(firstBodyA.id)) {
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

      const partIds = this.body.parts.map((part) => part.id);
      if (
        [firstBodyA.id, firstBodyB.id].some((r) => ballIds.includes(r)) &&
        [firstBodyA.id, firstBodyB.id].some((r) => partIds.includes(r))
      ) {
        const timeDiff = new Date() - collisionTime;
        if (timeDiff > COLLISION_PERIOD) {
          this.scene.sound.play("cup_bounce");
        }
        collisionTime = new Date();
      }
    });
  }

  update(delta) {
    this.behaviours.forEach((behaviour) => behaviour.update(delta));
  }
}
