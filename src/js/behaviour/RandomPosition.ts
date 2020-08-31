const RANDOM_POSITION_DELAY = 4300;

export class RandomPosition {
  constructor(scene, owner, options) {
    const { x, y, width, height } = options;

    const delay = options.delay ? options.delay : RANDOM_POSITION_DELAY;
    this.resetMomentum = !!options.resetMomentum;

    // console.log("options.isStatic", options.isStatic);
    // console.log("this.isStatic", this.isStatic);
    this.delayedCall(scene, owner, x, y, width, height, delay);
  }

  delayedCall(scene, owner, x, y, width, height, delay): void {
    scene.time.delayedCall(
      delay,
      () => {
        // DO not attach this to player
        owner.setRandomPosition(x, y, width, height, delay);
        if (this.resetMomentum) {
          owner.setStatic(true); // Needed to reset any momentum
          owner.setStatic(false);
        }
        this.delayedCall(scene, owner, x, y, width, height, delay);
      },
      null,
      this
    );
  }

  update(): void {}
}
