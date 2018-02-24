'use strict';
var JSDOM = require("jsdom").JSDOM;
var dom = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
var canvasMockify = require('canvas-mock');

var assert = require('assert');
var Core = require('../../core');
var ScenarioManager = require('../../manager/scenario');

describe('ScenarioManager', function() {
	var core, scenario;
    before(function() {
		// canvas mock
		var canvas = dom.window.document.createElement("canvas");
		canvasMockify(canvas);

		core = new Core(canvas);
		scenario = new ScenarioManager(core);
	});
	after(function () {
		// TODO: fix not call private method
		scenario._stopPrintLetter();
	});

    describe('#init()', function() {
		var script = [];
        it('does not occur error', function(done) {
			scenario.init(script);
			done();
		});
	});

    describe('#start()', function() {
		var script = [
			{"chara": "chara1", "serif": "セリフ1"},
			{"chara": "chara2", "serif": "セリフ2"}
		];

		beforeEach(function() {
			scenario.init(script);
		});

        it('should start at first serif script', function() {
			scenario.start();
			assert(scenario.getCurrentCharaNameByPosition() === "chara1");
		});

        it('should start serif script by arguments', function() {
			scenario.start(1);
			assert(scenario.getCurrentCharaNameByPosition() === "chara2");
		});

	});

    describe('#next(), isStart(), isEnd()', function() {
		var script = [
			{"chara": "chara1", "serif": "セリフ1"},
			{"chara": "chara2", "serif": "セリフ2"}
		];

		before(function() {
			scenario.init(script);
		});

        it('check whether is start and end correctly', function() {
			assert(scenario.isStart() === false);
			assert(scenario.isEnd()   === false);
			scenario.start();
			assert(scenario.isStart() === true);
			assert(scenario.isEnd()   === false);
		});

        it('should go next', function() {
			scenario.next();
			assert(scenario.getCurrentCharaNameByPosition() === "chara2");

			assert(scenario.isStart() === true);
			assert(scenario.isEnd()   === true);
		});
	});

    describe('printLetter', function() {
		var script = [
			{"chara": "chara1", "serif": "セリフ1"},
			{"chara": "chara2", "serif": "セリフ2"}
		];

		beforeEach(function() {
			scenario.init(script);
			scenario.removeEvent("printend");
		});

        it('starts and finishes to print letter', function(done) {
			scenario.on("printend", function() {
				assert(scenario.isPrintLetterEnd() === true);

				done();
			});

			scenario.start();
			assert(scenario.isPrintLetterEnd() === false);
		});

        it('starts and finishes to print letter twice', function(done) {
			var count = 0;
			scenario.on("printend", function() {
				count++;
				if (count === script.length) {
					// TODO: fix not call private method
					scenario._stopPrintLetter();
					return done();
				}
				else {
					scenario.next();
				}
			});

			scenario.start();
		});

        it('is enable to pause and resume to print letter', function(done) {
			scenario.on("printend", function() {
				done();
			});

			scenario.start();
			scenario.pausePrintLetter();
			scenario.resumePrintLetter();
		});


	});

    describe('current serif status', function() {
		var script = [
			{"id": "epilogue-0", "type": "serif", "pos":"right","chara":"reimu","exp":"normal2", "serif":"ってあれ？　この辺に筆を落としたはずなんだけれど……"},
			{"id": "epilogue-1", "type": "serif", "pos":"left","chara":"yukari","exp":"normal1","background":"epilogue3","save": false, "serif":"――ったく、貴女は昔から何も変わってないのね", "junction": ["そうね", "そんなことない"], "option": {"font_color": "#8b5fbf", "fukidashi": "normal"}}
		];

		beforeEach(function() {
			scenario.init(script);
			scenario.removeEvent("printend");
		});

        it('returns correct serif', function(done) {
			scenario.on("printend", function() {
				assert.deepEqual(scenario.getCurrentPrintedSentences(), ["――ったく、貴女は昔から何も変わってないのね"]);
				assert(scenario.getCurrentBackgroundImageName() === "epilogue3");
				assert(scenario.getCurrentOption().font_color === "#8b5fbf");
				assert(scenario.getCurrentCharaNameByPosition("left")  === "yukari");
				assert(scenario.getCurrentCharaNameByPosition("right") === "reimu");
				assert(scenario.getCurrentCharaExpressionByPosition("left")  === "normal1");
				assert(scenario.getCurrentCharaExpressionByPosition("right") === "normal2");
				assert(scenario.isCurrentTalkingByPosition("left")  === true);
				assert(scenario.isCurrentTalkingByPosition("right") === false);
				assert(scenario.isCurrentSerifExistsJunction() === true);
				assert.deepEqual(scenario.getCurrentJunctionList(), ["そうね", "そんなことない"]);

				done();
			});

			scenario.start();
			scenario.next();

			assert(scenario.getCurrentSentenceNum() === 1);
		});
	});

    describe('#isBackgroundChanged()', function() {
		var script = [
			{"chara": "chara1", "serif": "セリフ", "background": "test1"},
			{"chara": "chara1", "serif": "セリフ", "background": "test2"},
			{"chara": "chara1", "serif": "セリフ"},
			{"chara": "chara1", "serif": "セリフ", "background": "test2"},
		];

		before(function() {
			scenario.init(script);
		});

        it('returns background flag correctly', function() {
			scenario.start();
			assert(scenario.isBackgroundChanged() === true);
			scenario.next();
			assert(scenario.isBackgroundChanged() === true);
			scenario.next();
			assert(scenario.isBackgroundChanged() === false);
			scenario.next();
			assert(scenario.isBackgroundChanged() === false);
		});
	});

    describe('junction', function() {
		var script = [
			{"type": "serif","chara": "chara", "serif": "セリフ"},
			{"type": "junction_serif", "serifs": [
				[
					{"chara": "0-1-chara", "serif": "セリフ"},
					{"chara": "0-2-chara", "serif": "セリフ"},
				],
				[
					{"chara": "1-1-chara", "serif": "セリフ"},
					{"chara": "1-2-chara", "serif": "セリフ"},
				],
			]},
			{"type": "serif","chara": "chara", "serif": "セリフ"},
		];

		before(function() {
			scenario.init(script);
		});

        it('change serif correctly', function() {
			scenario.start();
			scenario.next(1);
			assert(scenario.getCurrentCharaNameByPosition() === "1-1-chara");
			scenario.next();
			assert(scenario.getCurrentCharaNameByPosition() === "1-2-chara");
			scenario.next();
			assert(scenario.getCurrentCharaNameByPosition() === "chara");
		});
	});


	// TODO: criteria test
	// TODO: save test
});
