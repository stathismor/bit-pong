import * as constants from "../constants";
import { successEmitter } from "../particles";
import { getCompletedLevels, getLevelByNumber } from "../utils";

const DEPTH = 40;
const OPTION_WIDTH = 94;
const OPTION_HEIGHT = 94;
const OPTION_RETRY_NAME = "retry";
const OPTION_SELECT_LEVEL_NAME = "level";
const OPTION_NEXT_LEVEL = "next";
const LEVEL_X_OFFSET = 126;
const RETRY_X_OFFSET = -292;
const NEXT_X_OFFSET = -125;
const Y_OFFSET = 46;

export class CompleteLevelPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, levelNumber, levelsCount) {
    super(scene, x, y, constants.TEXTURE_ATLAS, "popup_success");
    this.setDepth(DEPTH);

    this.setVisible(false);
    this.setScale(0.1);
    scene.add.existing(this);
    this.levelNumber = levelNumber;
    this.levelsCount = levelsCount;

    this.emitter = successEmitter;

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

    this.award = scene.add.image(
      this.x,
      this.y - 25,
      constants.TEXTURE_ATLAS,
      "trophy_silver_big"
    );
    this.award.setDepth(DEPTH);
    this.award.setVisible(false);
    this.award.setScale(0.1);
    scene.add.existing(this.award);

    const test = scene.tweens.add({
      targets: this.award,
      scaleX: 0.85,
      scaleY: 0.85,
      ease: "Sine.easeInOut",
      duration: 1650,
      repeat: 0,
      delay: 0,
      paused: true,
      yoyo: true,
      repeat: -1,
    });

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
      onComplete: () => test.play(),
    });

    this.selectLevel = scene.add
      .zone(
        this.x - this.width / 2 + LEVEL_X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_SELECT_LEVEL_NAME);

    this.retry = scene.add
      .zone(
        this.x + this.width / 2 - OPTION_WIDTH + RETRY_X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_RETRY_NAME);

    this.nextLevel = scene.add
      .zone(
        this.x + this.width / 2 - OPTION_WIDTH + NEXT_X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_NEXT_LEVEL);
  }

  popup(): void {
    this.emitter.start();
    this.setVisible(true);

    this.selectLevel.setInteractive();
    this.retry.setInteractive();
    this.nextLevel.setInteractive();

    this.tween.play();

    this.scene.sound.play("success");

    const completedLevels = getCompletedLevels();
    const configLevel = getLevelByNumber(this.levelNumber);
    const storageLevel = completedLevels[configLevel.name];
    const lives = storageLevel.lives;
    const awardKey = lives >= 2 ? "trophy_gold_big" : "trophy_silver_big";
    this.award.setFrame(awardKey);
    this.award.setDepth(DEPTH);
    this.award.setVisible(true);
    this.awardTween.play();

    if (this.levelNumber >= this.levelsCount) {
      this.scene.scene.start("YouWonScene");
    }
  }

  static onComplete(tween, gameObjects): void {
    const completeLevelPopup = gameObjects[0];
    completeLevelPopup.scene.input.on(
      "gameobjectdown",
      (pointer, gameObject) => {
        gameObject.scene.sound.play("button_click");
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
            const nextLevel = completeLevelPopup.levelNumber + 1;
            if (nextLevel <= completeLevelPopup.levelsCount) {
              gameObject.scene.scene.restart({
                levelNumber: completeLevelPopup.levelNumber + 1,
              });
            }
          } else {
            gameObject.scene.scene.start("LevelMenuScene", {
              levelNumber: completeLevelPopup.levelNumber,
            });
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
      selectLevelBorder.setDepth(100);

      const retryBounds = completeLevelPopup.selectLevel.getBounds();
      const retryBorder = completeLevelPopup.scene.add.rectangle(
        retryBounds.x + OPTION_WIDTH / 2,
        retryBounds.y + OPTION_HEIGHT / 2,
        retryBounds.width,
        retryBounds.height
      );
      retryBorder.setStrokeStyle(size, "0xFF0000");
      retryBorder.setDepth(100);

      const nextLevelBounds = completeLevelPopup.nextLevel.getBounds();
      const nextLevelBorder = completeLevelPopup.scene.add.rectangle(
        nextLevelBounds.x + OPTION_WIDTH / 2,
        nextLevelBounds.y + OPTION_HEIGHT / 2,
        nextLevelBounds.width,
        nextLevelBounds.height
      );
      nextLevelBorder.setStrokeStyle(size, "0xFF0000");
      nextLevelBorder.setDepth(100);
    }
  }
}
