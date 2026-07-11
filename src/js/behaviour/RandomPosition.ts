import Phaser from "phaser";
const RANDOM_POSITION_DELAY = 4300;

export class RandomPosition {
  resetMomentum: boolean;

  constructor(scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options: { x: number; y: number; width: number; height: number; delay?: number; resetMomentum?: boolean }) {
    const { x, y, width, height } = options;

    const delay = options.delay ? options.delay : RANDOM_POSITION_DELAY;
    this.resetMomentum = !!options.resetMomentum;

    this.delayedCall(scene, owner as Phaser.Physics.Matter.Sprite, x, y, width, height, delay);
  }

  delayedCall(scene: Phaser.Scene, owner: Phaser.Physics.Matter.Sprite, x: number, y: number, width: number, height: number, delay: number): void {
    scene.time.delayedCall(
      delay,
      () => {
        owner.setRandomPosition(x, y, width, height);
        if (this.resetMomentum) {
          owner.setStatic(true);
          owner.setStatic(false);
        }
        this.delayedCall(scene, owner, x, y, width, height, delay);
      },
    );
  }

  update(): void {}
}
