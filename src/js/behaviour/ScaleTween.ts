const DEFAULT_SCALE = 0.5;

export class ScaleTween {
  constructor(scene, owner, options) {
    const to = options && options.to ? options.to : DEFAULT_SCALE;

    const tweenOptions = {
      targets: { to },
      key: { from: 1, to },
      ease: "Sine.easeInOut",
      duration: 2100,
      yoyo: true,
      repeat: -1,
      onUpdate: function () {
        // @HACK: Tweening scale does not change body borders
        owner.setScale(this.targets[0].key);
      },
    };

    scene.tweens.add(tweenOptions);
  }

  update(): void {}
}
