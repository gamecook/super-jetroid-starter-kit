/**
 *  @block.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.block'
)
    .requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function () {
        EntityBlock = ig.Entity.extend({
            _wmIgnore:false,
            _wmScalable:true,
            spriteId:0,
            maxVel: { x: 100, y: 100 },
            friction: { x: 2000, y: 500 },
            bounce: 0,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,
            size: { x: 100, y: 100 },
            offset: {x: 0, y: 0},
            zIndex: 1,
            reflectionTimer: null,
            reflectionDelay: 10,
            pushSoundTimer: new ig.Timer(),
            pushSoundDelay: .4,
            pushSFX: new ig.Sound('media/sounds/push.*'),
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.reflectionTimer = new ig.Timer();
                this.setupAnimation(settings.spriteId ? settings.spriteId : 0);
            },
            setupAnimation: function (offset) {
                this.spriteId = this.lastspriteId = offset;
                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'idle', .1, ['block-' + offset + '-00.png', 'block-' + offset + '-01.png', 'block-' + offset + '-02.png', 'block-' + offset + '-03.png', 'block-' + offset + '-04.png'], true);
                this.currentAnim = this.anims.idle;
            },
            update: function() {
                this.parent();

                if (this.reflectionTimer.delta() > this.reflectionDelay) {
                    this.currentAnim.rewind();
                    this.reflectionTimer.reset();
                }
                
                if(Math.abs(this.vel.x) > 0 && this.pushSoundTimer.delta() > this.pushSoundDelay) {
                    //console.log("pushing sounds");
                        this.pushSFX.play();
                        this.pushSoundTimer.reset();
                    }
            },
            draw:function () {
                if (ig.editor) {
                    if (this.lastspriteId != this.spriteId)
                        this.setupAnimation(this.spriteId);
                }
                this.parent();
            },
            receiveDamage: function (value, from) {
                // do nothing
            }
        })
    })