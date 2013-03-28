/**
 *  @main-demos.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'demos.main-demos'
)
    .requires(
        'game.screens.game-screen',
        'game.screens.select-screen',
        'demos.levels.demo-aliens-a',
        'demos.levels.demo-aliens-b',
        'demos.levels.demo-aliens-c',
        'demos.levels.demo-aliens-d',
        'demos.levels.demo-blocks',
        'demos.levels.demo-spikes',
        'demos.levels.demo-switch-and-door',
        'demos.levels.demo-all-obsticals',
        'demos.levels.demo-collectables',
        'demos.levels.demo-controls',
        'demos.levels.demo-radar',
        'game.packed-textures'
)
    .defines(function () {

        BaseTutorial = GameScreen.extend({
            title: "Demo",
            init: function (level) {
                ig.difficulty = true;
                this.parent(level);
                document.getElementById("title").innerHTML = this.title;
            },
            loadLevel: function(data) {
                this.parent(data);
                this.displayCaption(this.title, 5);
            },
            onResume: function() {
                this.parent();
                this.displayCaption(this.title, 5);
            },
            drawPauseDisplay: function () {
                var x = (ig.system.width -  this.font.widthForString(this.title)) * .5;
                this.font.draw(this.title, x, ig.system.height * .5);

            }

        })
        
        TutorialAlienA = BaseTutorial.extend({
            title: "Alien A Demo",
            init: function () {
                this.parent("LevelDemoAliensA");
            }
        })

        TutorialAlienB = BaseTutorial.extend({
            title: "Alien B Demo",
            init: function () {
                this.parent("LevelDemoAliensB");
            },
            loadLevel: function (data) {
                this.parent(data);

                var aliens = this.getEntitiesByType(EntityAlienB);
                //console.log(aliens.length)
                for (var i = 0; i < aliens.length; i++)
                    aliens[i].kidMode = false;
            }

        })
        
        TutorialAlienC = BaseTutorial.extend({
            title: "Alien C Demo",
            init: function () {
                this.parent("LevelDemoAliensC");
            }

        })
        
        TutorialAlienD = BaseTutorial.extend({
            title: "Alien D Demo",
            init: function () {
                this.parent("LevelDemoAliensD");
            }
        })
        
        TutorialBlocks = BaseTutorial.extend({
            title: "Blocks Demo",
            init: function () {
                this.parent("LevelDemoBlocks");
                //TODO need a way to reset the level
            }
        })
        
        TutorialSpikes = BaseTutorial.extend({
            title: "Spike Demo",
            init: function () {
                this.parent("LevelDemoSpikes");
            }
        })

        TutorialSwitch = BaseTutorial.extend({
            title: "Switch & Door Demo",
            init: function () {
                this.parent("LevelDemoSwitchAndDoor");
            }
        })
        
        TutorialAllObsticals = BaseTutorial.extend({
            title: "All Obstical Demo",
            init: function () {
                this.parent("LevelDemoAllObsticals");
            }
        })
        
        TutorialCollectables = BaseTutorial.extend({
            title: "Collectable Demo",
            init: function () {
                this.parent("LevelDemoCollectables");
            }
        })
        
        TutorialKeyboard = BaseTutorial.extend({
            title: "Keyboard Control Demo",
            init: function () {
                this.parent("LevelDemoControls");
                this.joystick = null;
            }
        })
        
        TutorialTouch = BaseTutorial.extend({
            title: "Touch/Mouse Control Demo",
            init: function () {
                this.parent("LevelDemoControls");
                ig.input.unbind(ig.KEY.LEFT_ARROW);
                ig.input.unbind(ig.KEY.RIGHT_ARROW);
                ig.input.unbind(ig.KEY.UP_ARROW);
            }
        })
        
        DemoEffects = BaseTutorial.extend({
            title: "Effects Demo",
            effect1Button: { name: "lighting", label: "LIGHTING", x: 0, y: 0, width: 0, height: 0, value: true },
            effect2Button: { name: "scanlines", label: "SCANLINES", x: 0, y: 0, width: 0, height: 0, value: true },
            effect3Button: { name: "particles", label: "PARTICLES", x: 0, y: 0, width: 0, height: 0, value: true },
            init: function () {
                this.parent("LevelDemoRadar");
                
                this.joystick = null;
                
                this.effect1Button.width = this.font.widthForString(this.effect1Button.label + " OFF");
                this.effect1Button.height = this.font.heightForString(this.effect1Button.label);
                this.effect1Button.x = 3;//ig.system.width - (this.effect1Button.width + 5);
                this.effect1Button.y = 50;//(this.effect1Button.height) + 3;
                this.registerHitArea(this.effect1Button.name, this.effect1Button.x, this.effect1Button.y, this.effect1Button.width, this.effect1Button.height);

                // Sound Button
                this.effect2Button.width = this.font.widthForString(this.effect2Button.label + " OFF");
                this.effect2Button.height = this.font.heightForString(this.effect2Button.label);
                this.effect2Button.x = 3;//ig.system.width - (this.effect2Button.width + 5);
                this.effect2Button.y = (this.effect2Button.height) + 53;
                this.registerHitArea(this.effect2Button.name, this.effect2Button.x, this.effect2Button.y, this.effect2Button.width, this.effect2Button.height);

                // Sound Button
                this.effect3Button.width = this.font.widthForString(this.effect3Button.label + " OFF");
                this.effect3Button.height = this.font.heightForString(this.effect3Button.label);
                this.effect3Button.x = 3;//ig.system.width - (this.effect2Button.width + 5);
                this.effect3Button.y = (this.effect2Button.height * 2) + 3;
                this.registerHitArea(this.effect3Button.name, this.effect3Button.x, this.effect3Button.y, this.effect3Button.width, this.effect3Button.height);
            },
            draw: function() {
                this.parent();
                if (!this.paused) {
                    this.font.draw(this.effect1Button.label + (this.effect1Button.value ? " ON" : " OFF"), this.effect1Button.x + 10, this.effect1Button.y);
                    this.font.draw(this.effect2Button.label + (this.effect2Button.value ? " ON" : " OFF"), this.effect2Button.x + 10, this.effect2Button.y);
                }
                //this.font.draw(this.effect3Button.label + (this.effect3Button.value ? " ON" : " OFF"), this.effect3Button.x + 10, this.effect3Button.y);
            },
            onClickHitTest: function(hits) {
                this.parent(hits);

                if (hits.indexOf("lighting") != -1) {
                    this.effect1Button.value = !this.effect1Button.value;

                    if (!this.effect1Button.value) {
                        this.oldLightMask = this.lightMask;
                        this.lightMask = null;
                    } else {
                        this.lightMask = this.oldLightMask;
                    }

                } else if (hits.indexOf("scanlines") != -1) {
                    this.effect2Button.value = !this.effect2Button.value;
                    
                    if (!this.effect2Button.value) {
                        this.oldScanLines = this.scanLines;
                        this.scanLines = null;
                    } else {
                        this.scanLines = this.oldScanLines;
                    }
                } else if (hits.indexOf("particles") != -1) {
                    this.effect3Button.value = !this.effect3Button.value;

                    var emitter = this.getEntityByName("particle-emitter");
                    if (!this.effect3Button.value) {
                        emitter.maxInstances = 0;
                        emitter.clear();
                    } else {
                        
                        emitter.maxInstances = 200;
                    }
                }
            }
        })
        
        DemoSelectScreen = SelectScreen.extend({
            title: "Select Screen Demo",
            init: function () {
                this.parent();
                document.getElementById("title").innerHTML = this.title;
                ig.input.bind(ig.KEY.UP_ARROW, "up");
                ig.input.bind(ig.KEY.DOWN_ARROW, "down");
                ig.input.bind(ig.KEY._0, "0");
                ig.input.bind(ig.KEY._1, "1");
                ig.input.bind(ig.KEY._2, "2");
                ig.input.bind(ig.KEY._3, "3");
            },
            animationOutComplete: function () {
                ig.system.setGameNow(DemoSelectScreen);
            },
        })

        // Setup proejct

        ig.Sound.enabled = false;

        var demo = null;
        
        switch (getUrlVars().demo) {
            case "aliena":
                demo = TutorialAlienA;
                break;
            case "alienb":
                demo = TutorialAlienB;
                break;
            case "alienc":
                demo = TutorialAlienC;
                break;
            case "aliend":
                demo = TutorialAlienD;
                break;
            case "blocks":
                demo = TutorialBlocks;
                break;
            case "spikes":
                demo = TutorialSpikes;
                break;
            case "switches":
                demo = TutorialSwitch;
                break;
        case "all-obstacles":
                demo = TutorialAllObsticals;
                break;
            case "collectables":
                demo = TutorialCollectables;
                break;
            case "keyboard":
                demo = TutorialKeyboard;
                break;
            case "touch":
                demo = TutorialTouch;
                break;
            case "effects":
                demo = DemoEffects;
                break;
            default:
                demo = DemoSelectScreen;
                break;
        }

        if (demo)
            ig.main('#canvas', demo, 60, 854, 480, 1);


        
        
        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
        
    });