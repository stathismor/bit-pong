import { AdminBar } from "../hud/AdminBar";

const TITLE_OFFSET_Y = 100;
const NAME_OFFSET_Y = 70;
const DEPARTMENT_OFFSET_Y = 160;

import * as constants from "../constants";

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CreditsScene",
    });
  }

  create(): void {
    const config = this.sys.game.CONFIG;
    this.cameras.main.setBackgroundColor("#011627");
    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "credits_title"
    );
    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y + DEPARTMENT_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "credits_concept"
    );
    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y + DEPARTMENT_OFFSET_Y + NAME_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "credits_stathis"
    );
    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y + 2 * DEPARTMENT_OFFSET_Y + NAME_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "credits_art"
    );
    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y + 2 * DEPARTMENT_OFFSET_Y + 2 * NAME_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "credits_stathis"
    );
    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y + 2 * DEPARTMENT_OFFSET_Y + 3 * NAME_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "credits_antony"
    );

    ((): void => new AdminBar(this, true))();
  }
}
