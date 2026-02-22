import BEHAVIOUR_MAPPER from "../behaviour";
import { SetBody } from "../behaviour/SetBody";
import { ComponentManager } from "../behaviour/ComponentManager";
import { cupCategory } from "../collision";
import { uuidv4 } from "../utils";
import * as constants from "../constants";

interface BehaviourConf {
  name: string;
  options?: Record<string, unknown>;
}

export class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, angleRad: number, behaviours?: BehaviourConf[]) {
    super((scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics }).matter.world, x, y, constants.TEXTURE_ATLAS, "cup");
    this.setDepth(22);

    this.setData("name", "cup_" + uuidv4());

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, "cup", x, y, angleRad, true),
    );

    if (behaviours) {
      behaviours.forEach((behaviour) =>
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviour.name](scene, this, behaviour.options),
        ),
      );
    }

    this.setFriction(0);
    this.setStatic(true);
    this.setBounce(0.6);

    this.setCollisionCategory(cupCategory);
  }
}
