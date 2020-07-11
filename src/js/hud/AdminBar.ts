import * as constants from "../constants";

const BUTTONS_X_OFFSET = 60;
const BUTTONS_X_DISTANCE = 48;
const BUTTONS_Y_OFFSET = 40;

export class AdminBar {
  constructor(scene, showExit = false, showLevel = false) {
    this.scene = scene;
    const config = scene.sys.game.CONFIG;

    this.image = scene.add
      .image(
        config.width - BUTTONS_X_OFFSET,
        BUTTONS_Y_OFFSET,
        constants.TEXTURE_ATLAS,
        "sound_off"
      )
      .setDepth(constants.MAX_DEPTH)
      .setScrollFactor(0)
      .setInteractive();
    this.image.on("pointerdown", () => {
      this.updateSoundRegistry();
      this.updateSoundTexture();
    });

    if (showExit) {
      const exitButton = scene.add
        .image(
          config.width - BUTTONS_X_OFFSET - BUTTONS_X_DISTANCE,
          BUTTONS_Y_OFFSET,
          "exit"
        )
        .setDepth(constants.MAX_DEPTH)
        .setScrollFactor(0)
        .setInteractive();
      exitButton.on("pointerdown", () => {
        this.scene.scene.start("StartMenuScene");
      });
    }

    if (showLevel) {
      const selectLevelButton = scene.add
        .image(
          config.width - BUTTONS_X_OFFSET - 2 * BUTTONS_X_DISTANCE,
          BUTTONS_Y_OFFSET,
          "select_level_button"
        )
        .setDepth(constants.MAX_DEPTH)
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
