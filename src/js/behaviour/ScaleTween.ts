import Phaser from "phaser";
const DEFAULT_SCALE = 0.5;
const DEFAULT_DURATION = 2100;

export class ScaleTween {
  constructor(scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options?: { to?: number; duration?: number }) {
    const to = options && options.to ? options.to : DEFAULT_SCALE;
    const duration =
      options && options.duration ? options.duration : DEFAULT_DURATION;

    const tweenOptions = {
      targets: { to },
      key: { from: 1, to },
      ease: "Sine.easeInOut",
      duration,
      yoyo: true,
      repeat: -1,
      onUpdate: function (this: Phaser.Tweens.Tween) {
        // @HACK: Tweening scale does not change body borders
        (owner as Phaser.GameObjects.Sprite).setScale((this.targets[0] as { key: number }).key);
      },
    };

    scene.tweens.add(tweenOptions);
  }

  update(): void {}
}
