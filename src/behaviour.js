const ROTATION_SPEED = 0.002;

export default {
  rotate(object, delta) {
    object.setRotation(object.rotation + ROTATION_SPEED * delta);
  },
};
