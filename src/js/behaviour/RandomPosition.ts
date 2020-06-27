const RANDOM_POSITION_DELAY = 4300;

export class RandomPosition {
  constructor(scene, owner, options) {
    const { x, y, width, height } = options;

    const delay = options.delay ? options.delay : RANDOM_POSITION_DELAY;

    this.delayedCall(scene, owner, x, y, width, height, delay);
  }

  delayedCall(scene, owner, x, y, width, height, delay): void {
    scene.time.delayedCall(
      delay,
      () => {
        // DO not attach this to player
        owner.setRandomPosition(x, y, width, height, delay);
        this.delayedCall(scene, owner, x, y, width, height, delay);
      },
      null,
      this
    );
  }

  update(): void {}
}
