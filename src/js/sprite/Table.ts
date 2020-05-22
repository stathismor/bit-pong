import { tableCategory } from "../collision";
import BEHAVIOUR_MAPPER from "../behaviour";
import { ComponentManager } from "../behaviour/ComponentManager";
import { uuidv4 } from "../utils";

export class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, angleDeg, behaviours) {
    super(scene.matter.world, x, y, texture, frame, {
      isStatic: true,
      angle: angleDeg,
    });
    this.setData("name", "table_" + uuidv4());

    if (behaviours) {
      behaviours.forEach((behaviour) => {
        ComponentManager.Add(
          scene,
          this,
          new BEHAVIOUR_MAPPER[behaviour.name](scene, this, behaviour.options)
        );
      });
    }

    this.setBounce(0.9);

    this.setCollisionCategory(tableCategory);
  }
}
