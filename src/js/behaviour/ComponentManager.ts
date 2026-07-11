import Phaser from "phaser";
interface Behaviour {
  update(delta?: number): void;
}

export class ComponentManager {
  static components: Behaviour[] = [];

  static Add(_scene: Phaser.Scene, _owner: Phaser.GameObjects.GameObject, component: Behaviour): void {
    this.components.push(component);
  }

  static Clear(): void {
    this.components.length = 0;
  }

  static Update(delta: number): void {
    this.components.forEach((component) => component.update(delta));
  }

  static GetComponents(): Behaviour[] {
    return this.components;
  }
}
