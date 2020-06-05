import * as constants from "./constants";
import BitDrops from "./component/BitDrops";
import { GameplaySceneStatus } from "./scene/GameplayScene";

const COLLISION_PERIOD = 200;
const LEVEL_MENU_DELAY = 3000;

let collisionTime = new Date();

export function initCollisions(scene, player): void {
  const bitDrops = new BitDrops(scene);
  const cupBounceSound = scene.sound.add("cup_bounce");
  const tableBounceSound = scene.sound.add("table_bounce");

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
          ].some((name) => name.startsWith("ball_white"))
        ) {
          const cup = [bodyA, bodyB].find((body) =>
            body.gameObject.getData("name").startsWith("cup")
          ).gameObject;
          const ball = [bodyA, bodyB].find((body) =>
            body.gameObject.getData("name").startsWith("ball_white")
          ).gameObject;

          scene.sound.play("splash");

          const { x, y, rotation } = cup;
          bitDrops.spill(x, y, rotation);

          const camera = scene.cameras.main;
          camera.shake(160, 0.004);

          const currentLevel = scene.levelNumber;
          const completedLevels =
            JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || {};
          if (
            !(currentLevel in completedLevels) ||
            (currentLevel in completedLevels &&
              completedLevels[currentLevel] < player.livesNumber)
          ) {
            completedLevels[currentLevel] = player.livesNumber;
            localStorage.setItem(
              constants.LOGAL_STORAGE_KEY,
              JSON.stringify(completedLevels)
            );
          }

          scene.setStatus(GameplaySceneStatus.COMPLETE);

          scene.time.delayedCall(
            LEVEL_MENU_DELAY,
            () => {
              // DO not attach this to player
              scene.complete();
            },
            null,
            null
          );

          cup.setStatic(true);
          ball.setStatic(true);
          ball.setVisible(false);
        }
      } else {
        const bodyAName = bodyA.gameObject.getData("name");
        const bodyBName = bodyB.gameObject.getData("name");

        if ([bodyAName, bodyBName].some((name) => name.startsWith("drop"))) {
          continue;
        }

        if ([bodyAName, bodyBName].some((name) => name.startsWith("cup"))) {
          const timeDiff = new Date() - collisionTime;
          if (timeDiff > COLLISION_PERIOD) {
            cupBounceSound.play();
          }
          collisionTime = new Date();
          continue;
        }

        if ([bodyAName, bodyBName].some((name) => name.startsWith("table"))) {
          tableBounceSound.play();

          player.touchesTable = true;
        }
      }
    }
  });
}
