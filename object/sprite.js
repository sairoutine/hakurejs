'use strict';
var base_object = require('./base');
var util = require('../util');

var Sprite = function(scene) {
	base_object.apply(this, arguments);

	this.current_sprite_index = 0;
};
util.inherit(Sprite, base_object);

Sprite.prototype.init = function(){
	base_object.prototype.init.apply(this, arguments);

	this.current_sprite_index = 0;
};

Sprite.prototype.beforeDraw = function(){
	base_object.prototype.beforeDraw.apply(this, arguments);

	// animation sprite
	if(this.frame_count % this.spriteAnimationSpan() === 0) {
		this.current_sprite_index++;
		if(this.current_sprite_index >= this.spriteIndices().length) {
			this.current_sprite_index = 0;
		}
	}
};
Sprite.prototype.draw = function(){
	base_object.prototype.draw.apply(this, arguments);

	var image = this.core.image_loader.getImage(this.spriteName());

	var ctx = this.core.ctx;

	ctx.save();

	// set position
	ctx.translate(this.globalCenterX(), this.globalCenterY());

	// rotate
	var rotate = util.thetaToRadian(this.velocity.theta + this.rotateAdjust());
	ctx.rotate(rotate);

	var sprite_width  = this.spriteWidth();
	var sprite_height = this.spriteHeight();
	if(!sprite_width)  sprite_width = image.width;
	if(!sprite_height) sprite_height = image.height;

	var width  = sprite_width * this.scale();
	var height = sprite_height * this.scale();

	ctx.drawImage(image,
		// sprite position
		sprite_width * this.spriteIndexX(), sprite_height * this.spriteIndexY(),
		// sprite size to get
		sprite_width,                       sprite_height,
		// adjust left x, up y because of x and y indicate sprite center.
		-width/2,                           -height/2,
		// sprite size to show
		width,                              height
	);
	ctx.restore();
};

Sprite.prototype.spriteName = function(){
	throw new Error("spriteName method must be overridden.");
};
Sprite.prototype.spriteIndexX = function(){
	return this.spriteIndices()[this.current_sprite_index].x;
};
Sprite.prototype.spriteIndexY = function(){
	return this.spriteIndices()[this.current_sprite_index].y;
};
Sprite.prototype.spriteAnimationSpan = function(){
	return 0;
};
Sprite.prototype.spriteIndices = function(){
	return [{x: 0, y: 0}];
};
Sprite.prototype.spriteWidth = function(){
	return 0;
};
Sprite.prototype.spriteHeight = function(){
	return 0;
};
Sprite.prototype.rotateAdjust = function(){
	return 0;
};
Sprite.prototype.scale = function(){
	return 1;
};


module.exports = Sprite;