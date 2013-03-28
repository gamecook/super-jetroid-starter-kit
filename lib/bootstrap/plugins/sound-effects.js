/**
 *  @sound-effects.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */

ig.module(
    'bootstrap.plugins.sound-effects'
)
    .requires(
    'impact.sound'
)
    .defines(function() {

        ig.Sound.inject({
            loop: false,
            _endedCallbackBound: null,
            init: function (path, multiChannel) {
                this._endedCallbackBound = this._endedCallback.bind(this);
                this.parent(path, multiChannel);
            },
            play: function (loop) {
                if (!ig.Sound.enabled) {
                    return;
                }
                
                this.loop = loop;
                this.parent();
                this.playing = true;
                this.currentClip.addEventListener('ended', this._endedCallbackBound, false);
            },
            _endedCallback: function () {
                this.playing = false;
                if (this.loop) {
                    this.play(true);
                }
            },
            stop: function() {
                this.parent();
                this.playing = false;
            },
            fadeIn: function (time, volume, loop) {
                if (!ig.Sound.enabled) {
                    return;
                }
                
                if (volume == undefined)
                    volume = 1;
                this.targetVolume = volume;
                this.play(loop);
                this.currentClip.volume = 0;
                
                clearInterval(this._fadeInterval);
                this.fadeTimer = new ig.Timer(time);
                this._fadeInterval = setInterval(this._fadeInStep.bind(this), 50);
                
            },
            fadeOut: function (time) {
                clearInterval(this._fadeInterval);
                this.fadeTimer = new ig.Timer(time);
                this._fadeInterval = setInterval(this._fadeStep.bind(this), 50);
            },
            _fadeInStep: function () {
                var v = 1 - Math.abs((this.fadeTimer.delta() / this.fadeTimer.target));
                
                this.currentClip.volume = v;
                if (v >= this.targetVolume - .05) {
                    clearInterval(this._fadeInterval);
                    this.currentClip.volume = this.targetVolume;
                }
            },

            _fadeStep: function () {
                var v = this.fadeTimer.delta()
                    .map(-this.fadeTimer.target, 0, 1, 0)
                    .limit(0, 1)
                    * this.currentClip.volume;

                this.currentClip.volume = v;
                if (v <= 0.01) {
                    this.stop();
                    this.currentClip.volume = 1;
                    clearInterval(this._fadeInterval);
                }
            },
        })
    })
