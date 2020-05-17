import { ComponentManager } from "../behaviour/ComponentManager";
import { SetBody } from "../behaviour/SetBody";
import { uuidv4 } from "../utils";

export class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, isStatic) {
    super(scene.matter.world, x, y, texture, frame);

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, frame, x, y, 0, true)
    );

    this.setFriction(0.06);
    this.setStatic(isStatic);
    this.setData("name", "ball_" + uuidv4());
  }
}
