import Phaser from "phaser";
import * as constants from "../constants";

const HEALD_BAR_OFFSET_X = 0;
const HEALTH_BAR_OFFSET_Y = 32;
const LIVES_DISTANCE = 32;

export default class HealthBar {
  scene: Phaser.Scene;
  emptyLives: Phaser.GameObjects.Group;
  fullLives: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, livesNumber: number) {
    this.scene = scene;

    this.emptyLives = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "life_empty",
      repeat: constants.MAX_LIVES,
      active: false,
      visible: false,
    });
    this.fullLives = scene.add.group({
      key: constants.TEXTURE_ATLAS,
      frame: "life_full",
      repeat: constants.MAX_LIVES,
      active: false,
      visible: false,
    });

    this.update(livesNumber);
  }

  update(livesNumber: number): void {
    this.killAllLives();
    for (let index = 0; index < constants.MAX_LIVES; index += 1) {
      const life = (
        index < livesNumber
          ? this.fullLives.getFirstDead()
          : this.emptyLives.getFirstDead()
      ) as Phaser.GameObjects.Image;
      life.setDepth(constants.MAX_DEPTH);
      life.setActive(true);
      life.setVisible(true);
      life.x = HEALD_BAR_OFFSET_X + LIVES_DISTANCE * (index + 1);
      life.y = HEALTH_BAR_OFFSET_Y;
    }
  }

  killAllLives(): void {
    this.fullLives.getChildren().forEach((life) => {
      this.fullLives.kill(life);
      (life as Phaser.GameObjects.Image).setVisible(false);
    });

    this.emptyLives.getChildren().forEach((life) => {
      this.emptyLives.kill(life);
      (life as Phaser.GameObjects.Image).setVisible(false);
    });
  }
}
