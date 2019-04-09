# PokeReact level editor

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

`category`-`uniqueId`.`imageFormatExtension`

exemple : `tree-6.jpg`

* `category` is used to group tiles by category and for search

* `uniqueId` is the int used in the martix to identify tiles

The player can't cross tiles with id above 50