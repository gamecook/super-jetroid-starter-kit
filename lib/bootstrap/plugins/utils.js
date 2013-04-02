/**
 *  @utils.js
 *  @version: 1.1.0
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE) 
 */

ig.module(
    'bootstrap.plugins.utils'
)
    .requires(
    'impact.game'
)
    .defines(function () {

        ig.utils = {};

        String.prototype.pad = function (l, s) {
            return (l -= this.length) > 0
                ? (s = new Array(Math.ceil(l / s.length) + 1).join(s)).substr(0, s.length) + this + s.substr(0, l - s.length)
                : this;
        };

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        ig.utils.randomRange = function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        };

        Array.prototype.shuffle = function () {
            var i = this.length, j, tempi, tempj;
            if (i == 0) return false;
            while (--i) {
                j = Math.floor(Math.random() * (i + 1));
                tempi = this[i];
                tempj = this[j];
                this[i] = tempj;
                this[j] = tempi;
            }
            return this;
        }

        String.prototype.fromatTime = function () {
            sec_numb = parseInt(this);
            var hours = Math.floor(sec_numb / 3600);
            var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
            var seconds = sec_numb - (hours * 3600) - (minutes * 60);

            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }
            var time = minutes + ':' + seconds;
            return time;
        }

        ig.Game.inject({
            currentLevelName: null,
            /*
             * This method allows you to load a level by it's file name. The extension is automatically removed.
             */
            loadLevelByFileName: function (value, deferred) {
                this.currentLevelName = value.replace(/^(Level)?(\w)(\w*)/,
                    function (m, l, a, b) {
                        return a.toUpperCase() + b;
                    }).replace(".js", "");

                var levelData = ig.global['Level' + this.currentLevelName];
                //console.log("levelData", levelData);
                this[deferred ? "loadLevelDeferred" : "loadLevel"](levelData);
            }
        })

    }
)