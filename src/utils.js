export default {
  closestPointToCircle(centerX, centerY, currentX, currentY, radius) {
    const angle = Phaser.Math.Angle.Between(
      centerX,
      centerY,
      currentX,
      currentY
    );
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y };
  },
  isInCircle(x, y, currentX, currentY, radius) {
    return Phaser.Math.Distance.Between(x, y, currentX, currentY) <= radius;
  },
};
