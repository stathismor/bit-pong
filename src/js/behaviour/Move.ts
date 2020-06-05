export class Move {
  constructor(scene, owner, options) {
    const tweenOptions = {
      targets: owner,
      ease: "Sine.easeInOut",
      duration: 2100,
      yoyo: true,
      repeat: -1,
    };
    let direction = "horizontal";

    if (options) {
      if (options.direction) {
        direction = options.direction;
      }

      if (direction === "horizontal") {
        if (options.x) {
          tweenOptions["x"] = options.x;
        } else {
          tweenOptions["y"] = options.y;
        }
      }
    }

    scene.tweens.add(tweenOptions);
  }

  update(): void {}
}
