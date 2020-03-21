export class ScaleManager {
  constructor(width, height, isDesktop) {
    window.addEventListener("resize", () =>
      ScaleManager.resize(width, height, isDesktop)
    );
    ScaleManager.resize(width, height, isDesktop);
  }

  static resize(configWidth, configHeight, isDesktop) {
    // Check if device DPI messes up the width-height-ratio
    const canvas = document.getElementsByTagName("canvas")[0];
    const content = document.getElementById("content");

    // For desktop, only multiply with integer number
    if (isDesktop) {
      const multipleHeight = Math.max(
        1,
        Math.floor(window.innerHeight / configHeight)
      );
      const multipleWidth = Math.max(
        1,
        Math.floor(window.innerWidth / configWidth)
      );
      const multiple = Math.min(multipleWidth, multipleHeight);

      canvas.style.width = `${multiple * configWidth}px`;
      canvas.style.height = `${multiple * configHeight}px`;

      content.style.width = canvas.style.width;
      content.style.height = canvas.style.height;
      return;
    }

    // Width-height-ratio of game resolution
    const gameRatio = configWidth / configHeight;

    // Make content full height of browser and keep the ratio of game resolution
    content.style.width = `${window.innerHeight * gameRatio}px`;
    content.style.height = `${window.innerHeight}px`;

    const dpiW = parseInt(content.style.width, 10) / canvas.width;
    const dpiH = parseInt(content.style.height, 10) / canvas.height;

    const height = window.innerHeight * (dpiW / dpiH);
    const width = height * gameRatio;

    // Scale canvas
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
}

export default ScaleManager;
