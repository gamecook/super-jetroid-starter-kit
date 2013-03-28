/**
 *  @touch-joystick.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */

ig.module(
    'bootstrap.plugins.touch-joystick'
)
    .requires(
    'impact.game',
    'impact.font',
        'impact.image'
)
    .defines(function() {

        TouchJoystick = ig.Class.extend({
            angle: 0,
            distance: 0,
            active: false,
            radius: 75,
            diameter: 150,
            currentMousePoint: null,
            init: function() {

            },
            activate: function(x, y) {
                this.mouseDown = true;
                this.mouseDownPoint = { x: x, y: y };

            },
            deactivate: function() {
                this.mouseDown = false;
                this.mouseDownPoint = null;
            },
            update: function(x, y) {

                if (this.mouseDownPoint) {
                    this.currentMousePoint = this.limit(this.mouseDownPoint.x,
                        this.mouseDownPoint.y,
                        x,
                        y,
                        this.radius);
                }
            },
            limit: function(x1, y1, x2, y2, radius) {

                // the vector between the two points
                var dx = x2 - x1,
                    dy = y2 - y1,
                    distanceSquared = (dx * dx) + (dy * dy);
                if (distanceSquared <= radius * radius) {
                    return { x: x2, y: y2, dist: radius };
                } else {
                    var distance = Math.sqrt(distanceSquared),
                        ratio = radius / distance;

                    return {
                        x: (dx * ratio) + x1,
                        y: (dy * ratio) + y1,
                        dist: radius
                    };
                }
            }
        });
    })
