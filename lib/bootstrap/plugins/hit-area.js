/**
 *  @hit-area.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */
ig.module(
    'bootstrap.plugins.hit-area'
)
    .requires(
    'impact.game'
)
    .defines(function () {

        ig.Game.inject({
            hitAreas:[],
            debugHitAreas:false,
            registerHitArea:function (name, x, y, width, height, debugColor) {
                var newHitArea = new Rectangle(x, y, width, height, debugColor);
                newHitArea.name = name;
                this.hitAreas.push(newHitArea);
                return newHitArea;
            },
            testHitAreas:function (x, y) {
                var results = [];
                var i = 0;
                var total = this.hitAreas.length;
                var tmpHitArea;

                for (i; i < total; i++) {
                    tmpHitArea = this.hitAreas[i];
                    if (tmpHitArea.contains(x, y)) {
                        results.push(tmpHitArea.name);
                    }
                }

                return results;
            },
            getHitArea:function (name) {
                var i = 0;
                var total = this.hitAreas.length;
                var tmpHitArea;

                for (i; i < total; i++) {
                    tmpHitArea = this.hitAreas[i];
                    if (tmpHitArea.name == name)
                        return tmpHitArea;
                }

                return null;
            },
            updateHitArea:function (name, properties) {

                var tmpHitArea = this.getHitArea(name);
                if (!tmpHitArea)
                    return;

                for (var propt in properties) {
                    tmpHitArea[propt] = properties[propt];
                    //console.log("tmpHitArea[propt] ", propt, " was updated ", properties[propt])
                }
            },
            removeHitArea:function (name) {
                var i = 0;
                var total = this.hitAreas.length;
                var tmpHitArea;

                for (i; i < total; i++) {
                    tmpHitArea = this.hitAreas[i];
                    if (tmpHitArea.name == name);
                    //TODO remvove from array and return the hitarea
                }
            },
            clearHitAreas:function () {
                this.hitAreas = [];
            },
            draw:function () {
                this.parent();

                if (this.debugHitAreas) {
                    // Debug for hitareas
                    var total = this.hitAreas.length;
                    var i = 0;
                    var ctx = ig.system.context;
                    var rect;
                    for (i; i < total; i++) {
                        rect = this.hitAreas[i];
                        if (rect.name != "left" || rect.name != "right") {
                            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                            //console.log(rect.name, rect.x, rect.y, rect.width, rect.height);
                        }
                    }
                }
            }
        })

        Rectangle = ig.Class.extend({
            x:0,
            y:0,
            width:0,
            height:0,
            debugColor:0xffffff,
            top:0,
            right:0,
            bottom:0,
            left:0,
            init:function (x, y, width, height, debugColor) {
                this.resize(x, y, width, height);

                //TODO need to make sure this works
                if (debugColor)
                    this.debugColor = debugColor;
            },
            resize:function (x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.left = this.x;
                this.right = this.x + this.width;
                this.top = this.y;
                this.bottom = this.y + this.height;
            },
            contains:function (x, y) {
                if (x >= this.x && x <= this.right && y >= this.y && y <= this.bottom) {
                    return true;
                }
                return false;
            }

        })
    })