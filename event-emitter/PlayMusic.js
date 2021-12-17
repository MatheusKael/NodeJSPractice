const EventEmitter = require("events");

// Goal -> Take audio from youtube videos of music and play it

class PlayMusic extends EventEmitter {
  playing = false;

  constructor() {
    super();
  }

  play(song) {
    this.emit("play", song);
  }
  stop() {
    this.emit("stop");
  }

  listener() {
    this.on("play", (song) => {
      this.playing = true;
      console.log(`Now playing ${song}`);
    });
    this.on("stop", () => {
      this.playing = false;
    });
  }
}

const music = new PlayMusic();

music.listener();
music.play("song1");
