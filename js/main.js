const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
let lastTime = 0;
let dropInterval = 1000;
let dropCounter = 0;
const grid = createMatriz(10, 20);
const player = {
    pos: { x: 0, y: 0 },
    matriz: null
}

context.scale(20, 20);


function createPiece(tipo) {
    if (tipo === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
        
    } else if (tipo === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
        
    } 
}


function createMatriz(width, height) {
    const matriz = [];
    while (height--) {
        matriz.push(new Array(width).fill(0));
    }
    return matriz;

}


function collide(grid, player) {
    const matriz = player.matriz;
    const offset = player.pos;

    for (let y = 0; y < matriz.length; ++y) {
        for (let x = 0; x < matriz[y].length; ++x) {
            if (matriz[y][x] !== 0 && (grid[y + offset.y] && grid[y + offset.y][x + offset.x]) !== 0) {
                return true;
            }

        }
    }
    return false;
}

function merge(grid, player) {
    player.matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function drawMatriz(matriz, offset) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }

        });
    });


}

function draw() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatriz(grid, { x: 0, y: 0 });
    drawMatriz(player.matriz, player.pos);
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function playerDrop() {
    player.pos.y++;
    if (collide(grid, player)) {
        player.pos.y--;
        merge(grid, player);
        playerReset()
    }
    dropCounter = 0;
}

function playerReset() {
    player.matriz = createPiece("T");
    player.pos.x = 0;
    player.pos.y = 0;
}

function playerMove(direction) {
    player.pos.x += direction;
    if (collide(grid, player)) {
        player.pos.x -= direction;
    }
}

function rotate(matriz) {
    for (let y = 0; y < matriz.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matriz[x][y], matriz[y][x]] = [matriz[y][x], matriz[x][y]];

        }
    }
    matriz.forEach(row => row.reverse());
}

function PlayerRotate() {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matriz)
    while (collide(grid, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matriz[0].length) {
            rotate(player.matriz);
            player.pos.x = pos;
            return;
        }

    }
}



document.addEventListener("keydown", event => {
    if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 37) {
        playerMove(-1)
    } else if (event.keyCode === 39) {
        playerMove(1)
    } else if (event.keyCode === 32) {
        PlayerRotate();
    }
})



playerReset();
update();