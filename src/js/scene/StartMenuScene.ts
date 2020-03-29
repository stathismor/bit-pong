import { Scene } from "phaser";

import * as constants from "../constants";

export class StartMenuScene extends Scene {
  constructor() {
    super({
      key: "StartMenuScene",
    });
  }

  create() {
    // this.scene.start("GameplayScene", { levelNumber: 1 });
    const config = this.sys.game.CONFIG;
    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "start_menu_logo"
    );

    const startButton = this.add.image(
      config.centerX,
      config.centerY + 50,
      constants.TEXTURE_ATLAS,
      "start_menu_start"
    );

    startButton.setInteractive();

    startButton.on("pointerdown", () => this.scene.start("LevelMenuScene"));
  }
}
