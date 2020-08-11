import * as constants from "../constants";
import { uuidv4 } from "../utils";

const SPEED = 0.03;

export class Orbit {
  constructor(scene, owner, options) {
    this.owner = owner;
    this.x = options.x;
    this.y = options.y;
    this.distance = options.distance;
    this.speed = options.speed || SPEED;
    this.satellite = undefined;

    if (options.satellite) {
      this.satellite = scene.matter.add.image(
        this.x,
        this.y,
        constants.TEXTURE_ATLAS,
        options.satellite.name
      );
      this.satellite.setData("name", "drop_" + uuidv4());
      this.satellite.setStatic(true);
    }
  }

  update(delta): void {
    Phaser.Actions.RotateAroundDistance(
      [this.owner],
      { x: this.x, y: this.y },
      this.speed,
      this.distance
    );

    if (this.satellite) {
      Phaser.Actions.RotateAroundDistance(
        [this.satellite],
        { x: this.owner.x, y: this.owner.y },
        this.speed,
        50
      );
    }
  }
}
