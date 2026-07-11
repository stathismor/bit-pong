import Phaser from "phaser";
import LEVELS from "../../../config/levels.json";
import { Ball } from "../sprite/Ball";
import { Player } from "../sprite/Player";
import { Cup } from "../sprite/Cup";
import { Table } from "../sprite/Table";
import RetryLevelPopup from "../sprite/RetryLevelPopup";
import { CompleteLevelPopup } from "../sprite/CompleteLevelPopup";
import { SpriteManager } from "../sprite/SpriteManager";
import { ComponentManager } from "../behaviour/ComponentManager";
import HealthBar from "../hud/HealthBar";
import LevelBar from "../hud/LevelBar";
import { AdminBar } from "../hud/AdminBar";
import * as constants from "../constants";
import { initCategories } from "../collision";
import { initParticles } from "../particles";
import { initCollisions } from "../CollisionManager";

export enum GameplaySceneStatus {
  PLAY,
  RETRY,
  COMPLETE,
}

interface LevelData {
  levelNumber?: number;
  result?: string;
  keyPressed?: boolean;
}

interface BehaviourConf {
  name: string;
  options?: Record<string, unknown>;
}

interface LevelConf {
  tables?: { x: number; y: number; angle?: number; behaviours?: BehaviourConf[] }[];
  tables_half?: { x: number; y: number; angle?: number; behaviours?: BehaviourConf[] }[];
  cups?: { x: number; y: number; angle: number; behaviours?: BehaviourConf[] }[];
  balls?: { x: number; y: number; name?: string; isStatic: boolean; behaviours?: BehaviourConf[] }[];
  player: { x: number; y: number; name: string; angle?: number; depth: number; behaviours?: BehaviourConf[] };
}

export class GameplayScene extends Phaser.Scene {
  levelNumber = 1;
  status: GameplaySceneStatus = GameplaySceneStatus.PLAY;
  keyPressed = false;
  completeLevelPopup!: CompleteLevelPopup;

  constructor() {
    super({
      key: "GameplayScene",
    });
  }

  create(data: LevelData): void {
    const config = (this.sys.game as GameWithConfig).CONFIG;
    this.levelNumber = this.getLevelNumber(data);
    this.status = GameplaySceneStatus.PLAY;
    this.keyPressed = data.keyPressed || false;

    initCategories(this as unknown as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics });

    SpriteManager.Clear();
    ComponentManager.Clear();

    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "background",
    );

    initParticles(this);

    const level = (LEVELS as LevelConf[])[this.levelNumber - 1];
    const {
      tables: confTables = [],
      tables_half: confTablesHalf = [],
      cups: confCups = [],
      balls: ballsConf = [],
      player: playerConf,
    } = level;

    ballsConf.forEach((ballConf) => {
      const ball = new Ball(
        this,
        ballConf.x,
        ballConf.y,
        constants.TEXTURE_ATLAS,
        ballConf.name || "ball_white",
        ballConf.isStatic,
        ballConf.behaviours,
      );
      this.add.existing(ball);
      SpriteManager.Add(ball, "ball", ballConf);
    });

    const player = new Player(
      this,
      playerConf.x,
      playerConf.y,
      constants.TEXTURE_ATLAS,
      playerConf.name,
      Phaser.Math.DegToRad(playerConf.angle || 0),
      playerConf.depth,
      playerConf.behaviours,
    );
    SpriteManager.Add(player, "player", playerConf);
    this.add.existing(player);

    initCollisions(this as unknown as Parameters<typeof initCollisions>[0], player as unknown as Parameters<typeof initCollisions>[1]);

    confTables.forEach((confTable) => {
      const table = new Table(
        this,
        confTable.x,
        confTable.y,
        constants.TEXTURE_ATLAS,
        "table",
        Phaser.Math.DegToRad(confTable.angle || 0),
        confTable.behaviours,
      );
      this.add.existing(table);
    });

    confTablesHalf.forEach((confTable) => {
      const table = new Table(
        this,
        confTable.x,
        confTable.y,
        constants.TEXTURE_ATLAS,
        "table_half",
        Phaser.Math.DegToRad(confTable.angle || 0),
        confTable.behaviours,
      );
      this.add.existing(table);
    });

    confCups.forEach((confCup) => {
      const cup = new Cup(
        this,
        confCup.x,
        confCup.y,
        confCup.angle,
        confCup.behaviours,
      );
      this.add.existing(cup);
    });

    void new LevelBar(this, this.levelNumber);

    const healthBar = new HealthBar(this, player.livesNumber);
    const retryLevelPopup = new RetryLevelPopup(
      this,
      config.centerX,
      config.centerY,
      this.levelNumber,
    );

    player.on("dead", () => {
      healthBar.update(player.livesNumber);
      if (player.livesNumber === 0) {
        retryLevelPopup.popup();
      }
    });

    void new AdminBar(this, true, this.levelNumber);

    this.completeLevelPopup = new CompleteLevelPopup(
      this,
      config.centerX,
      config.centerY,
      this.levelNumber,
      LEVELS.length,
    );

    if (import.meta.env.DEV) {
      this.debug();
    }
  }

  update(_time: number, delta: number): void {
    ComponentManager.Update(delta);
  }

  getStatus(): GameplaySceneStatus {
    return this.status;
  }

  setStatus(status: GameplaySceneStatus): void {
    this.status = status;
  }

  complete(): void {
    this.completeLevelPopup.popup();
  }

  getLevelNumber(data: LevelData): number {
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
    const config = (this.sys.game as GameWithConfig).CONFIG;
    const size = 2;
    const border = this.add.rectangle(
      config.centerX,
      config.centerY,
      config.width - size,
      config.height - size,
    );
    border.setStrokeStyle(size, 0xff0000);

    this.input.keyboard!.addKey("S").on("down", () => {
      this.sound.setMute(!this.sound.mute);
    });

    const skipLevelsData = [
      {
        key: this.input.keyboard!.addKey("LEFT"),
        func: (level: number): number => level - 1,
      },
      {
        key: this.input.keyboard!.addKey("RIGHT"),
        func: (level: number): number => level + 1,
      },
    ];

    for (const { key, func } of skipLevelsData) {
      key.on("down", () => {
        if (!this.keyPressed) {
          this.keyPressed = true;
          this.scene.start("GameplayScene", {
            levelNumber: func(this.levelNumber),
            keyPressed: true,
          });
        }
      });
      key.on("up", () => {
        this.keyPressed = false;
      });
    }
  }
}
