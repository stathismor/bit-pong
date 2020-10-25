# Architecture

## Scene

The game is consisted of several _scenes_. There is the start menu scene, the level selection scene, the gameplay scene, and so on. The gameplay scene is where most things are happening. It is responsible for putting together and updating all the gameplay elements. On startup, it reads the configuration for the current level from `config/levels.json` and initialises all sprites.

## Sprite

A `sprite` is a (mostly) dump entity, which contains some data, and some `behaviours`. Data are things like names, positions, physics-related constants etc. It also contains the texture that is eventually going to be rendered on screen.

## Behaviour

Behaviour, as name implies, dictates the behaviour of a sprite. It knows of its owner (ball, cup, etc) and can affect its data in various ways. For instance a _move_ behaviour would update the x and y coordinates of its owner. This approach is a light version of the [ECS](https://en.wikipedia.org/wiki/Entity_component_system). Most of the behaviours are set in the `levels.json` and are being initialised on runtime.

## Component

Components are similar to behaviours but with a bit more functionality, and are not being set in `levels.json`. It is legacy code, and existed before `behaviour` was introduced. There is no reason why they could not become behaviours, other than spending some time on the task.

## Levels

Levels are configured in `levels.json`. You can define where each sprite is located on screen, and that kind of behaviours are applied for each. An example of a level config can look like:

```
{
    "name": "1",
    "order": 1,
    "description": "Description here",
    "tables": [
      {
        "x": 700,
        "y": 280,
        "behaviours": [
          {
            "name": "rotate",
            "options": {
              "speed": 0.004
            }
          }
        ]
      }
    ],
    "cups": [
      {
        "x": 820,
        "y": 520
      }
    ],
    "player": {
      "name": "ball_white",
      "x": 250,
      "y": 370
    }
  },
```

Most of the properties should be self-explanatory.

- `name` (string): The **unique** name of the level config. This is the key under which progress is saved, so it should never be changed after it has been deployed.
- `order` (number): This is the order under which the level will appear on the level selection screen.
- `behaviours` (array): A list of behaviours that will be applied on the object/sprite. Some of them, can accept extra options.
