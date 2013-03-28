/**
 *  @base-switch.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.base-switch'
)
    .requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function () {
        EntityBaseSwitch = ig.Entity.extend({
            zIndex: -1,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.NONE,
            active: false,
            sticky: false,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.targets = ig.ksort(this.target);
                this.totalTargets = this.targets.length;

                this.setupAnimation();

            },
            setupAnimation: function (){
                // Extend and override with custom animation logic
                
            },
            check: function (other) {
                // Player is on top of monster so just keep walking in same direction
                if (other.pos.y <= this.pos.y) {
                    this.active = true;   
                }
            },
            update: function() {
                this.parent();
                
                if (this.active) {
                    if (this.currentAnim != this.anims.press) {
                        this.currentAnim = this.anims.press;
                        this.currentAnim.rewind();
                        this.onToggle(true);
                    }
                } else {
                    if (this.currentAnim != this.anims.release) {
                        this.currentAnim = this.anims.release;
                        this.currentAnim.rewind();
                        this.onToggle(false);
                    }
                }
               
                if (!this.sticky)
                    this.active = false;
            },
            onToggle: function(value) {
                for (var i = 0; i < this.totalTargets; i++) {
                    ig.game.getEntityByName(this.targets[i]).toggle(value);
                }
            }
        })
    })