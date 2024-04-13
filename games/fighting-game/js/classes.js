class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1 }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.maxFrames = maxFrames
        this.currentFrame = 0
        this.elapsedFrames = 0
        this.holdFrames = 25 // Frame velocity
    }

    draw() {
        c.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.maxFrames),
            0,
            this.image.width / this.maxFrames,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.maxFrames) * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        this.draw()
        // Shop animation

        this.elapsedFrames++

        if (this.elapsedFrames % this.holdFrames === 0) {
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
}

class Fighter {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Attack box
        if (player.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
        } else {
            this.velocity.y += GRAVITY
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}