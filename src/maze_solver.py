from collections import deque
from dataclasses import dataclass

Position = tuple[int, int]
Grid = list[list[str]]

@dataclass
class SearchResult:
    path: list[Position] | None
    explored_nodes: int
    path_cost: int | None

def validate_maze(maze: Grid) -> tuple[Position, Position]:
    if not maze or not maze[0]:
        raise ValueError("Maze cannot be empty.")
    width = len(maze[0])
    if any(len(row) != width for row in maze):
        raise ValueError("All maze rows must have the same length.")
    allowed = {"S", "G", "#", "."}
    starts, goals = [], []
    for r, row in enumerate(maze):
        for c, cell in enumerate(row):
            if cell not in allowed:
                raise ValueError(f"Invalid cell symbol {cell!r} at {(r, c)}.")
            if cell == "S": starts.append((r, c))
            if cell == "G": goals.append((r, c))
    if len(starts) != 1:
        raise ValueError("Maze must contain exactly one start cell 'S'.")
    if len(goals) != 1:
        raise ValueError("Maze must contain exactly one goal cell 'G'.")
    return starts[0], goals[0]

def solve_maze(maze: Grid) -> SearchResult:
    """BFS shortest path. Explored = cells dequeued and processed, including G."""
    start, goal = validate_maze(maze)
    rows, cols = len(maze), len(maze[0])
    queue = deque([start])
    visited = {start}
    parent = {start: None}
    explored = 0
    while queue:
        current = queue.popleft()
        explored += 1
        if current == goal:
            path, node = [], goal
            while node is not None:
                path.append(node)
                node = parent[node]
            path.reverse()
            return SearchResult(path, explored, len(path) - 1)
        r, c = current
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            nxt = (nr, nc)
            if (0 <= nr < rows and 0 <= nc < cols
                and maze[nr][nc] != "#" and nxt not in visited):
                visited.add(nxt)
                parent[nxt] = current
                queue.append(nxt)
    return SearchResult(None, explored, None)

def render_solution(maze: Grid, path: list[Position] | None) -> str:
    rendered = [row[:] for row in maze]
    if path:
        for r, c in path:
            if rendered[r][c] not in {"S", "G"}:
                rendered[r][c] = "*"
    return "\n".join("".join(row) for row in rendered)

EXAMPLE_MAZE = [
    list("S...#...."),
    list(".##.#.##."),
    list("...##...#"),
    list("##....#.."),
    list("....##..G"),
]

def main():
    print("CF321 - Maze Solver using Breadth-First Search (BFS)")
    print("\nOriginal maze:")
    print("\n".join("".join(row) for row in EXAMPLE_MAZE))
    result = solve_maze(EXAMPLE_MAZE)
    print("\nSolved maze:")
    print(render_solution(EXAMPLE_MAZE, result.path))
    print(f"\nSolution found: {'Yes' if result.path else 'No'}")
    if result.path is not None:
        print(f"Path cost (number of moves): {result.path_cost}")
    print(f"Nodes explored: {result.explored_nodes}")

if __name__ == "__main__":
    main()
