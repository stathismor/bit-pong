export class AdminBar {
  constructor(scene) {
    this.scene = scene;
    const config = scene.sys.game.CONFIG;

    this.image = this.scene.add
      .image(0, 0, "sound_off")
      .setScrollFactor(0)
      .setInteractive();
    this.image.on("pointerdown", () => {
      this.updateSoundRegistry();
      this.updateSoundTexture();
    });

    this.image.setPosition(config.width - 20, 15);

    this.updateSoundTexture();
  }

  updateSoundTexture(): void {
    const soundOn = this.scene.game.registry.get("sound");
    this.image.setTexture(soundOn ? "sound_on" : "sound_off");
  }

  updateSoundRegistry(): void {
    const soundOn = this.scene.game.registry.get("sound");

    this.scene.game.registry.set("sound", !soundOn);
    this.scene.game.sound.mute = soundOn;
  }
}
