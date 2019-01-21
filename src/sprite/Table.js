export default class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key, angle) {
    super(scene.matter.world, x, y, key, null, {
      isStatic: true,
      angle,
    });
    this.setBounce(0.7);
  }
}
