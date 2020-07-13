import * as constants from "../constants";

const HEALD_BAR_OFFSET_X = 0;
const HEALTH_BAR_OFFSET_Y = 32;
const LIVES_DISTANCE = 32;

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

  update(livesNumber): void {
    this.killAllLives();
    for (let index = 0; index < constants.MAX_LIVES; index += 1) {
      const life =
        index < livesNumber
          ? this.fullLives.getFirstDead()
          : this.emptyLives.getFirstDead();
      life.setDepth(constants.MAX_DEPTH);
      life.setActive(true);
      life.setVisible(true);
      life.x = HEALD_BAR_OFFSET_X + LIVES_DISTANCE * (index + 1);
      life.y = HEALTH_BAR_OFFSET_Y;
    }
  }

  killAllLives(): void {
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
