class ScaleManager {
  constructor(width, height, isDesktop) {
    window.addEventListener('resize', () =>
      ScaleManager.resize(width, height, isDesktop)
    );
    ScaleManager.resize(width, height, isDesktop);
  }

  static resize(configWidth, configHeight, isDesktop) {
    // Check if device DPI messes up the width-height-ratio
    const canvas = document.getElementsByTagName('canvas')[0];

    // For desktop, only multiply with integer number
    if (isDesktop) {
      const multiple = Math.max(
        1,
        Math.floor(window.innerHeight / configHeight)
      );
      canvas.style.width = `${multiple * configWidth}px`;
      canvas.style.height = `${multiple * configHeight}px`;
      return;
    }

    // Width-height-ratio of game resolution
    const gameRatio = configWidth / configHeight;

    // Make div full height of browser and keep the ratio of game resolution
    const div = document.getElementById('content');
    div.style.width = `${window.innerHeight * gameRatio}px`;
    div.style.height = `${window.innerHeight}px`;

    const dpiW = parseInt(div.style.width, 10) / canvas.width;
    const dpiH = parseInt(div.style.height, 10) / canvas.height;

    const height = window.innerHeight * (dpiW / dpiH);
    const width = height * gameRatio;

    // Scale canvas
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
}

export default ScaleManager;
