import { AdminBar } from "../hud/AdminBar";

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CreditsScene",
    });
  }

  create(): void {
    const config = this.sys.game.CONFIG;
    this.cameras.main.setBackgroundColor("#011627");
    this.add.image(config.centerX, 70, "credits_title");
    this.add.image(config.centerX, 250, "credits_concept");
    this.add.image(config.centerX, 320, "credits_stathis");
    this.add.image(config.centerX, 470, "credits_art");
    this.add.image(config.centerX, 540, "credits_stathis");
    this.add.image(config.centerX, 610, "credits_antony");

    ((): void => new AdminBar(this, true))();
  }
}
