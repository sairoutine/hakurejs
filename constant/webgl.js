'use strict';

var CONSTANT = {
	SPRITE3D: {},
};

// vertices
CONSTANT.SPRITE3D.V_ITEM_SIZE = 3;
CONSTANT.SPRITE3D.V_ITEM_NUM = 4;
CONSTANT.SPRITE3D.V_SIZE =
	CONSTANT.SPRITE3D.V_ITEM_SIZE * CONSTANT.SPRITE3D.V_ITEM_NUM;
// texture coordinates
CONSTANT.SPRITE3D.C_ITEM_SIZE = 2;
CONSTANT.SPRITE3D.C_ITEM_NUM = 4;
CONSTANT.SPRITE3D.C_SIZE =
	CONSTANT.SPRITE3D.C_ITEM_SIZE * CONSTANT.SPRITE3D.C_ITEM_NUM;

// indices
CONSTANT.SPRITE3D.I_ITEM_SIZE = 1;
CONSTANT.SPRITE3D.I_ITEM_NUM = 6;
CONSTANT.SPRITE3D.I_SIZE =
	CONSTANT.SPRITE3D.I_ITEM_SIZE * CONSTANT.SPRITE3D.I_ITEM_NUM;

// color
CONSTANT.SPRITE3D.A_ITEM_SIZE = 4;
CONSTANT.SPRITE3D.A_ITEM_NUM = 4;
CONSTANT.SPRITE3D.A_SIZE =
	CONSTANT.SPRITE3D.A_ITEM_SIZE * CONSTANT.SPRITE3D.A_ITEM_NUM;

module.exports = CONSTANT;