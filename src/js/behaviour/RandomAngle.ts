const RANDOM_POSITION_DELAY = 4450;

export class RandomAngle {
  constructor(scene, owner, options) {
    const delay = options.delay ? options.delay : RANDOM_POSITION_DELAY;

    this.delayedCall(scene, owner, delay);
  }

  delayedCall(scene, owner, delay): void {
    scene.time.delayedCall(
      delay,
      () => {
        // DO not attach this to player
        const angle = Phaser.Math.Between(0, 360);
        owner.setAngle(angle);
        this.delayedCall(scene, owner, delay);
      },
      null,
      this
    );
  }

  update(): void {}
}
