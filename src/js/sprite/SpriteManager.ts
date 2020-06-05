export class SpriteManager {
  static player = undefined;
  static balls = [];
  static cups = [];
  static tables = [];

  static Add(sprite, type, conf): void {
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
      sprite.body.speed = 0;
      sprite.setStatic(true); // Needed to reset any momentum
      sprite.setStatic(conf.isStatic);
    }
  }
}
