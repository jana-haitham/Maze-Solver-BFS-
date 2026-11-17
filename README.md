# CF321 Project 1: Maze Solver using BFS

## Idea
A grid-based agent starts at `S` and must reach `G` without crossing walls (`#`). Open cells are `.`. The program uses Breadth-First Search (BFS) to find a shortest path when every move has equal cost.

## Problem formulation
- **State:** agent coordinate `(row, column)`.
- **Initial state:** cell marked `S`.
- **Goal state:** cell marked `G`.
- **Actions:** move up, down, left, or right if the destination is inside the grid and is not a wall.
- **Action cost:** 1 per move.
- **Path cost:** number of moves from `S` to `G`.

## Algorithm
BFS explores cells level by level using a FIFO queue. `visited` prevents duplicate discovery. `parent` stores the predecessor of each discovered cell so the path can be reconstructed. Since all moves cost 1, BFS finds a minimum-move path.

## Output
The program displays the original maze, the maze with the path marked by `*`, whether a solution was found, the path cost, and explored-node count. A node is counted as explored when dequeued and processed; the goal is included if reached.

## Requirements
Python 3.10 or newer. No third-party packages are needed.

## Run
From the project root:
```bash
python -m src.maze_solver
```

## Tests
```bash
python -m unittest discover -s tests -v
```

## Maze symbols
`S` start (exactly one), `G` goal (exactly one), `#` wall, `.` open cell.

## Structure
```text
src/maze_solver.py
tests/test_maze_solver.py
docs/Project_Report.md
docs/Viva_Questions.md
docs/Presentation_Outline.md
docs/Test_Results.txt
docs/Example_Run_Output.txt
README.md
```

## GitHub upload
Create an empty GitHub repository, then run:
```bash
git init
git add .
git commit -m "Add CF321 BFS maze solver project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Replace the placeholder with your repository URL.

## Limitations
Four-direction movement only, equal move costs, and one maze per run. If actions have different costs, BFS does not necessarily minimize total cost.
