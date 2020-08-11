const SPEED = 0.03;

export class Orbit {
  constructor(scene, owner, options) {
    this.owner = owner;
    this.x = options.x;
    this.y = options.y;
    this.distance = options.distance;
    this.speed = options.speed || SPEED;
  }

  update(delta): void {
    Phaser.Actions.RotateAroundDistance(
      [this.owner],
      { x: this.x, y: this.y },
      this.speed,
      this.distance
    );
  }
}
