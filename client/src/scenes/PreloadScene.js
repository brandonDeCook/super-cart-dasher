import Phaser from "phaser";

const mapUrl = new URL("../assets/test-grocery-store-map.json", import.meta.url);
const tilesUrl = new URL(
  "../assets/grocery-store-spritesheet.png",
  import.meta.url
);
const walkDownPngUrl = new URL(
  "../assets/player/player-walk-down.png",
  import.meta.url
);
const walkDownJsonUrl = new URL(
  "../assets/player/player-walk-down.json",
  import.meta.url
);
const walkDownDashPngUrl = new URL(
  "../assets/player/player-walk-down-speed-effect.png",
  import.meta.url
);
const walkDownDashJsonUrl = new URL(
  "../assets/player/player-walk-down-speed-effect.json",
  import.meta.url
);
const walkUpPngUrl = new URL(
  "../assets/player/player-walk-up.png",
  import.meta.url
);
const walkUpJsonUrl = new URL(
  "../assets/player/player-walk-up.json",
  import.meta.url
);
const walkUpDashPngUrl = new URL(
  "../assets/player/player-walk-up-speed-effect.png",
  import.meta.url
);
const walkUpDashJsonUrl = new URL(
  "../assets/player/player-walk-up-speed-effect.json",
  import.meta.url
);
const walkSidePngUrl = new URL(
  "../assets/player/player-walk-left-right.png",
  import.meta.url
);
const walkSideJsonUrl = new URL(
  "../assets/player/player-walk-left-right.json",
  import.meta.url
);
const walkSideDashPngUrl = new URL(
  "../assets/player/player-walk-left-right-speed-effect.png",
  import.meta.url
);
const walkSideDashJsonUrl = new URL(
  "../assets/player/player-walk-left-right-speed-effect.json",
  import.meta.url
);
const idleDownPngUrl = new URL(
  "../assets/player/player-idle-down.png",
  import.meta.url
);
const idleDownJsonUrl = new URL(
  "../assets/player/player-idle-down.json",
  import.meta.url
);
const idleUpPngUrl = new URL(
  "../assets/player/player-idle-up.png",
  import.meta.url
);
const idleUpJsonUrl = new URL(
  "../assets/player/player-idle-up.json",
  import.meta.url
);
const idleSidePngUrl = new URL(
  "../assets/player/player-idle-left-right.png",
  import.meta.url
);
const idleSideJsonUrl = new URL(
  "../assets/player/player-idle-left-right.json",
  import.meta.url
);
const dustPngUrl = new URL("../assets/effects/dust.png", import.meta.url);
const dustJsonUrl = new URL("../assets/effects/dust.json", import.meta.url);
const cartMoveUrl = new URL("../assets/sounds/cart-move.wav", import.meta.url);
const groceryCardShuffleUrl = new URL(
  "../assets/sounds/grocery-list-card-shuffle.wav",
  import.meta.url
);
const gemPngUrl = new URL("../assets/collectables/gem.png", import.meta.url);
const gemJsonUrl = new URL("../assets/collectables/gem.json", import.meta.url);
const gemPickupUrl = new URL("../assets/sounds/gem-pickup.wav", import.meta.url);
const uiScoreUrl = new URL("../assets/UI/score.png", import.meta.url);
const uiTimerUrl = new URL("../assets/UI/timer.png", import.meta.url);
const uiGroceryCardUrl = new URL(
  "../assets/UI/grocery-list-card.png",
  import.meta.url
);
const uiGroceryPresenter1Url = new URL(
  "../assets/UI/grocery-list-card-presenter1.png",
  import.meta.url
);
const uiGroceryPresenter2Url = new URL(
  "../assets/UI/grocery-list-card-presenter2.png",
  import.meta.url
);
const uiGroceryRibbonUrl = new URL(
  "../assets/UI/grocery-list-card-ribbon.png",
  import.meta.url
);
const scoreFontPngUrl = new URL("../assets/fonts/score-font.png", import.meta.url);
const scoreFontFntUrl = new URL("../assets/fonts/score-font.fnt", import.meta.url);
const timerFontPngUrl = new URL("../assets/fonts/timer-font.png", import.meta.url);
const timerFontFntUrl = new URL("../assets/fonts/timer-font.fnt", import.meta.url);

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.tilemapTiledJSON("grocery-map", mapUrl.href);
    this.load.image("grocery-tiles", tilesUrl.href);
    this.load.aseprite("player_down", walkDownPngUrl.href, walkDownJsonUrl.href);
    this.load.aseprite(
      "player_down_dash",
      walkDownDashPngUrl.href,
      walkDownDashJsonUrl.href
    );
    this.load.aseprite("player_up", walkUpPngUrl.href, walkUpJsonUrl.href);
    this.load.aseprite("player_up_dash", walkUpDashPngUrl.href, walkUpDashJsonUrl.href);
    this.load.aseprite("player_side", walkSidePngUrl.href, walkSideJsonUrl.href);
    this.load.aseprite(
      "player_side_dash",
      walkSideDashPngUrl.href,
      walkSideDashJsonUrl.href
    );
    this.load.aseprite("player_idle_down", idleDownPngUrl.href, idleDownJsonUrl.href);
    this.load.aseprite("player_idle_up", idleUpPngUrl.href, idleUpJsonUrl.href);
    this.load.aseprite(
      "player_idle_side",
      idleSidePngUrl.href,
      idleSideJsonUrl.href
    );
    this.load.aseprite("dust", dustPngUrl.href, dustJsonUrl.href);
    this.load.audio("cart-move", cartMoveUrl.href);
    this.load.audio("grocery-card-shuffle", groceryCardShuffleUrl.href);
    this.load.aseprite("gem", gemPngUrl.href, gemJsonUrl.href);
    this.load.audio("gem-pickup", gemPickupUrl.href);
    this.load.image("ui-score", uiScoreUrl.href);
    this.load.image("ui-timer", uiTimerUrl.href);
    this.load.image("ui-grocery-card", uiGroceryCardUrl.href);
    this.load.image("ui-grocery-card-presenter1", uiGroceryPresenter1Url.href);
    this.load.image("ui-grocery-card-presenter2", uiGroceryPresenter2Url.href);
    this.load.image("ui-grocery-card-ribbon", uiGroceryRibbonUrl.href);
    this.load.bitmapFont("scoreFont", scoreFontPngUrl.href, scoreFontFntUrl.href);
    this.load.bitmapFont("timerFont", timerFontPngUrl.href, timerFontFntUrl.href);
  }

  create() {
    this.scene.start("game");
  }
}
