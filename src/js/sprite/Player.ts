import BEHAVIOUR_MAPPER from "../behaviour";
import { SetBody } from "../behaviour/SetBody";
import { Drag } from "../behaviour/Drag";
import { ComponentManager } from "../behaviour/ComponentManager";
import { uuidv4 } from "../utils";

import * as constants from "../constants";

export class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, angleRad, depth, behaviours) {
    super(scene.matter.world, x, y, texture, frame);

    this.setData("name", frame + "_" + uuidv4());
    this.setData("isPlayer", true);
    this.configDepth = depth;

    this.livesNumber = constants.MAX_LIVES;

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, frame, x, y, angleRad, true)
    );

    if (behaviours) {
      behaviours.forEach((behaviour) =>
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviour.name](scene, this, behaviour.options)
        )
      );
    }

    this.overrideDepth(true);

    ComponentManager.Add(
      scene,
      this,
      new Drag(scene, this, x, y, frame, angleRad)
    );

    this.body.timeScale = constants.TIME_SCALE;
  }

  overrideDepth(useConfig = false): void {
    if (useConfig) {
      this.setDepth(this.configDepth);
    } else {
      if (this.frame.name.startsWith("cup")) {
        // @HACK: A bigger cup fits a smaller cup
        if (this.scale > 1) {
          this.setDepth(23);
        } else {
          this.setDepth(21);
        }
      } else {
        this.setDepth(0);
      }
    }
  }
}
