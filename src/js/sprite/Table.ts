import Phaser from "phaser";
import { tableCategory } from "../collision";
import BEHAVIOUR_MAPPER from "../behaviour";
import { ComponentManager } from "../behaviour/ComponentManager";
import { uuidv4 } from "../utils";

interface BehaviourConf {
  name: string;
  options?: Record<string, unknown>;
}

export class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, angleDeg: number, behaviours?: BehaviourConf[]) {
    super((scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics }).matter.world, x, y, texture, frame, {
      isStatic: true,
      angle: angleDeg,
    });
    this.setData("name", "table_" + uuidv4());

    if (behaviours) {
      behaviours.forEach((behaviour) => {
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviour.name](scene, this, behaviour.options),
        );
      });
    }

    this.setBounce(0.9);

    this.setCollisionCategory(tableCategory);
  }
}
