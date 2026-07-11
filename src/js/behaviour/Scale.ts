import Phaser from "phaser";
const DEFAULT_SCALE = 1;

export class Scale {
  constructor(_scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options?: { value?: number }) {
    const scale = options && options.value ? options.value : DEFAULT_SCALE;

    (owner as Phaser.GameObjects.Sprite).setScale(scale);
  }

  update(): void {}
}
