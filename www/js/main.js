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

//instacia de los elementos a utilizar.
var pantallaDerrota = document.getElementById("pantallaDerrota");
var score = document.getElementById("score");
var inline = document.getElementById("lines");
var level = document.getElementById("level");
var ubicacionPausa = document.getElementById("ubicacionPausa");
var tetris = document.getElementById("tetris");
var nextPiece = document.getElementById("nextPiece");
var imagenTetra = document.getElementById("imagenTetra");
var menu = document.getElementById("menu");
var creditosPantalla = document.getElementById("creditos");
var pantallaCargaHistoria = document.getElementById("pantallaCargaHistoria")
var pantallaCargaControles = document.getElementById("pantallaCargaControles")
var juego = document.getElementById("juego");
var tetraImagen = document.getElementById("tetra");
var s = document.getElementById("segundos");
var m = document.getElementById("minutos");
var volumenIcono = document.getElementById("imagenVolumen");
var volumenFondo = document.getElementById("fondoVolumen");
var musicaFondo = document.getElementById("musicaFondo");
var ubicacionControles = document.getElementById("botonesMenu");
var imagenPausa = document.getElementById("imagenPausa");
var fondoHome = document.getElementById("fondoHome");
var imagenHome = document.getElementById("imagenHome");
var botonesMenu = document.getElementById("botonesMenu");
var ubicacionBtnControles = document.getElementById("ubicacionBtnControles");



const colors = [
    null,
    '#C8BA54',
    '#B07D38',
    '#9D484E',
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
    if (player.level < 3) {
        img.src = "img/recursosJuego/fondoTableroTetris.png";
        context.drawImage(img, 0, 0);
    } else if (player.level >= 3 && player.level < 5) {
        img.src = "img/recursosJuego/fondo2.png";
        context.drawImage(img, 0, 0);
    } else if (player.level >= 5 && player.level < 8) {
        img.src = "img/recursosJuego/fondo3.png";
        context.drawImage(img, 0, 0);
    } else if (player.level >= 8) {
        img.src = "img/recursosJuego/fondo4.png";
        context.drawImage(img, 0, 0);
    }
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
            if (player.level == 3 || player.level == 5 || player.level == 8) {

            } else
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
        pantallaDerrota.style.display = "block";
        mostrarTetra(false);


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
    score.innerHTML = player.score;
    lines.innerHTML = player.lines;
    level.innerHTML = player.level;

}

/*  Validar si se pausa y si se des pausa */
function fPause(pausar_ahora) {
    pause = pausar_ahora;

    if (pause) {

        ubicacionPausa.style.display = "block";
        tetris.style.top = "-1555px";
        nextPiece.style.top = "-1890px";


    } else {
        ubicacionPausa.style.display = "none";
        tetris.style.top = "-1155px";
        nextPiece.style.top = "-1490px";
        imagenTetra.style.top = "-1060";
        update();
    }
}


function creditos() {
    menu.style.display = "none";
    creditosPantalla.style.display = "block";

}

function atrasCreditos() {
    creditosPantalla.style.display = "none";
    menu.style.display = "block";

}



function jugar() {
    pantallaCargaHistoria.style.display = "block";
    menu.style.display = "none";


}

function adelanteCarga() {
    pantallaCargaHistoria.style.display = "none";
    pantallaCargaControles.style.display = "block";


}

function iniciarJuego() {
    pantallaCargaControles.style.display = "none";
    juego.style.display = "block";
    pantallaDerrota.style.display = "none";
    tetraImagen.style.display = "none";
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
    juego.style.display = "none";
    ubicacionPausa.style.display = "none";
    menu.style.display = "block";
    tetris.style.top = "-1105px";
    nextPiece.style.top = "-1440px";
    pantallaDerrota.style.display = "none";
    tetraImagen.style.display = "none";
    if (pause) {
        pause = false;
    }
    limpiarPantalla();
}


function tiempo() {

    contador_s = 0;

    contador_m = 0;

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
    s.innerHTML = 0;
    m.innerHTML = 0;

}

function detenerMusica() {

    pausaMusica++;


    if (pausaMusica % 2 === 0) {
        musicaFondo.play();
        volumenIcono.src = "img/recursosJuego/volumen.png";

    } else {
        musicaFondo.pause();
        volumenIcono.src = "img/recursosJuego/icono_musica_off.png";

    }
}



function tetraPausa(activa) {
    if (activa) {

        botonesMenu.style.display = "none";

    } else {
        botonesMenu.style.display = "block";
       
    }
}


function mostrarTetra(activa) {
    if (activa) {
        tetraImagen.style.display = "block";
        tetris.style.top = "-1309px";
        nextPiece.style.top = "-1644px";
        ubicacionBtnControles.style.top = "-448px";
    } else {
        tetraImagen.style.display = "none";
        tetris.style.top = "-1155px";
        nextPiece.style.top = "-1490px";
        ubicacionBtnControles.style.top = "-498px";
    }

}

function tetra(caso) {
    let tiempoInvocacion = contador_s;
    let duracionTetra = 5;


    cronometroTetra = setInterval(

        function () {
            switch (caso) {
                case "A":
                    imagenTetra.src = "img/tetra/8.png";

                    tetraPausa(true);
                    mostrarTetra(true);



                    if ((contador_s - tiempoInvocacion) > duracionTetra) {

                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "B":
                    imagenTetra.src = "img/tetra/1.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "C":
                    imagenTetra.src = "img/tetra/2.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "D":
                    imagenTetra.src = "img/tetra/3.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "E":
                    imagenTetra.src = "img/tetra/4.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "F":
                    imagenTetra.src = "img/tetra/5.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "G":
                    imagenTetra.src = "img/tetra/6.png";
                    tetraPausa(true);
                    mostrarTetra(true);

                    if ((contador_s - tiempoInvocacion) > duracionTetra) {
                        tetraPausa(false);
                        mostrarTetra(false);
                        caso = null;
                    }
                    break;
                case "H":
                    imagenTetra.src = "img/tetra/7.png";
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