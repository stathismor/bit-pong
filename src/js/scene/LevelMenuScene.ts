import LEVELS from "../../../config/levels.json";
import * as constants from "../constants";

const LEVELS_PER_ROW = 3;
const LEVELS_PER_PAGE = 9;
const ROW_HEIGHT = 80;
const TITLE_OFFSET_Y = 50;
const LEVEL_OFFSET_Y = 50;

export class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LevelMenuScene",
    });
  }

  create(): void {
    const config = this.sys.game.CONFIG;
    const levelWidthDistance = config.width / LEVELS_PER_ROW;
    const levelPos = { x: levelWidthDistance, y: 128 };
    const completedLevels = JSON.parse(
      localStorage.getItem(constants.LOGAL_STORAGE_KEY)
    ) || [0];
    const nextLevel = Math.max(...completedLevels) + 1;
    const camera = this.scene.scene.cameras.main;

    this.pagesNum = Math.ceil(LEVELS.length / LEVELS_PER_PAGE);
    this.currentPageNum = 1;

    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "background"
    );
    this.add.image(
      config.centerX + config.width,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "background"
    );

    const title = this.add.image(
      config.centerX,
      TITLE_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "select_level"
    );
    title.setScrollFactor(0);

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
      40,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "left_arrow_disabled"
    );
    this.leftArrowDisabled.setScrollFactor(0);
    this.leftArrowDisabled.visible = false;
    this.rightArrowDisabled = this.add.image(
      config.width - 40,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "right_arrow_disabled"
    );
    this.rightArrowDisabled.setScrollFactor(0);
    this.rightArrowDisabled.visible = false;

    this.pageNumText = this.add.text(
      config.centerX,
      config.height - 20,
      `(${this.currentPageNum}/${this.pagesNum})`,
      {
        font: "14px Monospace",
        fill: "#FDFFFC",
      }
    );
    this.pageNumText.setPosition(
      config.centerX - this.pageNumText.width / 2,
      config.height - 40
    );
    this.pageNumText.setScrollFactor(0);

    this.updatePage();

    let pageNum = 0;
    for (let levelNumber = 1; levelNumber <= LEVELS.length; levelNumber += 1) {
      const isCompleted = completedLevels.includes(levelNumber);
      const isNextLevel = levelNumber === nextLevel;

      const colour = isCompleted ? "#011627" : "#fdfffc";
      const strokeColour = isCompleted ? "#fdfffc" : "#011627";
      const fontSize = isCompleted || isNextLevel ? 32 : 16;
      const yOffset = isCompleted || isNextLevel ? 8 : 23;
      let imageKey = "";
      if (isCompleted) {
        imageKey = "level_completed";
      } else if (isNextLevel) {
        imageKey = "level_empty";
      } else {
        imageKey = "level_locked";
      }

      const levelImage = this.add.image(
        0,
        0,
        constants.TEXTURE_ATLAS,
        imageKey
      );
      levelImage.x = levelPos.x - levelWidthDistance / 2;
      levelImage.y = levelPos.y - levelImage.height + LEVEL_OFFSET_Y;

      const levelText = this.add.text(0, 0, levelNumber.toString(), {
        fontFamily: "Arial",
        fill: colour,
        fontSize: fontSize,
      });
      levelText.setStroke(strokeColour, 5);
      levelText.setPosition(
        levelPos.x - levelWidthDistance / 2 - levelText.width / 2,
        levelImage.y - levelImage.height / 2 + yOffset
      );

      if (levelNumber % LEVELS_PER_PAGE === 0) {
        pageNum += 1;
        levelPos.x = levelWidthDistance + pageNum * config.width;
        levelPos.y = 128 - levelImage.height + LEVEL_OFFSET_Y;
      } else if (levelNumber % LEVELS_PER_ROW === 0) {
        levelPos.x = levelWidthDistance + pageNum * config.width;
        levelPos.y += ROW_HEIGHT;
      } else {
        levelPos.x = levelPos.x + levelWidthDistance;
      }

      // Only allow click if it's completed or it's the next level
      if (isCompleted || isNextLevel || process.env.DEBUG === "true") {
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
    if (this.currentPageNum < this.pagesNum) {
      this.rightArrowEnabled.visible = true;
      this.rightArrowDisabled.visible = false;
    } else {
      this.rightArrowEnabled.visible = false;
      this.rightArrowDisabled.visible = true;
    }

    this.pageNumText.setText(`(${this.currentPageNum}/${this.pagesNum})`);
  }
}
