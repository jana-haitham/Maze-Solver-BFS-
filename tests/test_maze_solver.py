import unittest
from src.maze_solver import solve_maze, render_solution, validate_maze

class TestMazeSolver(unittest.TestCase):
    def test_simple_path(self):
        result = solve_maze([list("S.G")])
        self.assertEqual(result.path, [(0,0),(0,1),(0,2)])
        self.assertEqual(result.path_cost, 2)

    def test_detour(self):
        result = solve_maze([list("S#G"), list("...")])
        self.assertEqual(result.path_cost, 4)

    def test_no_solution(self):
        result = solve_maze([list("S#."), list("##G")])
        self.assertIsNone(result.path)
        self.assertIsNone(result.path_cost)

    def test_invalid_missing_goal(self):
        with self.assertRaises(ValueError):
            validate_maze([list("S..")])

    def test_non_rectangular(self):
        with self.assertRaises(ValueError):
            solve_maze([list("S.."), list("..G.")])

    def test_render_does_not_mutate_input(self):
        maze = [list("S.G")]
        result = solve_maze(maze)
        self.assertEqual(render_solution(maze, result.path), "S*G")
        self.assertEqual(maze, [list("S.G")])

if __name__ == "__main__":
    unittest.main()
