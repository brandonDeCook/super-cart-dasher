import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../constants.js";
import Player from "../objects/Player.js";
import Dust from "../objects/Dust.js";
import Gem from "../objects/Gem.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    const WORLD_SCALE = 2;
    const CAMERA_ZOOM = 1;
    const map = this.make.tilemap({ key: "grocery-map" });
    const tilesetName = map.tilesets?.[0]?.name;
    const tileset = tilesetName
      ? map.addTilesetImage(tilesetName, "grocery-tiles")
      : null;

    if (tileset) {
      const floor = map.createLayer("floor", tileset, 0, 0);
      const collisions = map.createLayer("collisions", tileset, 0, 0);
      const props = map.createLayer("props", tileset, 0, 0);

      floor?.setScale(WORLD_SCALE);
      collisions?.setScale(WORLD_SCALE);
      props?.setScale(WORLD_SCALE);
    }

    const collidablesLayer = map.getObjectLayer("props-collisions");
    if (collidablesLayer) {
      this.collidablesGroup = this.physics.add.staticGroup();
      collidablesLayer.objects.forEach((obj) => {
        let cx, cy, bw, bh;
        if (obj.polygon) {
          const xs = obj.polygon.map((p) => p.x);
          const ys = obj.polygon.map((p) => p.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          bw = (maxX - minX) * WORLD_SCALE;
          bh = (maxY - minY) * WORLD_SCALE;
          cx = (obj.x + minX + (maxX - minX) / 2) * WORLD_SCALE;
          cy = (obj.y + minY + (maxY - minY) / 2) * WORLD_SCALE;
        } else {
          bw = obj.width * WORLD_SCALE;
          bh = obj.height * WORLD_SCALE;
          cx = obj.x * WORLD_SCALE + bw / 2;
          cy = obj.y * WORLD_SCALE + bh / 2;
        }
        const zone = this.add.zone(cx, cy, bw, bh);
        this.physics.add.existing(zone, true);
        this.collidablesGroup.add(zone);
      });
    }

    const mapW = 2880;
    const mapH = 1920;

    this.physics.world.setBounds(0, 0, mapW, mapH);

    this.player = new Player(this, mapW / 2, mapH / 2, WORLD_SCALE);

    this.dustGroup = this.add.group({
      classType: Dust,
      maxSize: 5,
      runChildUpdate: false
    });

    for (let i = 0; i < 5; i += 1) {
      this.dustGroup.add(new Dust(this, -9999, -9999));
    }

    this.gemGroup = this.physics.add.group({
      classType: Gem,
      maxSize: 10,
      runChildUpdate: false
    });

    for (let i = 0; i < 10; i += 1) {
      this.gemGroup.add(new Gem(this, -9999, -9999));
    }

    const boundsDebug = this.add.graphics();
    boundsDebug.lineStyle(2, 0x00ff00, 1);
    boundsDebug.strokeRect(0, 0, mapW, mapH);

    this.uiScore = this.add
      .image(this.scale.width / 2, 56, "ui-score")
      .setScrollFactor(0)
      .setDepth(1000)
      .setScale(WORLD_SCALE);

    this.uiTimer = this.add
      .image(this.scale.width, 0, "ui-timer")
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000)
      .setScale(WORLD_SCALE);

    this.uiGroceryCard = this.add
      .image(0, this.scale.height / 2, "ui-grocery-card")
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(999)
      .setScale(WORLD_SCALE);
    this.uiGroceryCardPresenter1 = this.add
      .image(0, 0, "ui-grocery-card-presenter1")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1000)
      .setScale(WORLD_SCALE);
    this.uiGroceryCardPresenter2 = this.add
      .image(0, 0, "ui-grocery-card-presenter2")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1000)
      .setScale(WORLD_SCALE);
    this.uiGroceryCardRibbon = this.add
      .image(0, 0, "ui-grocery-card-ribbon")
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(1000)
      .setScale(WORLD_SCALE);
    this.groceryCardRibbonScale = WORLD_SCALE;
    this.groceryCardRibbonFullWidth =
      this.uiGroceryCardRibbon.width * this.groceryCardRibbonScale;
    this.uiGroceryCardRibbon.setScale(0, this.groceryCardRibbonScale);

    this.isGroceryCardCollapsed = true;
    this.groceryCardPeek = 18 * WORLD_SCALE;
    this.groceryCardExpandOffset = -16 * WORLD_SCALE;
    this.groceryCardShuffleSound = this.sound.add("grocery-card-shuffle", {
      volume: 0.7
    });
    this.uiGroceryCard.setInteractive({ useHandCursor: true });
    this.uiGroceryCard.on("pointerdown", () => {
      this.toggleGroceryCard();
    });
    this.groceryCardToggleKey = this.input.keyboard?.addKey("Z");
    this.groceryCardToggleKey?.on("down", () => {
      this.toggleGroceryCard();
    });

    this.uiGroceryCardDebug = null;

    this.scoreValue = 0;
    this.timerSeconds = 180;
    this.timerAccumulator = 0;
    this.gemPickupSound = this.sound.add("gem-pickup", { volume: 0.7 });

    this.uiScoreDigits = this.add
      .bitmapText(0, 0, "scoreFont", "0000")
      .setScrollFactor(0)
      .setDepth(1001)
      .setScale(WORLD_SCALE)
      .setLetterSpacing(-7);

    this.uiTimerDigits = this.add
      .bitmapText(0, 0, "timerFont", "03:00")
      .setScrollFactor(0)
      .setDepth(1001)
      .setScale(WORLD_SCALE * 1.3)
      .setLetterSpacing(-8);

    this.updateScoreUI();
    this.updateTimerUI();

    const applyResize = () => {
      if (this.scale.width !== BASE_WIDTH || this.scale.height !== BASE_HEIGHT) {
        this.scale.resize(BASE_WIDTH, BASE_HEIGHT);
      }

      const camera = this.cameras.main;
      const viewW = this.scale.width;
      const viewH = this.scale.height;

      camera.setBounds(0, 0, mapW, mapH);
      camera.setZoom(CAMERA_ZOOM);
      const visibleW = viewW / CAMERA_ZOOM;
      const visibleH = viewH / CAMERA_ZOOM;

      if (mapW <= visibleW && mapH <= visibleH) {
        camera.stopFollow();
        camera.centerOn(mapW / 2, mapH / 2);
      } else {
        camera.startFollow(this.player, false, 1, 1);
      }
    };

    const positionUI = () => {
      if (this.uiScore) {
        this.uiScore.setPosition(this.scale.width / 2, 56);
      }
      if (this.uiTimer) {
        this.uiTimer.setPosition(this.scale.width, 0);
      }
      if (this.uiGroceryCard) {
        const cardWorldWidth = this.uiGroceryCard.displayWidth;
        this.uiGroceryCard.setPosition(
          this.isGroceryCardCollapsed
            ? -(cardWorldWidth - this.groceryCardPeek)
            : this.groceryCardExpandOffset,
          this.scale.height / 2
        );
        this.layoutGroceryCardDecorations();
      }
      this.updateScoreUI();
      this.updateTimerUI();
    };

    applyResize();
    positionUI();

    this.scale.on("resize", () => {
      applyResize();
      positionUI();
    });

    this.physics.add.overlap(this.player, this.gemGroup, this.onGemOverlap, null, this);

    if (this.collidablesGroup) {
      this.physics.add.collider(this.player, this.collidablesGroup);
    }

    const debugKey = this.input.keyboard.addKey(192); // ` / ~
    debugKey.on("down", () => {
      this.physics.world.drawDebug = !this.physics.world.drawDebug;
      if (this.physics.world.drawDebug) {
        this.physics.world.createDebugGraphic();
      } else if (this.physics.world.debugGraphic) {
        this.physics.world.debugGraphic.clear();
      }
    });
  }

  toggleGroceryCard() {
    if (!this.uiGroceryCard) {
      return;
    }
    this.isGroceryCardCollapsed = !this.isGroceryCardCollapsed;
    if (this.groceryCardShuffleSound) {
      const rate = this.isGroceryCardCollapsed ? 0.85 : 1.05;
      this.groceryCardShuffleSound.play({ rate });
    }
    const cardWorldWidth = this.uiGroceryCard.displayWidth;
    const targetX = this.isGroceryCardCollapsed
      ? -(cardWorldWidth - this.groceryCardPeek)
      : this.groceryCardExpandOffset;
    const shouldAnimatePresenters = !this.isGroceryCardCollapsed;
    this.animateGroceryCardRibbon(!this.isGroceryCardCollapsed, 360, 80);
    this.tweens.add({
      targets: this.uiGroceryCard,
      x: targetX,
      duration: 360,
      ease: "Back.easeOut",
      onUpdate: () => {
        this.layoutGroceryCardDecorations();
      },
      onComplete: () => {
        this.layoutGroceryCardDecorations();
        if (shouldAnimatePresenters) {
          this.animateGroceryCardPresenters();
        }
      }
    });
  }

  animateGroceryCardPresenters() {
    const presenters = [this.uiGroceryCardPresenter1, this.uiGroceryCardPresenter2];
    presenters.forEach((presenter, index) => {
      if (!presenter) {
        return;
      }
      this.tweens.killTweensOf(presenter);
      presenter.setAngle(0);
      const direction = index === 0 ? 1 : -1;
      this.tweens.add({
        targets: presenter,
        angle: 6 * direction,
        duration: 600,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: 0
      });
    });
  }

  animateGroceryCardRibbon(extend, duration = 360, delay = 0) {
    if (!this.uiGroceryCardRibbon) {
      return;
    }
    this.tweens.killTweensOf(this.uiGroceryCardRibbon);
    const targetScaleX = extend ? this.groceryCardRibbonScale : 0;
    if (extend) {
      this.uiGroceryCardRibbon.setScale(0, this.groceryCardRibbonScale);
    }
    this.tweens.add({
      targets: this.uiGroceryCardRibbon,
      scaleX: targetScaleX,
      duration,
      ease: "Sine.easeInOut",
      delay
    });
  }

  layoutGroceryCardDecorations() {
    if (!this.uiGroceryCard) {
      return;
    }
    const cardW = this.uiGroceryCard.displayWidth;
    const cardH = this.uiGroceryCard.displayHeight;
    const cardLeft = this.uiGroceryCard.x - cardW * this.uiGroceryCard.originX;
    const cardTop = this.uiGroceryCard.y - cardH * this.uiGroceryCard.originY;

    const presenterX = cardLeft + cardW * 0.34 + 30;
    const presenterY = cardTop + cardH * 0.5 - 20;
    this.uiGroceryCardPresenter1?.setPosition(presenterX, presenterY);
    this.uiGroceryCardPresenter2?.setPosition(presenterX, presenterY);

    const ribbonFullWidth =
      this.groceryCardRibbonFullWidth ??
      this.uiGroceryCardRibbon.width * this.groceryCardRibbonScale;
    const ribbonCenterX = cardLeft + cardW * 0.46;
    const ribbonX = ribbonCenterX - ribbonFullWidth / 2;
    const ribbonY = cardTop + cardH * 0.74 + 10;
    this.uiGroceryCardRibbon?.setPosition(ribbonX, ribbonY);
  }

  updateScoreUI() {
    const value = Math.max(0, Math.floor(this.scoreValue ?? 0));
    const text = String(value).padStart(4, "0");
    this.uiScoreDigits?.setText(text);

    if (this.uiScore) {
      const centerX = this.uiScore.x;
      const centerY = this.uiScore.y;
      this.uiScoreDigits?.setOrigin(0.5, 0.5);
      this.uiScoreDigits?.setPosition(centerX, centerY + 10 * this.uiScore.scaleY);
    }
  }

  updateTimerUI() {
    const total = Math.max(0, Math.floor(this.timerSeconds ?? 0));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    const text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    this.uiTimerDigits?.setText(text);

    if (this.uiTimer) {
      const offsetX = -8 * this.uiTimer.scaleX;
      const offsetY = 1 * this.uiTimer.scaleY;
      this.uiTimerDigits?.setOrigin(1, 0);
      this.uiTimerDigits?.setPosition(
        this.uiTimer.x - offsetX,
        this.uiTimer.y + offsetY
      );
    }
  }

  spawnDust(x, y, scale = 1) {
    const dust = this.dustGroup.getFirstDead(false);
    if (!dust) {
      return;
    }
    dust.spawn(x, y, scale);
  }

  spawnGem(x, y, scale = 1) {
    const gem = this.gemGroup.getFirstDead(false);
    if (!gem) {
      return;
    }
    gem.spawn(x, y, scale);
  }

  spawnGemColumn(startX, startY, count, spacing, scale = 1) {
    for (let i = 0; i < count; i += 1) {
      this.spawnGem(startX, startY + i * spacing, scale);
    }
  }

  onGemOverlap(player, gem) {
    if (!gem.active) {
      return;
    }
    gem.despawn?.();

    const multiplier = player?.collectGem?.() ?? 1;
    this.scoreValue += Math.round(25 * multiplier);
    this.updateScoreUI();

    const rate = 0.6 + (multiplier - 1) * 0.45;
    if (this.gemPickupSound) {
      if (this.gemPickupSound.isPlaying) {
        this.gemPickupSound.stop();
      }
      this.gemPickupSound.setRate(rate);
      this.gemPickupSound.play();
    }
  }

  update(time, delta) {
    if (this.player) {
      this.player.update();
    }

    if (this.timerSeconds <= 0) {
      return;
    }

    this.timerAccumulator += delta;
    while (this.timerAccumulator >= 1000) {
      this.timerAccumulator -= 1000;
      this.timerSeconds = Math.max(0, this.timerSeconds - 1);
      this.updateTimerUI();
    }
  }
}
