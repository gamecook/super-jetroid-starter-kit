/**
 *  @game-screen.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.screens.game-screen'
)
.requires(
    'impact.game',
    'impact.font',
    'bootstrap.plugins.camera',
    'game.plugins.effects',
    
    'bootstrap.plugins.pause',
    'bootstrap.plugins.utils',
    'bootstrap.plugins.hit-area',
    'game.plugins.particles',
    'bootstrap.plugins.touch-joystick',

    'game.plugins.caption',
    'game.plugins.meters',

    'game.levels.0',
    'game.levels.1',
    'game.levels.2',
    'game.levels.3',
    'game.levels.4',
    'game.levels.5',
    'game.levels.6',
    'game.levels.7',
    'game.levels.8',
    'game.levels.9'
)
    .defines(function () {

        GameScreen = ig.Game.extend({
            // Load a font
            font: null,
            pauseButton:new ig.Image('media/pause.png'),
            player:null,
            screenBoundary:null,
            gravity:1500,
            score:0,
            strength:3,
            level:0,
            maxLevels:5,
            mainMap:null,
            collisionMap:null,
            spawnerOffset:0,
            leftSpawner:null,
            rightSpawner:null,
            spawner:null,
            nextLevel:0,
            rewardsTotal:0,
            gameOver:false,
            cameraYOffset:0,
            gameOverDelay:2,
            gameOverDelayTimer:new ig.Timer(),
            gameOverSFX:new ig.Sound("media/sounds/death-theme.*"),
            showHUD:true,
            quitButton:{ name:"quit", label:"QUIT GAME", x:0, y:0, width:0, height:0 },
            soundButton:{ name:"sound", label:"SOUND", x:0, y:0, width:0, height:0 },
            musicButton: { name: "music", label: "MUSIC", x: 0, y: 0, width: 0, height: 0 },
            levelText: {x: 0, y:0},
            ad:null,
            totals:{},
            currentLevelName:null,
            
            joystick: null,
            
            init: function (level) {
                this.textures = ig.entitiesTextureAtlas;
                this.font = new ig.TextureAtlasFont(ig.nokia36WhiteShadowTextureAtlas, 2, 10);
                this.loadGame(level);
            },
            
            loadGame: function (level)
            {
                this.levelTimer = new ig.Timer();
                
                ig.input.bind(ig.KEY.MOUSE1, "click");
                
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');

                ig.input.bind(ig.KEY.A, 'left');
                ig.input.bind(ig.KEY.D, 'right');
                ig.input.bind(ig.KEY.W, 'jump');
                
                this.loadLevelByFileName(level);

                this.ad = document.getElementById("ad");
                if (this.ad) {
                    this.ad.style.display = "none";
                }

                this.alignButtons();

                this.joystick = new TouchJoystick();

                
            },
            alignButtons:function () {

                this.clearHitAreas();

                this.pauseX = (ig.system.width - this.pauseButton.width) * .5;
                
                this.registerHitArea("pause", this.pauseX, 8, this.pauseButton.width, this.pauseButton.height * .5);

                // Register buttons

                // Quit Button
                this.quitButton.width = this.font.widthForString(this.quitButton.label);
                this.quitButton.height = this.font.heightForString(this.quitButton.label);
                this.quitButton.x = ig.system.width - (this.quitButton.width + 5);
                this.quitButton.y = 3;
                this.registerHitArea(this.quitButton.name, this.quitButton.x, this.quitButton.y, this.quitButton.width, this.quitButton.height);

                // Sound Button
                this.soundButton.width = this.font.widthForString(this.soundButton.label + " OFF");
                this.soundButton.height = this.font.heightForString(this.soundButton.label);
                this.soundButton.x = 3;//ig.system.width - (this.soundButton.width + 5);
                this.soundButton.y = 3;//(this.soundButton.height) + 3;
                this.registerHitArea(this.soundButton.name, this.soundButton.x, this.soundButton.y, this.soundButton.width, this.soundButton.height);

                // Sound Button
                this.musicButton.width = this.font.widthForString(this.musicButton.label + " OFF");
                this.musicButton.height = this.font.heightForString(this.musicButton.label);
                this.musicButton.x = 3;//ig.system.width - (this.musicButton.width + 5);
                this.musicButton.y = (this.musicButton.height) + 3;
                this.registerHitArea(this.musicButton.name, this.musicButton.x, this.musicButton.y, this.musicButton.width, this.soundButton.height);

                this.levelNameText = "CURRENTLY EXPLORING ZONE ";
                this.levelText.x = (ig.system.width - this.font.widthForString(this.levelNameText+"00")) * .5;
                this.levelText.y = this.musicButton.y + this.musicButton.height + 50;
                
                if(this.currentLevelName)
                    this.levelNameText = "CURRENTLY EXPLORING ZONE " + (parseInt(this.currentLevelName) + 1).toString().pad(2, "0");
            },
            onViewChanged:function (viewState, width, height) {
                this.alignButtons();
            },
            loadLevel:function (data) {
                this.gameOver = false;
                this.parent(data);
                this.player = this.getEntitiesByType(EntityPlayer)[0];
                this.cameraFollow = this.player;
                this.levelTimer.reset();
                this.displayCaption("Entering Zone " + (parseInt(this.currentLevelName) + 1).toString().pad(2, "0"), 2);

            },
            updateControlMovement: function () {
                if (this.player == null)
                    return;
                
                if (this.player.pos.y + this.player.size.y < 0)
                    return;
                
                

                if (this.joystick) {
                    if (ig.input.pressed('click')) {
                        this.joystick.activate(ig.input.mouse.x, ig.input.mouse.y);
                    } else if (ig.input.released('click')) {
                        this.joystick.deactivate();
                    }

                    this.joystick.update(ig.input.mouse.x, ig.input.mouse.y);

                    // Mouse Control Logic
                    if (this.joystick.mouseDown) {
                        var mouseDownPoint = this.joystick.mouseDownPoint;
                        this.currentMousePoint = this.joystick.currentMousePoint;

                        var distPercent = this.currentMousePoint.dist / this.joystick.radius;

                        //TODO This needs to be based on angle and distance
                        if (this.currentMousePoint.y < mouseDownPoint.y && this.currentMousePoint.dist > 20) {
                            this.player.jumpDown(distPercent);
                            this.currentMousePoint.flying = true;
                        }

                        if (this.currentMousePoint.dist > 5) {
                            if (this.currentMousePoint.x > mouseDownPoint.x) {
                                if (this.player.moving.left > 0)
                                    this.player.leftReleased();
                                this.player.rightDown(distPercent);
                                this.currentMousePoint.dir = 1;
                            } else if (this.currentMousePoint.x < mouseDownPoint.x) {
                                if (this.player.moving.right > 0)
                                    this.player.rightReleased();
                                this.player.leftDown(distPercent);
                                this.currentMousePoint.dir = 0;
                            }
                        } else {
                            //console.log("Release");
                            if (this.currentMousePoint.dir)
                                this.player.rightReleased();
                            else {
                                this.player.leftReleased();
                            }
                        }

                    } else {
                        if (this.currentMousePoint) {
                            if (this.currentMousePoint.dir)
                                this.player.rightReleased();
                            else {
                                this.player.leftReleased();
                            }
                        }
                        this.currentMousePoint = null;
                    }

                }
                
                // Keyboard Controls
                if (this.player && !this.gameOver) {
                    // Controls
                    if (ig.input.pressed('left')) {
                        this.player.leftDown();
                    } else if (ig.input.released('left')) {
                        this.player.leftReleased();
                    }

                    if (ig.input.pressed('right')) {
                        this.player.rightDown();
                    } else if (ig.input.released('right')) {
                        this.player.rightReleased();
                    }

                    // jump
                    if (ig.input.state('jump')) {
                        this.player.jumpDown();
                    } else if (ig.input.released('jump')) {
                        //this.player.jumpReleased();
                    }
                }
            },
            update:function () {

                // Update all entities and backgroundMaps
                this.parent();

                //TODO this needs to be based on player position and not split screen
                if (ig.input.pressed('click')) {
                    if (!this.gameOver) {

                        // TO Hittest
                        var hits = this.testHitAreas(ig.input.mouse.x, ig.input.mouse.y); //console.log("hits", hits.indexOf("pause"));
                        this.onClickHitTest(hits);

                    } else {
                        if (this.gameOverDelayTimer.delta() > this.gameOverDelay) {
                            this.restartGame();
                        }
                    }
                }

                // Update control movement
                if (!this.gameOver && !this.paused)
                    this.updateControlMovement();

                if (this.gameOverDelayTimer.delta() > this.gameOverDelay && this.gameOver) {
                    this.restartGame();
                }
               
            },
            onClickHitTest: function(hits) {
                if (hits.indexOf("pause") != -1) {
                    this.togglePause();
                } else if (this.paused) {
                    // test for hitareas when paused
                    if (hits.indexOf("quit") != -1) {
                        ig.system.setGame(SelectScreen);
                    }

                    // Handle sound/music buttons
                    if (!ig.ua.mobile) {
                        if (hits.indexOf("sound") != -1) {
                            ig.soundManager.volume = (ig.soundManager.volume > 0) ? 0 : 1;
                        }
                        if (hits.indexOf("music") != -1) {
                            ig.music.volume = (ig.music.volume > 0) ? 0 : 1;
                        }
                    }
                }
            },
            restartGame: function() {
                this.loadLevelByFileName(this.currentLevelName);
                this.clearCaption();
            },
            onGameOver:function () {
                this.gameOver = true;
                this.gameOverDelayTimer.reset();
                ig.music.fadeOut(1);
                this.gameOverSFX.play();

            },
            onPause:function () {
                this.parent();
                this.levelTimer.pause();
                ig.music.pause();
                //this.hideCaption();
                if (this.ad)
                    this.ad.style.display = "block";

                this.clearCaption();
            },
            onResume:function () {
                this.parent();
                this.levelTimer.unpause();
                ig.music.play();
                if (this.ad)
                    this.ad.style.display = "none";
            },
            draw:function () {
                // Draw all entities and backgroundMaps
                this.parent();


                if (!this.gameOver) {
                    
                    this.pauseButton.drawTile(this.pauseX, 8, (this.paused ? 1 : 0), 60, 34);

                    if (this.joystick) {
                        if (this.joystick.mouseDown) {
                            if (this.joystick.mouseDownPoint) {
                                this.textures.drawFrame("touch-point-small.png", this.joystick.mouseDownPoint.x - this.joystick.radius, this.joystick.mouseDownPoint.y - this.joystick.radius);
                                this.textures.drawFrame("touch-point-large.png", this.joystick.currentMousePoint.x - this.joystick.radius, this.joystick.currentMousePoint.y - this.joystick.radius);
                            }
                        }
                    }

                }

                if (this.paused) {
                    this.drawPauseDisplay();
                }


            },
            drawPauseDisplay: function() {
                //Quit Button
                this.font.draw(this.quitButton.label, this.quitButton.x - 10, this.quitButton.y);
                this.font.draw(this.levelNameText, this.levelText.x, this.levelText.y);
                this.font.draw("TIME: " + Math.round(this.levelTimer.delta()).toString().fromatTime(), this.quitButton.x - 30, this.quitButton.y + 40);

                if (!ig.ua.mobile) {
                    //Sound Button
                    this.font.draw(this.soundButton.label + (ig.soundManager.volume > 0 ? " ON" : " OFF"), this.soundButton.x + 10, this.soundButton.y);
                    this.font.draw(this.musicButton.label + (ig.music.volume > 0 ? " ON" : " OFF"), this.musicButton.x + 10, this.musicButton.y);
                }

            },
            exitLevel:function () {
                this.clearCaption();
                ig.system.setGame(SelectScreen);
            }
        });

    });