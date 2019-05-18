import * as constants from '../constants';

const OPTION_WIDTH = 100;
const OPTION_HEIGHT = 40;
const OPTION_RETRY_NAME = 'Retry';
const OPTION_HOME_NAME = 'Home';
const X_OFFSET = 6;
const Y_OFFSET = 6;

export default class CompleteLevelPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, constants.TEXTURE_ATLAS, 'complete_level_popup');
    this.setVisible(false);
    this.setScale(0.1);
    scene.add.existing(this);

    this.tween = scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      ease: 'Elastic',
      easeParams: [1.2, 0.5],
      duration: 650,
      repeat: 0,
      delay: 0,
      paused: true,
      onComplete: CompleteLevelPopup.onComplete,
    });

    this.zoneNo = this.scene.add
      .zone(
        this.x - this.width / 2 + X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_RETRY_NAME);

    this.zoneYes = this.scene.add
      .zone(
        this.x + this.width / 2 - OPTION_WIDTH - X_OFFSET,
        this.y + this.height / 2 - OPTION_HEIGHT - Y_OFFSET,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_HOME_NAME);
  }

  popup() {
    this.setVisible(true);

    this.zoneNo.setInteractive();
    this.zoneYes.setInteractive();

    this.tween.play();
  }

  static onComplete(tween, gameObjects) {
    const completeLevelPopup = gameObjects[0];
    completeLevelPopup.scene.input.on(
      'gameobjectdown',
      (pointer, gameObject) => {
        if (
          gameObject.name === OPTION_HOME_NAME ||
          gameObject.name === OPTION_RETRY_NAME
        ) {
          completeLevelPopup.zoneNo.removeInteractive();
          completeLevelPopup.zoneYes.removeInteractive();
          if (gameObject.name === OPTION_RETRY_NAME) {
            gameObject.scene.scene.restart({ result: 'retry' });
          } else {
            gameObject.scene.scene.start('LevelMenuScene');
          }
        }
      }
    );
    CompleteLevelPopup.debug(completeLevelPopup);
  }

  static debug(completeLevelPopup) {
    // Add a red border
    if (__DEV__) {
      const size = 2;
      const boundsNo = completeLevelPopup.zoneNo.getBounds();
      const borderNo = completeLevelPopup.scene.add.rectangle(
        boundsNo.x + OPTION_WIDTH / 2,
        boundsNo.y + OPTION_HEIGHT / 2,
        boundsNo.width,
        boundsNo.height
      );
      borderNo.setStrokeStyle(size, '0xFF0000');

      const boundsYes = completeLevelPopup.zoneYes.getBounds();
      const borderYes = completeLevelPopup.scene.add.rectangle(
        boundsYes.x + OPTION_WIDTH / 2,
        boundsYes.y + OPTION_HEIGHT / 2,
        boundsYes.width,
        boundsYes.height
      );
      borderYes.setStrokeStyle(size, '0xFF0000');
    }
  }
}
