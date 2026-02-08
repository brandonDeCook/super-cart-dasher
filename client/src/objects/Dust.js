import Phaser from "phaser";

const ensureAnims = (scene) => {
  if (scene.anims.exists("dust")) {
    return;
  }
  const texture = scene.textures.get("dust");
  const frameNames = texture.getFrameNames().filter((name) => name !== "__BASE");
  if (!frameNames.length) {
    return;
  }
  const frames = frameNames
    .sort((a, b) => {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }
      return String(a).localeCompare(String(b));
    })
    .map((name) => ({ key: "dust", frame: name }));

  scene.anims.create({
    key: "dust",
    frames,
    frameRate: 16,
    repeat: 0
  });
};

export default class Dust extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "dust", 0);
    scene.add.existing(this);
    ensureAnims(scene);
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x, y, scale = 1) {
    this.setPosition(x, y);
    this.setScale(scale);
    this.setActive(true);
    this.setVisible(true);
    if (this.scene.anims.exists("dust")) {
      this.play("dust");
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.setActive(false);
        this.setVisible(false);
      });
    } else {
      this.setFrame(0);
      this.scene.time.delayedCall(200, () => {
        this.setActive(false);
        this.setVisible(false);
      });
    }
  }
}
