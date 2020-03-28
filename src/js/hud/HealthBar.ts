import * as constants from "../constants";

const HEALTH_BAR_Y = 16;
const LIVES_DISTANCE = 16;

export default class HealthBar {
  constructor(scene, livesNumber) {
    this.scene = scene;

    this.emptyLives = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "empty_life",
      repeat: constants.MAX_LIVES,
      active: false,
      visible: false,
    });
    this.fullLives = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "full_life",
      repeat: constants.MAX_LIVES,
      active: false,
      visible: false,
    });

    this.update(livesNumber);
  }

  update(livesNumber) {
    this.killAllLives();
    for (let index = 0; index < constants.MAX_LIVES; index += 1) {
      const life =
        index < livesNumber
          ? this.fullLives.getFirstDead()
          : this.emptyLives.getFirstDead();
      life.setActive(true);
      life.setVisible(true);
      life.x = LIVES_DISTANCE * (index + 1);
      life.y = HEALTH_BAR_Y;
    }
  }

  killAllLives() {
    this.fullLives.children.each((life) => {
      this.fullLives.kill(life);
      life.setVisible(false);
    });

    this.emptyLives.children.each((life) => {
      this.emptyLives.kill(life);
      life.setVisible(false);
    });
  }
}
