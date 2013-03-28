/**
 *  @alien-d.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.alien-d'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityAlienD = EntityBaseMonster.extend({
            _wmIgnore:false,
            size:{ x:80, y:20 },
            offset:{ x:0, y:0 },
            gravityFactor: 0,
            attackDelay: 3,
            attackTimer: null,
            spitActive: false,
            attackDamage: 1,
            collides: ig.Entity.COLLIDES.FIXED,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.attackTimer = new ig.Timer();
                if (typeof settings.attackDelay == "undefined")
                    this.attackDelay = Math.random() * 5 + 1;
            },
            setupAnimation: function (offset) {
                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'attack', .07, ['alien-d-' + offset + '-00.png', 'alien-d-' + offset + '-01.png', 'alien-d-' + offset + '-02.png', 'alien-d-' + offset + '-03.png'], true);
            },
            check:function (other) {
                this.parent(other);
            },
            onUpdateAI: function () {
                if (this.attackTimer.delta() > this.attackDelay) {
                    this.attackTimer.reset();
                    this.currentAnim.gotoFrame(0);
                    this.spitActive = false;
                }
                if (this.currentAnim.frame == 3 && this.spitActive == false) {
                    ig.game.spawnEntity(EntitySpit, this.pos.x + (this.size.x * .5) - 2, this.pos.y + this.size.y, { attackDamage: this.attackDamage });
                    this.spitActive =true;
                }
            },
            update:function () {
                this.parent();
                //TODO need to add logic to see if the alien is in view and has been "discovered"
            }
        })
        
        EntitySpit = ig.Entity.extend({
            collides: ig.Entity.COLLIDES.LITE,
            size: { x: 15, y: 25 },
            checkAgainst: ig.Entity.TYPE.A,
            maxVel: { x: 500, y: 1000 },
            zIndex: -1,
            attackDamage: 1,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'idle', 1, ['alien-spit.png'], false);
            },
            check: function(other) {
                other.receiveDamage(this.attackDamage, this);
                this.kill();
            },
            handleMovementTrace: function(res) {
                this.parent(res);
                if (res.collision.y)
                    this.kill();
            }

        })
    })