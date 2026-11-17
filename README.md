# CF321 Project 1: Maze Solver Using BFS

## Project Overview
A grid-based agent starts at `S` and must reach `G` without crossing walls (`#`). Open cells are represented by `.`. The project implements Breadth-First Search (BFS) to find the shortest path when every move has equal cost.

## Problem Formulation
- **State:** Agent coordinate `(row, column)`.
- **Initial State:** Cell marked `S`.
- **Goal State:** Cell marked `G`.
- **Actions:** Move up, down, left, or right if the destination is inside the grid and is not a wall.
- **Action Cost:** 1 per move.
- **Path Cost:** Number of moves from `S` to `G`.

## Algorithm
BFS explores cells level by level using a FIFO queue. The `visited` set prevents duplicate discovery, while the `parent` dictionary stores the predecessor of each discovered cell to reconstruct the final path. Since all moves have equal cost, BFS guarantees a shortest path.

## Features
- Maze validation.
- Shortest-path search using BFS.
- Queue-based exploration.
- Path reconstruction.
- Solution visualization.
- Path cost calculation.
- Explored-node counting.
- Unit testing.

## Output
The program displays:
- Original maze.
- Solved maze with the path marked by `*`.
- Whether a solution was found.
- Path cost.
- Number of explored nodes.

## Requirements
- Python 3.10 or newer.
- No third-party packages required.

## How to Run
From the project root directory:

```bash
python -m src.maze_solver
```

## How to Run Tests

```bash
python -m unittest discover -s tests -v
```

## Maze Symbols
| Symbol | Meaning |
|---|---|
| `S` | Starting position |
| `G` | Goal position |
| `#` | Wall |
| `.` | Open cell |
| `*` | Final solution path |

## Project Structure

```text
CF321_Maze_Solver_BFS/
│
├── src/
│   ├── __init__.py
│   └── maze_solver.py
│
├── tests/
│   ├── __init__.py
│   └── test_maze_solver.py
│
└── README.md
```

## Limitations
- Supports four-direction movement only.
- All moves have equal cost.
- Solves one maze per execution.
- BFS does not guarantee minimum total cost when movement costs differ.
