/**
 *  @player.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.player'
)
    .requires(
    'impact.sound',
    'bootstrap.entities.base-actor',
    'bootstrap.entities.base-powerup',
    'bootstrap.entities.death-explosion'
)
    .defines(function () {
        EntityPlayer = EntityBaseActor.extend({
            _wmIgnore:false,
            size:{ x:40, y:70 },
            offset:{ x:20, y:10 },
            rocketSFX: new ig.Sound('media/sounds/rocket.*'),
             hurtSFX: new ig.Sound('media/sounds/hurt1.*'),
             walkingSFX: new ig.Sound('media/sounds/walking-sound-2.*'),
             noEnergySFX: new ig.Sound('media/sounds/no-energy.*'),
             thudSFX: new ig.Sound('media/sounds/thud.*'),
             powerupSFX: new ig.Sound('media/sounds/powerup.*'),
            maxVel:{ x:500, y:950 },
            friction:{ x:1500, y:800 },
            accelGround:1000,
            accelAir: 500,
            accelRocket: -2500,
            type:ig.Entity.TYPE.A,
            checkAgainst:ig.Entity.TYPE.NONE,
            collides:ig.Entity.COLLIDES.ACTIVE,
            fallDistance:300,
            idleAnimationTimer:new ig.Timer(),
            idleAnimationDelay:4,
            steppingTimer: new ig.Timer(),
            rocketSoundTimer: new ig.Timer(),
            healthMax:10,
            health:10,
            bounciness:0.2,
            jumpisDown: false,
            jumpPercent: 1,
            fallDamageValue: 3,
            walkingSoundDelay: .3,
            rocketSoundDelay: .3,
            moving: {right:0, left: 0, up: 0},
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.setupAnimation();

            },
            setupAnimation: function () {

                var atlas = ig.entitiesTextureAtlas;

                this.addTextureAtlasAnim(atlas, 'idle', 1, ['player-waiting-00.png'], false); // Add texture atlas animation
                this.addTextureAtlasAnim(atlas, 'waiting', .05, ['player-waiting-00.png', 'player-waiting-01.png', 'player-waiting-02.png', 'player-waiting-03.png', 'player-waiting-04.png', 'player-waiting-05.png', 'player-waiting-06.png', 'player-waiting-07.png', 'player-waiting-08.png', 'player-waiting-09.png'], true); // Add texture atlas animation
                this.addTextureAtlasAnim(atlas, 'run', .07, ['player-walk-00.png', 'player-walk-01.png', 'player-walk-02.png', 'player-walk-03.png', 'player-walk-04.png', 'player-walk-05.png', 'player-walk-06.png', 'player-walk-07.png'], false); // Add texture atlas animation
                this.addTextureAtlasAnim(atlas, 'jump', .07, ['player-jet-00.png', 'player-jet-01.png', 'player-jet-02.png'], false); // Add texture atlas animation
                this.addTextureAtlasAnim(atlas, 'jumpEmpty', 1, ['player-jet-empty-00.png'], false); // Add texture atlas animation
                this.addTextureAtlasAnim(atlas, 'fall', 1, ['player-falling-01.png'], false); // Add texture atlas animation

                this.currentAnim = this.anims.idle;
            },
            outOfBounds:function () {
                this.fallOutOfBoundsSFX.play();
                this.parent();
            },
            updateAnimation:function () {
                this.parent();

                
                
                //TODO break this down into smaller method calls and move into mob class
                // set the current animation, based on the player's speed
                if (this.jumpIsDown) {
                    this.currentAnim = this.anims.jump;
                } else if (this.vel.y > 500 && !this.jumpIsDown) {
                    this.currentAnim = this.anims.fall;
                } else if (Math.abs(this.vel.x) > 0 && this.standing) {
                    //console.log(this.pushing);
                    this.currentAnim = this.anims.run;
                    //this.anims.run.frameTime = this.pushing ? .5 : .7;
                } else {
                    if (this.currentAnim != this.anims.waiting) {
                        this.currentAnim = this.anims.idle;
                    }
                    if (this.idleAnimationTimer.delta() > this.idleAnimationDelay) {
                        this.currentAnim = this.anims.waiting;
                        this.currentAnim.rewind();
                        this.idleAnimationTimer.reset();
                    }
                }

                this.currentAnim.flip.x = this.flip;

                if (ig.game.blinkTimer)
                    var blink = Math.round(ig.game.blinkTimer.delta() * 4 % 1);

                if (this.invincible && blink) {
                    this.currentAnim.alpha = .5//this.captionTimer.delta() * 100 % 2 + .4;// / this.invincibleDelay * 1 + .2;
                    //console.log("alpha!", this.captionTimer.delta() * 100 % 1);
                } else {
                    this.currentAnim.alpha = 1;
                }

                this.pushing = false;
            },
            update:function () {

                this.parent();

                // Handle movement
                if (this.jumpIsDown) {

                    if (this.rocketSoundTimer.delta() > this.rocketSoundDelay) {
                        this.rocketSFX.play();
                        this.rocketSoundTimer.reset();
                    }

                }
                else {

                    if (this.rocketSFX.playing)
                        this.rocketSFX.stop();
                }
                
                this.jumpIsDown = false;
                this.jumpPercent = 1;
                
                
                
                // Right
                if (this.moving.right > 0) {

                    var accel = this.standing ? this.accelGround : this.accelAir;

                    this.accel.x = Math.round(accel * this.moving.right);
                    this.flip = false;

                    //console.log("mod", this.idleAnimationTimer.delta(), this.idleAnimationTimer.delta() % 6)
                    
                    
                } else if (this.moving.left > 0) {

                    var accel = this.standing ? this.accelGround : this.accelAir;
                    this.accel.x = Math.round(-accel * this.moving.left);
                    this.flip = true;
                    
                    
                    //this.moving.left = 0;
                }
                else
                {
                    //console.log("moving", this.moving.right, this.moving.left)
                    this.accel.x = 0;
                }

                if (Math.abs(this.vel.x) > 10 && this.standing && this.steppingTimer.delta() > this.walkingSoundDelay) {
                    this.walkingSFX.play();
                    this.steppingTimer.reset();
                }

                //Up
                if (this.moving.up > .2) {

                    this.jumpIsDown = true;
                    this.jumpPercent = this.moving.up;

                    this.accel.y = this.accelRocket * this.moving.up + (this.accelRocket * .2);

                    this.moving.up = 0;
                }

                else {
                    this.accel.y = 0;
                }
            },
            jumpDown: function (percent) {
                
                
                if (!percent) percent = 1;

                this.moving.up = percent;

            },
            rightDown: function (percent) {
                
                if (!percent) percent = 1;
                //console.log("move right");
                this.moving.right = percent;
            },
            rightReleased:function () {
                this.moving.right = 0;
            },
            leftDown: function (percent) {

                if (!percent) percent = 1;
                this.moving.left = percent;
            },
            leftReleased:function () {
                this.moving.left = 0;
            },
            addPowerUp: function (property, value, message) {
                this.parent(property, value);
                if (this[property] != null) {

                    if (message)
                        ig.game.displayCaption(message, 2);
                }
            },
            receiveDamage: function(value, from, overrideInvincible) {
                
                this.parent(value, from);

                if (!this.invincible && !overrideInvincible) {
                    this.hurtSFX.play();
                    this.makeInvincible();
                }


                ig.game.shake(1, 2);

                if (this.health <= 0) {
                    var deathText = "You Were Killed!";
                    ig.game.displayCaption(deathText, 2);
                }
            },

            makeInvincible:function () {
                console.log("make invincible");
                this.invincible = true;
                this.captionTimer.reset();
                //this.collides = ig.Entity.COLLIDES.NONE;
            },
            onFallToDeath:function (floor) {
                this.parent();
                ig.game.shake(1, 4);
            },
            onKill:function () {
                ig.game.onGameOver();
            },
            onLand: function() {
                this.thudSFX.play();
            }
        });

        EntityDeathExplosionParticle.inject({
            baseVelocity:{ x:5, y:-50 },
            vel: { x: 30, y: 350 },
            gravityFactor: .5,
            animSheet:new ig.AnimationSheet('media/sprites/particle-sprites.png', 10, 10),
            bounciness:.5,
        })
        

    });
