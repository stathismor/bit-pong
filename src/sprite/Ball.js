class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key) {
    super(scene.matter.world, x, y, key, null, { isStatic: true });

    this.setInteractive({ draggable: true });
    scene.input.setDraggable(this);
    scene.matter.add.mouseSpring();

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setStatic(false);
    });
  }
}

export default Ball;
