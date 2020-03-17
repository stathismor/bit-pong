export function iterate(obj, stack) {
  const keyList = [];
  function _iterate(objInner, stackInner) {
    for (const property in objInner) {
      if (objInner.hasOwnProperty(property)) {
        if (typeof objInner[property] === 'object') {
          _iterate(objInner[property], stackInner + '.' + property);
        } else {
          const keys = {};
          keys[property] = objInner[property];
          keyList.push(keys);
        }
      }
    }
    return keyList;
  }
  return _iterate(obj, stack);
}

export function closestPointToCircle(
  centerX,
  centerY,
  currentX,
  currentY,
  radius
) {
  const angle = Phaser.Math.Angle.Between(centerX, centerY, currentX, currentY);
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return { x, y };
}

export function isInCircle(x, y, currentX, currentY, radius) {
  return Phaser.Math.Distance.Between(x, y, currentX, currentY) <= radius;
}
