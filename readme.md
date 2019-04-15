# PokeReact level editor

[Available here](https://yadpe.github.io/pokeReact-level-editor/)

## Features

* Create / Edit / Import / Export levels 

* Autosave every 35 sec

* Search through your tiles library

## how to use 

1. Import your tiles library from your local files

2. Set the level height and width (1 block = 32x32px)

3. click on the title you want to paint to select it, then click on the level grid to add it 

4. Use right click to delete a tile from the level grid 

5. Use the export button to get a copy of the current level in your clipboard in a matrix format 


## how to name a tile image file :

`category`-`id`-`tags`-`collide(0/1)`.`imageFormatExtension`

exemple : `vegetation-6-tree-1.jpg`

* `category` is used to group tiles and define the position on the plan
    * Terrain [`z-index: 0`] (grass, path, water, sand, etc..)
    * Player [`z-index: 10`]
    * Vegetation [`z-index: 20`] (three, rock, bush, building, etc..)

* `id` is a integer used in the martix to identify tiles **It must be unique and id 1 is reserved for colisions**

* `tags` are used when searching for a tile in the editor

* `collide(0/1)` is a integer `0` or `1` that is used by the game to define if the player can step on the tile or not. `0` no collide, `1` collide.

Tiles placed in the tiles folder are automaticly loaded by the game
