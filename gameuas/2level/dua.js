
        // Variabel global
        var mazeCanvas = document.getElementById("mazeCanvas");
        var ctx = mazeCanvas.getContext("2d");
        var sprite;
        var finishSprite;
        var foodImage;
        var maze, draw, player;
        var cellSize;
        var difficulty;
        var score = 0;

        // Fungsi untuk menghasilkan angka acak antara min dan max (inklusif)
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Fungsi untuk mengubah kecerahan gambar
        function changeBrightness(factor, image) {
            var virtCanvas = document.createElement("canvas");
            virtCanvas.width = image.width;
            virtCanvas.height = image.height;
            var context = virtCanvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);

            var imgData = context.getImageData(0, 0, image.width, image.height);

            for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = imgData.data[i] * factor;
                imgData.data[i + 1] = imgData.data[i + 1] * factor;
                imgData.data[i + 2] = imgData.data[i + 2] * factor;
            }
            context.putImageData(imgData, 0, 0);

            var outputImage = new Image();
            outputImage.src = virtCanvas.toDataURL();
            virtCanvas.remove();
            return outputImage;
        }

        // Fungsi untuk menggambar labirin
        function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
            var map = Maze.map();
            var cellSize = cellsize;
            var drawEndMethod;

            ctx.lineWidth = cellSize / 40;

            this.redrawMaze = function (size) {
                cellSize = size;
                ctx.lineWidth = cellSize / 50;
                drawMap();
                drawEndMethod();
            };

            function drawCell(xCord, yCord, cell) {
                var x = xCord * cellSize;
                var y = yCord * cellSize;

                if (cell.n == false) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + cellSize, y);
                    ctx.stroke();
                }
                if (cell.s === false) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + cellSize);
                    ctx.lineTo(x + cellSize, y + cellSize);
                    ctx.stroke();
                }
                if (cell.e === false) {
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize, y);
                    ctx.lineTo(x + cellSize, y + cellSize);
                    ctx.stroke();
                }
                if (cell.w === false) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + cellSize);
                    ctx.stroke();
                }
            }

            function drawMap() {
                for (x = 0; x < map.length; x++) {
                    for (y = 0; y < map[x].length; y++) {
                        drawCell(x, y, map[x][y]);
                    }
                }
            }

            function drawEndFlag() {
                var coord = Maze.endCoord();
                var gridSize = 4;
                var fraction = cellSize / gridSize - 2;
                var colorSwap = true;

                for (let y = 0; y < gridSize; y++) {
                    if (gridSize % 2 == 0) {
                        colorSwap = !colorSwap;
                    }
                    for (let x = 0; x < gridSize; x++) {
                        ctx.beginPath();
                        ctx.rect(
                            coord.x * cellSize + x * fraction + 4.5,
                            coord.y * cellSize + y * fraction + 4.5,
                            fraction,
                            fraction
                        );
                        if (colorSwap) {
                            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                        } else {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                        }
                        ctx.fill();
                        colorSwap = !colorSwap;
                    }
                }
            }

            function drawEndSprite() {
                var offsetLeft = cellSize / 50;
                var offsetRight = cellSize / 25;
                var coord = Maze.endCoord();
                ctx.drawImage(
                    endSprite,
                    2,
                    2,
                    endSprite.width,
                    endSprite.height,
                    coord.x * cellSize + offsetLeft,
                    coord.y * cellSize + offsetLeft,
                    cellSize - offsetRight,
                    cellSize - offsetRight
                );
            }

            function clear() {
                var canvasSize = cellSize * map.length;
                ctx.clearRect(0, 0, canvasSize, canvasSize);
            }

            if (endSprite != null) {
                drawEndMethod = drawEndSprite;
            } else {
                drawEndMethod = drawEndFlag;
            }

            clear();
            drawMap();
            drawEndMethod();
        }

        // Kelas untuk objek pemain
        function Player(maze, c, _cellsize, onComplete, sprite = null) {
            var ctx = c.getContext("2d");
            var drawSprite;
            var moves = 0;

            drawSprite = drawSpriteCircle;
            if (sprite != null) {
                drawSprite = drawSpriteImg;
            }

            var player = this;
            var map = maze.map();
            var cellCoords = {
                x: maze.startCoord().x,
                y: maze.startCoord().y
            };
            var cellSize = _cellsize;
            var halfCellSize = cellSize / 2;

            this.redrawPlayer = function (_cellsize) {
                cellSize = _cellsize;
                drawSpriteImg(cellCoords);
            };

            function drawSpriteCircle(coord) {
                ctx.beginPath();
                ctx.fillStyle = "yellow";
                ctx.arc(
                    (coord.x + 1) * cellSize - halfCellSize,
                    (coord.y + 1) * cellSize - halfCellSize,
                    halfCellSize - 2,
                    0,
                    2 * Math.PI
                );
                ctx.fill();

                if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
                    onComplete(moves);
                    player.unbindKeyDown();
                }
            }

            function drawSpriteImg(coord) {
                var offsetLeft = cellSize / 50;
                var offsetRight = cellSize / 25;
                ctx.drawImage(
                    sprite,
                    0,
                    0,
                    sprite.width,
                    sprite.height,
                    coord.x * cellSize + offsetLeft,
                    coord.y * cellSize + offsetLeft,
                    cellSize - offsetRight,
                    cellSize - offsetRight
                );

                if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
                    onComplete(moves);
                    player.unbindKeyDown();
                }
            }

            function removeSprite(coord) {
                var offsetLeft = cellSize / 50;
                var offsetRight = cellSize / 25;
                ctx.clearRect(
                    coord.x * cellSize + offsetLeft,
                    coord.y * cellSize + offsetLeft,
                    cellSize - offsetRight,
                    cellSize - offsetRight
                );
            }

            function check(e) {
                var cell = map[cellCoords.x][cellCoords.y];
                moves++;

                switch (e.keyCode) {
                    case 65:
                    case 37: // west
                        if (cell.w == true) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x - 1,
                                y: cellCoords.y
                            };
                            drawSprite(cellCoords);
                        }
                        break;
                    case 87:
                    case 38: // north
                        if (cell.n == true) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x,
                                y: cellCoords.y - 1
                            };
                            drawSprite(cellCoords);
                        }
                        break;
                    case 68:
                    case 39: // east
                        if (cell.e == true) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x + 1,
                                y: cellCoords.y
                            };
                            drawSprite(cellCoords);
                        }
                        break;
                    case 83:
                    case 40: // south
                        if (cell.s == true) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x,
                                y: cellCoords.y + 1
                            };
                            drawSprite(cellCoords);
                        }
                        break;
                }

                if (coord.x === foodCoord.x && coord.y === foodCoord.y) {
                    score += 10; // Menambah skor sebesar 10 (sesuaikan dengan logika permainan Anda)
                    document.getElementById("score").innerHTML = "Skor: " + score; // Memperbarui tampilan skor

                    // Generate new random position for food
                    foodCoord = {
                        x: getRandomNumber(0, difficulty - 1),
                        y: getRandomNumber(0, difficulty - 1)
                    };

                    // Draw the new food position
                    ctx.drawImage(foodImage, foodCoord.x * cellSize, foodCoord.y * cellSize, cellSize, cellSize);
                }
            }

            this.bindKeyDown = function () {
                window.addEventListener("keydown", check, false);
            };

            this.unbindKeyDown = function () {
                window.removeEventListener("keydown", check, false);
            };

            drawSprite(maze.startCoord());
            this.bindKeyDown();
        }

        // Fungsi untuk membuat maze baru dan memulai permainan
        function makeMaze() {
            if (player != undefined) {
                player.unbindKeyDown();
                player = null;
            }

            var e = document.getElementById("diffSelect");
            difficulty = parseInt(e.options[e.selectedIndex].value);
            cellSize = mazeCanvas.width / difficulty;
            maze = new Maze(difficulty, difficulty);
            draw = new DrawMaze(maze, ctx, cellSize, finishSprite);

            // Load food image
            foodImage = new Image();
            foodImage.src = "path_to_food_image";
            foodImage.onload = function () {
                foodImage = changeBrightness(1.1, foodImage);
                // Generate random position for food
                foodCoord = {
                    x: getRandomNumber(0, difficulty - 1),
                    y: getRandomNumber(0, difficulty - 1)
                };
                // Draw the food position
                ctx.drawImage(foodImage, foodCoord.x * cellSize, foodCoord.y * cellSize, cellSize, cellSize);
            };

            player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
        }

        // Fungsi untuk menampilkan pesan kemenangan
        function displayVictoryMess(moves) {
            document.getElementById("moves").innerHTML = "Anda Melakukan " + moves + " Langkah.";
            toggleVisibility("message-container");
        }

        // Fungsi untuk toggle visibility elemen HTML
        function toggleVisibility(id) {
            var element = document.getElementById(id);
            if (element.style.visibility === "visible") {
                element.style.visibility = "hidden";
            } else {
                element.style.visibility = "visible";
            }
        }

        // Fungsi untuk mengatur ulang permainan
        function restartGame() {
            toggleVisibility("message-container");
            score = 0;
            document.getElementById("score").innerHTML = "Skor: " + score;
            makeMaze();
        }

        // Menjalankan permainan saat halaman dimuat
        window.onload = function () {
            mazeCanvas.width = mazeCanvas.offsetWidth;
            mazeCanvas.height = mazeCanvas.offsetWidth;

            sprite = new Image();
            sprite.src = "path_to_sprite_image";
            sprite.onload = function () {
                sprite = changeBrightness(1.2, sprite);
                finishSprite = new Image();
                finishSprite.src = "path_to_finish_sprite_image";
                finishSprite.onload = function () {
                    finishSprite = changeBrightness(1.1, finishSprite);
                    makeMaze();
                };
            };
        };

        // Menangani perubahan ukuran jendela untuk mengatur ulang tampilan maze dan pemain
        window.onresize = function () {
            mazeCanvas.width = mazeCanvas.offsetWidth;
            mazeCanvas.height = mazeCanvas.offsetWidth;
            cellSize = mazeCanvas.width / difficulty;

            if (player != null) {
                draw.redrawMaze(cellSize);
                player.redrawPlayer(cellSize);
            }
        };