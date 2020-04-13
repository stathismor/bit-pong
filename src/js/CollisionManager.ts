import * as constants from "./constants";
import BitDrops from "./component/BitDrops";

const COLLISION_PERIOD = 200;
const LEVEL_MENU_DELAY = 3000;

let collisionTime = new Date();

export function initCollisions(scene): void {
  const bitDrops = new BitDrops(scene);

  scene.matter.world.on("collisionstart", (event, bodyA1, bodyB1) => {
    const { pairs } = event;

    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;

      if (pair.isSensor) {
        if (
          [
            bodyA.gameObject.getData("isPlayer"),
            bodyB.gameObject.getData("isPlayer"),
          ].some((isPlayer) => isPlayer)
        ) {
          const currentLevel = scene.levelNumber;
          const completedLevels =
            JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || [];

          const player = [bodyA, bodyB].find(
            (body) => body.gameObject.getData("isPlayer") === true
          ).gameObject;
          const cup = [bodyA, bodyB].find((body) =>
            body.gameObject.getData("name").startsWith("cup")
          ).gameObject;
          const ball = [bodyA, bodyB].find((body) =>
            body.gameObject.getData("name").startsWith("ball")
          ).gameObject;

          scene.sound.play("splash");

          const { x, y, rotation } = cup;
          bitDrops.spill(x, y, rotation);

          if (player.getData("name") === ball.getData("name")) {
            player.isDead = true;
            player.destroy();
          }

          if (!completedLevels.includes(currentLevel)) {
            localStorage.setItem(
              constants.LOGAL_STORAGE_KEY,
              JSON.stringify([currentLevel, ...completedLevels])
            );
          }

          scene.time.delayedCall(
            LEVEL_MENU_DELAY,
            () => cup.emit("complete"),
            null,
            null
          );
        }
      } else {
        if (
          [
            bodyA.gameObject.getData("name"),
            bodyB.gameObject.getData("name"),
          ].some((name) => name.startsWith("drop"))
        ) {
          return;
        }

        if (
          [
            bodyA.gameObject.getData("name"),
            bodyB.gameObject.getData("name"),
          ].some((name) => name.startsWith("cup"))
        ) {
          const timeDiff = new Date() - collisionTime;
          if (timeDiff > COLLISION_PERIOD) {
            scene.sound.play("cup_bounce");
          }
          collisionTime = new Date();
          return;
        }

        if (
          [
            bodyA.gameObject.getData("name"),
            bodyB.gameObject.getData("name"),
          ].some((name) => name.startsWith("table"))
        ) {
          scene.sound.play("table_bounce");

          // Should not access player like that
          const player = [bodyA, bodyB].find(
            (body) => body.gameObject.getData("isPlayer") === true
          ).gameObject;
          player.touchesTable = true;
        }
      }
    }
  });
}
