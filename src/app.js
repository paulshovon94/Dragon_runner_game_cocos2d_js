var tanks = [];
var backgrounds = [];
var labelScoreValue, labelLifeValue,
    dragon, backgroundSize, dragonFloorX, dragonFloorY;
var backgroundDiv = 100;
var score = 0;
var life = 1;
var size, tankSpeed;
//for one touch
var flag = false;
var tap = 0;
var gate = 0;

var HelloWorldLayer = cc.Layer.extend({
    sprite: null,

    //constractor
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        this.init();


        return true;
    },

    //init function
    init: function () {
        this._super();
        size = cc.winSize;

        //Background
        this.createBackground();
        this.schedule(this.backgroundMove, 0.01);
        this.schedule(this.wait, .1);

        //Dragon
        dragon = new cc.Sprite(res.Dragon1);
        dragon.setPosition(size.width / 12, size.height * 1.45 / 6);
        this.addChild(dragon, 0);
        dragonFloorX = size.width / 12;
        dragonFloorY = size.height * 1.45 / 6;
        // console.log('x: ' + size.width / 12);
        // console.log('y: ' + size.height * 1.45 / 6);

        //Tank
        this.createTank();
        this.schedule(this.createTank, 3);
        tankSpeed = 10;
        this.schedule(this.increaseTankSpeed, 5);

        //Score Label
        var labelScore = new cc.LabelTTF("Score: ", "Arial", 40);
        labelScore.setAnchorPoint(cc.p(0.0, 0.5));
        labelScore.setPosition(cc.p(size.width * 8 / 10, size.height * 9 / 10));
        labelScore.setColor(cc.color(255, 255, 255));
        this.addChild(labelScore);

        //Score entry
        labelScoreValue = new cc.LabelTTF(score.toString(), "Arial", 40);
        labelScoreValue.setAnchorPoint(cc.p(0.0, 0.5));
        labelScoreValue.setPosition(cc.p((size.width * 8 / 10) + 140, size.height * 9 / 10));
        labelScoreValue.setColor(cc.color(255, 255, 255));
        this.addChild(labelScoreValue);
    },

    //Touch detection
    onEnter: function () {
        this._super();
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan: this.onTouchBegan,
        //     onTouchMoved: this.onTouchMoved,
        //     onTouchEnded: this.onTouchEnded
        // }, this);
    },

    //Touch Begain
    onTouchBegan: function (touch, event) {
        tap++;
        if (tap == 1) {
            var sprite_action = cc.JumpTo.create(1.5, cc.p(dragon.getPositionX(), dragon.getPositionY()), 200, 1);
            dragon.runAction(sprite_action);
            gate = 1
            return flag;
        }
        return flag;
    },
    //checking  every 0.1 secon if there is any tap
    wait: function (dt) {
        //if any tap has done then gate =1
        if (gate == 1) {
            //it will reset every variable after 1.5 second after being touched
            this.schedule(this.test, 1.5);
            console.log("In wait function" + dt);
        }

    },
    //it reset everything so that it can be jumped again
    test: function (dt) {
        flag = true;
        tap = 0;
        gate = 0;
        console.log("In test function" + dt);
    },

    //Touch Moved
    onTouchMoved: function (touch, event) {
        var tp = touch.getLocation();
        var tar = event.getCurrentTarget();
        //tar._basket.setPosition(tp.x, 0)
        //_basket.setPosition( touch.getLocationX( ), touch.getLocationY( ) );
        //console.log('onTouchMoved:' + tp.x.toFixed(2) + ',' + tp.y.toFixed(2));

    },

    //Touch Ended
    onTouchEnded: function (touch, event) {
        var tp = touch.getLocation();
        //console.log('Total touch:' + tap);
        //console.log('onTouchEnded:' + tp.x.toFixed(2) + ',' + tp.y.toFixed(2));
    },

    //Background create
    createBackground: function () {
        //Background at screen
        var background = new cc.Sprite(res.Background);
        backgroundSize = background.getContentSize();
        background.setAnchorPoint(cc.p(0.0, 0.5));
        background.setPosition(cc.p(0, size.height / 2));
        background.scaleY = size.height / backgroundSize.height;
        this.addChild(background, 0);
        backgrounds.push(background);
        //Background at right behind the screen
        var background = new cc.Sprite(res.Background);
        background.setAnchorPoint(cc.p(0.0, 0.5));
        background.setPosition(cc.p(backgroundSize.width, size.height / 2));
        background.scaleY = size.height / backgroundSize.height;
        this.addChild(background, 0);
        backgrounds.push(background);
    },

    //Create Tank
    createTank: function (dt) {
        var tank = new cc.Sprite(res.Tank);
        tank.setAnchorPoint(cc.p(1.0, 0.3));
        var posX = (Math.random() * 500) + 500;
        //cc.log("PosX: "+posX);
        tank.setPosition(cc.p(size.width + posX, size.height * 1.2 / 6));
        tanks.push(tank);
        this.addChild(tank, 0);
    },

    //Background moveing
    backgroundMove: function (dt) {

        for (var i = 0; i < backgrounds.length; i++) {
            backgrounds[i].setPositionX(backgrounds[i].getPositionX() - (backgroundSize.width / backgroundDiv));
            if (backgrounds[i].getPositionX() <= (-backgroundSize.width)) {
                backgrounds[i].setPositionX(backgroundSize.width);
            }
        }

        for (var i = 0; i < tanks.length; i++) {
            var x = tanks[i].getPositionX();
            tanks[i].setPositionX(x - tankSpeed);

            if (this.catchTank(tanks[i])) {
                life--;
                if (life <= 0) {
                    this.gameOver();
                }
            }

            if (this.tanksBehind(tanks[i])) {
                labelScoreValue.setString((++score).toString());
                tanks.splice(i, 1);
            }
        }

    },

    //Tanks went behind the screen 
    tanksBehind: function (tank) {
        if (tank.getPositionX() <= 0) {
            return true;
        }
        return false;
    },

    //Detecting collision between dragon and tank
    catchTank: function (tank) {
        var rectA = tank.getBoundingBox();
        var rectB = dragon.getBoundingBox();
        rectA.x += 5;
        rectA.height -= 50;
        rectA.width -= 30;
        rectB.height -= 50;
        rectB.width -= 10;
        // cc.log("Tank "+rectA.height);
        // cc.log("Dragon" +rectB.height);
        if (cc.rectIntersectsRect(rectA, rectB)) {
            return true;
        }
        return false;
    },

    //When collision detected
    gameOver: function () {
        var go = new cc.Sprite(res.GameOver);
        var gameOverSize = go.getContentSize();
        go.setPosition(cc.p(size.width / 2, size.height / 2));
        go.scaleY = size.height / gameOverSize.height;
        go.scaleX = size.width / gameOverSize.width;
        this.addChild(go, 10);
    },

    //Increases tank speed
    increaseTankSpeed: function (dt) {
        tankSpeed++;
    },

});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});