const socket = io();


class Game {

  constructor (pid) {
    this.pid = pid;
    this.canvas = document.querySelector('#root');
    this.cxt = this.canvas.getContext('2d');
    this.interval = 20;
    this.speed = 7;
    this.pressed = {};
    
    this.drawtimes = 0;

    socket.on('data', data => {
      this.data = data;
      for (let i in data.players) {
        if (data.players[i].id == this.pid) {
          this.player = data.players[i];
        }
      }
      this.draw();
    });

    this.controller();
    this.loop();
  }

  collide (x, w) {
    if (x + w > 600 || x < 0) {
      return true;
    }
    return false;
  }

  clear () {
    this.cxt.clearRect(0, 0, 600, 480);
  }

  draw () {
    this.clear();
    for (let i in this.data.players) {
      this.cxt.fillStyle = 'black';
      this.cxt.fillRect(...this.data.players[i].info);
    }
    
  }

  controller () {
    window.addEventListener('keydown', e => {
      this.pressed[e.key || e.which] = true;
    }, true)
    window.addEventListener('keyup', e => {
      this.pressed[e.key || e.which] = false;
    }, true)
  }

  loop () {
    setInterval(() => {
      var posx = this.player.info[0]
      var w = this.player.info[2]
      if (this.pressed.ArrowLeft) {
        posx -= this.speed;
      }
      if (this.pressed.ArrowRight) {
        posx += this.speed;
      }
      if (posx !== this.player.info[0]) {
        let collision = this.collide(posx, w);
        if (!collision) {
          this.player.info[0] = posx;
          socket.emit('update', this.player);
          // this.draw();
        }
        
      }
    }, this.interval);
  }

}

socket.on('id', id => {
  const game = new Game(id);
})