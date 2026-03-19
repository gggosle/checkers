# Directory Structure

```
checkers/
├── index.html          # Main HTML entry point
├── main.js             # Application bootstrap
├── constants.js        # Game configuration & CSS class names
├── style.css           # Styles with CSS custom properties
├── .planning/          # Planning artifacts
├── controllers/        # Input handling
│   ├── GameController.js
│   └── InfoController.js
├── models/             # Data & business logic
│   ├── GameModel.js
│   ├── Board.js
│   ├── Checker.js
│   ├── InfoModel.js
│   ├── MoveType.js
│   └── Color.js
├── views/              # UI rendering
│   ├── GameView.js
│   └── InfoView.js
└── images/             # Static assets
    └── crown.svg
```

## Naming Conventions

- Classes: PascalCase (`GameModel`, `GameView`)
- Constants: SCREAMING_SNAKE_CASE (`GAME_CONFIG`, `MOVE_DIR_UP`)
- CSS classes: kebab-case with semantic prefixes (`.turn-indicator`, `.valid-move`)
- Files: PascalCase for classes, lowercase for utilities

## Key File Locations

| Purpose | File |
|---------|------|
| Game initialization | `main.js:8` |
| Board rendering | `views/GameView.js:91` |
| Move validation | `models/GameModel.js:38` |
| Click handling | `controllers/GameController.js:43` |
| Turn switching | `models/GameModel.js:164` |
