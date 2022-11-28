function createPuzzleDom(puzzle, id) {
    puzzle = puzzle.toLowerCase();

    const size = puzzle.length <= 9 ? 3 : 4;
    const table = document.createElement('table');
    if (id) {
        table.id = id;
    }
    table.classList.add('puzzle');

    for (let i = 0; i < size; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < size; j++) {
            const td = document.createElement('td');

            td.classList.add(`puzzle-${puzzle.charAt(i * size + j) || 'unknown'}`);

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    return table;
}