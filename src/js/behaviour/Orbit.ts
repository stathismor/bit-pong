import Phaser from "phaser";
import * as constants from "../constants";
import { uuidv4 } from "../utils";

const SPEED = 0.03;

export class Orbit {
  owner: Phaser.GameObjects.GameObject;
  x: number;
  y: number;
  distance: number;
  speed: number;
  satellite: Phaser.Physics.Matter.Image | undefined;

  constructor(scene: Phaser.Scene, owner: Phaser.GameObjects.GameObject, options: { x: number; y: number; distance: number; speed?: number; satellite?: { name: string } }) {
    this.owner = owner;
    this.x = options.x;
    this.y = options.y;
    this.distance = options.distance;
    this.speed = options.speed || SPEED;
    this.satellite = undefined;

    if (options.satellite) {
      const matterScene = scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics };
      this.satellite = matterScene.matter.add.image(
        this.x,
        this.y,
        constants.TEXTURE_ATLAS,
        options.satellite.name,
      );
      this.satellite.setData("name", "drop_" + uuidv4());
      this.satellite.setStatic(true);
    }
  }

  update(): void {
    Phaser.Actions.RotateAroundDistance(
      [this.owner],
      { x: this.x, y: this.y },
      this.speed,
      this.distance,
    );

    if (this.satellite) {
      Phaser.Actions.RotateAroundDistance(
        [this.satellite],
        { x: (this.owner as Phaser.GameObjects.Sprite).x, y: (this.owner as Phaser.GameObjects.Sprite).y },
        this.speed,
        50,
      );
    }
  }
}
