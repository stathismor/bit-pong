import LEVELS from "../../../config/levels.json";
import { AdminBar } from "../hud/AdminBar";

import * as constants from "../constants";

const LEVELS_PER_ROW = 5;
const LEVELS_PER_PAGE = 15;
const ROW_HEIGHT = 160;
const TITLE_OFFSET_Y = 100;
const BORDER_OFFSET_Y = 420;
const LEVEL_OFFSET_Y = 130;
const TILE_OFFSET_X = 291;
const TILE_DISTANCE_X = 180;
const ARROW_OFFSET_X = 137;
const ARROW_OFFSET_Y = 414;
const PAGE_NUMBER_OFFSET_X = 25;
const PAGE_NUMBER_OFFSET_Y = 664;
const PAGE_NUMBER_DISTANCE = 14;

const LEVEL_DIGIT_BIG_MAP = {
  0: "digit_big_zero",
  1: "digit_big_one",
  2: "digit_big_two",
  3: "digit_big_three",
  4: "digit_big_four",
  5: "digit_big_five",
  6: "digit_big_six",
  7: "digit_big_seven",
  8: "digit_big_eight",
  9: "digit_big_nine",
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

  create(data): void {
    const config = this.sys.game.CONFIG;
    let { levelNumber } = data;
    const levelWidthDistance = 22; //config.width / LEVELS_PER_ROW;
    const levelPos = { x: TILE_OFFSET_X, y: 252 };
    const completedLevels =
      JSON.parse(localStorage.getItem(constants.LOGAL_STORAGE_ROOT)) || {};
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
      constants.TEXTURE_ATLAS,
      "select_level_text"
    );
    title.setScrollFactor(0);

    this.pagesCountKey = constants.LEVEL_DIGIT_SMALL_MAP[this.pagesCount];
    this.currentPageNumKey =
      constants.LEVEL_DIGIT_SMALL_MAP[this.currentPageNum];

    const leftBracket = this.add.image(
      config.centerX - PAGE_NUMBER_OFFSET_X,
      PAGE_NUMBER_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "digit_small_bracket_left"
    );
    leftBracket.setScrollFactor(0);
    this.currentPageNumImage = this.add.image(
      config.centerX - PAGE_NUMBER_OFFSET_X + PAGE_NUMBER_DISTANCE,
      PAGE_NUMBER_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      this.currentPageNumKey
    );
    this.currentPageNumImage.setScrollFactor(0);
    const slash = this.add.image(
      config.centerX - PAGE_NUMBER_OFFSET_X + PAGE_NUMBER_DISTANCE * 2,
      PAGE_NUMBER_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "digit_small_slash"
    );
    slash.setScrollFactor(0);
    const pagesCountImage = this.add.image(
      config.centerX - PAGE_NUMBER_OFFSET_X + PAGE_NUMBER_DISTANCE * 3,
      PAGE_NUMBER_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      this.pagesCountKey
    );
    pagesCountImage.setScrollFactor(0);
    const rightBracket = this.add.image(
      config.centerX - PAGE_NUMBER_OFFSET_X + PAGE_NUMBER_DISTANCE * 4,
      PAGE_NUMBER_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "digit_small_bracket_right"
    );
    rightBracket.setScrollFactor(0);

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

      const levelImage = this.add.image(
        0,
        0,
        constants.TEXTURE_ATLAS,
        imageKey
      );
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
      const firstDigitImage = this.add.image(
        0,
        0,
        constants.TEXTURE_ATLAS,
        firstDigitKey
      );

      if (levelNumber > 9) {
        const secondDigit = parseInt(levelNumberText[1]);
        const secondDigitKey =
          isCompleted || isNextLevel
            ? LEVEL_DIGIT_BIG_MAP[secondDigit]
            : LEVEL_DIGIT_MEDIUM_MAP[secondDigit];
        const secondDigitImage = this.add.image(
          0,
          0,
          constants.TEXTURE_ATLAS,
          secondDigitKey
        );

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
          ? "trophy_gold_small"
          : "trophy_silver_small";
        this.add.image(
          levelImage.x,
          levelImage.y + 30,
          constants.TEXTURE_ATLAS,
          awardKey
        );
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
      if (isCompleted || isNextLevel || process.env.DEBUG === "true") {
        // Make the text interactive
        levelImage.setInteractive(
          new Phaser.Geom.Rectangle(0, 0, levelImage.width, levelImage.height),
          Phaser.Geom.Rectangle.Contains
        );

        levelImage.on("pointerdown", () => {
          this.scene.scene.sound.play("button_click");
          this.scene.start("GameplayScene", { levelNumber });
        });
      }
    }

    const border = this.add.image(
      config.centerX,
      BORDER_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "select_level_border"
    );
    border.setScrollFactor(0);

    this.leftArrowEnabled = this.add.image(
      ARROW_OFFSET_X,
      ARROW_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "arrow_left_enabled"
    );
    this.rightArrowEnabled = this.add.image(
      config.width - ARROW_OFFSET_X,
      ARROW_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "arrow_right_enabled"
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
        this.scene.scene.sound.play("button_click");
        this.currentPageNum = func(this.currentPageNum);
        this.leftArrowEnabled.removeInteractive();
        this.rightArrowEnabled.removeInteractive();
        this.scene.scene.tweens.add({
          targets: camera,
          ease: "Sine.easeInOut",
          duration: 200,
          scrollX: camera.scrollX + diffX,
          onComplete: () => {
            this.leftArrowEnabled.setInteractive();
            this.rightArrowEnabled.setInteractive();
          },
        });
        this.updatePage();
      });
    }

    this.leftArrowDisabled = this.add.image(
      ARROW_OFFSET_X,
      ARROW_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "arrow_left_disabled"
    );
    this.leftArrowDisabled.setScrollFactor(0);
    this.leftArrowDisabled.visible = false;
    this.rightArrowDisabled = this.add.image(
      config.width - ARROW_OFFSET_X,
      ARROW_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "arrow_right_disabled"
    );
    this.rightArrowDisabled.setScrollFactor(0);
    this.rightArrowDisabled.visible = false;

    // Move page to current level number. If coming from gameplay scene,
    // move to that page, otherwise the last one.
    this.currentPageNum = Math.ceil(
      (levelNumber || nextLevel) / LEVELS_PER_PAGE
    );
    camera.scrollX += config.width * (this.currentPageNum - 1);

    this.updatePage();

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

    this.currentPageNumKey =
      constants.LEVEL_DIGIT_SMALL_MAP[this.currentPageNum];
    this.currentPageNumImage.setFrame(this.currentPageNumKey);
  }
}
