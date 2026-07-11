import Phaser from "phaser";
import * as constants from "./constants";

export let successEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
export let rainParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

export function initParticles(scene: Phaser.Scene): void {
  const config = (scene.sys.game as GameWithConfig).CONFIG;

  rainParticles = scene.add.particles(0, 0, constants.TEXTURE_ATLAS, {
    emitting: false,
  });
  rainParticles.setDepth(30);

  successEmitter = scene.add.particles(0, 0, constants.TEXTURE_ATLAS, {
    speedY: { min: 200, max: 400 },
    lifespan: { min: 1500, max: 2500 },
    quantity: 3,
    emitting: false,
    x: { min: 0, max: config.width },
    y: 0,
    frame: ["drop_dark", "drop_light"],
    alpha: { start: 1, end: 0.25, ease: "Quint.easeIn" },
  });
  successEmitter.setDepth(10);

  scene.events.once("shutdown", () => {
    rainParticles?.destroy();
    successEmitter?.destroy();
  });
}
