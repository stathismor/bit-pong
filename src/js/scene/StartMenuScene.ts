import { AdminBar } from "../hud/AdminBar";

import * as constants from "../constants";

const BUTTON_WIDTH = 407;
const BUTTON_HEIGHT = 85;
const BUTTON_PLAY_NAME = "PLAY";
const BUTTON_CREDITS_NAME = "CREDITS";
const VERSION_OFFSET_X = 20;
const VERSION_OFFSET_Y = 20;
const VERSION_DIGIT_DISTANCE = 14;

export class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "StartMenuScene",
    });
  }

  create(): void {
    this.scene.start("GameplayScene", { levelNumber: 43 });
    // this.scene.start("LevelMenuScene");
    // this.scene.start("CreditsScene");
    // this.scene.start("YouWonScene");
    const config = this.sys.game.CONFIG;
    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "start"
    );

    const playButton = this.add
      .zone(185, 461, BUTTON_WIDTH, BUTTON_HEIGHT)
      .setOrigin(0)
      .setName(BUTTON_PLAY_NAME);
    playButton.setInteractive();

    const creditsButton = this.add
      .zone(185, 569, BUTTON_WIDTH, BUTTON_HEIGHT)
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
        this.scene.scene.sound.play("button_click");
        this.scene.start("LevelMenuScene", { levelNumber: 0 });
      } else if (gameObject.name === BUTTON_CREDITS_NAME) {
        this.scene.scene.sound.play("button_click");
        this.scene.start("CreditsScene");
      }
    });

    // @HACK: I am sooo lazyyy right now to do this properly
    this.add.image(
      VERSION_OFFSET_X,
      config.height - VERSION_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      constants.LEVEL_DIGIT_SMALL_MAP["v"]
    );
    this.add.image(
      VERSION_OFFSET_X + VERSION_DIGIT_DISTANCE + 2,
      config.height - VERSION_OFFSET_Y - 1,
      constants.TEXTURE_ATLAS,
      constants.LEVEL_DIGIT_SMALL_MAP["0"]
    );
    this.add.image(
      VERSION_OFFSET_X + 2 * VERSION_DIGIT_DISTANCE,
      config.height - VERSION_OFFSET_Y + 4,
      constants.TEXTURE_ATLAS,
      constants.LEVEL_DIGIT_SMALL_MAP["dot"]
    );
    this.add.image(
      VERSION_OFFSET_X + 3 * VERSION_DIGIT_DISTANCE - 2,
      config.height - VERSION_OFFSET_Y - 1,
      constants.TEXTURE_ATLAS,
      constants.LEVEL_DIGIT_SMALL_MAP["0"]
    );
    this.add.image(
      VERSION_OFFSET_X + 4 * VERSION_DIGIT_DISTANCE - 4,
      config.height - VERSION_OFFSET_Y + 4,
      constants.TEXTURE_ATLAS,
      constants.LEVEL_DIGIT_SMALL_MAP["dot"]
    );
    this.add.image(
      VERSION_OFFSET_X + 5 * VERSION_DIGIT_DISTANCE - 6,
      config.height - VERSION_OFFSET_Y - 1,
      constants.TEXTURE_ATLAS,
      constants.LEVEL_DIGIT_SMALL_MAP["6"]
    );

    ((): void => new AdminBar(this))();
  }
}
