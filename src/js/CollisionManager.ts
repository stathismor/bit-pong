import * as constants from "./constants";
import BitDrops from "./component/BitDrops";
import { GameplaySceneStatus } from "./scene/GameplayScene";
import { getLevelByNumber, getStorageRoot } from "./utils";

const BALL_CUP_COLLISION_PERIOD = 200;
const BALL_BALL_COLLISION_PERIOD = 200;
const BALL_TABLE_COLLISION_PERIOD = 50;
const SUCCESS_POPUP_DELAY = 2000;

let ballCupCollisionTime = new Date();
let ballBallCollisionTime = new Date();
let ballTableCollisionTime = new Date();

interface GameplayScene extends Phaser.Scene {
  levelNumber: number;
  setStatus(status: GameplaySceneStatus): void;
  complete(): void;
  matter: Phaser.Physics.Matter.MatterPhysics;
}

interface PlayerSprite extends Phaser.Physics.Matter.Sprite {
  livesNumber: number;
  touchesTable: boolean;
}

export function initCollisions(scene: GameplayScene, player: PlayerSprite): void {
  const bitDrops = new BitDrops(scene);
  const cupBounceSound = scene.sound.add("cup_bounce");
  const tableBounceSound = scene.sound.add("bounce_table");
  const ballBallBounceSound = scene.sound.add("bounce_ball_ball");

  scene.matter.world.on("collisionstart", (event: { pairs: MatterJS.ICollisionPair[] }) => {
    const { pairs } = event;

    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;

      if (pair.isSensor) {
        const goA = (bodyA as MatterJS.BodyType & { gameObject: Phaser.Physics.Matter.Sprite }).gameObject;
        const goB = (bodyB as MatterJS.BodyType & { gameObject: Phaser.Physics.Matter.Sprite }).gameObject;
        if (!goA || !goB) continue;

        if (
          [goA.getData("name"), goB.getData("name")].some((name: string) => name.startsWith("cup")) &&
          [goA.getData("name"), goB.getData("name")].some((name: string) => name.startsWith("ball_white"))
        ) {
          const cup = [{ body: bodyA, go: goA }, { body: bodyB, go: goB }].find((b) =>
            (b.go.getData("name") as string).startsWith("cup"),
          )!.go;
          const ball = [{ body: bodyA, go: goA }, { body: bodyB, go: goB }].find((b) =>
            (b.go.getData("name") as string).startsWith("ball_white"),
          )!.go;

          scene.sound.play("splash");

          const { x, y, rotation } = cup;
          bitDrops.spill(x, y, rotation);

          const camera = scene.cameras.main;
          camera.shake(180, 0.015);

          const currentLevelNumber = scene.levelNumber;
          const root = getStorageRoot();
          const completedLevels = (root[constants.LOCAL_STORAGE_LEVELS] || {}) as Record<string, { lives: number }>;
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
              JSON.stringify(root),
            );
          }

          scene.setStatus(GameplaySceneStatus.COMPLETE);

          scene.time.delayedCall(SUCCESS_POPUP_DELAY, () => {
            scene.complete();
          });

          cup.setStatic(true);
          ball.setStatic(true);
          ball.setVisible(false);
        }
      } else {
        const goA = (bodyA as MatterJS.BodyType & { gameObject: Phaser.Physics.Matter.Sprite }).gameObject;
        const goB = (bodyB as MatterJS.BodyType & { gameObject: Phaser.Physics.Matter.Sprite }).gameObject;
        if (!goA || !goB) continue;

        const bodyAName = goA.getData("name") as string;
        const bodyBName = goB.getData("name") as string;

        if ([bodyAName, bodyBName].some((name) => name.startsWith("drop"))) {
          continue;
        }

        if ([bodyAName, bodyBName].some((name) => name.startsWith("cup"))) {
          const timeDiff = new Date().getTime() - ballCupCollisionTime.getTime();
          if (timeDiff > BALL_CUP_COLLISION_PERIOD) {
            cupBounceSound.play();
          }
          ballCupCollisionTime = new Date();
        } else if (
          [bodyAName, bodyBName].some((name) => name.startsWith("table"))
        ) {
          const timeDiff = new Date().getTime() - ballTableCollisionTime.getTime();
          if (timeDiff > BALL_TABLE_COLLISION_PERIOD) {
            tableBounceSound.play();
          }
          ballTableCollisionTime = new Date();
          player.touchesTable = true;
        } else if (
          [bodyAName, bodyBName].every((name) => name.startsWith("ball"))
        ) {
          const timeDiff = new Date().getTime() - ballBallCollisionTime.getTime();
          if (timeDiff > BALL_BALL_COLLISION_PERIOD) {
            ballBallBounceSound.play();
          }
          ballBallCollisionTime = new Date();
        }
      }
    }
  });
}
