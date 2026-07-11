import Phaser from "phaser";
const ROTATION_SPEED = 0.002;
const ROTATION_DIRECTION = 1; // 1 for clockwise, -1 for counter-clockwise

export class Rotate {
  speed: number;
  owner: Phaser.GameObjects.GameObject;

  constructor(_scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options?: { direction?: number; speed?: number }) {
    this.speed = ROTATION_SPEED;
    let direction = ROTATION_DIRECTION;

    if (options) {
      direction = options.direction ? options.direction : direction;
      this.speed = options.speed ? options.speed : this.speed;
    }
    this.speed = direction * this.speed;
    this.owner = owner;
  }

  update(delta?: number): void {
    const sprite = this.owner as Phaser.GameObjects.Sprite;
    sprite.setRotation(sprite.rotation + this.speed * (delta || 0));
  }
}
