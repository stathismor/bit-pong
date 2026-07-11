import Phaser from "phaser";
const RANDOM_POSITION_DELAY = 4450;

export class RandomAngle {
  constructor(scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options: { delay?: number }) {
    const delay = options.delay ? options.delay : RANDOM_POSITION_DELAY;

    this.delayedCall(scene, owner, delay);
  }

  delayedCall(scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, delay: number): void {
    scene.time.delayedCall(
      delay,
      () => {
        (owner as Phaser.GameObjects.Sprite).setAngle(Phaser.Math.Between(0, 360));
        this.delayedCall(scene, owner, delay);
      },
    );
  }

  update(): void {}
}
