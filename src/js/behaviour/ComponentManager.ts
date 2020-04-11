export class ComponentManager {
  static components = [];

  static Add(scene, owner, component): void {
    this.components.push(component);
  }

  static Update(delta): void {
    this.components.forEach((component) => component.update(delta));
  }
}
