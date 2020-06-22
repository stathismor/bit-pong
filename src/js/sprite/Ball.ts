import { ComponentManager } from "../behaviour/ComponentManager";
import { SetBody } from "../behaviour/SetBody";
import { uuidv4 } from "../utils";

import * as constants from "../constants";

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
    this.body.timeScale = constants.TIME_SCALE;
    this.setData("name", `${frame}_${uuidv4()}`);
  }
}
