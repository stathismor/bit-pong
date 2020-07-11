import * as constants from "../constants";

const LEVEL_TEXT_OFFSET_X = -40;
const LEVEL_NUMBER_OFFSET_X = 10;
const OFFSET_Y = 30;

export default class LevelBar {
  constructor(scene, levelNumber) {
    const config = scene.sys.game.CONFIG;

    scene.add.image(
      config.centerX + LEVEL_TEXT_OFFSET_X,
      OFFSET_Y,
      "level_text"
    );

    const levelNumberText = levelNumber.toString();
    const firstDigit = parseInt(levelNumberText[0]);
    let secondDigit = null;
    let offsetDiff = 0;
    let firstDigitOffsetX = 0;
    const firstDigitKey = constants.LEVEL_DIGIT_SMALL_MAP[firstDigit];
    const firstDigitImage = scene.add.image(
      config.centerX + LEVEL_NUMBER_OFFSET_X,
      OFFSET_Y,
      firstDigitKey
    );

    if (levelNumber > 9) {
      secondDigit = parseInt(levelNumberText[1]);
      const secondDigitKey = constants.LEVEL_DIGIT_SMALL_MAP[secondDigit];
      const secondDigitImage = scene.add.image(0, 0, secondDigitKey);

      const secondDigitOffsetX = secondDigitImage.width;
      firstDigitOffsetX = firstDigitImage.width;
      // @HACK digit "1" has different width, so needs some special treatment
      if (secondDigit === 1) {
        offsetDiff = -Math.abs(firstDigitOffsetX - secondDigitOffsetX) / 2;
      } else {
        offsetDiff = Math.abs(firstDigitOffsetX - secondDigitOffsetX) / 2;
      }

      secondDigitImage.setPosition(
        config.centerX +
          LEVEL_NUMBER_OFFSET_X +
          firstDigitImage.width +
          offsetDiff,
        OFFSET_Y
      );
    }
  }
}
