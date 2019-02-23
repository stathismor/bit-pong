export default class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key, angleDeg) {
    super(scene.matter.world, x, y, key, null, {
      isStatic: true,
      angle: angleDeg,
    });
    this.setBounce(0.7);
  }
}
