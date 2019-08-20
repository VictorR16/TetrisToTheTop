let lastTime = 0;
let dropInterval = 1000;
let dropCounter = 0;
const grid = createMatriz(10, 20);
let pause = false;
let pausaMusica = 0;
let btnPausa = 0;
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);
const canvasNext = document.getElementById("nextPiece");
const contextNext = canvasNext.getContext("2d");
contextNext.scale(19, 19);



const colors = [
    null,
    '#C8BA54',
    '#B07D38',
    '#B07D38',
    '#7B567B',
    '#3E6783',
    '#618C8E',
    '#486D45'

];

const player = {
    pos: { x: 0, y: 0 },
    matriz: null,
    next: null,
    score: 0,
    lines: 0,
    level: 0
}


/* Piezas del juego */
function createPiece(tipo) {
    switch (tipo) {
        case "T":
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
            break;
        case "O":
            return [
                [2, 2],
                [2, 2]
            ];
            break;
        case "L":
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3]
            ];
            break;
        case "J":
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0]
            ];
            break;
        case "I":
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0]
            ];
            break;
        case "S":
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ];
            break;
        case "Z":
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ];
            break;
    }











}

/* tamaño figuras */
function createMatriz(width, height) {
    const matriz = [];
    while (height--) {
        matriz.push(new Array(width).fill(0));
    }
    return matriz;

}

/* Comprobar colicion de las figuras */
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

/*Unir figuras */
function merge(grid, player) {
    player.matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });

}

/* Dibujar la piezas en el canvas */
function drawMatriz(matriz, offset) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }

        });
    });


}

/* Dibujar la figura siguiente en su respectivo cuadro */
function drawMatrizNext(matriz, offset) {

    contextNext.fillStyle = "#000000";
    contextNext.fillRect(0, 0, canvasNext.width, canvasNext.height);

    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                contextNext.fillStyle = colors[value];
                contextNext.fillRect(x + offset.x, y + offset.y, 1, 1);
            }

        });
    });


}

/* Dibujar el canvas y las figuras*/
function draw() {
    var img = new Image();
    if (player.level == 0) {
        img.src = "img/recursosJuego/fondoTableroTetris.png";
        context.drawImage(img, 0, 0);
    } else if (player.level >= 1) {
        img.src = "img/recursosJuego/fondo2.png";
        context.drawImage(img, 0, 0);
    }
    /*  context.fillStyle = "#ffffff";*/
    /* context.fillRect(0, 0, canvas.width, canvas.height);*/
    drawMatriz(grid, { x: 0, y: 0 });
    drawMatriz(player.matriz, player.pos);
    drawMatrizNext(player.next, { x: 1, y: 1 });


}
/* Funcion para eliminar filas si estan completas */
function gridSweep() {
    const fondoTetra = 'CDEFGH';
    let rowCount = 1;
    outer: for (let y = grid.length - 1; y > 0; --y) {
        for (let x = 0; x < grid[y].length; ++x) {
            if (grid[y][x] === 0) {
                continue outer;
            }

        }

        const row = grid.splice(y, 1)[0].fill(0);
        grid.unshift(row);

        ++y;

        player.score += rowCount * 10;
        player.lines++;
        rowCount *= 2;
        if (player.lines % 3 === 0) {
            player.level++;
            tetra(fondoTetra[fondoTetra.length * Math.random() | 0]);

        }
    }


}



/* Actualiza la pantalla cada frame */
function update(time = 0) {
    if (pause) return;

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);



}

/* Funcion para la caida de las piezas */
function playerDrop() {
    player.pos.y++;
    if (collide(grid, player)) {
        player.pos.y--;
        merge(grid, player);
        playerReset()
        gridSweep();
        updateScore()
    }
    dropCounter = 0;
}

/*Funcion para la creacion de nuevas figuras y controlar su caida */
function playerReset() {
    const pieces = 'ILJOTSZ';
    dropInterval = 1000 - (player.level * 100);
    if (player.next === null) {
        player.matriz = createPiece(pieces[pieces.length * Math.random() | 0]);
    } else {
        player.matriz = player.next;
    }

    player.next = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.x = (grid[0].length / 2 | 0) - (player.matriz[0].length / 2 | 0);
    player.pos.y = 0;
    if (collide(grid, player)) {
        grid.forEach(row => row.fill(0));
        player.score = 0;
        player.lines = 0;
        player.level = 0;
        reiniciarTiempo();
        document.getElementById("pantallaDerrota").style.display = "block";
        document.getElementById("tetra").style.display = "none";


    }
}

/* Funcion para mover horizontalmente las figuras*/
function playerMove(direction) {
    player.pos.x += direction;
    if (collide(grid, player)) {
        player.pos.x -= direction;
    }
}
/* Funcion para rotar las figuras */
function rotate(matriz) {
    for (let y = 0; y < matriz.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matriz[x][y], matriz[y][x]] = [matriz[y][x], matriz[x][y]];

        }
    }
    matriz.forEach(row => row.reverse());
}

/* Funcion para rotar, llamado jugador */
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

function rotar() {
    PlayerRotate();
}


/* Controles con teclado*/
function mover(boton) {
    switch (boton) {
        case 40:
            playerDrop();
            break;
        case 37:
            playerMove(-1);
            break;
        case 39:
            playerMove(1);
            break;
        case 32:
            PlayerRotate();
            break;


    };
}

/* Se actualizan los puntajes en el juego */
function updateScore() {
    document.getElementById("score").innerHTML = player.score;
    document.getElementById("lines").innerHTML = player.lines;
    document.getElementById("level").innerHTML = player.level;

}

