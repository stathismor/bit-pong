import { AdminBar } from "../hud/AdminBar";

import * as constants from "../constants";

const BUTTON_WIDTH = 400;
const BUTTON_HEIGHT = 77;
const BUTTON_PLAY_NAME = "PLAY";
const BUTTON_CREDITS_NAME = "CREDITS";

export class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "StartMenuScene",
    });
  }

  create(): void {
    // this.scene.start("GameplayScene", { levelNumber: 11 });
    // this.scene.start("LevelMenuScene");
    // this.scene.start("CreditsScene");
    const config = this.sys.game.CONFIG;
    this.add.image(config.centerX, config.centerY, "start");

    const playButton = this.add
      .zone(350, 445, BUTTON_WIDTH, BUTTON_HEIGHT)
      .setOrigin(0)
      .setName(BUTTON_PLAY_NAME);
    playButton.setInteractive();

    const creditsButton = this.add
      .zone(350, 550, BUTTON_WIDTH, BUTTON_HEIGHT)
      .setOrigin(0)
      .setName(BUTTON_CREDITS_NAME);
    creditsButton.setInteractive();

    if (process.env.DEBUG === "true") {
      const size = 2;
      const playBounds = playButton.getBounds();
      const playRect = this.add.rectangle(
        playBounds.x + BUTTON_WIDTH / 2,
        playBounds.y + BUTTON_HEIGHT / 2,
        playBounds.width,
        playBounds.height
      );
      playRect.setStrokeStyle(size, "0xFF0000");

      const creditsBounds = creditsButton.getBounds();
      const creditsRect = this.add.rectangle(
        creditsBounds.x + BUTTON_WIDTH / 2,
        creditsBounds.y + BUTTON_HEIGHT / 2,
        creditsBounds.width,
        creditsBounds.height
      );
      creditsRect.setStrokeStyle(size, "0xFF0000");
    }

    this.input.on("gameobjectdown", (pointer, gameObject) => {
      if (gameObject.name === BUTTON_PLAY_NAME) {
        this.scene.start("LevelMenuScene");
      } else if (gameObject.name === BUTTON_CREDITS_NAME) {
        this.scene.start("CreditsScene");
      }
    });

    ((): void => new AdminBar(this))();
  }
}
