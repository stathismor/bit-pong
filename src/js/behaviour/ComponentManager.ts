export class ComponentManager {
  static components = [];

  static Add(scene, owner, component): void {
    this.components.push(component);
  }

  static Clear(): void {
    this.components.length = 0;
  }

  static Update(delta): void {
    this.components.forEach((component) => component.update(delta));
  }

  static GetComponents() {
    return this.components;
  }
}