/*  Validar si se pausa y si se des pausa */
function fPause(pausar_ahora) {
    pause = pausar_ahora;

    if (pause) {

        document.getElementById("ubicacionPausa").style.display = "block";
        document.getElementById("tetris").style.top = "-1500px";
        document.getElementById("nextPiece").style.top = "-1840px";

    } else {
        document.getElementById("ubicacionPausa").style.display = "none";
        document.getElementById("tetris").style.top = "-1100px";
        document.getElementById("nextPiece").style.top = "-1440px";
        document.getElementById("imagenTetra").style.top = "-1060";
        update();
    }
}


function creditos() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("creditos").style.display = "block";

}

function atrasCreditos() {
    document.getElementById("creditos").style.display = "none";
    document.getElementById("menu").style.display = "block";

}



function jugar() {
    document.getElementById("pantallaCargaHistoria").style.display = "block";
    document.getElementById("menu").style.display = "none";


}

function adelanteCarga() {
    document.getElementById("pantallaCargaHistoria").style.display = "none";
    document.getElementById("pantallaCargaControles").style.display = "block";


}

function iniciarJuego() {
    document.getElementById("pantallaCargaControles").style.display = "none";
    document.getElementById("juego").style.display = "block";
    document.getElementById("pantallaDerrota").style.display = "none";
    document.getElementById("tetra").style.display = "none";
    player.matriz = null;
    player.next = null;
    mostrarTetra(false);
    updateScore();
    playerReset();
    update();
    tiempo();
    player.score = 0;
    player.lines = 0;
    player.level = 0;



}

function limpiarPantalla() {
    grid.forEach(row => row.fill(0));
    player.score = 0;
    player.lines = 0;
    player.level = 0;
    rowCount = 20;
    updateScore();
    reiniciarTiempo();
}

function irMenu() {
    document.getElementById("juego").style.display = "none";
    document.getElementById("ubicacionPausa").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.getElementById("tetris").style.top = "-1105px";
    document.getElementById("nextPiece").style.top = "-1440px";
    document.getElementById("pantallaDerrota").style.display = "none";
    document.getElementById("tetra").style.display = "none";
    if (pause) {
        pause = false;
    }
    limpiarPantalla();
}


function tiempo() {

    contador_s = 0;

    contador_m = 0;

    s = document.getElementById("segundos");

    m = document.getElementById("minutos");



    cronometro = setInterval(

        function () {

            if (contador_s == 60) {

                contador_s = 0;

                contador_m++;

                m.innerHTML = contador_m;



                if (contador_m == 60) {

                    contador_m = 0;

                }

            }

            if (!pause) {

                s.innerHTML = contador_s;

                contador_s++;
            }

            if (contador_s == 2 && contador_m == 0) {
                tetra("A");
            }


        }

        , 1000);



}

function reiniciarTiempo() {
    clearInterval(cronometro);
    s = document.getElementById("segundos");

    m = document.getElementById("minutos");
    s.innerHTML = 0;
    m.innerHTML = 0;

}

function detenerMusica() {

    pausaMusica++;

    if (pausaMusica % 2 === 0) {
        document.getElementById("musicaFondo").play();
        document.getElementById("imagenVolumen").src = "img/recursosJuego/volumen.png";
    } else {
        document.getElementById("musicaFondo").pause();
        document.getElementById("imagenVolumen").src = "img/recursosJuego/icono_musica off.png";
    }
}



function tetraPausa(activa) {
    if (activa) {
        document.getElementById("imagenPausa").style.display = "none";
        document.getElementById("fondoVolumen").style.right = "106px";
        document.getElementById("imagenVolumen").style.right = "136px";
        document.getElementById("fondoHome").style.right = "167px";
        document.getElementById("imagenHome").style.right = "198px";
    } else {
        document.getElementById("imagenPausa").style.display = "inline";
        document.getElementById("fondoVolumen").style.right = "83px";
        document.getElementById("imagenVolumen").style.right = "115px";
        document.getElementById("fondoHome").style.right = "184px";
        document.getElementById("imagenHome").style.right = "215px";
    }
}


function mostrarTetra(activa) {
    if (activa) {
        document.getElementById("tetra").style.display = "block";
        document.getElementById("tetris").style.top = "-1305px";
        document.getElementById("nextPiece").style.top = "-1645px";
    } else {
        document.getElementById("tetra").style.display = "none";
        document.getElementById("tetris").style.top = "-1105px";
        document.getElementById("nextPiece").style.top = "-1440px";
    }

}

function tetra(caso) {
    let tiempoInvocacion = contador_s;
    let duracionTetra = 5;


    cronometroTetra = setInterval(

        function () {
            switch (caso) {
                case "A":
                    document.getElementById("imagenTetra").src = "img/tetra/8.png";

                    tetraPausa(true);
                    mostrarTetra(true);



                    if ((contador_s - tiempoInvocacion) > duracionTetra) {

                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "B":
                    document.getElementById("imagenTetra").src = "img/tetra/1.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "C":
                    document.getElementById("imagenTetra").src = "img/tetra/2.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "D":
                    document.getElementById("imagenTetra").src = "img/tetra/3.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "E":
                    document.getElementById("imagenTetra").src = "img/tetra/4.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "F":
                    document.getElementById("imagenTetra").src = "img/tetra/5.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "G":
                    document.getElementById("imagenTetra").src = "img/tetra/6.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "H":
                    document.getElementById("imagenTetra").src = "img/tetra/7.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
            }
            cronometroTetra++;
        }
        , 1000);
}