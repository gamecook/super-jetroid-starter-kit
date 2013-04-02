ig.module(
    'game.screens.start-screen'
)
    .requires(
    'impact.game',
     'bootstrap.plugins.texture-atlas'
)
    .defines(function () {

        // This is a simple template for the start screen. Replace the draw logic with your own artwork
        StartScreen = ig.Game.extend({
            clickDelay:1,
            currentPageBackground:null,
            backgroundObj:{ x:0, y:0 },
            playerObj:{ x:0, y:0 },
            logoObj:{ x:0, y:0 },
            logoMaskObj:{ x:0, y:0 },
            backgroundMaskBObj:{ x:0, y:0 },
            startBlinkTimer:new ig.Timer(),
            showStartText:false,
            animationDone:false,
            screens: ["background-image.png"],
            currentScreen:0,
            logoTween: null,
            splashScreenTextures: null,
            init:function () {
                
                this.splashScreenTextures = ig.screensTextureAtlas;

                //this.delayTimer.reset();

                ig.input.bind(ig.KEY.MOUSE1, "click");

                this.setupTweens();

                this.animateIntoIn(this.animationIntroInComplete);

                ig.input.bind(ig.KEY.ENTER, 'enter');

            },
            setupTweens: function () {
                
                //var page1Data = this.radarTexture.getFrameData("radar-sprite.png");
                var logoData = this.splashScreenTextures.getFrameData("title.png").frame;
                this.page0Img = this.splashScreenTextures.getFrameData("background-image.png").frame;

                // this needs to handle screen resize while animation is going on
                this.backgroundObj.x = (ig.system.width - (this.page0Img.w - 53)) * .5;
                this.backgroundObj.y = (ig.system.height - this.page0Img.h) * .5;
               

                if (this.ad && ig.system.height <= 786)
                    this.backgroundObj.y = 10;

                //Monster position
                /*this.playerObj.x = this.backgroundObj.x + 20;//130;//(this.backgroundObj.x + this.page0Img.w) - (this.playerImg.width + 80);
                this.playerObj.y = ig.system.height;
                this.monsterTween = TweenLite.fromTo(this.playerObj, .5, { y: this.playerObj.y }, { y: this.backgroundObj.y + 30, delay: .8, ease: Back.easeOut });
                this.monsterTween.pause();
                */
                
                // Setup Logo
                this.logoObj.x = ig.system.width + 300;
                this.logoObj.y = ig.system.height - 300;
                this.logoTween = TweenLite.fromTo(this.logoObj, .5, { x: this.logoObj.x, y: this.logoObj.y }, { x: this.backgroundObj.x + this.page0Img.w - logoData.w - 50, y: this.backgroundObj.y + this.page0Img.h - logoData.h - 15, delay: 0, ease: Strong.easeOut });
                this.logoTween.pause();

                // Background Mask
                this.backgroundMaskBObj.x = this.backgroundObj.x;
                this.backgroundMaskBObj.y = this.backgroundObj.y - 70;
                this.backgroundMaskBObj.w = 755;
                this.backgroundMaskBObj.h = 600;
                this.backrgoundMaskTween = TweenLite.fromTo(this.backgroundMaskBObj, 1, { y: this.backgroundMaskBObj.y }, { y: ig.system.height, ease: Quart.easeInOut });
                this.backrgoundMaskTween.pause();

            },
            showScreen:function (index) {

                // Keep track if we need to go into the inrto or are coming from the intro
                if (index >= this.screens.length) {
                    index = 0;
                }
                this.currentScreen = index;
                

                /*if (this.currentScreen == 0) {
                    this.monsterTween.play();
                }
                else if (this.currentScreen == 1) {
                    this.animationDone = this.showStartText = false;
                    this.monsterTween.reverse();
                }*/

                this.activeBGImg = this.screens[this.currentScreen];//this["page" + this.currentScreen + "Img"];
                this.animateMaskDown(.1, this.animationComplete);

            },
            animateIntoIn:function (callback) {
                this.mode = "animateIntroIn";
                this.logoTween.play();
                this.showScreen(0);
                this.animateMaskDown(.3, this.animationComplete);
            },
            animateIntroOut:function (callback) {
                this.mode = "animateIntroOut";
                this.animationDone = this.showStartText = false;
                this.backrgoundMaskTween.reverse().delay(.1);
                //this.monsterTween.reverse();
                this.logoTween.reverse().delay(.4).eventCallback("onReverseComplete", this.animationComplete);
            },
            animateMaskUp:function (delay, callback) {
                this.backrgoundMaskTween.reverse().delay(delay).eventCallback("onReverseComplete", callback);
            },
            animateMaskDown:function (delay, callback) {
                this.backrgoundMaskTween.play().delay(delay).eventCallback("onComplete", callback);
            },
            animateNextPage:function () {
                if (ig.game.showScreen)
                    ig.game.showScreen(ig.game.currentScreen + 1);
            },
            animationComplete:function () {
                switch (ig.game.mode) {
                    case "animateIntroIn":
                        ig.game.animationDone = true;
                        break;
                    case "animateIntroOut":
                        ig.game.gotoNextScreen();
                        break;
                }
            },
            gotoNextScreen: function() {
                ig.system.setGame(SelectScreen);
            },
            update:function () {
                if (ig.input.pressed('click') && this.animationDone) {

                    this.onStart();
                }
                this.parent();

                if (this.animationDone)
                    this.showStartText = Math.round(this.startBlinkTimer.delta()) % 2 ? true : false;

                var delay = ig.game.currentScreen == 0 ? this.screenDelay * .5 : this.screenDelay;

                /*if (this.delayTimer.delta() > delay) {
                    this.delayTimer.reset();
                    this.animateMaskUp(.2, this.animateNextPage);
                }*/

                if (ig.input.pressed('enter')) {
                    this.onStart();
                }


                // Joystick controls
                if (typeof (controller) != "undefined") {
                    var state = controller.getState();

                    if (state.connected) {

                        if (state.start || state.a)
                            this.onStart();

                    }
                } else {
                    //console.log("no controller");
                }
            },
            onStart: function()
            {
                //if (this.currentScreen == 0) {
                    this.animateIntroOut(this.animationInrtoOutComplete);
                    //this.startSFX.play();
                /*} else {
                    this.showScreen(0);
                    this.delayTimer.reset();
                }*/
            },
            draw:function () {
                this.parent();

                this.splashScreenTextures.drawFrame(this.activeBGImg, this.backgroundObj.x, this.backgroundObj.y);

                //Mask For Background
                ig.system.context.fillRect(this.backgroundMaskBObj.x, this.backgroundMaskBObj.y, this.backgroundMaskBObj.w, this.backgroundMaskBObj.h);

                if (this.showStartText) {
                    var txtImg = (this.currentScreen == 0) ? "start-text.png" : "instructions-text.png";
                    var txtFrame = this.splashScreenTextures.getFrameData(txtImg).frame;
                    this.splashScreenTextures.drawFrame(txtImg, this.backgroundObj.x + this.page0Img.w - (txtFrame.w + 50), this.backgroundObj.y + 25);
                }
                //this.splashScreenTextures.drawFrame("player.png", this.playerObj.x, this.playerObj.y);

                //Logo Tray
                this.splashScreenTextures.drawFrame("background-mask.png", this.backgroundObj.x - 20, this.logoObj.y - 30);

                //Logo Text
                this.splashScreenTextures.drawFrame("title.png", this.logoObj.x, this.logoObj.y);

                // Mask off right side
                ig.system.context.fillRect(this.backgroundObj.x + this.backgroundObj.width, this.backgroundObj.y - 100, this.backgroundMaskBObj.w, this.backgroundMaskBObj.h);
            }
        });
    })