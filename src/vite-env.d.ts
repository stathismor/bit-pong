/// <reference types="vite/client" />

interface GameConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface GameWithConfig extends Phaser.Game {
  CONFIG: GameConfig;
}
