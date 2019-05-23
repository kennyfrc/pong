function Ball() {
  // .call calls the function now
  // and applies its default values there
  Entity.call(this)
  
  // this overrides the default values
  this.width = 20
  this.height = 20

  this.reset()

  // Load sound to the call
  // The HTMLMediaElement.canPlayType() method 
  // determines whether the specified media type can be played back
  this.blip = new Audio()
  if (this.blip.canPlayType('audio/mpeg')) {
    this.blip.src = 'blip.mp3'
  } else {
    this.blip.src = 'blip.ogg'
  }
}

// ball is an object of the entity prototype
Ball.prototype = Object.create(Entity.prototype)
Ball.prototype.constructor = Ball

// Reset the ball's position
Ball.prototype.reset = function() {
  // center it horizontally
  this.x = game.width / 2 - this.width / 2
  // center it vertically
  this.y = game.height / 2 - this.height / 2

  // A simple way to start in a random direction
  // var max = 5, min = -5
  // this.yVelocity = Math.floor(Math.random() * (max - min + 1) + min)
  // this.xVelocity = 5

  // A better way to launch the ball at a random angle
  var minAngle = -30,
      maxAngle = 30,
      angle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle
  // Convert angle to x,y coordinates
  var radian = Math.PI / 180,
      speed = 7
  this.xVelocity = speed * Math.cos(angle * radian)
  this.yVelocity = speed * Math.sin(angle * radian)

  // Alternate between right and left
  if (Math.random() > 0.5) this.xVelocity *= -1
}

// this updates the original definition of Entitity.update just for ball
Ball.prototype.update = function() {
  // apply the update function in a given context
  Entity.prototype.update.apply(this, arguments) // this is like invoking super

  // Detects if and which paddle we hit
  if (this.intersect(game.player)) {
    var hitter = game.player
  } else if (this.intersect(game.bot)) {
    var hitter = game.bot
  }

  // Hits a paddle
  // hitter = player or bot depending on the intersection
  // 
  if (hitter) {
    this.xVelocity *= -1.1 // Rebound and increase speed
    this.yVelocity *= 1.1

    // Transfer some of the paddle vertical velocity to the ball
    // adding spin by moving your paddle as you hit it
    this.yVelocity += hitter.yVelocity / 4
    // play audio
    this.blip.play()
  }

  // Rebound if it hits top or bottom
  // < 0 is top, game.height is bottom
  if (this.y < 0 || this.y + this.height > game.height) {
    // flip the velocity
    this.yVelocity *= -1 // rebound, switch direction

    // play audio
    this.blip.play()
  }

  // Off screen on left. Bot wins.
  // reset the ball if it goes off-screen
  if (this.x < -this.width) {
    game.bot.score += 1
    this.reset()
  }

  // Off screen on right. Player wins.
  // reset the ball if it goes off-screen
  if (this.x > game.width) {
    game.player.score += 1
    this.reset()
  }
}