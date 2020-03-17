import * as constants from '../constants';
import { StartMenuScene } from './StartMenuScene';
import Images from '../images';
import Sounds from '../sounds';
import Data from '../data';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload() {
    // HACK: parcel changes the asset names in dist directory, so
    // we dynamically get the new image names for the atlas
    const atlasData = Data.bit_pong_data;
    atlasData.textures[0].image = Images.bit_pong_atlas;
    this.load.multiatlas(constants.TEXTURE_ATLAS, atlasData);

    // Audio
    this.load.audio('table_bounce', Sounds.table_bounce);
    this.load.audio('cup_bounce', Sounds.cup_bounce);
    this.load.audio('splash', Sounds.splash);
  }

  create() {
    this.scene.start('StartMenuScene');
  }
}
