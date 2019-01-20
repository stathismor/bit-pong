const _SPEED = 0.1;
const _STIFFNESS = 0.0001;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key) {
    super(scene.matter.world, x, y, key, null);
    this.startPos = { x, y };
    this.spring = scene.matter.add.mouseSpring();

    this.setCircle();
    this.setStatic(true);
    this.setInteractive({ draggable: true });
    scene.input.setDraggable(this);

    this.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: this.body,
      stiffness: _STIFFNESS,
      damping: 1,
    });

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setStatic(false);
    });

    scene.input.on('dragend', function(pointer, gameObject) {
      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * _SPEED,
        (gameObject.startPos.y - gameObject.y) * _SPEED
      );

      gameObject.scene.matter.world.removeConstraint(gameObject.constraint);
      gameObject.spring.destroy();
    });
  }
}

export default Ball;
