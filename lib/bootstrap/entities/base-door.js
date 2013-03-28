/**
 *  @base-door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.base-door'
)
    .requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function () {
        EntityBaseDoor = ig.Entity.extend({
            _wmIgnore: false,
            zIndex: -1,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.FIXED,

            active: false,
            sticky: true,
            type: 1,
            delay: -1,
            defaultDelay: -1,
            delayTimer: null,
            blocked: false,
            readyToClose: false,
            inView: false,
            openSFX: null,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.delayTimer = new ig.Timer();
                this.setupAnimation();
            },
            setupAnimation: function() {
                // override and add your own animations
            },
            check: function(other) {
                if (other instanceof EntityPlayer) {
                    this.blocked = true;
                }
            },
            open: function() {
                this.toggle(true);
            },
            close: function() {
                this.toggle(false);
            },
            receiveDamage: function(value, from) {
                // do nothing
            },
            toggle: function(value, override) {
                // TODO this could be cleaned up
                // Handle animation and door logic
                if (value) {
                    this.delay = this.defaultDelay;
                    this.delayTimer.reset();
                    this.currentAnim = this.anims.press;
                    this.currentAnim.rewind();
                    this.collides = ig.Entity.COLLIDES.NONE;
                    if (this.inView && this.openSFX)
                        this.openSFX.play();
                } else {
                    if (!this.blocked) {
                        if (this.defaultDelay == -1 || override) {
                            this.currentAnim = this.anims.release;
                            this.collides = ig.Entity.COLLIDES.FIXED;
                            this.currentAnim.rewind();
                            this.delay = -1;
                            this.readyToClose = false;
                            if (this.inView && this.openSFX)
                                this.openSFX.play();
                        }
                    } else {
                        this.readyToClose = true;
                    }
                }

                // set the activate value
                this.activate = value;
            },
            update: function() {
                this.parent();

                if (this.delay > 0) {
                    if (this.delayTimer.delta() > this.delay && !this.blocked) {
                        this.toggle(false, true);
                    } else if (this.blocked) {
                        this.delayTimer.reset();
                        this.blocked = false;
                    }
                }

                if (this.readyToClose)
                    this.close();

                this.blocked = false;

            }
        });
    })