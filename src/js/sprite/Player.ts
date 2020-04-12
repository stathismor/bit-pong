import { SetBody } from "../behaviour/SetBody";
import { Drag } from "../behaviour/Drag";
import { ComponentManager } from "../behaviour/ComponentManager";
import * as constants from "../constants";

export class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, angleRad) {
    this.livesNumber = constants.MAX_LIVES;
    super(scene.matter.world, x, y, texture, frame);
    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, frame, x, y, angleRad)
    );
    ComponentManager.Add(
      scene,
      this,
      new Drag(scene, this, x, y, frame, angleRad)
    );
  }
}
