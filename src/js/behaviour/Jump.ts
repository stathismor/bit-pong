const DURATION = 900;
const DELAY = 0;

export class Jump {
  constructor(scene, owner, options) {
    const tweenOptions = {
      targets: owner,
      ease: "Bounce.easeIn",
      duration: options.duration || DURATION,
      delay: options.delay || DELAY,
      yoyo: true,
      repeat: -1,
      y: options.y,
    };

    scene.tweens.add(tweenOptions);
  }

  update(): void {}
}
