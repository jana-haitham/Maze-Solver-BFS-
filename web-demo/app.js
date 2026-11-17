(() => {
  const $ = (id) => document.getElementById(id);
  const presets = {
    default: ["S...#....", ".##.#.##.", "...##...#", "##....#..", "....##..G"],
    detour: ["S#G", "..."],
    blocked: ["S#.", "##G"],
    open: ["S....", ".....", "....G"]
  };
  const clone = (grid) => grid.map(row => row.slice());
  let grid = presets.default.map(row => row.split(''));
  let tool = 'wall';
  let search = null;
  let stepIndex = 0;
  let timer = null;
  let finalResult = null;

  function findPoint(symbol) {
    for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[r].length; c++) if (grid[r][c] === symbol) return [r,c];
    return null;
  }
  function stopAnimation() { if (timer) clearInterval(timer); timer = null; $('playBtn').textContent = '▶ Animate'; }
  function resetSearch() { stopAnimation(); search = null; stepIndex = 0; finalResult = null; $('pathCost').textContent = '—'; $('exploredCount').textContent = '0'; $('resultBadge').textContent = 'NOT RUN'; $('resultBadge').className = 'result-badge idle'; $('progressText').textContent = 'Ready'; $('progressBar').style.width = '0%'; $('message').className = 'message'; $('message').innerHTML = 'Set your maze, then press <b>Solve maze</b>.'; render(); }
  function render() {
    const root = $('maze'); root.innerHTML = ''; root.style.gridTemplateColumns = `repeat(${grid[0].length}, auto)`;
    const explored = new Set(search ? search.order.slice(0, stepIndex).map(p => p.join(',')) : []);
    const path = new Set(finalResult && finalResult.path ? finalResult.path.map(p => p.join(',')) : []);
    const current = search && stepIndex > 0 && stepIndex <= search.order.length ? search.order[stepIndex-1].join(',') : '';
    grid.forEach((row,r) => row.forEach((cell,c) => {
      const key = `${r},${c}`; const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cell'; btn.textContent = cell === '#' ? '' : cell;
      btn.setAttribute('aria-label', `Row ${r+1}, column ${c+1}: ${cell === '#' ? 'wall' : cell === 'S' ? 'start' : cell === 'G' ? 'goal' : 'open'}`);
      if (cell === '#') btn.classList.add('wall'); if (cell === 'S') btn.classList.add('start'); if (cell === 'G') btn.classList.add('goal');
      if (explored.has(key) && cell === '.') btn.classList.add('visited'); if (path.has(key) && cell === '.') btn.classList.add('path'); if (current === key) btn.classList.add('current');
      btn.addEventListener('click', () => editCell(r,c)); root.appendChild(btn);
    }));
  }
  function editCell(r,c) {
    if (timer) stopAnimation();
    if (tool === 'start' || tool === 'goal') {
      const symbol = tool === 'start' ? 'S' : 'G';
      const old = findPoint(symbol); if (old) grid[old[0]][old[1]] = '.';
      if (grid[r][c] === '#') grid[r][c] = '.'; grid[r][c] = symbol;
    } else if (tool === 'wall') { if (grid[r][c] === '.') grid[r][c] = '#'; else if (grid[r][c] === '#') grid[r][c] = '.'; }
    else if (tool === 'erase' && grid[r][c] === '#') grid[r][c] = '.';
    resetSearch();
  }
  function validate() {
    const starts = grid.flat().filter(x => x === 'S').length, goals = grid.flat().filter(x => x === 'G').length;
    if (starts !== 1 || goals !== 1) { $('message').className = 'message error'; $('message').textContent = 'The maze must contain exactly one Start (S) and one Goal (G).'; return false; }
    return true;
  }
  function buildSearch() {
    if (!validate()) return false;
    const start = findPoint('S'), goal = findPoint('G'), rows = grid.length, cols = grid[0].length;
    const queue = [start], visited = new Set([start.join(',')]), parent = new Map([[start.join(','), null]]), order = [];
    let head = 0, found = false;
    while (head < queue.length) {
      const current = queue[head++]; order.push(current);
      if (current[0] === goal[0] && current[1] === goal[1]) { found = true; break; }
      // Keep the same neighbor order as the Python project: up, down, left, right.
      for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = current[0]+dr, nc = current[1]+dc, key = `${nr},${nc}`;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc] !== '#' && !visited.has(key)) {
          visited.add(key); parent.set(key, current); queue.push([nr,nc]);
        }
      }
    }
    let path = null;
    if (found) { path=[]; let node=goal; while (node) { path.push(node); node=parent.get(node.join(',')); } path.reverse(); }
    search = {order, path}; stepIndex = 0; finalResult = null; return true;
  }
  function updateProgress() {
    const total = search.order.length; $('exploredCount').textContent = String(Math.min(stepIndex,total));
    $('progressText').textContent = `${Math.min(stepIndex,total)} / ${total} nodes`;
    $('progressBar').style.width = `${total ? Math.min(stepIndex,total)/total*100 : 0}%`;
  }
  function showFinal() {
    finalResult = {path: search.path}; stopAnimation();
    if (search.path) { $('pathCost').textContent = String(search.path.length-1); $('resultBadge').textContent = 'SOLUTION FOUND'; $('resultBadge').className = 'result-badge success'; $('message').className = 'message success'; $('message').textContent = `Shortest path found! ${search.path.length-1} moves from S to G.`; }
    else { $('pathCost').textContent = '—'; $('resultBadge').textContent = 'NO SOLUTION'; $('resultBadge').className = 'result-badge fail'; $('message').className = 'message error'; $('message').textContent = 'No path exists. BFS explored every reachable cell and the queue became empty.'; }
    updateProgress(); render();
  }
  function advance() {
    if (!search) return;
    if (stepIndex < search.order.length) { stepIndex++; updateProgress(); render(); }
    if (stepIndex >= search.order.length) showFinal();
  }
  function runAll() {
    if (!search && !buildSearch()) return;
    stopAnimation(); stepIndex = search.order.length; showFinal();
  }
  function loadPreset(name) { stopAnimation(); grid = presets[name].map(row=>row.split('')); $('rowsInput').value=grid.length; $('colsInput').value=grid[0].length; resetSearch(); }

  document.querySelectorAll('.tool').forEach(btn => btn.addEventListener('click', () => { tool=btn.dataset.tool; document.querySelectorAll('.tool').forEach(b=>b.classList.toggle('active',b===btn)); $('editStatus').textContent = `${tool.toUpperCase()} TOOL`; }));
  $('presetSelect').addEventListener('change', e=>loadPreset(e.target.value));
  $('solveBtn').addEventListener('click', runAll);
  $('stepBtn').addEventListener('click', () => { if (!search && !buildSearch()) return; advance(); });
  $('playBtn').addEventListener('click', () => { if (timer) { stopAnimation(); return; } if (!search && !buildSearch()) return; if (stepIndex >= search.order.length) { stepIndex=0; finalResult=null; } $('playBtn').textContent='Ⅱ Pause'; timer=setInterval(advance, Number($('speedInput').value)); });
  $('resetBtn').addEventListener('click', resetSearch);
  $('clearBtn').addEventListener('click', () => { grid=grid.map(row=>row.map(cell=>cell==='#'?'.':cell)); resetSearch(); });
  $('resizeBtn').addEventListener('click', () => {
    const rows=Math.max(2,Math.min(15,Number($('rowsInput').value)||9)), cols=Math.max(2,Math.min(20,Number($('colsInput').value)||13));
    grid=Array.from({length:rows},()=>Array(cols).fill('.')); grid[0][0]='S'; grid[rows-1][cols-1]='G'; resetSearch();
  });
  // Start with the default sample and a clean result panel.
  resetSearch();
})();
