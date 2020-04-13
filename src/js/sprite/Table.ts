import { tableCategory } from "../collision";
import { uuidv4 } from "../utils";

export class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, angleDeg) {
    super(scene.matter.world, x, y, texture, frame, {
      isStatic: true,
      angle: angleDeg,
    });
    this.setData("name", "table_" + uuidv4());

    this.setBounce(0.9);

    this.setCollisionCategory(tableCategory);
  }
}
