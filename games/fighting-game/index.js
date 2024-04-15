const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const GRAVITY = 0.7

const backgroundImage = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'img/background.png'
})

const shopSprite = new Sprite({
    position: {
        x: 640,
        y: 146
    },
    imageSrc: 'img/shop.png',
    scale: 2.6,
    maxFrames: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: 'img/samuraiMack/Idle.png',
    scale: 2.5,
    maxFrames: 8,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: 'img/samuraiMack/Idle.png',
            maxFrames: 8
        },
        run: {
            imageSrc: 'img/samuraiMack/Run.png',
            maxFrames: 8
        },
        jump: {
            imageSrc: 'img/samuraiMack/Jump.png',
            maxFrames: 2
        },
        fall: {
            imageSrc: 'img/samuraiMack/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imageSrc: 'img/samuraiMack/Attack1.png',
            maxFrames: 6
        },
        takeHit: {
            imageSrc: 'img/samuraiMack/Take Hit - white silhouette.png',
            maxFrames: 4
        },
        death: {
            imageSrc: 'img/samuraiMack/Death.png',
            maxFrames: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: 'img/kenji/Idle.png',
    scale: 2.5,
    maxFrames: 4,
    offset: {
        x: 215,
        y: 169
    },
    sprites: {
        idle: {
            imageSrc: 'img/kenji/Idle.png',
            maxFrames: 4
        },
        run: {
            imageSrc: 'img/kenji/Run.png',
            maxFrames: 8
        },
        jump: {
            imageSrc: 'img/kenji/Jump.png',
            maxFrames: 2
        },
        fall: {
            imageSrc: 'img/kenji/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imageSrc: 'img/kenji/Attack1.png',
            maxFrames: 4
        },
        takeHit: {
            imageSrc: 'img/kenji/Take hit.png',
            maxFrames: 3
        },
        death: {
            imageSrc: 'img/kenji/Death.png',
            maxFrames: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    backgroundImage.update()
    shopSprite.update()
    c.fillStyle = 'rgba(255, 255, 255, .15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player Movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // Jumping mechanic
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // Enemy mechanic
    if (player.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // Detect collision
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.currentFrame === 4) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('.enemy-hp').style.width = enemy.health + '%'
    }

    if (player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.currentFrame === 2) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('.player-hp').style.width = player.health + '%'
    }

    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false
    }

    // End game
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})