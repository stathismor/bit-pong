import { AdminBar } from "../hud/AdminBar";

import * as constants from "../constants";

const BUTTON_WIDTH = 222;
const BUTTON_HEIGHT = 60;
const BUTTON_NAME = "NEW_GAME";

export class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "StartMenuScene",
    });
  }

  create(): void {
    // this.scene.start("GameplayScene", { levelNumber: 27 });
    // this.scene.start("LevelMenuScene");
    const config = this.sys.game.CONFIG;
    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "start"
    );

    const newGameButton = this.add
      .zone(90, 240, BUTTON_WIDTH, BUTTON_HEIGHT)
      .setOrigin(0)
      .setName(BUTTON_NAME);
    newGameButton.setInteractive();

    if (process.env.DEBUG === "true") {
      const size = 2;
      const boundsNo = newGameButton.getBounds();
      const borderNo = this.add.rectangle(
        boundsNo.x + BUTTON_WIDTH / 2,
        boundsNo.y + BUTTON_HEIGHT / 2,
        boundsNo.width,
        boundsNo.height
      );
      borderNo.setStrokeStyle(size, "0xFF0000");
    }

    this.input.on("gameobjectdown", (pointer, gameObject) => {
      if (gameObject.name === BUTTON_NAME) {
        this.scene.start("LevelMenuScene");
      }
    });

    ((): void => new AdminBar(this))();
  }
}
