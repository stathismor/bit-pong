const OFFSET = 8;

export default class LevelBar {
  constructor(scene, levelNumber) {
    const config = scene.sys.game.CONFIG;

    const levelText = scene.add.text(0, 0, `Level: ${levelNumber}`, {
      font: "12px Monospace",
      fill: "#000000",
    });

    levelText.setPosition(
      config.centerX - levelText.width / 2 - OFFSET,
      OFFSET
    );
  }
}
