import { tableCategory } from "../collision";

export default class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame, angleDeg) {
    super(scene.matter.world, x, y, texture, frame, {
      isStatic: true,
      angle: angleDeg,
    });
    this.setBounce(0.9);

    this.setCollisionCategory(tableCategory);
  }
}
