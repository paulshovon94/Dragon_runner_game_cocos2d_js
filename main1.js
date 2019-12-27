<?xml version="1.0"?>
<project name="Javascript compress project" basedir="." default="compile">

    <!-- The classpath should be modified to the real closure compiler jar file path -->
    <taskdef name="jscomp" classname="com.google.javascript.jscomp.ant.CompileTask" classpath="./compiler.jar"/>
    <target name="compile">
        <jscomp compilationLevel="simple" warning="quiet"
                debug="false" output="./game.min.js">
                <!-- Uncomment the line below to enable sourcemap generation -->
            <!--sourceMapOutputFile="./cocos2d-js-sourcemap" sourceMapFormat="V3"> -->
            <sources dir="./">
                <!-- You may need to modify the file name to the actual downloaded file name -->
                <file name="cocos2d-js-lite.js"/>
                <!-- Put your own js files here, dependency order is also important -->
            </sources>
        </jscomp>
    </target>
</project>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Test</title>

    <meta name="ad.size" content="width=300,height=250">    

    <meta name="viewport"
        content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1,maximum-scale=1"/>

    <!--https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html-->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="format-detection" content="telephone=no">

    <!-- force webkit on 360 -->
    <meta name="renderer" content="webkit"/>
    <meta name="force-rendering" content="webkit"/>
    <!-- force edge on IE -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="msapplication-tap-highlight" content="no">

    <!-- force full screen on some browser -->
    <meta name="full-screen" content="yes"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>

    <!-- force screen orientation on some browser -->
    <!-- <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-orientation" content="portrait"> -->

    <meta name="browsermode" content="application">
    <meta name="x5-page-mode" content="app">

    <style type="text/css">
        html {
        -ms-touch-action: none;
        }

        body, canvas, div {
        margin: 0;
        padding: 0;
        outline: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        body {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        border: 0;
        margin: 0;

        cursor: default;
        color: #888;
        background-color: #333;

        text-align: center;
        font-family: Helvetica, Verdana, Arial, sans-serif;

        display: flex;
        flex-direction: column;
        }

        #Cocos2dGameContainer {
        position: absolute;
        margin: 0;
        overflow: hidden;
        left: 0px;
        top: 0px;

        display: -webkit-box;
        -webkit-box-orient: horizontal;
        -webkit-box-align: center;
        -webkit-box-pack: center;
        }

        canvas {
        background-color: rgba(0, 0, 0, 0);
        }
    </style>
