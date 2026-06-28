document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');

    const gridSize = 20;
    const canvasSize = 400;
    let snake;
    let food;
    let score;
    let direction;
    let gameInterval;
    let gameSpeed = 150; // milliseconds

    function initGame() {
        snake = [
            { x: 10, y: 10 }, // head
        ];
        food = {};
        score = 0;
        direction = 'right';
        scoreDisplay.textContent = score;
        clearInterval(gameInterval);
        gameSpeed = 150;
        generateFood();
        gameInterval = setInterval(gameLoop, gameSpeed);
    }

    function generateFood() {
        let newFoodPosition;
        while (true) {
            newFoodPosition = {
                x: Math.floor(Math.random() * (canvasSize / gridSize)),
                y: Math.floor(Math.random() * (canvasSize / gridSize))
            };
            let collisionWithSnake = false;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === newFoodPosition.x && snake[i].y === newFoodPosition.y) {
                    collisionWithSnake = true;
                    break;
                }
            }
            if (!collisionWithSnake) {
                food = newFoodPosition;
                break;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i === 0) ? '#2ecc71' : '#27ae60';
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#1a242f';
            ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }

        // Draw food
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = '#1a242f';
        ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        const head = { x: snake[0].x, y: snake[0].y };

        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        snake.unshift(head);

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = score;
            generateFood();
            // Increase speed slightly
            gameSpeed = Math.max(50, gameSpeed - 5); // Minimum speed of 50ms
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= (canvasSize / gridSize) ||
            head.y < 0 || head.y >= (canvasSize / gridSize)) {
            return true;
        }

        // Self-collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
    }

    function gameLoop() {
        moveSnake();
        if (checkCollision()) {
            gameOver();
        } else {
            draw();
        }
    }

    document.addEventListener('keydown', e => {
        const newDirection = e.key.replace('Arrow', '').toLowerCase();
        // Prevent immediate reverse
        if ((newDirection === 'up' && direction !== 'down') ||
            (newDirection === 'down' && direction !== 'up') ||
            (newDirection === 'left' && direction !== 'right') ||
            (newDirection === 'right' && direction !== 'left')) {
            direction = newDirection;
        }
    });

    restartButton.addEventListener('click', initGame);

    initGame();
});