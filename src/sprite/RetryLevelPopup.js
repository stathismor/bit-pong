const OPTION_WIDTH = 64;
const OPTION_HEIGHT = 32;
const OPTION_NO_NAME = 'No';
const OPTION_YES_NAME = 'Yes';

export default class RetryLevelPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'retry_popup');
    this.setVisible(false);
    this.setScale(0.1);
    scene.add.existing(this);

    this.tween = scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      ease: 'Elastic',
      easeParams: [1.2, 0.5],
      duration: 1200,
      repeat: 0,
      delay: 0,
      paused: true,
    });
  }

  popup() {
    this.setVisible(true);

    this.tween.play();

    const zoneNo = this.scene.add
      .zone(
        this.x - this.width / 2,
        this.y + this.height / 2 - OPTION_HEIGHT,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_NO_NAME)
      .setInteractive();

    const zoneYes = this.scene.add
      .zone(
        this.x - this.width / 2 + OPTION_WIDTH,
        this.y + this.height / 2 - OPTION_HEIGHT,
        OPTION_WIDTH,
        OPTION_HEIGHT
      )
      .setOrigin(0)
      .setName(OPTION_YES_NAME)
      .setInteractive();

    // Add a red border
    if (__DEV__) {
      const size = 2;
      const boundsNo = zoneNo.getBounds();
      const borderNo = this.scene.add.rectangle(
        boundsNo.x + OPTION_WIDTH / 2,
        boundsNo.y + OPTION_HEIGHT / 2,
        boundsNo.width,
        boundsNo.height
      );
      borderNo.setStrokeStyle(size, '0xFF0000');

      const boundsYes = zoneYes.getBounds();
      const borderYes = this.scene.add.rectangle(
        boundsYes.x + OPTION_WIDTH / 2,
        boundsYes.y + OPTION_HEIGHT / 2,
        boundsYes.width,
        boundsYes.height
      );
      borderYes.setStrokeStyle(size, '0xFF0000');
    }

    this.scene.input.on('gameobjectdown', (pointer, gameObject) => {
      if (
        gameObject.name === OPTION_YES_NAME ||
        gameObject.name === OPTION_NO_NAME
      ) {
        zoneNo.removeInteractive();
        zoneYes.removeInteractive();
        if (gameObject.name === OPTION_NO_NAME) {
          this.scene.scene.start('LevelMenuScene');
        } else {
          this.scene.scene.restart({ result: 'retry' });
        }
      }
    });
  }
}
