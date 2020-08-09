import { addSmallNumber } from "../utils";
import * as constants from "../constants";

const LEVEL_TEXT_OFFSET_X = -40;
const LEVEL_NUMBER_OFFSET_X = 10;
const OFFSET_Y = 30;

export default class LevelBar {
  constructor(scene, levelNumber) {
    const config = scene.sys.game.CONFIG;

    scene.add
      .image(
        config.centerX + LEVEL_TEXT_OFFSET_X,
        OFFSET_Y,
        constants.TEXTURE_ATLAS,
        "level_text"
      )
      .setDepth(constants.MAX_DEPTH);

    addSmallNumber(
      scene,
      levelNumber,
      config.centerX + LEVEL_NUMBER_OFFSET_X,
      OFFSET_Y
    );
  }
}
