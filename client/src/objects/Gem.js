import Phaser from "phaser";

const ensureAnims = (scene) => {
  if (scene.anims.exists("gem")) {
    return;
  }
  const texture = scene.textures.get("gem");
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
    .map((name) => ({ key: "gem", frame: name }));

  scene.anims.create({
    key: "gem",
    frames,
    frameRate: 6,
    repeat: -1
  });
};

export default class Gem extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "gem", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    ensureAnims(scene);
    this.setActive(false);
    this.setVisible(false);
    this.collected = false;
    this.baseY = y;
    this.bobTween = null;
    if (this.body) {
      this.body.setAllowGravity(false);
      this.body.setImmovable(true);
      this.body.enable = false;
    }
  }

  updateHitbox() {
    if (!this.body) {
      return;
    }
    const hitboxScale = 1.000001;
    const bodyWidth = this.displayWidth * hitboxScale;
    const bodyHeight = this.displayHeight * hitboxScale;
    this.body.setSize(bodyWidth, bodyHeight, true);
  }

  spawn(x, y, scale = 1) {
    this.setPosition(x, y);
    this.baseY = y;
    this.setScale(scale);
    this.setActive(true);
    this.setVisible(true);
    this.collected = false;
    if (this.body) {
      this.body.enable = true;
    }
    this.updateHitbox();
    if (this.scene.anims.exists("gem")) {
      this.play("gem");
    } else {
      this.setFrame(0);
    }

    if (this.bobTween) {
      this.bobTween.remove();
    }
    this.bobTween = this.scene.tweens.add({
      targets: this,
      y: y - 6 * scale,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  despawn() {
    if (this.bobTween) {
      this.bobTween.remove();
      this.bobTween = null;
    }
    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      this.body.enable = false;
    }
  }
}
