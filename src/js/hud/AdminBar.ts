import * as constants from "../constants";

const BUTTONS_X_OFFSET = 120;
const BUTTONS_Y_OFFSET = 40;

export class AdminBar {
  constructor(scene, showLevel = false) {
    this.scene = scene;
    const config = scene.sys.game.CONFIG;

    this.image = scene.add
      .image(
        config.width - BUTTONS_X_OFFSET / 2,
        BUTTONS_Y_OFFSET,
        constants.TEXTURE_ATLAS,
        "sound_off"
      )
      .setScrollFactor(0)
      .setInteractive();
    this.image.on("pointerdown", () => {
      this.updateSoundRegistry();
      this.updateSoundTexture();
    });

    if (showLevel) {
      const selectLevelButton = scene.add
        .image(
          config.width - BUTTONS_X_OFFSET,
          BUTTONS_Y_OFFSET,
          "select_level_button"
        )
        .setScrollFactor(0)
        .setInteractive();
      selectLevelButton.on("pointerdown", () => {
        this.scene.scene.start("LevelMenuScene");
      });
    }

    this.updateSoundTexture();
  }

  updateSoundTexture(): void {
    const soundOn = this.scene.game.registry.get("sound");
    this.image.setTexture(
      constants.TEXTURE_ATLAS,
      soundOn ? "sound_on" : "sound_off"
    );
  }

  updateSoundRegistry(): void {
    const soundOn = this.scene.game.registry.get("sound");

    this.scene.game.registry.set("sound", !soundOn);
    this.scene.game.sound.mute = soundOn;
  }
}
