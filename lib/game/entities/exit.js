/**
 *  @exit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 * This entity extends base-exit
 */

ig.module(
    'game.entities.exit'
)
    .requires(
    'bootstrap.entities.base-exit'
)
    .defines(function () {

        EntityExit = EntityBaseExit.extend({
            size:{x:80, y:80},
        });

    });