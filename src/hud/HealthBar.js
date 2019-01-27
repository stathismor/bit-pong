const MAX_LIVES = 3;
const HEALTH_BAR_Y = 16;
const LIVES_DISTANCE = 16;

export default class HealthBar {
  constructor(scene, lives, ball) {
    this.scene = scene;
    this.ball = ball;
    this.lives = ball.lives;
    this.healthSlots = [];

    this.empty_lives = scene.add.group({
      key: 'empty_life',
      repeat: MAX_LIVES,
      active: false,
      visible: false,
    });
    this.full_lives = scene.add.group({
      key: 'full_life',
      repeat: MAX_LIVES,
      active: false,
      visible: false,
    });

    for (let index = 1; index <= MAX_LIVES; index += 1) {
      const life =
        index <= lives
          ? this.full_lives.getFirstDead()
          : this.empty_lives.getFirstDead();
      life.setActive(true);
      life.setVisible(true);
      life.x = LIVES_DISTANCE * index;
      life.y = HEALTH_BAR_Y;
      this.healthSlots.push(life);
    }
  }
}
