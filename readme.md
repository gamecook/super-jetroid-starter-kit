#About Super Jetroid Starter Kit
Super Jetroid Starter Kit is a full game template to help you fast track your ImpactJS game development on Windows 8 and Web. The Starter Kit is collection of scripts, code and stock art/sounds that you can modify into your own space adventure/exploration game or turn into something totally different. The Starter Kit consists of the following features: 

* **impact code** that contains a plugins, entities and sample code to extend the core impact framework and offer extra functionality in the map editor. Here is a list of important directories that make up the Bootstrap:
    * **impact/lib/bootstrap** this is a collection of base classes, plugins and other boiler plate code to help speed up ImpactJS game development.
    * **impact/lib/bootstrap/entities** is where you can find all the entities for the Bootstrap.
    * **impact/lib/bootstrap/platforms** is a collection of modules that will modify your game based on the type of platform it will run on. *(Windows 8 is the only finished platform and more are coming soon.)*
    * **impact/lib/bootstrap/plugins** is where all the Bootstrap plugins live.
    * **resources** contains all of the artwork for the game as individual sprites (pngs) which need to be packaged into a texture atlas..

Here is a brief overview of the Starter Kit and how to use it:
##Getting Started

*** Important Note: You will need a copy of ImpactJS ([http://impactjs.com][1]) in order to compile this project. ***

Once you check out the bootstrap you can simply drop it into a Visual Studio project include the starter kit game directories (lib, media, and additional CSS/JS files) and run the project.
One thing to note is that the Starter Kit comes with it's own Weltmeister config.js file. You will need to use this file or at least add the following to your requires block:

* 'game.packed-textures'
* 'bootstrap.plugins.weltmeister.random-map-button'

Which will allow you to see the graphics for the game and take advantage of the bootstrap's random map generator.

*(More details coming soon)* 

##Impact Bootstrap  And Super Jetroid Code
The lib directory is set up exactly like any default Impact project. Inside, you will find the following directories and files:

 * **lib/bootstrap** contains the core of the Impact Boostratp and the plugins which modify the core of Impact.

 * **lib/demos** contains demos of the core game mechanics. This is useful for testing out changes to the game code without having to play through the entire game.

 * **lib/game** contains classes built off of the Bootstrap directory, the main game code, all of the test levels and a sample game file (`main.js`) so you can run the Super Jetroid game.

 * **default.html** is a modified`default.html` file to run in Windows 8. This file includes a reference to WinJS, additional JS/CSS files, which is located in the `css` directory, as well as placeholder artwork for touch controls.

Most of the core code that makes up the Impact Bootstrap lives in the `lib/bootstrap`  directory while the game itself I sin the `lib/game` directory. Let's take a quick look at some of the Bootstrap's plugins and entities:

###Bootstrap Plugins
Each of the plugins that make up the Impact Bootstrap were designed to work together or independently allowing you to pick and choose which parts of the Bootstrap you want to include in your game. Here are a few of the core plugins you will find in the bootstrap:

 * **camera.js** is a simple camera class that follows an entity and allows you to set a region around the player to trigger scrolling. It also handles basic lighting effects via a PNG overlay.
 * **hit-area.js** is a plugin allows you to define simple hit areas to test coordinates against. This is useful for buttons or UI elements on the screen.
 * * **impact-storage.js** is a plugin that takes advantage of local storage to let you save game state to the browser or locally in Windows 8.
 * **menu.js** adds the ability to overlay a 'screen' on top of the game. This is useful for pause menus or displaying stats at the end of a level or a game-over screen. There is a default menu that lets you display text. Simply extend this and override the `draw()` method with your own graphics.
 * **pause.js** adds support to pause all entities in the game on the screen by calling `togglePause()` on the `ig.game` class. This will not update any entities when paused, but they will continue to draw.
 * **sound-effects.js** this modifies the core sound class and allows fade up/down and looping of sound effects.
 * * **texture-atlas.js** is a plugin allows you use texture atlases in your game along with the built in sprite engine. It also offers a solution for texture atlas fonts which improve the way fonts look on devices which incorrectly display the built in font class.
 * * **touch-joystick.js** is a plugin offers an on screen touch controller similar to the analog stick on a game pad.
 * **utils.js** adds some basic utilities to your game, such as padding strings with zeros for high scores and the ability to load a level by its file name via a newly injected `loadLevelByFileName()` method on the `ig.game` class.

###Entities
The Impact Bootstrap comes with its own set of entities, which you can extend in order to help speed up game development. 

####Base Entities
Base entities are 'abstract classes' designed to allow you to extend them in your own game. They cannot be directly placed on the map without being extended and finalized with artwork and sometimes additional logic. Here is what the Bootstrap includes:

 * **base-actor** represents any entity in your game that will move, have death animation and  possibly need some kind of AI. The base-actor supplies some stub methods and logic, such as the  ability to become "invincible", spawn particles when it receives damage or is killed, can be crushed by moving platforms, fall to its death (happens when the entity falls for too long then hits a *fixed* entity or something in the collision map) and more. Take a look at the class to see what has been added. The base-player and base-monster extend off this class.
 * **base-monster** is a template for a simple monster in your game. Right now, the monster knows how to walk back and forth on a platform without falling off. *(In the future, the base-monster will have additional AI, such as walking off platforms, follow the player and hooks to interact with other entities in the game world.)*
 * **base-item** is a template for items that an actor can pick up or equip in the game. It supports the notion of flagging the item as equipable which will hide the item entity on the game map but add it to an actor's inventory. From there you can handle each call to equip to do specific actions for each type of item. *(This item and it's full set of functionality is still being fleshed out.)
 * **base-door.js** is simple door that allows the player to hide inside without taking damage. The door can be extended to offer rewards to the player for going inside or when leaving.
 *  * **base-level-exit.js** allows the player to exit a level. When the player enters this invisible entity it calls `exitLevel()` which is injected into the `ig.game` class allowing you to handle exiting to the next level. The is useful of showing an end of level screen or simply returning to beginning of the game or start/level picker screen.
       
Now that we have covered how plugins and entities work, let's look at the last directory that makes up the Impact Bootstrap:

##Resources
The resources directory includes all of the artwork needed for the game. There are broken up into individual sprites. You will need to use shoebox to package them up into Texture Atlases. You will find a shoebox setting file for doing this. You are free to repurpose the demo game artwork for yourself.

###Sound Effects
Impact Bootstrap comes with a set of pre-generated sound effects, which you can use as placeholders or put them in your final game. You will find MP3 and Ogg versions in the `media/bootstrap/sounds` folder for use in your game. 

##Change Log
**v1.0.0** Initial Import from my original Impact Bootstrap with a modified version of Super Jetroid and Win8 specific additions such as resizing, touch controls and stripping out platform plugins not needed on Win8.


  [1]: http://impactjs.com