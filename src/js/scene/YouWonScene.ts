import { AdminBar } from "../hud/AdminBar";

import LEVELS from "../../../config/levels.json";
import { SpriteManager } from "../sprite/SpriteManager";
import { Cup } from "../sprite/Cup";
import { Table } from "../sprite/Table";
import { Ball } from "../sprite/Ball";
import { initParticles } from "../particles";
import { ComponentManager } from "../behaviour/ComponentManager";
import { addSmallNumber, getCompletedLevels } from "../utils";
import * as constants from "../constants";

const TITLE_OFFSET_Y = 100;
const CUPS_OFFSET_X = 200;
const SPRITES_OFFSET_Y = 440;
const AWARD_OFFSET_X = 50;
const AWARD_OFFSET_Y = 50;

interface BehaviourConf {
  name: string;
  options?: Record<string, unknown>;
}

interface SpriteConf {
  x: number;
  y: number;
  angle?: number;
  isStatic?: boolean;
  name?: string;
  behaviours?: BehaviourConf[];
  [key: string]: unknown;
}

export class YouWonScene extends Phaser.Scene {
  constructor() {
    super({
      key: "YouWonScene",
    });
  }

  create(): void {
    const config = (this.sys.game as GameWithConfig).CONFIG;

    const spritesConfig: {
      balls: SpriteConf[];
      tables: SpriteConf[];
      tables_half: SpriteConf[];
      cups: SpriteConf[];
    } = {
      balls: [
        {
          x: 370,
          y: SPRITES_OFFSET_Y - 44,
          isStatic: true,
          behaviours: [
            {
              name: "jump",
              options: {
                y: SPRITES_OFFSET_Y - 90,
              },
            },
          ],
        },
        {
          x: 680,
          y: SPRITES_OFFSET_Y - 44,
          isStatic: true,
          name: "ball_orange",
          behaviours: [
            {
              name: "jump",
              options: {
                y: SPRITES_OFFSET_Y - 80,
                delay: 600,
              },
            },
          ],
        },
        {
          x: 910,
          y: SPRITES_OFFSET_Y - 17,
          isStatic: true,
          name: "drop_dark",
          behaviours: [
            {
              name: "jump",
              options: {
                y: SPRITES_OFFSET_Y - 110,
                delay: 500,
                duration: 1000,
              },
            },
          ],
        },
      ],
      tables: [
        {
          x: config.centerX,
          y: SPRITES_OFFSET_Y,
        },
      ],
      tables_half: [
        {
          x: 800,
          y: SPRITES_OFFSET_Y - 138,
          angle: 90,
          behaviours: [
            {
              name: "jump",
              options: {
                y: SPRITES_OFFSET_Y - 160,
                delay: 300,
              },
            },
          ],
        },
      ],
      cups: [
        {
          x: CUPS_OFFSET_X,
          y: 160,
          angle: 45,
          behaviours: [
            {
              name: "fountain",
            },
          ],
        },
        {
          x: config.width - CUPS_OFFSET_X,
          y: 160,
          angle: 315,
          behaviours: [
            {
              name: "fountain",
            },
          ],
        },
        {
          x: 540,
          y: SPRITES_OFFSET_Y - 65,
          behaviours: [
            {
              name: "jump",
              options: {
                y: SPRITES_OFFSET_Y - 100,
                delay: 700,
                duration: 1000,
              },
            },
          ],
        },
      ],
    };

    SpriteManager.Clear();
    ComponentManager.Clear();
    initParticles(this);

    this.add.image(
      config.centerX,
      config.centerY,
      constants.TEXTURE_ATLAS,
      "background",
    );

    this.add.image(
      config.centerX,
      TITLE_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "you_won_title",
    );

    this.add.image(
      config.centerX,
      560,
      constants.TEXTURE_ATLAS,
      "you_won_text",
    );

    const completedLevels = getCompletedLevels();

    const levelsCount = Object.keys(completedLevels).reduce(
      (accumulator, currentValue) => {
        const level = completedLevels[currentValue];
        return level.lives > 1 ? accumulator + 1 : accumulator;
      },
      0,
    );

    let offsetX = AWARD_OFFSET_X;
    const trophy = this.add.image(
      offsetX,
      config.height - AWARD_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "trophy_gold_small",
    );

    offsetX += trophy.width / 2 + 10;
    this.add.image(
      offsetX,
      config.height - AWARD_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "digit_small_colon",
    );

    offsetX += 15;
    const width = addSmallNumber(
      this,
      levelsCount,
      offsetX,
      config.height - AWARD_OFFSET_Y,
    );

    offsetX += width;
    const slashImg = this.add.image(
      offsetX,
      config.height - AWARD_OFFSET_Y,
      constants.TEXTURE_ATLAS,
      "digit_small_slash",
    );

    offsetX += slashImg.width;
    addSmallNumber(
      this,
      LEVELS.length,
      offsetX,
      config.height - AWARD_OFFSET_Y,
    );

    const { cups, balls, tables, tables_half } = spritesConfig;

    balls.forEach((ballConf) => {
      const ball = new Ball(
        this,
        ballConf.x,
        ballConf.y,
        constants.TEXTURE_ATLAS,
        ballConf.name || "ball_white",
        !!ballConf.isStatic,
        ballConf.behaviours,
      );
      this.add.existing(ball);
      SpriteManager.Add(ball, "ball", ballConf);
    });

    cups.forEach((cupConf) => {
      const cup = new Cup(
        this,
        cupConf.x,
        cupConf.y,
        cupConf.angle || 0,
        cupConf.behaviours,
      );
      this.add.existing(cup);
    });

    tables.forEach((conf) => {
      const table = new Table(
        this,
        conf.x,
        conf.y,
        constants.TEXTURE_ATLAS,
        "table",
        Phaser.Math.DegToRad(conf.angle || 0),
        conf.behaviours,
      );
      this.add.existing(table);
    });

    tables_half.forEach((conf) => {
      const table = new Table(
        this,
        conf.x,
        conf.y,
        constants.TEXTURE_ATLAS,
        "table_half",
        Phaser.Math.DegToRad(conf.angle || 0),
        conf.behaviours,
      );
      this.add.existing(table);
    });

    void new AdminBar(this, true);
  }

  update(_time: number, delta: number): void {
    ComponentManager.Update(delta);
  }
}
