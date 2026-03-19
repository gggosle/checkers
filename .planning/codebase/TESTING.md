# Testing

## Test Framework

None - No automated tests currently exist.

## Test Structure

No `tests/` directory present.

## Coverage

Zero coverage - no test suite implemented.

## Recommendations

1. Add Jest or Vitest for unit testing
2. Test model logic independently of DOM:
   - Move validation in `GameModel`
   - Board state management in `Board`
   - Piece promotion logic
3. Mock DOM interactions for view testing
4. Test edge cases:
   - Multi-jump sequences
   - Forced jump situations
   - King promotion boundaries
   - Win condition detection
