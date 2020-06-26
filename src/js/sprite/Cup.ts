import BEHAVIOUR_MAPPER from "../behaviour";
import { SetBody } from "../behaviour/SetBody";
import { ComponentManager } from "../behaviour/ComponentManager";
import { cupCategory } from "../collision";
import { uuidv4 } from "../utils";
import * as constants from "../constants";

export class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, angleRad, behaviours) {
    super(scene.matter.world, x, y, constants.TEXTURE_ATLAS, "cup");

    this.setData("name", "cup_" + uuidv4());

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, "cup", x, y, angleRad, true)
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

    this.setFriction(0);
    this.setStatic(true);
    this.setBounce(0.6);

    this.setCollisionCategory(cupCategory);
  }
}
