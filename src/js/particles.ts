import * as constants from "./constants";

export let successEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
export let spillParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
export let rainParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

export function initParticles(scene: Phaser.Scene): void {
  const config = (scene.sys.game as GameWithConfig).CONFIG;

  // In Phaser 4 (3.60+), scene.add.particles() returns a ParticleEmitter directly
  // spillParticles is used by Fountain as a shared emitter — but in the new API
  // each call to scene.add.particles creates a separate emitter.
  // We create a "blank" emitter for spillParticles that Fountain will configure.
  spillParticles = scene.add.particles(0, 0, constants.TEXTURE_ATLAS, {
    frame: ["drop_dark", "drop_light"],
    speed: { min: 200 * 1.3, max: 300 * 1.3 },
    accelerationY: 500,
    lifespan: { min: 500, max: 700 },
    quantity: 20,
    emitting: false,
    alpha: { start: 1, end: 0, ease: "Quint.easeIn" },
  });
  spillParticles.setDepth(10);

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
    spillParticles?.destroy();
    rainParticles?.destroy();
    successEmitter?.destroy();
  });
}
