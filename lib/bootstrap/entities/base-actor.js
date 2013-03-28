/**
 *  @base-actor.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.base-actor'
)
    .requires(
    'impact.entity',
    'impact.sound',
    'bootstrap.entities.death-explosion'
)
    .defines(function () {

        EntityBaseActor = ig.Entity.extend({
            _wmIgnore:true,
            visible:true,
            weapon:0,
            activeWeapon:"none",
            startPosition:null,
            invincible:false,
            invincibleDelay:2,
            captionTimer:null,
            healthMax:10,
            health:10,
            markedForDeath:false,
            fallDistance:200,
            fallDamageValue:1,
            shotPressed:false,
            fireDelay:null,
            fireRate:0,
            bloodColorOffset:0,
            equipment:[],
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                //TODO need to figure out if we should call this here?
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
                this.startPosition = { x:x, y:y };
                this.captionTimer = new ig.Timer();
                this.fireDelay = new ig.Timer();
            },
            setupAnimation:function (offset) {
            },
            receiveDamage:function (value, from) {
                if (this.invincible || !this.visible)
                    return;

                this.parent(value, from);

                if (this.health > 0) {
                    this.spawnParticles(2);
                }
            },
            kill:function (noAnimation) {
                this.parent();

                this.health = 0;

                //TODO need to rename all this to make more sense
                if (!noAnimation) {
                    this.markedForDeath = true;
                    this.onDeathAnimation();
                }
                else {
                    this.onKill();
                }
            },
            onKill:function () {
                //Handler for when the entity is killed
            },
            onDeathAnimation:function () {
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, { colorOffset:this.bloodColorOffset, callBack:this.onKill });

                //TODO need to think through this better

            },
            outOfBounds:function () {
                this.kill(true);
            },
            collideWith:function (other, axis) {

                // check for crushing damage from a moving platform (or any FIXED entity)
                if (other.collides == ig.Entity.COLLIDES.FIXED && this.touches(other)) {
                    // we're still overlapping, but by how much?
                    var overlap;
                    var size;
                    if (axis == 'y') {
                        size = this.size.y;
                        if (this.pos.y < other.pos.y) overlap = this.pos.y + this.size.y - other.pos.y;
                        else overlap = this.pos.y - (other.pos.y + other.size.y);
                    } else {
                        size = this.size.x;
                        if (this.pos.x < other.pos.x) overlap = this.pos.x + this.size.x - other.pos.x;
                        else overlap = this.pos.x - (other.pos.x + other.size.x);
                    }
                    overlap = Math.abs(overlap);

                    // overlapping by more than 1/2 of our size?
                    if (overlap > 3) {
                        // we're being crushed - this is damage per-frame, so not 100% the same at different frame rates
                        this.kill();
                    }
                }
            },
            spawnParticles:function (total) {
                for (var i = 0; i < total; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, { colorOffset:this.bloodColorOffset });
            },
            makeInvincible:function () {
                this.invincible = true;
                this.captionTimer.reset();
            },
            equip:function (target) {
                this.equipment.push(target);
            },
            update:function () {


                if (this.visible)
                    this.updateAnimation();

                this.parent();
            },
            updateInvicibleEffect:function () {
                //TODO maybe we need to add invincible to draw or consolidate the two
                if (this.captionTimer.delta() > this.invincibleDelay) {
                    this.invincible = false;
                    if (this.currentAnim)
                        this.currentAnim.alpha = 1;

                    //Reset active collision setting
                    //this.collides = ig.Entity.COLLIDES.ACTIVE;
                }
            },
            updateAnimation:function () {
                this.updateInvicibleEffect();
            },
            draw:function () {

                // Exit draw call if the entity is not visible
                if (!this.visible)
                    return;

                this.parent();
            },
            handleMovementTrace:function (res) {

                this.parent(res);

                if (res.collision.y) {

                    if (Math.abs(this.vel.y) > this.fallDistance) {
                        var damage = Math.abs(Math.round(this.vel.y / this.fallDistance * this.fallDamageValue));
                        if (damage >= this.health) {
                            this.onFallToDeath((this.vel.y < 0));
                        } else {
                            this.receiveDamage(damage, this);
                        }


                    } else if(!this.standing){
                        this.onLand();
                    }
                }
            },
            onFallToDeath:function () {
                this.kill();
            },
            onLand: function() {
                
            }
        });

    });