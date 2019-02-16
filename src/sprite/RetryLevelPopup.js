export default class RetryLevelPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'retry_popup');
    this.setVisible(false);
    this.setScale(0.1);
    this.scene.add.existing(this);

    this.tween = this.scene.tweens.add({
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
  }
}
