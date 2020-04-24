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
            bodyA.gameObject.getData("name"),
            bodyB.gameObject.getData("name"),
          ].some((name) => name.startsWith("cup")) &&
          [
            bodyA.gameObject.getData("name"),
            bodyB.gameObject.getData("name"),
          ].some((name) => name.startsWith("ball"))
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

          if (!completedLevels.includes(currentLevel)) {
            localStorage.setItem(
              constants.LOGAL_STORAGE_KEY,
              JSON.stringify([currentLevel, ...completedLevels])
            );
          }

          player.isDead = true;
          scene.time.delayedCall(
            LEVEL_MENU_DELAY,
            () => {
              player.emit("complete");
            },
            null,
            null
          );
          cup.setStatic(true);
          ball.setStatic(true);
          ball.setVisible(false);
        }
      } else {
        if (
          [
            bodyA.gameObject.getData("name"),
            bodyB.gameObject.getData("name"),
          ].some((name) => name.startsWith("drop"))
        ) {
          continue;
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
          continue;
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
          );
          if (player && player.gameObject) {
            player.gameObject.touchesTable = true;
          }
        }
      }
    }
  });
}
