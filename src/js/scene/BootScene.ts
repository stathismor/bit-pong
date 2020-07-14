import * as constants from "../constants";
import Images from "../images";
import Sounds from "../sounds";
import Data from "../data";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    const config = this.sys.game.CONFIG;

    // HACK: parcel changes the asset names in dist directory, so
    // we dynamically get the new image names for the atlas
    const atlasData = Data.bit_pong_data;
    atlasData.textures[0].image = Images.bit_pong_atlas;
    const multiAtlasFileConfig = {
      key: constants.TEXTURE_ATLAS,
      url: atlasData,
    };
    this.load.multiatlas(multiAtlasFileConfig);
    this.load.image("select_level_button", Images.select_level_button);
    this.load.image("award_gold", Images.award_gold);
    this.load.image("award_silver", Images.award_silver);
    this.load.image("select_level_text", Images.select_level_text);
    this.load.image("select_level_border", Images.select_level_border);
    this.load.image("digit_zero", Images.digit_zero);
    this.load.image("digit_one", Images.digit_one);
    this.load.image("digit_two", Images.digit_two);
    this.load.image("digit_three", Images.digit_three);
    this.load.image("digit_four", Images.digit_four);
    this.load.image("digit_five", Images.digit_five);
    this.load.image("digit_six", Images.digit_six);
    this.load.image("digit_seven", Images.digit_seven);
    this.load.image("digit_eight", Images.digit_eight);
    this.load.image("digit_nine", Images.digit_nine);
    this.load.image("digit_medium_zero", Images.digit_medium_zero);
    this.load.image("digit_medium_one", Images.digit_medium_one);
    this.load.image("digit_medium_two", Images.digit_medium_two);
    this.load.image("digit_medium_three", Images.digit_medium_three);
    this.load.image("digit_medium_four", Images.digit_medium_four);
    this.load.image("digit_medium_five", Images.digit_medium_five);
    this.load.image("digit_medium_six", Images.digit_medium_six);
    this.load.image("digit_medium_seven", Images.digit_medium_seven);
    this.load.image("digit_medium_eight", Images.digit_medium_eight);
    this.load.image("digit_medium_nine", Images.digit_medium_nine);
    this.load.image("digit_small_zero", Images.digit_small_zero);
    this.load.image("digit_small_one", Images.digit_small_one);
    this.load.image("digit_small_two", Images.digit_small_two);
    this.load.image("digit_small_three", Images.digit_small_three);
    this.load.image("digit_small_four", Images.digit_small_four);
    this.load.image("digit_small_five", Images.digit_small_five);
    this.load.image("digit_small_six", Images.digit_small_six);
    this.load.image("digit_small_seven", Images.digit_small_seven);
    this.load.image("digit_small_eight", Images.digit_small_eight);
    this.load.image("digit_small_nine", Images.digit_small_nine);
    this.load.image("digit_small_slash", Images.digit_small_slash);
    this.load.image("level_tile_grey", Images.level_tile_grey);
    this.load.image("level_tile_green", Images.level_tile_green);
    this.load.image("trophy_gold", Images.trophy_gold);
    this.load.image("trophy_silver", Images.trophy_silver);
    this.load.image("trophy_empty", Images.trophy_empty);
    this.load.image("level_tile_locked", Images.level_tile_locked);
    this.load.image("credits_title", Images.credits_title);
    this.load.image("credits_art", Images.credits_art);
    this.load.image("credits_concept", Images.credits_concept);
    this.load.image("credits_stathis", Images.credits_stathis);
    this.load.image("credits_antony", Images.credits_antony);
    this.load.image("exit", Images.exit);
    this.load.image("right_arrow_enabled", Images.right_arrow_enabled);
    this.load.image("right_arrow_disabled", Images.right_arrow_disabled);
    this.load.image("left_arrow_enabled", Images.left_arrow_enabled);
    this.load.image("left_arrow_disabled", Images.left_arrow_disabled);
    this.load.image("level_text", Images.level_text);
    this.load.image("bracket_left", Images.bracket_left);
    this.load.image("bracket_right", Images.bracket_right);
    this.load.image("start", Images.start);
    this.load.image("admin_select_level", Images.admin_select_level);
    this.load.image("admin_sound_on", Images.admin_sound_on);
    this.load.image("admin_sound_off", Images.admin_sound_off);
    this.load.image("admin_exit", Images.admin_exit);
    this.load.image("admin_home", Images.admin_home);
    this.load.image("award_gold_big", Images.award_gold_big);
    this.load.image("award_silver_big", Images.award_silver_big);
    this.load.image("popup_success", Images.popup_success);
    this.load.image("popup_success_no_next", Images.popup_success_no_next);
    this.load.image("popup_whoops", Images.popup_whoops);

    // Audio
    this.load.audio("bounce_table", Sounds.bounce_table, { instances: 2 });
    this.load.audio("bounce_ball_ball", Sounds.bounce_ball_ball, {
      instances: 2,
    });
    this.load.audio("cup_bounce", Sounds.cup_bounce, { instances: 2 });
    this.load.audio("splash", Sounds.splash);
    this.load.audio("success", Sounds.success);
    this.load.audio("whoops", Sounds.whoops);
    this.load.audio("swoosh", Sounds.swoosh);
    this.load.audio("button_click", Sounds.button_click);

    if (this.game.registry.get("sound") === undefined) {
      this.game.registry.set("sound", true);
    }

    const camera = this.cameras.main;
    camera.setBounds(0, 0, config.width, config.height);
  }

  create(): void {
    this.scene.start("StartMenuScene");
  }
}
