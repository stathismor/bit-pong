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
    // HACK: parcel changes the asset names in dist directory, so
    // we dynamically get the new image names for the atlas
    const atlasData = Data.bit_pong_data;
    atlasData.textures[0].image = Images.bit_pong_atlas;
    this.load.multiatlas(constants.TEXTURE_ATLAS, atlasData);
    this.load.image("sound_on", Images.sound_on);
    this.load.image("sound_off", Images.sound_off);

    // Audio
    this.load.audio("table_bounce", Sounds.table_bounce, { instances: 2 });
    this.load.audio("cup_bounce", Sounds.cup_bounce, { instances: 2 });
    this.load.audio("splash", Sounds.splash);

    if (this.game.registry.get("sound") === undefined) {
      this.game.registry.set("sound", true);
    }
  }

  create(): void {
    this.scene.start("StartMenuScene");
  }
}
