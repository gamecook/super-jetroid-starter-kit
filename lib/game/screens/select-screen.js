/**
 *  @select-screen.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.screens.select-screen'
)
    .requires(
    'impact.game',
    'impact.font',
    'impact.sound',
    'plugins.tween-lite',
    'bootstrap.plugins.hit-area',
    'game.screens.game-screen'
)
    .defines(function () {

        // This is a simple template for the start screen. Replace the draw logic with your own artwork
        SelectScreen = ig.Game.extend({
            clickDelay:1,
            delayTimer:new ig.Timer(),
            selectionTextObj:{ x:0, y:0 },
            selectionBoxObj:{ x:0, y:0 },
            purchaseTextObj: { x: 0, y: 0 },
            debugHitAreas:false,
            scanLines: new ig.Image("media/sprites/scan-lines.png"),
            animating: false,
            columns: 5,
            total: 10,
            sizeX: 110,
            sizeY: 100,
            padding: 20,
            totalLevels: 10,
            showPurchaseText: false,
            selectSFX: new ig.Sound("media/sounds/selection.*"),
            init: function() {

                this.screenTextures = ig.entitiesTextureAtlas;

                this.font = new ig.TextureAtlasFont(ig.nokia36WhiteShadowTextureAtlas, 2, 10);
                
                ig.input.bind(ig.KEY.MOUSE1, "click");

                this.setupTweens();

                this.animateIn();
                
                // Enable this if you want to limit the levels in trial mode
                /*
                if (typeof licenseInfo != "undefined") {
                    if (licenseInfo.isTrial) {
                        this.totalLevels = 2;
                        this.showPurchaseText = true;
                    }
                }*/

                this.level = this.totalLevels;

                this.selection = 0;//this.level - 1;
                
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.ENTER, 'enter');
                
                ig.music.play("track1");

            },
            setupTweens: function() {

                this.selectionTextImg = this.screenTextures.getFrameData("select-text.png").frame;
                this.selectionBoxImg = this.screenTextures.getFrameData("selection-boxes.png").frame;
                this.purchaseTextImg = this.screenTextures.getFrameData("purchase-text.png").frame;

                // Setup Select Text
                this.selectionBoxObj.x = ig.system.width + this.selectionBoxImg.w;
                this.selectionBoxObj.y = (ig.system.height - this.selectionBoxImg.h) * .5 - 30;
                this.selectionBoxTween = TweenLite.fromTo(this.selectionBoxObj, .5, { x: this.selectionBoxObj.x }, { x: (ig.system.width - this.selectionBoxImg.w) * .5, ease: Strong.easeOut });
                this.selectionBoxTween.pause();
                
                // Setup Select Box
                this.selectionTextObj.x = -this.selectionTextImg.w;
                this.selectionTextObj.y = this.selectionBoxObj.y - this.selectionTextImg.h - 20;
                this.selectionTextTween = TweenLite.fromTo(this.selectionTextObj, .5, { x: this.selectionTextObj.x }, { x: (ig.system.width - this.selectionTextImg.w) * .5, ease: Strong.easeOut });
                this.selectionTextTween.pause();

                // Setup Purchase Text
                this.purchaseTextObj.x = -this.purchaseTextImg.w;
                this.purchaseTextObj.y = this.selectionBoxObj.y + this.selectionBoxImg.h + 15;
                this.purchaseTextObj.w = this.purchaseTextImg.w;
                this.purchaseTextObj.h = this.purchaseTextImg.h;
                this.purchaseTextTween = TweenLite.fromTo(this.purchaseTextObj, .5, { x: ig.system.width }, { x: (ig.system.width - this.purchaseTextImg.w) * .5, delay: .5, ease: Strong.easeOut });
                this.purchaseTextTween.pause();
            },
            setupHitareas: function () {
                this.hitAreas = [];
                
                var startX = this.selectionBoxObj.x;
                var startY = this.selectionBoxObj.y;
                
                for (var i = 0; i < this.total; i++) {
                    this.registerHitArea(i, startX, startY, this.sizeX, this.sizeY);
                    startX += this.sizeX + this.padding;
                    if (i % this.columns == this.columns - 1) {
                        startX = this.selectionBoxObj.x;
                        startY += this.sizeY + this.padding;
                    }
                }

                if(this.showPurchaseText)
                {
                    this.registerHitArea("purchase", this.purchaseTextObj.x, this.purchaseTextObj.y, this.purchaseTextObj.w, this.purchaseTextObj.h);
                }

            },
            animateIn: function () {
                this.animating = true;
                this.selectionTextTween.play().delay(0);
                this.selectionBoxTween.play().delay(.5).eventCallback("onComplete", this.animationInComplete);
                this.purchaseTextTween.play().delay(.6);
            },
            animationInComplete: function () {

                ig.game.animating = false;
                ig.game.setupHitareas();
            },
            animateOut: function () {
                this.animating = true;
                this.selectionTextTween.reverse().delay(0).eventCallback("onReverseComplete", this.animationOutComplete);
                this.selectionBoxTween.reverse().delay(.5);
                this.purchaseTextTween.reverse().delay(.5);
            },
            animationOutComplete: function() {
                ig.system.setGameNow(GameScreen, ig.game.nextLevelToLoad);
            },
            update:function () {
                this.parent();

                // check for button press
                if (ig.input.pressed('click') && !this.animating) {
                    var hits = this.testHitAreas(ig.input.mouse.x, ig.input.mouse.y);
                    if (hits.length > 0) {
                        if (hits[0] == "purchase") {
                            sendToStore();
                        } else {
                            if (hits[0] < this.level) {
                                this.makeSelection(hits[0]);
                            } else {
                                //console.log("level is not unlocked");
                            }
                        }
                    }
                }

                if (ig.input.pressed('left')) {
                    this.previousSelection();
                } else if (ig.input.pressed('right')) {
                    this.nextSelection();
                } else if (ig.input.pressed('enter')) {
                    this.makeSelection(this.selection);
                }

                // Joystick controls
                if (typeof (controller) != "undefined") {
                    var state = controller.getState();

                    if (state.connected) {

                        //console.log("Controller");
                        if (state.dpad_right)
                            this.nextSelection();
                        
                        if (state.dpad_left)
                            this.previousSelection();
                        
                        if (state.start)
                            this.makeSelection(this.selection);

                    }
                } else {
                    //console.log("no controller");
                }

            },
            nextSelection: function () {
                
                this.selection++;
                if (this.selection > 9 || this.selection > this.level-1)
                    this.selection = 0;
            },
            previousSelection: function(){
                this.selection--;
                if (this.selection < 0)
                    this.selection = this.level-1;
            },
            makeSelection: function(value) {
                this.nextLevelToLoad = value + ".js";
                this.selection = value;
                this.animateOut();
                this.selectSFX.play();
            },
            draw:function () {
                this.parent();

                this.screenTextures.drawFrame("select-text.png", this.selectionTextObj.x, this.selectionTextObj.y);

                if (this.showPurchaseText)
                    this.screenTextures.drawFrame("purchase-text.png", this.purchaseTextObj.x, this.purchaseTextObj.y);

                this.screenTextures.drawFrame("selection-boxes.png", this.selectionBoxObj.x, this.selectionBoxObj.y);

                //draw box details
                var text = "00";
                var ranking = 1;

                var startX = this.selectionBoxObj.x;
                var startY = this.selectionBoxObj.y;
                for (var i = 0; i < this.total; i++) {

                    text = i < this.level ? (i + 1).toString().pad(2, "0") : "--";
                    var width = this.font.widthForString(text);
                    this.font.draw(text, startX + ((this.sizeX - width) * .5) + 2, startY + 30);

                    startX += this.sizeX + this.padding;
                    if (i % this.columns == this.columns - 1) {
                        startX = this.selectionBoxObj.x;
                        startY += this.sizeY + this.padding;

                    }
                    
                }

                var selectedX = this.selectionBoxObj.x + ((this.selection % this.columns) * (this.sizeX + this.padding));
                var selectedY = this.selectionBoxObj.y + ((this.selection > (this.columns - 1) ? 1 : 0) * (this.sizeY + this.padding));
                
                this.screenTextures.drawFrame("selction-box-highlight.png", selectedX, selectedY);

                this.scanLines.draw(0, 0);

            }
        });
    })