</head>
<body>   
    <canvas id="gameCanvas" width="800" height="450" style="background-color:black;"></canvas>
    <script type="text/javascript">
          window.onload = function(){
              cc.game.onStart = function(){
                  //load resources
var sys = cc.sys;
                if(!sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
                    document.body.removeChild(document.getElementById("cocosLoading"));

                // Pass true to enable retina display, on Android disabled by default to improve performance
                cc.view.enableRetina(sys.os === sys.OS_IOS ? true : true);

                // Disable auto full screen on baidu and wechat, you might also want to eliminate sys.BROWSER_TYPE_MOBILE_QQ
                if (sys.isMobile && 
                    sys.browserType !== sys.BROWSER_TYPE_BAIDU &&
                    sys.browserType !== sys.BROWSER_TYPE_WECHAT) {
                    cc.view.enableAutoFullScreen(true);
                }

                // Adjust viewport meta
                cc.view.adjustViewPort(true);

                // Uncomment the following line to set a fixed orientation for your game
                cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

                // Setup the resolution policy and design resolution size
                //cc.view.setDesignResolutionSize(640, 1136, cc.ResolutionPolicy.SHOW_ALL);
                
                var rectSize = cc.view.getFrameSize();
                cc.view.setDesignResolutionSize(rectSize.width, rectSize.height, cc.ResolutionPolicy.SHOW_ALL);

    
                var gameOverImgKey = "gameOverImgKey";

                var testSoundSrc = "";
                var testSoundKey = "testSoundKey";

                const panel=
                {        
                    panelGame : 1,
                    panelTest : 2
                };

                const delegateFunc=
                {
                    remove : 1
                };

                var StorePanel=cc.Layer.extend({
    
                    appDelegate:null,
                    isSmallWindow:false,

                    imgBackground:null,
                    btnCross:null,
                    loadingLayer:null,
                    lblTitle:null,

                    initDefaultValue:function()
                    {
                        appDelegate=AppDelegate.sharedApplication();
                        this.isSmallWindow=false;
                    },

                    init:function()
                    {
                        if (this._super())
                        {
                            this.initDefaultValue();

                            return true;
                        }
                        return false;
                    },

                    initSubClass:function()
                    {
                        this.initDefaultValue();
                    },
                    
                    initWithSmallWindow:function()
                    {
                        this.initDefaultValue();
                        this.isSmallWindow=true;
                        this.setContentSize(cc.winSize);
                        cc.eventManager.addListener({
                            event: cc.EventListener.TOUCH_ONE_BY_ONE,
                            swallowTouches: true,
                                onTouchBegan: function(touch,event){
                                return event.getCurrentTarget().onTouchBegan(touch,event);
                                },
                                onTouchMoved: function(touch,event){
                                //cc.log("TOUCH MOVED");
                                event.getCurrentTarget().onTouchMoved(touch,event);
                                },
                                onTouchEnded: function(touch,event){
                                //cc.log("TOUCH ENDED");
                                event.getCurrentTarget().onTouchEnded(touch,event);
                                }
                            }, this);
                    },

                    //#pragma mark- Background

                    loadBackground:function(strImageName, strImageKey)
                    {
                        this.imgBackground=StorePanel.createSprite(strImageName, strImageKey);
                        //this.imgBackground.setScale(appDelegate.deviceScaleFloat);
                                            
                        this.imgBackground.setScaleX(cc.winSize.width/this.imgBackground.getContentSize().width);
                        this.imgBackground.setScaleY(cc.winSize.height/this.imgBackground.getContentSize().height);
                        this.imgBackground.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                        this.addChild(this.imgBackground);
                    },
                                            
                    loadSmallBackground:function(strImageName, strImageKey)
                    {
                        this.imgBackground=StorePanel.createSprite(strImageName, strImageKey);
                        this.imgBackground.setScale(appDelegate.deviceScaleFloat);
                        this.imgBackground.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                        this.addChild(this.imgBackground);
                    },

                    loadTitle:function(title)
                    {
                        this.lblTitle=new cc.LabelTTF(title, "Arial", 50*appDelegate.deviceScaleFloat);
                        if (this.isSmallWindow && this.imgBackground!=null)
                            this.lblTitle.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2+this.imgBackground.getScaleY()*this.imgBackground.getContentSize().height/2-40*appDelegate.deviceScaleFloat));
                        else 
                            this.lblTitle.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height-40*appDelegate.deviceScaleFloat));
                        this.lblTitle.setAnchorPoint(cc.p(0.5,0.5));
                        this.lblTitle.setFontFillColor(cc.color(255,255,255));
                        this.lblTitle.enableShadow(cc.color(0,0,0), cc.size(2, -2), 10);
                        this.addChild(this.lblTitle);
                    },

                    loadCrossButton:function(strImageName, strImageKey)
                    {
                        this.btnCross=StorePanel.createButton(strImageName, strImageKey);
                        this.btnCross.setScale(appDelegate.deviceScaleFloat);
                        this.btnCross.addTouchEventListener(this.crossCallBack,this);
                        //this.btnCross.setPosition(cc.p(cc.winSize.width/2-225*appDelegate.deviceScaleFloat,75*appDelegate.deviceScaleFloat));
                        this.btnCross.setTag(0);

                        if (this.isSmallWindow && this.imgBackground!=null)
                            this.btnCross.setPosition(cc.p(cc.winSize.width/2-this.imgBackground.getScaleX()*this.imgBackground.getContentSize().width/2+this.btnCross.getScaleX()*this.btnCross.getContentSize().width/2+5*appDelegate.deviceScaleFloat,
                                                        cc.winSize.height/2+this.imgBackground.getScaleY()*this.imgBackground.getContentSize().height/2-this.btnCross.getScaleY()*this.btnCross.getContentSize().height/2-5*appDelegate.deviceScaleFloat));
                        else
                            this.btnCross.setPosition(cc.p(this.btnCross.getScaleX()*this.btnCross.getContentSize().width/2+5*appDelegate.deviceScaleFloat,cc.winSize.height-this.btnCross.getScaleY()*this.btnCross.getContentSize().height/2-5*appDelegate.deviceScaleFloat));
                        
                        this.addChild(this.btnCross, 2);
                    },

                    crossCallBack:function(pSender,type)
                    {
                        switch (type)
                        {
                            case ccui.Widget.TOUCH_ENDED:
                                this.removeFromParent(true);
                            break;
                        }
                    },

                    loadLoading:function()
                    {
                        this.scheduleOnce(this.removeLoading,10);
                        this.loadingLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
                        this.addChild(this.loadingLayer, 100);

                        var strLB = 'Loading...';
                        var lblLBText=new cc.LabelTTF(strLB, StorePanel.getFont(res.fontGeorgiaBoldTtf), 60*appDelegate.deviceScaleFloat);
                        lblLBText.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height/2));
                        lblLBText.setAnchorPoint(cc.p(0.5,0.5));
                        lblLBText.setFontFillColor(cc.color(255,255,255));
                        lblLBText.enableStroke(cc.color(96,63,44), 3.0, true);
                        this.loadingLayer.addChild(lblLBText);
                    },

                    removeLoading:function()
                    {
                        //   cc.log('removeLoadingLayer..............');
                        this.unschedule(this.removeLoading);
                        this.loadingLayer.removeFromParent();
                    },

                    onTouchBegan:function(touch,event){

                        return true;
                    },

                    onTouchMoved:function(touch,event){
                    },

                    onTouchEnded:function(touch,event){
                        
                        if(this.isSmallWindow==true)
                        {
                            if(this.imgBackground!=null)
                            {
                                var touchPoint = touch.getLocation();
                                //touchPoint = cc.director.convertToGL(touchPoint);
                                
                                //touchPoint=this.convertToNodeSpace(touchPoint);
                                
                                var smallWindowRect=cc.rect(this.imgBackground.getPosition().x-this.imgBackground.getScaleX()*this.imgBackground.getContentSize().width/2,
                                                            this.imgBackground.getPosition().y-this.imgBackground.getScaleY()*this.imgBackground.getContentSize().height/2 ,
                                                            this.imgBackground.getScaleX()*this.imgBackground.getContentSize().width, 
                                                            this.imgBackground.getScaleY()*this.imgBackground.getContentSize().height);
                                
                                if (!cc.rectContainsPoint(smallWindowRect,touchPoint))
                                {
                                    this.removeFromParent(true);
                                }
                            }
                        }
                    }
                    
                });

                StorePanel.cacheBase64Image = function(_imgSrc, _imgKey){
                    var imgElement = new cc.newElement("IMG");
                    imgElement.setAttribute("src", _imgSrc);

                    cc.textureCache.cacheImage(_imgKey, imgElement);
                }

                StorePanel.createSprite = function(_imgSrc, _imgKey){
                    StorePanel.cacheBase64Image(_imgSrc, _imgKey);

                    var sprite = new cc.Sprite(_imgKey);
                    return sprite;
                }
                StorePanel.createPhysicsSprite = function(_imgSrc, _imgKey){
                    StorePanel.cacheBase64Image(_imgSrc, _imgKey);

                    var physicsSprite = new cc.PhysicsSprite.create(_imgKey);
                    return physicsSprite;
                }
                StorePanel.createButton = function(_imgSrc, _imgKey){
                    StorePanel.cacheBase64Image(_imgSrc, _imgKey);

                    var btn = new ccui.Button(_imgKey, _imgKey);
                    return btn;
                }

                StorePanel.getRandomInt=function(lowerlimit,higherLimit) {
                    return Math.floor(Math.random() * Math.floor(higherLimit-lowerlimit)+lowerlimit);
                }


                StorePanel.createLabel=function(strText,fontSize, isBold)
                {
                    var strFontName="Arial";
                    
                    var lbl=new cc.LabelTTF(strText, strFontName, fontSize);
                    lbl.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                    lbl.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                    lbl.setColor(cc.color.BLACK);
                    
                    return lbl;
                }

                StorePanel.checkSpriteTouch=function(mainSprite,touchLocation)
                {
                    var point=mainSprite.convertToNodeSpace(touchLocation);
                    var size=mainSprite.getContentSize();
                    
                    if(point.x>0 && point.y>0 && point.x<size.width && point.y<size.height)
                        return true;
                    else
                        return false;
                }
                StorePanel.insertString=function(str, index, value) {
                    return str.substr(0, index) + value + str.substr(index);
                }
                StorePanel.getStringCommaFormated=function(value)
                {
                    var returnString = value.toString();
                    var insertPosition = returnString.length-3;

                    if(insertPosition > 0) {
                        returnString = StorePanel.insertString(returnString, insertPosition, ",");
                        insertPosition-=3;
                    }

                    while (insertPosition > 0) {
                        returnString = StorePanel.insertString(returnString, insertPosition, ",");
                        insertPosition-=3;
                    }
                    // cc.log("value: "+value+" ret: "+returnString);
                    return returnString;
                }

                StorePanel.setImageGray=function(image)
                {
                    image.setBlendFunc(cc.ZERO, cc.ONE_MINUS_SRC_ALPHA); // ciluate black
                }

                StorePanel.getFocusAction=function(){
                    var scaleUp = cc.ScaleTo.create(0.1, 1.2 * appDelegate.deviceScaleFloat, 1.2 * appDelegate.deviceScaleFloat);
                    var scaleDown = cc.ScaleTo.create(0.1, 1 * appDelegate.deviceScaleFloat, 1 * appDelegate.deviceScaleFloat);
                    var sequence = cc.Sequence.create(scaleUp, scaleDown);
                    var repeat = cc.RepeatForever.create(sequence);
                    
                    return repeat;
                }

                StorePanel.getTintAction=function(){
                    var tintDark = cc.TintTo.create(0.2, 255, 100, 100);
                    var tintBright = cc.TintTo.create(0.2, 255, 255, 255);
                    var sequence = cc.Sequence.create(tintDark, tintBright);
                    var repeat = cc.RepeatForever.create(sequence);
                    
                    return repeat;
                }


                //Main
                var mainPanel = null;
                var Item = cc.Class.extend({
                    appDelegate:null,
                    item: null,
                    imgSrc: null,
                    imgKey: null,
                    name: "Item",
                    tag: "",

                    init:function(_imgSrc, _imgKey, _pos, _name, _tag){
                        this.appDelegate = AppDelegate.sharedApplication();

                        this.imgSrc = _imgSrc;
                        this.imgKey = _imgKey;
                        this.name = _name;
                        this.tag = _tag;
                        cc.log(this.name + " created");

                        mainPanel = GamePlay.sharedManager();

                        return true;        
                    },
                    loadItem: function(){
                        this.item = StorePanel.createSprite(this.imgSrc, this.imgKey);
                        this.item.setPosition(_pos);
                    },

                });
                Item.create=function(imgSrc, imgKey, pos, name, tag) {
                    var ret=new Item();

                    if(ret && ret.init()) {
                        return ret;
                    } else {
                        delete ret;
                        ret=null;
                        return null;
                    }
                }

                var GameOver = StorePanel.extend({
                    appDelegate:null,
                    
                    init:function(){
                        if (this._super()){
                            this.initWithSmallWindow();
                            this.appDelegate = AppDelegate.sharedApplication();
                            cc.log("Game Over!");

                            this.laodAll();

                            return true;
                        }
                        return false;   
                    },
                    laodAll: function(){
                        var colr = cc.color(106, 138, 162);
                        var layerColor = cc.LayerColor.create(colr, cc.winSize.width, cc.winSize.height);
                        layerColor.setPosition(cc.p(0, 0));
                        this.addChild(layerColor);
                        // layerColor.setOpacity(0.8);

                        var score = localStorage.getItem("currentScore");
                        cc.log("your score: " + score);
                        var bestScore = localStorage.getItem("bestScore");
                        cc.log("best score: " + bestScore);

                        var scoreLabel = StorePanel.createLabel(score, 80*appDelegate.deviceScaleFloat, true);
                        scoreLabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2 + 100*appDelegate.deviceScaleFloat));
                        scoreLabel.setColor(cc.color(255,255,255));
                        // label.setDimensions(cc.size(this.imgBackground.getContentSize().width-50*appDelegate.deviceScaleFloat,200*appDelegate.deviceScaleFloat));
                        this.addChild(scoreLabel,1);

                        var overLabel = StorePanel.createLabel("Tap and Try", 60*appDelegate.deviceScaleFloat, false);
                        overLabel.setPosition(cc.p(scoreLabel.getPosition().x, scoreLabel.getPosition().y - 100*appDelegate.deviceScaleFloat));
                        overLabel.setColor(cc.color(255,255,255));
                        // label.setDimensions(cc.size(this.imgBackground.getContentSize().width-50*appDelegate.deviceScaleFloat,200*appDelegate.deviceScaleFloat));
                        this.addChild(overLabel,1);
                    },
                    onTouchBegan:function(touch,event){
                        // this.removeFromParentAndCleanup(true);
                        // appDelegate.ghud.loadStorePanel(panel.panelTest);

                        var appLink = "https://play.google.com/store/apps/details?id=com.itiw.dragonjump";
                        // var appLink = "�market://details?id=com.itiw.dragonjump�";
                      cc.sys.openURL("" + appLink);

                        return true;
                    },

                    onTouchMoved:function(touch,event){

                    },

                    onTouchEnded:function(touch,event){

                    },
                });
                GameOver.create=function(){
                    var ret=new GameOver();

                    if(ret && ret.init()) {
                        return ret;
                    } else {
                        delete ret;
                        ret=null;
                        return null;
                    }
                }

                var isTapEnabled = false;
                var canCountScore = false;
                var isLevelCompleted = false;
                var isGameOver = false;
                var scorePoint = 0;
                var scoreLimit = 10;
                var scoreLabel = null;
                var targetScore;
                
                var panelName;
                var testList2d;    

                
                //TRex Runner
                var spEggs = [], spBackgrounds = [];
                var size, spBasket, spBackgroundBottom, score, life, labelScoreValue, labelLifeValue, spBackgroundSize, backgroundDiv, eggSpeed;


                var GamePlay = StorePanel.extend({
                    layerOnGamePanel: null,
                    isFirstTouch: true,
                    isCompleted: false,
                    nextTask: "nothing",
                    hand: null,                   
                    noOfCurrentLevel: 0,

                    init:function(){
                        if (this._super()){
                            // cc.director.getPhysicsManager().enabled = true;
                            this.initWithSmallWindow();
                            GamePlay.sharedInstance=this;
                            var appDelegate=AppDelegate.sharedApplication();
                            mainPanel = this;

                            // this.loadLayerOnGamePanel();
                            this.loadTRexRunnerPanel();
                            // this.loadScore();
                            this.loadNextSequence();

                            // this.scheduleUpdate();
                            return true;
                        }
                        return false;
                    },
                    loadTRexRunnerPanel: function(){
                        console.log("This is Test Panel");
                        var testLabel = StorePanel.createLabel("Hello" + scorePoint.toString(), 60*appDelegate.deviceScaleFloat);
                        testLabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2 + 450 * appDelegate.deviceScaleFloat));
                        // scoreLabel.setColor(cc.color(255,255,255));
                        // this.addChild(testLabel,10);

                        size = cc.winSize;

                        this.createBackground();
                        backgroundDiv = 100;
                        this.schedule(this.backgroundEggMove, 0.01);


                        spBasket = StorePanel.createSprite(dinoImgSrc, dinoImgKey);
                        var spBasketSize = spBasket.getContentSize();
                        spBasket.setAnchorPoint(cc.p(0.0, 0.0));
                        spBasket.setPosition(cc.p(20, size.height/3));
                        this.addChild(spBasket, 0);

                        
                        this.createEgg();
                        this.schedule(this.createEgg, 3);
                        eggSpeed = 10;
                        this.schedule(this.increaseEggSpeed, 5);
                        //this.schedule(this.dropEgg, 0.05);
                        
                        
                        score = 0;
                        life = 1;

                        var labelScore = StorePanel.createLabel("Score: ", 40 * appDelegate.deviceScaleFloat);
                        // var labelScore = new cc.LabelTTF("Score: ", "Arial", 40);
                        labelScore.setAnchorPoint(cc.p(0.0, 0.5));
                        labelScore.setPosition(cc.p(size.width*7/10, size.height*9/10));
                        labelScore.setColor(cc.color(0, 0, 0));
                        this.addChild(labelScore);

                        labelScoreValue = StorePanel.createLabel(score.toString(), 40 * appDelegate.deviceScaleFloat);
                        labelScoreValue.setAnchorPoint(cc.p(0.0, 0.5));
                        labelScoreValue.setPosition(cc.p((size.width*4/5)+60, size.height*9/10));
                        labelScoreValue.setColor(cc.color(0, 0, 0));
                        this.addChild(labelScoreValue);
                    },
                    loadNextSequence: function(){
                        cc.log("nextTask: " + this.nextTask);
                        if(this.nextTask == "nothing"){

                        }
                    },
                    loadTutorialHandWithPos: function(_pos){
                        var addHand = cc.callFunc(function(){
                            this.hand = StorePanel.createSprite(handImgSrc, handImgKey);
                            this.hand.setPosition(_pos);
                            this.addChild(this.hand, 10);
                            this.hand.setScale(1 * appDelegate.deviceScaleFloat);

                            this.moveVertically(this.hand, 1.0, 10);
                            
                        }, this);
                        return addHand;
                    },
                    moveVertically: function(item, movingTime, moveAmount){
                        var moveUp = cc.MoveTo.create(movingTime, cc.p(item.x, item.y + moveAmount * appDelegate.deviceScaleFloat));
                        var moveDown = cc.MoveTo.create(movingTime, cc.p(item.x, item.y -moveAmount * appDelegate.deviceScaleFloat));
                        item.runAction(cc.RepeatForever.create(cc.Sequence.create(moveUp, moveDown)));
                    },
                    makeActive: function(dt){
                        canCountScore = true;
                    },
                    
                    loadLayerOnGamePanel: function(){
                        var colr = cc.color(0, 0, 0);
                        this.layerOnGamePanel = cc.LayerColor.create(colr, cc.winSize.width, cc.winSize.height);
                        this.layerOnGamePanel.setPosition(cc.p(0, 0));
                        this.addChild(this.layerOnGamePanel);
                        this.layerOnGamePanel.setOpacity(1*255);
                    },                    
                    loadSpriteWithPos: function(itemName, itemKey, _pos){
                        var sprite = StorePanel.createSprite(itemName, itemName);
                        sprite.setPosition(_pos);
                        this.addChild(sprite);
                        sprite.setScale(appDelegate.deviceScaleFloat);
                        return sprite;
                    },
                    loadBg: function(bgSrc, bgKey){
                        this.bg = StorePanel.createSprite(bgSrc, bgKey);
                        this.bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                        this.addChild(this.bg);
                        this.bg.setScale(appDelegate.deviceScaleFloat);
                    },
                    loadScore: function(){
                        scoreLabel = StorePanel.createLabel("" + scorePoint.toString(), 60*appDelegate.deviceScaleFloat);
                        scoreLabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2 + 450 * appDelegate.deviceScaleFloat));
                        // scoreLabel.setColor(cc.color(255,255,255));
                        // label.setDimensions(cc.size(this.imgBackground.getContentSize().width-50*appDelegate.deviceScaleFloat,200*appDelegate.deviceScaleFloat));
                        this.addChild(scoreLabel,10);
                    },

                    randomNum: function(min, max) {
                      return Math.floor(Math.random() * (max - min) ) + min;
                    },

                    update: function(dt){

                    },
                    increaseEggSpeed: function(dt){
                        eggSpeed++;
                    },
                    createBackground: function(){
                        var spBackground = StorePanel.createSprite(backgroundImgSrc, backgroundImgKey);
                        spBackgroundSize = spBackground.getContentSize();
                        spBackground.setAnchorPoint(cc.p(0.0, 0.5));
                        spBackground.setPosition(cc.p(0, size.height/2));
                        spBackground.scaleY = size.height / spBackgroundSize.height;
                        this.addChild(spBackground, 0);
                        spBackgrounds.push(spBackground);

                        var spBackground = StorePanel.createSprite(backgroundImgSrc, backgroundImgKey);
                        spBackground.setAnchorPoint(cc.p(0.0, 0.5));
                        spBackground.setPosition(cc.p(spBackgroundSize.width, size.height/2));
                        spBackground.scaleY = size.height / spBackgroundSize.height;
                        this.addChild(spBackground, 0);
                        spBackgrounds.push(spBackground);
                    },
                    backgroundEggMove: function(dt){

                        for(var i=0; i<spBackgrounds.length; i++){
                            spBackgrounds[i].setPositionX(spBackgrounds[i].getPositionX()-(spBackgroundSize.width/backgroundDiv));
                            if(spBackgrounds[i].getPositionX()<=(-spBackgroundSize.width)){
                                spBackgrounds[i].setPositionX(spBackgroundSize.width);
                            }
                        }
                        for(var i=0; i<spEggs.length; i++){
                            var y = spEggs[i].getPositionX();
                            spEggs[i].setPositionX(y-eggSpeed);

                            if(this.catchEgg(spEggs[i])){
                                cc.log("Life: "+ (--life));
                                /*labelScoreValue.setString((++score).toString());
                                var sprite_action = cc.FadeOut.create(0.5);
                                spEggs[i].runAction(sprite_action);
                                //this.removeChild(spEggs[i]);
                                spEggs.splice(i, 1);*/
                                if(life<=0){
                                    this.gameOver();
                                }
                            }
                            if(this.fallenEgg(spEggs[i])){
                                //cc.log("Score: "+ (++score));
                                labelScoreValue.setString((++score).toString());
                                //this.crackEgg(spEggs[i]);
                                spEggs.splice(i, 1);
                                /*if(life<=0){
                                    this.gameOver();
                                }*/
                            }
                        }
                    },
                    createEgg: function(dt){
                        var spEgg = StorePanel.createSprite(cactusImgSrc, cactusImgKey);
                        spEgg.setAnchorPoint(cc.p(1.0, 0.3));
                        var posX = (Math.random()*500)+500;
                        //cc.log("PosX: "+posX);
                        spEgg.setPosition(cc.p(size.width+posX, size.height/3));
                        spEggs.push(spEgg);
                        this.addChild(spEgg, 0);
                    },
                    /*dropEgg: function(dt){
                        for(var i=0; i<spEggs.length; i++){
                            var y = spEggs[i].getPositionY();
                            spEggs[i].setPositionY(y-5);

                            if(this.catchEgg(spEggs[i])){
                                //cc.log("Score: "+ (++score));
                                labelScoreValue.setString((++score).toString());
                                var sprite_action = cc.FadeOut.create(0.5);
                                spEggs[i].runAction(sprite_action);
                                //this.removeChild(spEggs[i]);
                                spEggs.splice(i, 1);
                            }
                            if(this.fallenEgg(spEggs[i])){
                                //cc.log("Life: "+ (--life));
                                labelLifeValue.setString((--life).toString());
                                this.crackEgg(spEggs[i]);
                                spEggs.splice(i, 1);
                                if(life<=0){
                                    this.gameOver();
                                }
                            }
                        }
                    },*/
                    
                    gameOver: function(){
                        /*var scene = new HelloWorldScene2();
                        cc.director.pushScene(new cc.TransitionFade(3, scene));*/
                        var spBackground = StorePanel.createSprite(gameOverImgSrc, gameOverImgKey);
                        spBackgroundSize = spBackground.getContentSize();
                        spBackground.setAnchorPoint(cc.p(0.5, 0.5));
                        spBackground.setPosition(cc.p(size.width/2, size.height/2));
                        spBackground.scaleY = size.height / spBackgroundSize.height;
                        spBackground.scaleX = size.width / spBackgroundSize.width;
                        this.addChild(spBackground, 0);
                    },
                    /*crackEgg: function(egg){
                        this.removeChild(egg);
                        var spEggCrack = new cc.Sprite.create(res.EggCrack_png);
                        spEggCrack.setAnchorPoint(cc.p(0.5, 0.5));
                        spEggCrack.setPosition(cc.p(egg.getPositionX(), spBackgroundBottom));
                        this.addChild(spEggCrack, 0);
                        var sprite_action = cc.FadeOut.create(10);
                        spEggCrack.runAction(sprite_action);
                    },*/
                    fallenEgg: function(egg){
                        if(egg.getPositionX() <= 0){
                            return true;
                        }
                        return false;
                    },
                    catchEgg: function(egg){
                        var rectA = egg.getBoundingBox();
                        var rectB = spBasket.getBoundingBox();
                        rectA.x += 5;
                        rectA.height-=10;
                        rectA.width-=10;
                        if(cc.rectIntersectsRect(rectA, rectB)){
                            return true;
                        }
                        return false;
                    },

                    onTouchBegan:function(touch,event){
                        cc.log("touch");
                        // if(cc.rectContainsPoint(spBasket.getBoundingBox(), cc.p(touch.getLocationX(), touch.getLocationY()))){
                        //     //mousePressed = true;
                        //     var sprite_action = cc.JumpTo.create(1.5, cc.p(spBasket.getPositionX(), spBasket.getPositionY()), 200, 1);
                        //     spBasket.runAction(sprite_action);
                        // }
                        var sprite_action = cc.JumpTo.create(1.5, cc.p(spBasket.getPositionX(), spBasket.getPositionY()), 200, 1);
                            spBasket.runAction(sprite_action);

                        return true;
                    },

                    onTouchMoved:function(touch,event){

                    },

                    onTouchEnded:function(touch,event){

                    },
                });

                GamePlay.sharedInstance=null;
                GamePlay.sharedManager=function(){
                    return GamePlay.sharedInstance;
                }

                GamePlay.create=function()
                {
                    var ret=new GamePlay();

                    if(ret && ret.init()) {
                        return ret;
                    } else {
                        delete ret;
                        ret=null;
                        return null;
                    }
                }
                var GameHud=cc.Layer.extend({

                    init:function()
                    {
                        if (this._super())
                        {
                            //this.runAction(cc.Sequence.create(cc.delayTime(0.1),cc.CallFunc.create(this.callAfterLoad, this)));
                            this.callAfterLoad();
                            return true;
                        }
                        return false;
                    },

                    callAfterLoad:function()
                    {
                        // cc.log("callAfterLoad 1");

                                            
                    },

                    loadStorePanel:function(panelId){
                        switch(panelId){
                            case panel.panelGame:
                            {
                                var gamePlay = GamePlay.create();
                                this.addChild(gamePlay,1);
                            }
                            break;
                            case panel.panelTest:
                            {
                                var gameTest = GameTest.create();
                                this.addChild(gameTest,1);
                            }
                            break;
                        }
                    }

                });
                GameHud.create=function()
                {
                    var ret=new GameHud();

                    if(ret && ret.init()) {
                        return ret;
                    } else {
                        delete ret;
                        ret=null;
                        return null;
                    }
                }
                var GameNode=cc.Layer.extend({
                    init:function()
                    {
                        if(this._super())
                        {
                            var appDelegate=AppDelegate.sharedApplication();
                            appDelegate.ghud.loadStorePanel(panel.panelGame);
                            //var resources=Resources.sharedManager();

                            return true;
                        }
                        return false;
                    },

                    runTimeLoadCompleted:function(tag)
                    {
                        if(tag=="egg")
                        {
                            
                        }
                    }

                });   

                GameNode.create=function() 
                {
                    var ret=new GameNode();
                    if(ret && ret.init()) {
                        return ret;
                    } else {
                        delete ret;
                        ret=null;
                        return null;
                    }
                }

                var GameNodeScene=cc.Scene.extend({
                    onEnter:function () {
                        this._super();
                        var appDelegate=AppDelegate.sharedApplication();
                        
                        var gameHud=GameHud.create();
                        this.addChild(gameHud,1);
                        appDelegate.ghud=gameHud;
                        
                        var gameNode=GameNode.create();
                        this.addChild(gameNode);
                        appDelegate.gnode=gameNode;    
                        // cc.director.getPhysicsManager().enabled = true;                
                    },

                    loadBackground:function () 
                    {
                        var sprite = StorePanel.createSprite(bgImgSrc, bgImgKey);
                        sprite.setPosition(cc.size.width / 2, cc.size.height / 2);
                        this.addChild(sprite, 0);
                    },
                });

                var AppDelegate=cc.Layer.extend({
                    deviceScaleFloat:1,

                    gnode:null,
                    ghud:null,
                    selectedObjectId:[],

                    autoBattleType:0,
                    isOtherVillage:false,
                    otherVillageData:null,
                    friendsVillageLBScores:[],
                    
                    myVillageData:null,

                    isTouchSwallowed:false,

                    isCalledFbMethod:false,

                    init:function()
                    {
                        if (this._super())
                        {
                            //cc.sys.localStorage.clear();
                            this.deviceScaleFloat=1;

                            var rectSize = cc.view.getFrameSize();
                                
                            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS)
                            {
                                if(rectSize.height==2436 && rectSize.width==1125) this.deviceScaleFloat=1.65;
                                else if(rectSize.height==2208 && rectSize.width==1242) this.deviceScaleFloat=1.92;
                                else if(rectSize.height==1334 && rectSize.width==750) this.deviceScaleFloat=1.17;
                                else if(rectSize.height==2048 && rectSize.width==1536) this.deviceScaleFloat=1.9;
                                else if(rectSize.height==1024 && rectSize.width==768) this.deviceScaleFloat=0.95;
                            }
                            else
                            {
                                if(rectSize.height==2436 && rectSize.width==1125) this.deviceScaleFloat=1.65;
                                else if(rectSize.height==2208 && rectSize.width==1242) this.deviceScaleFloat=1.92;
                                else if(rectSize.height==1334 && rectSize.width==750) this.deviceScaleFloat=1.17;
                                else if(rectSize.height==2048 && rectSize.width==1536) this.deviceScaleFloat=1.9;
                                else if(rectSize.height==1024 && rectSize.width==768) this.deviceScaleFloat=0.95;

                                else if(rectSize.height>=2048 && rectSize.width>=640*2.0) this.deviceScaleFloat=2.0;
                                else if(rectSize.height>=1792 && rectSize.width>=640*1.75) this.deviceScaleFloat=1.75;
                                else if(rectSize.height>=1536 && rectSize.width>=640*1.5) this.deviceScaleFloat=1.5;
                                else if(rectSize.height>=1280 && rectSize.width>=640*1.25) this.deviceScaleFloat=1.25;
                                else if(rectSize.height>=1152 && rectSize.width>=640*1.125) this.deviceScaleFloat=1.125;
                                else if(rectSize.height>=960 && rectSize.width>=640*1.0) this.deviceScaleFloat=1.0;
                                else if(rectSize.height>=840 && rectSize.width>=640*0.875) this.deviceScaleFloat=0.875;
                                else if(rectSize.height>=720 && rectSize.width>=640*0.75) this.deviceScaleFloat=0.75;
                                else if(rectSize.height>=480 && rectSize.width>=640*0.5) this.deviceScaleFloat=0.5;
                                else deviceScaleFloat=0.4;
                            }
                                           
                            // cc.log("rectSize.height / rectSize.width " + rectSize.height + " " + rectSize.width);
                            
                            // cc.log("this.deviceScaleFloat " + this.deviceScaleFloat);
                                                
                            this.runAction(cc.Sequence.create(cc.CallFunc.create(this.cache64Images, this),cc.delayTime(0.1),cc.CallFunc.create(this.callAfterLoad, this)));

                            return true;
                        }
                        return false;
                    },

                    cache64Images:function(){
                        StorePanel.cacheBase64Image(logoImgSrc, logoImgKey);
                        StorePanel.cacheBase64Image(handImgSrc, handImgKey);
                        StorePanel.cacheBase64Image(gamePlayBgImgSrc, gamePlayBgImgKey);

                        StorePanel.cacheBase64Image(backgroundImgSrc, backgroundImgKey);
                        StorePanel.cacheBase64Image(cactusImgSrc, cactusImgKey);
                        StorePanel.cacheBase64Image(dinoImgSrc, dinoImgKey);
                        StorePanel.cacheBase64Image(gameOverImgSrc, gameOverImgKey);



                        // var preloader = new Audio();
                        // preloader.src = "data:audio/mp3;base64," + ballOnTileSoundSrc;
                    },

                    callAfterLoad:function()
                    {
                        this.isTouchSwallowed=false;
                        this.isOtherVillage=false;
                        
                        // this.myVillageData=VillageData.create(true,null);
                        // cc.log("my scene added");
                        cc.director.runScene(new GameNodeScene());
                        
                        /*if(!cc.sys.isNative && !isLocalhost)
                        {
                            FBInstantManager.getFriendsVillageLBScores("All Players Scores");
                        }
                        this.pausOn();*/
                    },

                    willDataUpdate:function()
                    {
                        if(this.isOtherVillage==true)
                            return false;
                        return true;
                    }
                    
                });

                AppDelegate.sharedInstance=null;
                    
                AppDelegate.sharedApplication=function() 
                {
                    if(AppDelegate.sharedInstance==null)
                    {
                        AppDelegate.sharedInstance=AppDelegate.create();
                    }
                    return AppDelegate.sharedInstance;
                }

                AppDelegate.isTileMapExpand=0;

                AppDelegate.create=function() 
                {
                    var ret=new AppDelegate();

                    if(ret && ret.init()) {
                        return ret;
                    } else {
                        delete ret;
                        ret=null;
                        return null;
                    }
                }

                var AppDelegateScene=cc.Scene.extend({
                    onEnter:function () {
                        this._super();

                        var appDelegate=AppDelegate.sharedApplication();
                        this.addChild(appDelegate,1);
                    } 
                });
                //-----

                cc._loaderImage = logoImgSrc;
                cc.LoaderScene.preload([], function () {
                    cc.director.runScene(new AppDelegateScene());
                }, this);
              };
              cc.game.run("gameCanvas");
          };
    </script>
</body>
</html>
