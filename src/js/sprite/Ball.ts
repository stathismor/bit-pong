import { ComponentManager } from "../behaviour/ComponentManager";
import { SetBody } from "../behaviour/SetBody";
import BEHAVIOUR_MAPPER from "../behaviour";
import { uuidv4 } from "../utils";

import * as constants from "../constants";

export class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, isStatic, behaviours) {
    super(scene.matter.world, x, y, texture, frame);

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, frame, x, y, 0, true)
    );

    if (behaviours) {
      behaviours.forEach((behaviour) => {
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviour.name](scene, this, behaviour.options)
        );
      });
    }

    this.setFriction(0.06);
    this.setStatic(isStatic);
    this.body.timeScale = constants.TIME_SCALE;
    this.setData("name", `${frame}_${uuidv4()}`);
  }
}
