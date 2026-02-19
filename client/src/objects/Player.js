import Phaser from "phaser";

const WALK_SPEED = 120;
const DASH_SPEED = 200;
const SPEED_STEPS = [1, 1.25, 1.5, 1.75, 2, 2.25];
const SPEED_BOOST_WINDOW_MS = 2000;
const MAX_SPEED_DECAY_MS = 3000;
const SPEED_BOOST_MULTIPLIERS = [1, 1.25, 1.5, 1.75, 2, 3];
const WALK_SPEEDS = SPEED_STEPS.map((step) => WALK_SPEED * step);
const DASH_SPEEDS = SPEED_STEPS.map((step) => DASH_SPEED * step);

const ensureAnims = (scene) => {
  const anims = scene.anims;

  const buildFrames = (sheetKey) => {
    const texture = scene.textures.get(sheetKey);
    const frameNames = texture.getFrameNames().filter((name) => name !== "__BASE");
    if (!frameNames.length) {
      return [];
    }
    const sorted = frameNames.sort((a, b) => {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }
      return String(a).localeCompare(String(b));
    });
    return sorted.map((name) => ({ key: sheetKey, frame: name }));
  };

  const make = (key, sheetKey, frameRate) => {
    if (anims.exists(key)) {
      return;
    }
    const frames = buildFrames(sheetKey);
    if (!frames.length) {
      return;
    }
    anims.create({
      key,
      frames,
      frameRate,
      repeat: -1
    });
  };

  make("walk-down", "player_down", 10);
  make("dash-down", "player_down_dash", 16);
  make("walk-up", "player_up", 10);
  make("dash-up", "player_up_dash", 16);
  make("walk-side", "player_side", 10);
  make("dash-side", "player_side_dash", 16);
  make("idle-down", "player_idle_down", 6);
  make("idle-up", "player_idle_up", 6);
  make("idle-side", "player_idle_side", 6);
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, scale = 1) {
    super(scene, x, y, "player_down", 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(10);
    this.setScale(scale);
    this.setCollideWorldBounds(true);
    if (this.body) {
      this.body.setSize(this.width, this.height, true);
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.shiftKey = scene.input.keyboard.addKey("SHIFT");
    this.lastAnimKey = "idle-down";
    this.facing = "down";
    this.lastDustAt = 0;
    this.lastDustSide = -1;
    this.cartMoveSound = scene.sound.add("cart-move", { loop: false, volume: 0.20 });
    this.cartMoveTimer = null;
    this.isMoving = false;
    this.speedTier = 0;
    this.visualOffsetX = 0;
    this.useDashHitboxOffset = false;
    this.speedBoostTier = 0;
    this.lastGemCollectedAt = 0;
    this.lastSpeedDecayAt = 0;

    ensureAnims(scene);
    if (scene.anims.exists(this.lastAnimKey)) {
      this.play(this.lastAnimKey);
    }
    this.updateCartBody();
  }

  updateCartBody() {
    if (!this.body) {
      return;
    }

    const isSide = this.facing === "side";
    const baseWidth = isSide ? 40 : 24;
    const baseHeight = isSide ? 24 : 40;
    const bodyWidth = Math.round(baseWidth * 0.75);
    const bodyHeight = Math.round(baseHeight * 0.75);
    const baseX = (this.width - baseWidth) / 2;
    const baseY = (this.height - baseHeight) / 2;
    const shrinkX = (baseWidth - bodyWidth) / 2;
    const shrinkY = (baseHeight - bodyHeight) / 2;

    let offsetX = baseX + shrinkX;
    let offsetY = baseY + shrinkY;

    if (this.facing === "down") {
      offsetY = this.height - baseHeight - 6 + shrinkY;
    } else if (this.facing === "up") {
      offsetY = 6 + shrinkY;
    } else if (this.facing === "side") {
      offsetY = baseY + 18 + shrinkY;
      offsetX = this.flipX
        ? 38 + shrinkX
        : this.width - baseWidth - 38 + shrinkX;
    }

    if (this.useDashHitboxOffset && this.facing === "side") {
      offsetX += this.flipX ? 54 : -54;
    }

    this.body.setSize(bodyWidth, bodyHeight, false);
    this.body.setOffset(offsetX, offsetY);
  }

  update() {
    this.updateSpeedDecay();
    const { left, right, up, down } = this.cursors;
    const isDashing = this.shiftKey?.isDown;
    let vx = 0;
    let vy = 0;

    if (left?.isDown) {
      vx = -1;
    } else if (right?.isDown) {
      vx = 1;
    } else if (up?.isDown) {
      vy = -1;
    } else if (down?.isDown) {
      vy = 1;
    }

    const maxTier = SPEED_STEPS.length - 1;
    if (this.speedTier > maxTier) {
      this.speedTier = maxTier;
    }
    const tier = Math.max(0, this.speedTier ?? 0);
    const isMaxSpeed = tier >= maxTier;
    const wantsSpeedEffect = isMaxSpeed;
    const wantsDashAnim = isDashing || wantsSpeedEffect;
    const tierSpeed = isDashing ? DASH_SPEEDS[tier] : WALK_SPEEDS[tier];
    const speed = tierSpeed * this.scaleX;
    this.setVelocity(vx * speed, vy * speed);

    let anim = null;

    if (left?.isDown || right?.isDown) {
      anim = wantsDashAnim ? "dash-side" : "walk-side";
      this.setFlipX(!!right?.isDown);
      this.facing = "side";
    }
    if (!anim && up?.isDown) {
      const dashUpKey = this.scene.anims.exists("dash-up")
        ? "dash-up"
        : "walk-up";
      anim = wantsDashAnim ? dashUpKey : "walk-up";
      this.facing = "up";
    }
    if (!anim && down?.isDown) {
      const dashDownKey = this.scene.anims.exists("dash-down")
        ? "dash-down"
        : "walk-down";
      anim = wantsDashAnim ? dashDownKey : "walk-down";
      this.facing = "down";
    }

    const isNowMoving = vx !== 0 || vy !== 0;
    this.useDashHitboxOffset = wantsDashAnim && this.facing === "side";

    if (!anim) {
      this.isMoving = false;
      this.useDashHitboxOffset = false;
      if (this.cartMoveSound?.isPlaying) {
        this.cartMoveSound.stop();
      }
      if (this.cartMoveTimer) {
        this.cartMoveTimer.remove(false);
        this.cartMoveTimer = null;
      }
      let idleKey = "idle-down";
      if (this.facing === "up") {
        idleKey = "idle-up";
      } else if (this.facing === "side") {
        idleKey = "idle-side";
      }
      if (this.anims.currentAnim?.key !== idleKey || !this.anims.isPlaying) {
        if (this.scene.anims.exists(idleKey)) {
          this.play(idleKey, true);
        } else {
          this.anims.stop();
          this.setFrame(0);
        }
      }
      this.updateCartBody();
      return;
    }

    if (this.anims.currentAnim?.key !== anim || !this.anims.isPlaying) {
      this.play(anim, true);
      this.lastAnimKey = anim;
    }

    if (!this.isMoving && isNowMoving) {
      this.isMoving = true;
    }

    if (this.isMoving && this.cartMoveSound && !this.cartMoveSound.isPlaying && !this.cartMoveTimer) {
      this.cartMoveSound.play();
      this.cartMoveSound.once(Phaser.Sound.Events.COMPLETE, () => {
        if (!this.isMoving) {
          return;
        }
        this.cartMoveTimer = this.scene.time.delayedCall(300, () => {
          this.cartMoveTimer = null;
          if (this.isMoving && !this.cartMoveSound.isPlaying) {
            this.cartMoveSound.play();
          }
        });
      });
    }

    const now = this.scene.time.now;
    if ((vx !== 0 || vy !== 0) && now - this.lastDustAt >= 1500) {
      this.lastDustSide *= -1;
      const sideOffset = 16 * this.lastDustSide;
      let dustX = this.x;
      let dustY = this.y + this.displayHeight / 2 - 6;

      switch (this.facing) {
        case "up":
          dustY -= 20;
          dustX += sideOffset;
          break;
        case "down":
          dustY -= 130;
          dustX += sideOffset;
          break;
        case "side":
          dustY -= 20;
          dustX = this.flipX ? dustX - 70 : dustX + 70;
          break;
        default:
          break;
      }

      this.scene.spawnDust?.(dustX, dustY, this.scaleX);
      this.scene.spawnGem?.(dustX, dustY, this.scaleX);
      this.lastDustAt = now;
    }

    this.updateCartBody();
  }

  collectGem() {
    const now = this.scene.time.now;
    const maxTier = SPEED_BOOST_MULTIPLIERS.length - 1;
    const nextTier =
      now - this.lastGemCollectedAt <= SPEED_BOOST_WINDOW_MS
        ? (this.speedBoostTier ?? 0) + 1
        : 1;
    this.speedBoostTier = Math.min(maxTier, nextTier);
    this.lastGemCollectedAt = now;
    this.lastSpeedDecayAt = now;
    if (this.speedTier !== this.speedBoostTier) {
      this.speedTier = this.speedBoostTier;
      console.log("[Player] speed tier ->", this.speedTier);
    }
    return SPEED_BOOST_MULTIPLIERS[this.speedBoostTier] ?? 1;
  }

  updateSpeedDecay() {
    if (!this.speedBoostTier) {
      return;
    }
    const now = this.scene.time.now;
    if (now - this.lastGemCollectedAt <= SPEED_BOOST_WINDOW_MS) {
      return;
    }
    const lastDecay = this.lastSpeedDecayAt || this.lastGemCollectedAt;
    const maxTier = SPEED_BOOST_MULTIPLIERS.length - 1;
    const decayWindow =
      this.speedBoostTier >= maxTier ? MAX_SPEED_DECAY_MS : SPEED_BOOST_WINDOW_MS;
    if (now - lastDecay < decayWindow) {
      return;
    }
    this.speedBoostTier = Math.max(0, this.speedBoostTier - 1);
    this.lastSpeedDecayAt = now;
    if (this.speedTier !== this.speedBoostTier) {
      this.speedTier = this.speedBoostTier;
      console.log("[Player] speed tier ->", this.speedTier);
    }
  }
}
