import * as constants from "../constants";
import Images from "../images";
import Sounds from "../sounds";
import Data from "../data";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    const config = this.sys.game.CONFIG;

    // HACK: parcel changes the asset names in dist directory, so
    // we dynamically get the new image names for the atlas
    const atlasData = Data.bit_pong_data;
    atlasData.textures[0].image = Images.bit_pong_atlas;
    const multiAtlasFileConfig = {
      key: constants.TEXTURE_ATLAS,
      url: atlasData,
    };
    this.load.multiatlas(multiAtlasFileConfig);

    // Audio
    this.load.audio("bounce_table", Sounds.bounce_table, { instances: 2 });
    this.load.audio("bounce_ball_ball", Sounds.bounce_ball_ball, {
      instances: 2,
    });
    this.load.audio("cup_bounce", Sounds.cup_bounce, { instances: 2 });
    this.load.audio("splash", Sounds.splash);
    this.load.audio("success", Sounds.success);
    this.load.audio("whoops", Sounds.whoops);
    this.load.audio("swoosh", Sounds.swoosh);
    this.load.audio("button_click", Sounds.button_click);

    if (this.game.registry.get("sound") === undefined) {
      this.game.registry.set("sound", true);
    }

    const camera = this.cameras.main;
    camera.setBounds(0, 0, config.width, config.height);
  }

  create(): void {
    this.scene.start("StartMenuScene");
  }
}
