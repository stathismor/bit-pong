import Phaser from "phaser";
interface SpriteConf {
  x: number;
  y: number;
  angle?: number;
  isStatic?: boolean;
  [key: string]: unknown;
}

interface SpriteData {
  sprite: Phaser.Physics.Matter.Sprite;
  conf: SpriteConf;
}

export class SpriteManager {
  static player: SpriteData | undefined = undefined;
  static balls: SpriteData[] = [];
  static cups: SpriteData[] = [];
  static tables: SpriteData[] = [];

  static Add(sprite: Phaser.Physics.Matter.Sprite, type: string, conf: SpriteConf): void {
    switch (type) {
      case "player":
        SpriteManager.player = { sprite, conf };
        break;
      case "ball":
        SpriteManager.balls.push({ sprite, conf });
        break;
      case "cup":
        SpriteManager.cups.push({ sprite, conf });
        break;
      case "table":
        SpriteManager.tables.push({ sprite, conf });
        break;
      default:
      // Oopsie
    }
  }

  static Clear(): void {
    const spritesData = [...SpriteManager.balls, ...SpriteManager.cups];
    for (const spriteData of spritesData) {
      const { sprite } = spriteData;
      sprite.destroy();
    }

    SpriteManager.player = undefined;
    SpriteManager.balls.length = 0;
    SpriteManager.cups.length = 0;
    SpriteManager.tables.length = 0;
  }

  static ResetPositions(): void {
    const spritesData = [...SpriteManager.balls, ...SpriteManager.cups];
    for (const spriteData of spritesData) {
      const { sprite, conf } = spriteData;

      sprite.x = conf.x;
      sprite.y = conf.y;
      sprite.rotation = Phaser.Math.DegToRad(conf.angle || 0);
      (sprite.body as MatterJS.BodyType).speed = 0;
      sprite.setStatic(true);
      sprite.setStatic(!!conf.isStatic);
    }
  }

  static GetPlayer(): Phaser.Physics.Matter.Sprite | undefined {
    return SpriteManager.player ? SpriteManager.player.sprite : undefined;
  }

  static GetBalls(): Phaser.Physics.Matter.Sprite[] {
    return SpriteManager.balls.map((ball) => ball.sprite);
  }
}
