const ROTATION_SPEED = 0.002;

export default class Rotate {
  constructor(scene, owner) {
    this.owner = owner;
  }

  update(delta) {
    this.owner.setRotation(this.owner.rotation + ROTATION_SPEED * delta);
  }
}
