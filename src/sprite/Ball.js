const SPEED = 0.1;
const STIFFNESS = 0.0001;
const OUT_OF_BOUNDS_DISTANCE = 200;

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, key, lives) {
    super(scene.matter.world, x, y, key, null);
    this.lives = lives;
    this.startPos = { x, y };
    this.spring = scene.matter.add.mouseSpring();

    this.setCircle();
    this.setStatic(true);
    this.setInteractive({ draggable: true });
    scene.input.setDraggable(this);

    this.constraint = Phaser.Physics.Matter.Matter.Constraint.create({
      pointA: { x, y },
      bodyB: this.body,
      stiffness: STIFFNESS,
      damping: 1,
    });

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setStatic(false);
    });

    scene.input.on('dragend', function(pointer, gameObject) {
      gameObject.setStatic(false);
      gameObject.setVelocity(
        (gameObject.startPos.x - gameObject.x) * SPEED,
        (gameObject.startPos.y - gameObject.y) * SPEED
      );

      gameObject.scene.matter.world.removeConstraint(gameObject.constraint);
      gameObject.spring.destroy();
    });

    const context = this;
    this.scene.matter.world.on('collisionstart', function(event, bodyA, bodyB) {
      if (
        [bodyA.id, bodyB.id].includes(context.body.id) &&
        [bodyA.id, bodyB.id].some(r => context.scene.tableIds.includes(r))
      ) {
        context.scene.sound.play('bounce');
      }
    });
  }

  update() {
    if (
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.startPos.x,
        this.startPos.y
      ) > OUT_OF_BOUNDS_DISTANCE
    ) {
      this.lives -= 1;
      this.scene.scene.restart({ lives: this.lives });
    }
  }
}

export default Ball;
