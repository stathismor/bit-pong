import Phaser from "phaser";
export class Move {
  constructor(scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options?: { direction?: string; x?: number; y?: number }) {
    const tweenOptions: Record<string, unknown> = {
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

    scene.tweens.add(tweenOptions as Phaser.Types.Tweens.TweenBuilderConfig);
  }

  update(): void {}
}
