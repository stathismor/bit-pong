const ROTATION_SPEED = 0.002;
const ROTATION_DIRECTION = 1; // 1 for clockwise, -1 for counter-clockwise

export class Rotate {
  constructor(scene, owner, options) {
    this.speed = ROTATION_SPEED;
    let direction = ROTATION_DIRECTION;

    if (options) {
      direction = options.direction ? options.direction : direction;
      this.speed = options.speed ? options.speed : this.speed;
    }
    this.speed = direction * this.speed;
    this.owner = owner;
  }

  update(delta): void {
    this.owner.setRotation(this.owner.rotation + this.speed * delta);
  }
}
