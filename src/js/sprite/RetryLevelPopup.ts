import * as constants from "../constants";

const OPTION_WIDTH = 54;
const OPTION_HEIGHT = 54;
const OPTION_RETRY_NAME = "Retry";
const OPTION_SELECT_LEVEL_NAME = "Home";
const X_OFFSET = 78;
const Y_OFFSET = 23;

export default class RetryLevelPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, constants.TEXTURE_ATLAS, "whoops");
    this.setVisible(false);
    this.setScale(0.1);
    scene.add.existing(this);

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
      onComplete: RetryLevelPopup.onComplete,
    });

    this.retry = this.scene.add
      .zone(
        this.x - this.width / 2 + X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_RETRY_NAME);

    this.selectLevel = this.scene.add
      .zone(
        this.x + this.width / 2 - OPTION_WIDTH - X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_SELECT_LEVEL_NAME);
  }

  popup(): void {
    this.setVisible(true);

    this.retry.setInteractive();
    this.selectLevel.setInteractive();

    this.tween.play();
  }

  static onComplete(tween, gameObjects): void {
    const retryLevelPopup = gameObjects[0];
    retryLevelPopup.scene.input.on("gameobjectdown", (pointer, gameObject) => {
      if (
        gameObject.name === OPTION_SELECT_LEVEL_NAME ||
        gameObject.name === OPTION_RETRY_NAME
      ) {
        retryLevelPopup.retry.removeInteractive();
        retryLevelPopup.selectLevel.removeInteractive();
        if (gameObject.name === OPTION_SELECT_LEVEL_NAME) {
          gameObject.scene.scene.start("LevelMenuScene");
        } else {
          gameObject.scene.scene.restart({ result: "retry" });
        }
      }
    });
    RetryLevelPopup.debug(retryLevelPopup);
  }

  static debug(retryLevelPopup): void {
    // Add a red border
    if (process.env.DEBUG === "true") {
      const size = 2;
      const boundsNo = retryLevelPopup.retry.getBounds();
      const borderNo = retryLevelPopup.scene.add.rectangle(
        boundsNo.x + OPTION_WIDTH / 2,
        boundsNo.y + OPTION_HEIGHT / 2,
        boundsNo.width,
        boundsNo.height
      );
      borderNo.setStrokeStyle(size, "0xFF0000");

      const boundsYes = retryLevelPopup.selectLevel.getBounds();
      const borderYes = retryLevelPopup.scene.add.rectangle(
        boundsYes.x + OPTION_WIDTH / 2,
        boundsYes.y + OPTION_HEIGHT / 2,
        boundsYes.width,
        boundsYes.height
      );
      borderYes.setStrokeStyle(size, "0xFF0000");
    }
  }
}