import LEVELS from "../../../config/levels.json";
import { Ball } from "../sprite/Ball";
import { Player } from "../sprite/Player";
import { Cup } from "../sprite/Cup";
import { Table } from "../sprite/Table";
import RetryLevelPopup from "../sprite/RetryLevelPopup";
import CompleteLevelPopup from "../sprite/CompleteLevelPopup";
import { ComponentManager } from "../behaviour/ComponentManager";
import HealthBar from "../hud/HealthBar";
import LevelBar from "../hud/LevelBar";
import * as constants from "../constants";
import { initCategories } from "../collision";

export class GameplayScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameplayScene",
    });
    this.levelNumber = 1;
    this.tableIds = [];
    this.player = null;
  }

  create(data): void {
    const config = this.sys.game.CONFIG;
    this.levelNumber = this.getLevelNumber(data);

    const level = LEVELS[this.levelNumber - 1];
    const {
      tables: confTables = [],
      cups: confCups,
      balls: ballsConf = [],
      player,
    } = level;

    initCategories(this);

    ballsConf.forEach((ballConf) => {
      const ball = new Ball(
        this,
        ballConf.x,
        ballConf.y,
        constants.TEXTURE_ATLAS,
        "ball"
      );
      this.add.existing(ball);
    });

    this.player = new Player(
      this,
      player.x,
      player.y,
      constants.TEXTURE_ATLAS,
      player.name,
      Phaser.Math.DegToRad(0)
    );
    this.add.existing(this.player);
    const ballIds = this.player.body.parts.map((part) => part.id);

    confTables.forEach((confTable) => {
      const table = new Table(
        this,
        confTable.x,
        confTable.y,
        constants.TEXTURE_ATLAS,
        "table",
        Phaser.Math.DegToRad(confTable.angle)
      );
      this.add.existing(table);
      this.tableIds.push(table.body.id);
    });

    const cups = [];
    confCups.forEach((confCup) => {
      const cup = new Cup(
        this,
        confCup.x,
        confCup.y,
        confCup.angle,
        ballIds,
        confCup.behaviours
      );
      this.add.existing(cup);
      cups.push(cup);
    });

    ((): void => new LevelBar(this, this.levelNumber))();

    // @TODO: How do I get lives number here
    const healthBar = new HealthBar(this, this.player.livesNumber);
    const retryLevelPopup = new RetryLevelPopup(
      this,
      config.centerX,
      config.centerY
    );

    this.player.on("dead", () => {
      healthBar.update(this.player.livesNumber);
      if (this.player.livesNumber === 0) {
        retryLevelPopup.popup();
      }
    });

    const completeLevelPopup = new CompleteLevelPopup(
      this,
      config.centerX,
      config.centerY
    );

    cups.forEach((cup) => {
      cup.on("complete", () => {
        completeLevelPopup.popup();
      });
    });

    if (process.env.DEBUG) {
      this.debug();
    }
  }

  update(time, delta): void {
    ComponentManager.Update(delta);
  }

  getLevelNumber(data): void {
    const { result, levelNumber } = data;

    if (levelNumber) {
      return levelNumber;
    }

    switch (result) {
      case "fail":
        return this.levelNumber;
      case "success":
        return this.levelNumber + 1;
      default:
        return this.levelNumber;
    }
  }

  debug(): void {
    // Add a red border
    const config = this.sys.game.CONFIG;
    const size = 2;
    const border = this.add.rectangle(
      config.centerX,
      config.centerY,
      config.width - size,
      config.height - size
    );
    border.setStrokeStyle(size, "0xFF0000");
  }
}
