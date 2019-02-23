export default class Table extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key, angleRad) {
    super(scene.matter.world, x, y, key, null, {
      isStatic: true,
      angleRad,
    });
    this.setBounce(0.7);
  }
}
