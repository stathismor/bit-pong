import LEVELS from "../../../config/levels.json";
import { AdminBar } from "../hud/AdminBar";

import * as constants from "../constants";

const LEVELS_PER_ROW = 5;
const LEVELS_PER_PAGE = 15;
const ROW_HEIGHT = 160;
const TITLE_OFFSET_Y = 70;
const BORDER_OFFSET_Y = 410;
const LEVEL_OFFSET_Y = 120;
const TILE_OFFSET_X = 291;
const TILE_DISTANCE_X = 180;

const LEVEL_DIGIT_BIG_MAP = {
  0: "digit_zero",
  1: "digit_one",
  2: "digit_two",
  3: "digit_three",
  4: "digit_four",
  5: "digit_five",
  6: "digit_six",
  7: "digit_seven",
  8: "digit_eight",
  9: "digit_nine",
};

const LEVEL_DIGIT_MEDIUM_MAP = {
  0: "digit_medium_zero",
  1: "digit_medium_one",
  2: "digit_medium_two",
  3: "digit_medium_three",
  4: "digit_medium_four",
  5: "digit_medium_five",
  6: "digit_medium_six",
  7: "digit_medium_seven",
  8: "digit_medium_eight",
  9: "digit_medium_nine",
};

export class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LevelMenuScene",
    });
  }

  create(): void {
    const config = this.sys.game.CONFIG;
    const levelWidthDistance = 22; //config.width / LEVELS_PER_ROW;
    const levelPos = { x: TILE_OFFSET_X, y: 252 };
    const completedLevels =
      JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_KEY)) || {};
    const levelNumbers = Object.keys(completedLevels);
    const nextLevel =
      levelNumbers.length === 0
        ? 1
        : Math.max(
            ...Object.keys(completedLevels).map((key) => parseInt(key))
          ) + 1;
    const camera = this.scene.scene.cameras.main;

    this.pagesCount = Math.ceil(LEVELS.length / LEVELS_PER_PAGE);
    this.currentPageNum = 1;

    for (let i = 0; i < this.pagesCount; i += 1) {
      this.add.image(
        config.centerX + i * config.width,
        config.centerY,
        constants.TEXTURE_ATLAS,
        "background"
      );
    }

    const title = this.add.image(
      config.centerX,
      TITLE_OFFSET_Y,
      "select_level_text"
    );
    title.setScrollFactor(0);

    const border = this.add.image(
      config.centerX,
      BORDER_OFFSET_Y,
      "select_level_border"
    );
    border.setScrollFactor(0);

    this.leftArrowEnabled = this.add.image(
      40,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "left_arrow"
    );
    this.rightArrowEnabled = this.add.image(
      config.width - 40,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "right_arrow"
    );
    const navigationData = [
      {
        button: this.leftArrowEnabled,
        diffX: -config.width,
        func: (pageNum): void => pageNum - 1,
      },
      {
        button: this.rightArrowEnabled,
        diffX: config.width,
        func: (pageNum): void => pageNum + 1,
      },
    ];
    for (const { button, diffX, func } of navigationData) {
      button.setScrollFactor(0);
      button.setInteractive();
      button.on("pointerdown", () => {
        this.currentPageNum = func(this.currentPageNum);
        this.scene.scene.tweens.add({
          targets: camera,
          ease: "Sine.easeInOut",
          duration: 200,
          scrollX: camera.scrollX + diffX,
        });
        this.updatePage();
      });
    }

    this.leftArrowDisabled = this.add.image(
      80,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "left_arrow_disabled"
    );
    this.leftArrowDisabled.setScrollFactor(0);
    this.leftArrowDisabled.visible = false;
    this.rightArrowDisabled = this.add.image(
      config.width - 80,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "right_arrow_disabled"
    );
    this.rightArrowDisabled.setScrollFactor(0);
    this.rightArrowDisabled.visible = false;

    this.pageNumText = this.add.text(
      config.centerX,
      config.height - 40,
      `(${this.currentPageNum}/${this.pagesCount})`,
      {
        font: "14px Monospace",
        fill: "#FDFFFC",
      }
    );
    this.pageNumText.setPosition(
      config.centerX - this.pageNumText.width / 2,
      config.height - 80
    );
    this.pageNumText.setScrollFactor(0);

    this.updatePage();

    let pageNum = 0;
    for (let levelNumber = 1; levelNumber <= LEVELS.length; levelNumber += 1) {
      const isCompleted = levelNumber in completedLevels;
      const isNextLevel = levelNumber === nextLevel;

      const yOffset = isCompleted || isNextLevel ? 32 : 82;
      let imageKey = "";
      if (isCompleted || isNextLevel) {
        imageKey = "level_tile_green";
      } else {
        imageKey = "level_tile_locked";
      }

      const levelImage = this.add.image(0, 0, imageKey);
      levelImage.x = levelPos.x - levelWidthDistance / 2;
      levelImage.y = levelPos.y - levelImage.height + LEVEL_OFFSET_Y;

      let firstDigitOffsetX = 0;
      let offsetDiff = 0;

      const levelNumberText = levelNumber.toString();
      const firstDigit = parseInt(levelNumberText[0]);
      const firstDigitKey =
        isCompleted || isNextLevel
          ? LEVEL_DIGIT_BIG_MAP[firstDigit]
          : LEVEL_DIGIT_MEDIUM_MAP[firstDigit];
      const firstDigitImage = this.add.image(0, 0, firstDigitKey);

      if (levelNumber > 9) {
        const secondDigit = parseInt(levelNumberText[1]);
        const secondDigitKey =
          isCompleted || isNextLevel
            ? LEVEL_DIGIT_BIG_MAP[secondDigit]
            : LEVEL_DIGIT_MEDIUM_MAP[secondDigit];
        const secondDigitImage = this.add.image(0, 0, secondDigitKey);

        const secondDigitOffsetX = secondDigitImage.width;
        firstDigitOffsetX = firstDigitImage.width;
        // @HACK digit "1" has different width, so needs some special treatment
        if (secondDigit === 1) {
          offsetDiff = -Math.abs(firstDigitOffsetX - secondDigitOffsetX) / 2;
        } else {
          offsetDiff = Math.abs(firstDigitOffsetX - secondDigitOffsetX) / 2;
        }

        secondDigitImage.setPosition(
          levelPos.x -
            levelWidthDistance / 2 -
            secondDigitImage.width / 2 +
            secondDigitOffsetX -
            offsetDiff,
          levelImage.y - levelImage.height / 2 + yOffset
        );
      }

      firstDigitImage.setPosition(
        levelPos.x -
          levelWidthDistance / 2 -
          firstDigitOffsetX / 2 -
          offsetDiff,
        levelImage.y - levelImage.height / 2 + yOffset
      );

      if (isCompleted || isNextLevel) {
        const level = completedLevels[levelNumber];
        const awardKey = isNextLevel
          ? "trophy_empty"
          : level >= 2
          ? "trophy_gold"
          : "trophy_silver";
        this.add.image(levelImage.x, levelImage.y + 30, awardKey);
      }

      if (levelNumber % LEVELS_PER_PAGE === 0) {
        pageNum += 1;
        levelPos.x = TILE_OFFSET_X + pageNum * config.width;
        levelPos.y = 256 - levelImage.height + LEVEL_OFFSET_Y;
      } else if (levelNumber % LEVELS_PER_ROW === 0) {
        levelPos.x = TILE_OFFSET_X + pageNum * config.width;
        levelPos.y += ROW_HEIGHT;
      } else {
        levelPos.x = levelPos.x + TILE_DISTANCE_X;
      }

      // Only allow click if it's completed or it's the next level
      if (isCompleted || isNextLevel || process.env.DEBUG === "true" || true) {
        // Make the text interactive
        levelImage.setInteractive(
          new Phaser.Geom.Rectangle(0, 0, levelImage.width, levelImage.height),
          Phaser.Geom.Rectangle.Contains
        );

        levelImage.on("pointerdown", () =>
          this.scene.start("GameplayScene", { levelNumber })
        );
      }
    }

    ((): void => new AdminBar(this, true))();
  }

  updatePage(): void {
    // Left arrow
    if (this.currentPageNum < 2) {
      this.leftArrowEnabled.visible = false;
      this.leftArrowDisabled.visible = true;
    } else {
      this.leftArrowEnabled.visible = true;
      this.leftArrowDisabled.visible = false;
    }

    // Right arrow
    if (this.currentPageNum < this.pagesCount) {
      this.rightArrowEnabled.visible = true;
      this.rightArrowDisabled.visible = false;
    } else {
      this.rightArrowEnabled.visible = false;
      this.rightArrowDisabled.visible = true;
    }

    this.pageNumText.setText(`(${this.currentPageNum}/${this.pagesCount})`);
  }
}
