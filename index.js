'use strict';
module.exports = {
	util: require("./util"),
	core: require("./core"),
	constant: require("./constant"),
	serif_manager: require("./serif_manager"),
	scene: {
		base: require("./scene/base"),
	},
	object: {
		base: require("./object/base"),
		sprite: require("./object/sprite"),
		pool_manager: require("./object/pool_manager"),
	},
	asset_loader: {
		image: require("./asset_loader/image"),
		audio: require("./asset_loader/audio"),
		font:  require("./asset_loader/font"),
	},
	storage: {
		base: require("./storage/base"),
		save: require("./storage/save"),
	},

};
