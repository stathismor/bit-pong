import * as constants from "../constants";

const OPTION_WIDTH = 90;
const OPTION_HEIGHT = 90;
const OPTION_RETRY_NAME = "retry";
const OPTION_SELECT_LEVEL_NAME = "level";
const OPTION_NEXT_LEVEL = "next";
const LEVEL_X_OFFSET = 156;
const RETRY_X_OFFSET = -292;
const NEXT_X_OFFSET = -146;
const Y_OFFSET = 60;

export class CompleteLevelPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, levelNum, levelsCount) {
    super(scene, x, y, constants.TEXTURE_ATLAS, "success");
    this.setVisible(false);
    this.setScale(0.1);
    scene.add.existing(this);
    this.levelNum = levelNum;
    this.levelsCount = levelsCount;

    this.tween = scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      ease: "Elastic",
      easeParams: [1.2, 0.5],
      duration: 650,
      repeat: 0,
      delay: 0,
      paused: true,
      onComplete: CompleteLevelPopup.onComplete,
    });

    this.award = scene.add.image(this.x + 140, this.y - 35, "award_silver");
    this.award.setVisible(false);
    this.award.setScale(0.1);
    scene.add.existing(this.award);
    this.awardTween = scene.tweens.add({
      targets: this.award,
      scaleX: 1,
      scaleY: 1,
      ease: "Elastic",
      easeParams: [1.2, 0.5],
      duration: 650,
      repeat: 0,
      delay: 0,
      paused: true,
    });

    this.selectLevel = this.scene.add
      .zone(
        this.x - this.width / 2 + LEVEL_X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_SELECT_LEVEL_NAME);

    this.retry = this.scene.add
      .zone(
        this.x + this.width / 2 - OPTION_WIDTH + RETRY_X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_RETRY_NAME);

    this.nextLevel = this.scene.add
      .zone(
        this.x + this.width / 2 - OPTION_WIDTH + NEXT_X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_NEXT_LEVEL);

    // @TODO. This sisable zone for last level, need to remove texture
    if (levelNum >= levelsCount) {
      this.nextLevel.setVisible(false);
    }
  }

  popup(): void {
    this.setVisible(true);

    this.selectLevel.setInteractive();
    this.retry.setInteractive();
    this.nextLevel.setInteractive();

    this.tween.play();

    const completedLevels =
      JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || {};
    const level = completedLevels[this.levelNum];
    const awardKey = level >= 2 ? "award_gold" : "award_silver";
    this.award = this.scene.add.image(this.x + 140, this.y - 35, awardKey);
    this.award.setVisible(true);
    this.awardTween.play();
  }

  static onComplete(tween, gameObjects): void {
    const completeLevelPopup = gameObjects[0];
    completeLevelPopup.scene.input.on(
      "gameobjectdown",
      (pointer, gameObject) => {
        if (
          gameObject.name === OPTION_SELECT_LEVEL_NAME ||
          gameObject.name === OPTION_RETRY_NAME ||
          gameObject.name === OPTION_NEXT_LEVEL
        ) {
          completeLevelPopup.retry.removeInteractive();
          completeLevelPopup.selectLevel.removeInteractive();
          completeLevelPopup.nextLevel.removeInteractive();

          if (gameObject.name === OPTION_RETRY_NAME) {
            gameObject.scene.scene.restart({ result: "retry" });
          } else if (gameObject.name === OPTION_NEXT_LEVEL) {
            const nextLevel = completeLevelPopup.levelNum + 1;
            if (nextLevel <= completeLevelPopup.levelsCount) {
              gameObject.scene.scene.restart({
                levelNumber: completeLevelPopup.levelNum + 1,
              });
            }
          } else {
            gameObject.scene.scene.start("LevelMenuScene");
          }
        }
      }
    );
    CompleteLevelPopup.debug(completeLevelPopup);
  }

  static debug(completeLevelPopup): void {
    // Add a red border
    if (process.env.DEBUG === "true") {
      const size = 2;
      const selectLevelBounds = completeLevelPopup.retry.getBounds();
      const selectLevelBorder = completeLevelPopup.scene.add.rectangle(
        selectLevelBounds.x + OPTION_WIDTH / 2,
        selectLevelBounds.y + OPTION_HEIGHT / 2,
        selectLevelBounds.width,
        selectLevelBounds.height
      );
      selectLevelBorder.setStrokeStyle(size, "0xFF0000");

      const retryBounds = completeLevelPopup.selectLevel.getBounds();
      const retryBorder = completeLevelPopup.scene.add.rectangle(
        retryBounds.x + OPTION_WIDTH / 2,
        retryBounds.y + OPTION_HEIGHT / 2,
        retryBounds.width,
        retryBounds.height
      );
      retryBorder.setStrokeStyle(size, "0xFF0000");

      const nextLevelBounds = completeLevelPopup.nextLevel.getBounds();
      const nextLevelBorder = completeLevelPopup.scene.add.rectangle(
        nextLevelBounds.x + OPTION_WIDTH / 2,
        nextLevelBounds.y + OPTION_HEIGHT / 2,
        nextLevelBounds.width,
        nextLevelBounds.height
      );
      nextLevelBorder.setStrokeStyle(size, "0xFF0000");
    }
  }
}
