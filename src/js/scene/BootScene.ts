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
    this.load.image("select_level_button", Images.select_level_button);
    this.load.image("award_gold", Images.award_gold);
    this.load.image("award_silver", Images.award_silver);

    // Audio
    this.load.audio("table_bounce", Sounds.table_bounce, { instances: 2 });
    this.load.audio("cup_bounce", Sounds.cup_bounce, { instances: 2 });
    this.load.audio("splash", Sounds.splash);

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
