const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const drums = {
  files: [
    'data/kick.wav',
    'data/snare1.wav',
    'data/hh.wav',
    'data/oh.wav',
    'data/shaker.wav',
    'data/fx1.wav',
    'data/clap.wav',
    'data/snare2.wav'
  ],
  
  audio_data: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  
  buffer_source: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  
  mute: false,
  
  choke_groups: [
    {
      leader: 2,
      follower: [3]
    }
  ],
  
  trigger: function (i) {
    if (this.mute) return;
    this.choke(i);
    
    // if playing
    if (this.buffer_source[i]!=null) this.buffer_source[i].stop(0);
    // start new voice
    this.buffer_source[i] = audioCtx.createBufferSource();
    this.buffer_source[i].buffer = this.audio_data[i];
    this.buffer_source[i].connect(audioCtx.destination);
    this.buffer_source[i].start(0);
  },
  
  stop: function (i) {
    if (this.buffer_source[i]!=null) {
      this.buffer_source[i].stop(0);
      this.buffer_source[i] = null;
    }
  },
  
  choke: function (i) {
    for (c in this.choke_groups) {
      let c_group = this.choke_groups[c];
      if (i==c_group.leader) {
        for (f in c_group.follower)
          this.stop(c_group.follower[f]);
      }
    }
  },
  
  init: function () {
    for (i in this.files) {
      // https://www.thecodecreative.com/blog/how-to-load-an-audio-file-using-fetch
      let index = i;
      fetch(this.files[index])
          .then(data => data.arrayBuffer())
          .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
          .then(decodedAudio => {
            this.audio_data[index] = decodedAudio;
          })
    }
  }

}

drums.init();