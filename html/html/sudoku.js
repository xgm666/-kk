// 创建一个函数来生成一个随机数独
function generateRandomSudoku() {
    const sudoku = [];

    // 创建一个随机排列的数字数组
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // 生成初始状态的数独
    for (let i = 0; i < 9; i++) {
        const newRow = [];
        for (let j = 0; j < 9; j++) {
            newRow.push(numbers[(i * 3 + Math.floor(i / 3) + j) % 9]);
        }
        sudoku.push(newRow);
    }

    // 随机交换行和列来增加随机性
    for (let i = 0; i < 30; i++) {
        const groupIndex = Math.floor(Math.random() * 3);
        const index1 = Math.floor(Math.random() * 3) + groupIndex * 3;
        const index2 = Math.floor(Math.random() * 3) + groupIndex * 3;
        for (let j = 0; j < 9; j++) {
            [sudoku[j][index1], sudoku[j][index2]] = [sudoku[j][index2], sudoku[j][index1]];
        }
    }

    // 随机交换数字
    for (let i = 0; i < 30; i++) {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        for (let j = 0; j < 9; j++) {
            for (let k = 0; k < 9; k++) {
                if (sudoku[j][k] === num1) {
                    sudoku[j][k] = num2;
                } else if (sudoku[j][k] === num2) {
                    sudoku[j][k] = num1;
                }
            }
        }
    }

    // 随机留空白格子，你可以调整空白格子的数量
    for (let i = 0; i < 50; i++) {
        const rowIndex = Math.floor(Math.random() * 9);
        const colIndex = Math.floor(Math.random() * 9);
        sudoku[rowIndex][colIndex] = null;
    }

    return sudoku;
}

// 创建一个函数来填充九宫格中的单元格
function fillSudokuGrid(gridId, sudoku) {
    const grid = document.getElementById(gridId);
    const table = document.createElement('table');

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            if (sudoku[i][j] !== null) {
                cell.textContent = sudoku[i][j];
            } else {
                cell.className = 'empty';
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    grid.appendChild(table);
}

// 并发生成9个九宫格数独
function generateSudokuGridsConcurrently() {
    const gridIds = ['grid1', 'grid2', 'grid3', 'grid4', 'grid5', 'grid6', 'grid7', 'grid8', 'grid9'];

    // 使用Promise.all来并发生成并填充9个不同的九宫格数独
    Promise.all(gridIds.map(async (gridId) => {
        const sudoku = generateRandomSudoku();
        return fillSudokuGrid(gridId, sudoku);
    }))
        .then(() => {
            console.log("9个不同的九宫格数独生成完成");
        })
        .catch((error) => {
            console.error("生成九宫格数独时发生错误", error);
        });
}

// 在页面加载完成后调用并发生成函数
window.onload = generateSudokuGridsConcurrently;
