import * as constants from "./constants";
import BitDrops from "./component/BitDrops";
import { GameplaySceneStatus } from "./scene/GameplayScene";
import { getCompletedLevels, getLevelByNumber, getStorageRoot } from "./utils";

const BALL_CUP_COLLISION_PERIOD = 200;
const BALL_BALL_COLLISION_PERIOD = 200;
const BALL_TABLE_COLLISION_PERIOD = 50;
const SUCCESS_POPUP_DELAY = 2000;

let ballCupCollisionTime = new Date();
let ballBallCollisionTime = new Date();
let ballTableCollisionTime = new Date();

export function initCollisions(scene, player): void {
  const bitDrops = new BitDrops(scene);
  const cupBounceSound = scene.sound.add("cup_bounce");
  const tableBounceSound = scene.sound.add("bounce_table");
  const ballBallBounceSound = scene.sound.add("bounce_ball_ball");

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
          camera.shake(180, 0.015);

          const currentLevelNumber = scene.levelNumber;
          const root = getStorageRoot();
          const completedLevels = root[constants.LOCAL_STORAGE_LEVELS] || {};
          const level = getLevelByNumber(currentLevelNumber);
          const levelName = level.name;

          if (
            !(levelName in completedLevels) ||
            (levelName in completedLevels &&
              completedLevels[levelName].lives < player.livesNumber)
          ) {
            completedLevels[levelName] = { lives: player.livesNumber };
            localStorage.setItem(
              constants.LOCAL_STORAGE_ROOT,
              JSON.stringify(root)
            );
          }

          scene.setStatus(GameplaySceneStatus.COMPLETE);

          scene.time.delayedCall(
            SUCCESS_POPUP_DELAY,
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
          const timeDiff = new Date() - ballCupCollisionTime;
          if (timeDiff > BALL_CUP_COLLISION_PERIOD) {
            cupBounceSound.play();
          }
          ballCupCollisionTime = new Date();
        } else if (
          [bodyAName, bodyBName].some((name) => name.startsWith("table"))
        ) {
          const timeDiff = new Date() - ballTableCollisionTime;
          if (timeDiff > BALL_TABLE_COLLISION_PERIOD) {
            tableBounceSound.play();
          }
          ballTableCollisionTime = new Date();
          player.touchesTable = true;
        } else if (
          [bodyAName, bodyBName].every((name) => name.startsWith("ball"))
        ) {
          const timeDiff = new Date() - ballBallCollisionTime;
          if (timeDiff > BALL_BALL_COLLISION_PERIOD) {
            ballBallBounceSound.play();
          }
          ballBallCollisionTime = new Date();
        }
      }
    }
  });
}
