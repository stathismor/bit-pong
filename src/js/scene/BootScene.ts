import * as constants from "../constants";
import Images from "../images";
import Sounds from "../sounds";
import Data from "../data";
import { getVersion, getOldCompletedLevels, getLevelByName } from "../utils";

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

  // @TODO: Remove this after testing
  migrate(): void {
    const localVersion = getVersion();
    const oldLevels = getOldCompletedLevels();
    const newVersion = constants.VERSION;
    if ((!localVersion || localVersion < newVersion) && oldLevels) {
      const root = {};
      root["version"] = newVersion;
      root["levels"] = {};

      for (const order in oldLevels) {
        const lives = oldLevels[order];
        const level = { lives };
        const configLevel = getLevelByName(order);
        root["levels"][configLevel.name] = level;
      }

      console.info("Bit Pong: Migrating data to version", constants.VERSION);

      localStorage.setItem(constants.LOCAL_STORAGE_ROOT, JSON.stringify(root));
      localStorage.removeItem(constants.LOCAL_STORAGE_ROOT_OLD);
    }
  }

  initLocalStorage(): void {
    const localVersion = getVersion();
    if (!localVersion) {
      console.info("Initialising local storage");
      root = { version: constants.VERSION, levels: {} };
      localStorage.setItem(constants.LOCAL_STORAGE_ROOT, JSON.stringify(root));
    }
  }

  create(): void {
    this.migrate();
    this.initLocalStorage();
    this.scene.start("StartMenuScene");
  }
}
