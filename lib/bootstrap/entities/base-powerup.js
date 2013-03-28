/**
 *  @base-powerup.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.base-powerup'
)
    .requires(
    'bootstrap.entities.base-item',
    'bootstrap.entities.base-actor',
    'impact.sound'
)
    .defines(function () {
        EntityBasePowerup = EntityBaseItem.extend({
            _wmIgnore:true,
            powerUpProperty:"",
            value:0,
            spriteID:0,
            size:{x:50, y:45},
            /**
             * Override this method and simply add Air to the player. No need to call parent logic.
             * @param target
             */
            onPickup:function (target) {
                // Checks if there is a addPowerUp method on the target
                if (target.addPowerUp)
                    target.addPowerUp(this.powerUpProperty, this.value, "Picked Up More " + this.powerUpProperty.capitalize() + ".");

                this.kill();
            }
        })

        EntityBaseActor.inject({
            addPowerUp: function (property, value) {
                console.log("Picked Up Item")
                if (this[property] != null) {
                    this[property] += value;
                    this.powerupSFX.play();
                    if (this[property] > this[property + "Max"])
                        this[property] = this[property + "Max"];
                    else if (this[property] < 0) {
                        this[property] = 0;
                    }
                }
            }
        })
    })