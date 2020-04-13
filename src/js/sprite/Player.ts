import { SetBody } from "../behaviour/SetBody";
import { Drag } from "../behaviour/Drag";
import { ComponentManager } from "../behaviour/ComponentManager";
import { uuidv4 } from "../utils";
import * as constants from "../constants";

export class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, angleRad) {
    super(scene.matter.world, x, y, texture, frame);

    this.setData("name", frame + "_" + uuidv4());
    this.setData("isPlayer", true);

    this.livesNumber = constants.MAX_LIVES;
    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, frame, x, y, angleRad, true)
    );
    ComponentManager.Add(
      scene,
      this,
      new Drag(scene, this, x, y, frame, angleRad)
    );
  }
}
