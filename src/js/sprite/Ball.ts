import { ComponentManager } from "../behaviour/ComponentManager";
import { SetBody } from "../behaviour/SetBody";
import BEHAVIOUR_MAPPER from "../behaviour";
import { uuidv4 } from "../utils";

import * as constants from "../constants";

interface BehaviourConf {
  name: string;
  options?: Record<string, unknown>;
}

export class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, isStatic: boolean, behaviours?: BehaviourConf[]) {
    super((scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics }).matter.world, x, y, texture, frame);

    ComponentManager.Add(
      scene,
      this,
      new SetBody(scene, this, frame, x, y, 0, true),
    );

    if (behaviours) {
      behaviours.forEach((behaviour) => {
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviour.name](scene, this, behaviour.options),
        );
      });
    }

    this.setFriction(0.06);
    this.setStatic(isStatic);
    (this.body as MatterJS.BodyType).timeScale = constants.TIME_SCALE;
    this.setData("name", `${frame}_${uuidv4()}`);
  }
}
