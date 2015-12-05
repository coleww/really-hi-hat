(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.AudioContext = window.AudioContext || window.webkitAudioContext
var ac = new AudioContext()
var synth = require('./')(ac)
// just connect and start the synth to make sure it plays, edit as needed!
synth.connect(ac.destination)
console.log('boop')
setInterval(function () {
console.log('boop')
synth.start(ac.currentTime)
}, 1000)

},{"./":2}],2:[function(require,module,exports){
var makeDistortionCurve = require('make-distortion-curve')
var adsr = require('a-d-s-r')
// yr function should accept an audioContext, and optional params/opts
module.exports = function (ac, opts) {
  // make some audioNodes, connect them, store them on the object
  var audioNodes = {
    one: ac.createOscillator(),
    two: ac.createOscillator(),
    three: ac.createOscillator(),
    four: ac.createOscillator(),
    five: ac.createOscillator(),
    six: ac.createOscillator(),
    maingain: ac.createGain(),
    distortion: ac.createWaveShaper(),
    bandfilter: ac.createBiquadFilter(),
    highfilter: ac.createBiquadFilter(),
    delay: ac.createDelay(0.05),
    dgain: ac.createGain(),
    envelope: ac.createGain(),
    settings: {
      attack: 0.02,
      decay: 0.03,
      sustain: 0.000001,
      release: 0.3,
      peak: 0.7,
      mid: 0.25,
      end: 0.00001
    }
  }

  audioNodes.one.type = 'square'
  audioNodes.one.frequency.setValueAtTime(80, ac.currentTime)
  audioNodes.two.type = 'square'
  audioNodes.two.frequency.setValueAtTime(115, ac.currentTime)
  audioNodes.three.type = 'square'
  audioNodes.three.frequency.setValueAtTime(165, ac.currentTime)
  audioNodes.four.type = 'square'
  audioNodes.four.frequency.setValueAtTime(250, ac.currentTime)
  audioNodes.five.type = 'square'
  audioNodes.five.frequency.setValueAtTime(340, ac.currentTime)
  audioNodes.six.type = 'square'
  audioNodes.six.frequency.setValueAtTime(420, ac.currentTime)

  audioNodes.maingain.gain.value = 0.75 / 6.0

  audioNodes.distortion.curve = makeDistortionCurve(333)

  audioNodes.bandfilter.type = 'bandpass'
  audioNodes.bandfilter.frequency.setValueAtTime(10420, ac.currentTime)

  audioNodes.highfilter.type = 'highpass'
  audioNodes.highfilter.frequency.setValueAtTime(6660, ac.currentTime)

  audioNodes.dgain.gain.value = 0.5

  audioNodes.envelope.gain.setValueAtTime(0, ac.currentTime)

  audioNodes.one.connect(audioNodes.maingain)
  audioNodes.two.connect(audioNodes.maingain)
  audioNodes.three.connect(audioNodes.maingain)
  audioNodes.four.connect(audioNodes.maingain)
  audioNodes.five.connect(audioNodes.maingain)
  audioNodes.six.connect(audioNodes.maingain)
  audioNodes.maingain.connect(audioNodes.distortion)
  audioNodes.distortion.connect(audioNodes.bandfilter)
  audioNodes.bandfilter.connect(audioNodes.highfilter)
  audioNodes.highfilter.connect(audioNodes.delay)
  audioNodes.delay.connect(audioNodes.dgain)
  audioNodes.dgain.connect(audioNodes.envelope)

  audioNodes.one.start(ac.currentTime)
  audioNodes.two.start(ac.currentTime)
  audioNodes.three.start(ac.currentTime)
  audioNodes.four.start(ac.currentTime)
  audioNodes.five.start(ac.currentTime)
  audioNodes.six.start(ac.currentTime)
  return {
    connect: function (input) {
      audioNodes.envelope.connect(input)
    },
    start: function (when) {
      // //this function should call `start(when)` on yr source nodes. Probably oscillators/samplers i guess, and any LFO too!
      adsr(audioNodes.envelope, when, audioNodes.settings)
    },
    stop: function (when) {
      // // same thing as start but with `stop(when)`
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
      audioNodes.source.stop(when)
    },
    update: function (opts) {
      // optional: for performing high-level updates on the instrument.
      Object.keys(opts).forEach(function (k) {
        var v = opts[k]
        // ????
      })
    },
    nodes: function () {
      // returns an object of `{stringKey: audioNode}` for raw manipulation
      return audioNodes
    }
  }
}
},{"a-d-s-r":3,"make-distortion-curve":4}],3:[function(require,module,exports){
module.exports = function (gainNode, when, adsr) {
  gainNode.gain.exponentialRampToValueAtTime(adsr.peak, when + adsr.attack)
  gainNode.gain.exponentialRampToValueAtTime(adsr.mid, when + adsr.attack + adsr.decay)
  gainNode.gain.setValueAtTime(adsr.mid, when + adsr.sustain + adsr.attack + adsr.decay)
  gainNode.gain.exponentialRampToValueAtTime(adsr.end, when + adsr.sustain + adsr.attack + adsr.decay + adsr.release)
}

},{}],4:[function(require,module,exports){
module.exports = function(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZGVtby5qcyIsImluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2EtZC1zLXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWFrZS1kaXN0b3J0aW9uLWN1cnZlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0XG52YXIgYWMgPSBuZXcgQXVkaW9Db250ZXh0KClcbnZhciBzeW50aCA9IHJlcXVpcmUoJy4vJykoYWMpXG4vLyBqdXN0IGNvbm5lY3QgYW5kIHN0YXJ0IHRoZSBzeW50aCB0byBtYWtlIHN1cmUgaXQgcGxheXMsIGVkaXQgYXMgbmVlZGVkIVxuc3ludGguY29ubmVjdChhYy5kZXN0aW5hdGlvbilcbmNvbnNvbGUubG9nKCdib29wJylcbnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbmNvbnNvbGUubG9nKCdib29wJylcbnN5bnRoLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxufSwgMTAwMClcbiIsInZhciBtYWtlRGlzdG9ydGlvbkN1cnZlID0gcmVxdWlyZSgnbWFrZS1kaXN0b3J0aW9uLWN1cnZlJylcbnZhciBhZHNyID0gcmVxdWlyZSgnYS1kLXMtcicpXG4vLyB5ciBmdW5jdGlvbiBzaG91bGQgYWNjZXB0IGFuIGF1ZGlvQ29udGV4dCwgYW5kIG9wdGlvbmFsIHBhcmFtcy9vcHRzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhYywgb3B0cykge1xuICAvLyBtYWtlIHNvbWUgYXVkaW9Ob2RlcywgY29ubmVjdCB0aGVtLCBzdG9yZSB0aGVtIG9uIHRoZSBvYmplY3RcbiAgdmFyIGF1ZGlvTm9kZXMgPSB7XG4gICAgb25lOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgdHdvOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgdGhyZWU6IGFjLmNyZWF0ZU9zY2lsbGF0b3IoKSxcbiAgICBmb3VyOiBhYy5jcmVhdGVPc2NpbGxhdG9yKCksXG4gICAgZml2ZTogYWMuY3JlYXRlT3NjaWxsYXRvcigpLFxuICAgIHNpeDogYWMuY3JlYXRlT3NjaWxsYXRvcigpLFxuICAgIG1haW5nYWluOiBhYy5jcmVhdGVHYWluKCksXG4gICAgZGlzdG9ydGlvbjogYWMuY3JlYXRlV2F2ZVNoYXBlcigpLFxuICAgIGJhbmRmaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIGhpZ2hmaWx0ZXI6IGFjLmNyZWF0ZUJpcXVhZEZpbHRlcigpLFxuICAgIGRlbGF5OiBhYy5jcmVhdGVEZWxheSgwLjA1KSxcbiAgICBkZ2FpbjogYWMuY3JlYXRlR2FpbigpLFxuICAgIGVudmVsb3BlOiBhYy5jcmVhdGVHYWluKCksXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGF0dGFjazogMC4wMixcbiAgICAgIGRlY2F5OiAwLjAzLFxuICAgICAgc3VzdGFpbjogMC4wMDAwMDEsXG4gICAgICByZWxlYXNlOiAwLjMsXG4gICAgICBwZWFrOiAwLjcsXG4gICAgICBtaWQ6IDAuMjUsXG4gICAgICBlbmQ6IDAuMDAwMDFcbiAgICB9XG4gIH1cblxuICBhdWRpb05vZGVzLm9uZS50eXBlID0gJ3NxdWFyZSdcbiAgYXVkaW9Ob2Rlcy5vbmUuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDgwLCBhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy50d28udHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMudHdvLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgxMTUsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLnRocmVlLnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLnRocmVlLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgxNjUsIGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLmZvdXIudHlwZSA9ICdzcXVhcmUnXG4gIGF1ZGlvTm9kZXMuZm91ci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMjUwLCBhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5maXZlLnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLmZpdmUuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDM0MCwgYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMuc2l4LnR5cGUgPSAnc3F1YXJlJ1xuICBhdWRpb05vZGVzLnNpeC5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoNDIwLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm1haW5nYWluLmdhaW4udmFsdWUgPSAwLjc1IC8gNi4wXG5cbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSgzMzMpXG5cbiAgYXVkaW9Ob2Rlcy5iYW5kZmlsdGVyLnR5cGUgPSAnYmFuZHBhc3MnXG4gIGF1ZGlvTm9kZXMuYmFuZGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMTA0MjAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMuaGlnaGZpbHRlci50eXBlID0gJ2hpZ2hwYXNzJ1xuICBhdWRpb05vZGVzLmhpZ2hmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDY2NjAsIGFjLmN1cnJlbnRUaW1lKVxuXG4gIGF1ZGlvTm9kZXMuZGdhaW4uZ2Fpbi52YWx1ZSA9IDAuNVxuXG4gIGF1ZGlvTm9kZXMuZW52ZWxvcGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBhYy5jdXJyZW50VGltZSlcblxuICBhdWRpb05vZGVzLm9uZS5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMudHdvLmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy50aHJlZS5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMuZm91ci5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMuZml2ZS5jb25uZWN0KGF1ZGlvTm9kZXMubWFpbmdhaW4pXG4gIGF1ZGlvTm9kZXMuc2l4LmNvbm5lY3QoYXVkaW9Ob2Rlcy5tYWluZ2FpbilcbiAgYXVkaW9Ob2Rlcy5tYWluZ2Fpbi5jb25uZWN0KGF1ZGlvTm9kZXMuZGlzdG9ydGlvbilcbiAgYXVkaW9Ob2Rlcy5kaXN0b3J0aW9uLmNvbm5lY3QoYXVkaW9Ob2Rlcy5iYW5kZmlsdGVyKVxuICBhdWRpb05vZGVzLmJhbmRmaWx0ZXIuY29ubmVjdChhdWRpb05vZGVzLmhpZ2hmaWx0ZXIpXG4gIGF1ZGlvTm9kZXMuaGlnaGZpbHRlci5jb25uZWN0KGF1ZGlvTm9kZXMuZGVsYXkpXG4gIGF1ZGlvTm9kZXMuZGVsYXkuY29ubmVjdChhdWRpb05vZGVzLmRnYWluKVxuICBhdWRpb05vZGVzLmRnYWluLmNvbm5lY3QoYXVkaW9Ob2Rlcy5lbnZlbG9wZSlcblxuICBhdWRpb05vZGVzLm9uZS5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy50d28uc3RhcnQoYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMudGhyZWUuc3RhcnQoYWMuY3VycmVudFRpbWUpXG4gIGF1ZGlvTm9kZXMuZm91ci5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgYXVkaW9Ob2Rlcy5maXZlLnN0YXJ0KGFjLmN1cnJlbnRUaW1lKVxuICBhdWRpb05vZGVzLnNpeC5zdGFydChhYy5jdXJyZW50VGltZSlcbiAgcmV0dXJuIHtcbiAgICBjb25uZWN0OiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIGF1ZGlvTm9kZXMuZW52ZWxvcGUuY29ubmVjdChpbnB1dClcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgLy8gLy90aGlzIGZ1bmN0aW9uIHNob3VsZCBjYWxsIGBzdGFydCh3aGVuKWAgb24geXIgc291cmNlIG5vZGVzLiBQcm9iYWJseSBvc2NpbGxhdG9ycy9zYW1wbGVycyBpIGd1ZXNzLCBhbmQgYW55IExGTyB0b28hXG4gICAgICBhZHNyKGF1ZGlvTm9kZXMuZW52ZWxvcGUsIHdoZW4sIGF1ZGlvTm9kZXMuc2V0dGluZ3MpXG4gICAgfSxcbiAgICBzdG9wOiBmdW5jdGlvbiAod2hlbikge1xuICAgICAgLy8gLy8gc2FtZSB0aGluZyBhcyBzdGFydCBidXQgd2l0aCBgc3RvcCh3aGVuKWBcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICAgIGF1ZGlvTm9kZXMuc291cmNlLnN0b3Aod2hlbilcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgIC8vIG9wdGlvbmFsOiBmb3IgcGVyZm9ybWluZyBoaWdoLWxldmVsIHVwZGF0ZXMgb24gdGhlIGluc3RydW1lbnQuXG4gICAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHZhciB2ID0gb3B0c1trXVxuICAgICAgICAvLyA/Pz8/XG4gICAgICB9KVxuICAgIH0sXG4gICAgbm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHJldHVybnMgYW4gb2JqZWN0IG9mIGB7c3RyaW5nS2V5OiBhdWRpb05vZGV9YCBmb3IgcmF3IG1hbmlwdWxhdGlvblxuICAgICAgcmV0dXJuIGF1ZGlvTm9kZXNcbiAgICB9XG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChnYWluTm9kZSwgd2hlbiwgYWRzcikge1xuICBnYWluTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoYWRzci5wZWFrLCB3aGVuICsgYWRzci5hdHRhY2spXG4gIGdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZShhZHNyLm1pZCwgd2hlbiArIGFkc3IuYXR0YWNrICsgYWRzci5kZWNheSlcbiAgZ2Fpbk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZShhZHNyLm1pZCwgd2hlbiArIGFkc3Iuc3VzdGFpbiArIGFkc3IuYXR0YWNrICsgYWRzci5kZWNheSlcbiAgZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKGFkc3IuZW5kLCB3aGVuICsgYWRzci5zdXN0YWluICsgYWRzci5hdHRhY2sgKyBhZHNyLmRlY2F5ICsgYWRzci5yZWxlYXNlKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhbW91bnQpIHtcbiAgdmFyIGsgPSB0eXBlb2YgYW1vdW50ID09PSAnbnVtYmVyJyA/IGFtb3VudCA6IDUwLFxuICAgIG5fc2FtcGxlcyA9IDQ0MTAwLFxuICAgIGN1cnZlID0gbmV3IEZsb2F0MzJBcnJheShuX3NhbXBsZXMpLFxuICAgIGRlZyA9IE1hdGguUEkgLyAxODAsXG4gICAgaSA9IDAsXG4gICAgeDtcbiAgZm9yICggOyBpIDwgbl9zYW1wbGVzOyArK2kgKSB7XG4gICAgeCA9IGkgKiAyIC8gbl9zYW1wbGVzIC0gMTtcbiAgICBjdXJ2ZVtpXSA9ICggMyArIGsgKSAqIHggKiAyMCAqIGRlZyAvICggTWF0aC5QSSArIGsgKiBNYXRoLmFicyh4KSApO1xuICB9XG4gIHJldHVybiBjdXJ2ZTtcbn1cbiJdfQ==
