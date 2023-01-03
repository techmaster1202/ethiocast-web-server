var video;
var loadedUri;
var player;
var arrowTimeOut = null;
var key;
var firstAdCall = false;
var goFullScreen = false;
var type;
var playersetup = false;

function isStreamHls(uri) {
  var splitUri = uri.split('?');
  var extension = splitUri[0].split('.').pop();
  if (extension.indexOf('m3u8') >= 0) {
    return true;
  } else {
    return false;
  }
}
function initVideoJS(uri, drm, ref, textTracks, streamType) {
  if (uri == loadedUri) { return }
  $(document).ready(function () {
    if (uri == 'http://' || uri == 'https://') {
      $('#' + ref).hide();
      $('#imgup').hide();
      $('#imgdown').hide();
    } else {
      $('#' + ref).show();
      if (streamType != "MUSIC") {
        if (ref == "player") {
          if (isStreamHls(uri) == false) {
            initShakaPlayer(uri, ref, drm, textTracks);
          } else {
            initVideoJsPlayer(uri, ref, drm, textTracks);
          }
        }
      } else {
        $('#imgup').hide();
        $('#imgdown').hide();
        if (ref == "player") {
          $('#grouped').css("position", "absolute");
          $('#grouped').css("zIndex", "-1");
          initVideoJsPlayer(uri, ref, drm, textTracks);
        }
      }
    }
  })
}
function killVideoJSPlayer() {
  $(document).ready(function () {

    loadedUri = null;
    selected_track = 0;
    playersetup = false;

  })
}
function setRemoteTextTracks(textTracks) {
  if (textTracks == undefined) { return }
  textTracks.forEach((element) => {
    player.addTextTrack(element.uri, 'eng', 'subtitle', 'text/vtt', '', element.title);
  })
}
function log(msg) {
  var logsEl = document.getElementById('logs');
  var current = logsEl.innerHTML;
  if (msg) {
    logsEl.innerHTML = current + '' + msg + '<br />';
  }
}

//VideoJS for playback of HLS since Shake is no good at it
function initVideoJsPlayer(uri, ref, drm, textTracks) {
  console.log('videojs')
  loadedUri = uri;
  video = document.getElementById(ref);

  $('#grouped').css('background-color', "#1d1d1d");

  $('#video_html5_api').css("height", "100%");
  $('#video_html5_api').css("width", "100%");

  $('.player-dimensions').css("width", "100%");
  $('.player-dimensions').css("height", "100%");

  $('#player').css("width", "100%");
  $('#player').css("height", "100%");

  player = videojs(video, {
    html5: {
      nativeCaptions: false,
      nativeTextTracks: false
    },
    controlBar: {
      'pictureInPictureToggle': true
    },
    preloadWebComponents: true,
    textTrackSettings: true,
    controls: false,
    autoplay: true
  });



  var splitUri = uri.split('?');
  var extension = splitUri[0].split('.').pop();
  if (extension.indexOf('m3u8') >= 0) {
    player.src({ src: uri, type: 'application/x-mpegurl' });
  }
  if (extension.indexOf('mpd') >= 0) {
    player.src({ src: uri, type: 'application/dash+xml' });
  }
  if (extension.indexOf('mp4') >= 0) {
    player.src({ src: uri, type: 'video/mp4' });
  }
  if (extension.indexOf('mp3') >= 0) {
    player.src({ src: uri, type: 'audio/mp3' });
  }
}
function setupCastingAndStart() {
  const cjs = new Castjs();
  if (cjs.available) {
    cjs.cast(loadedUri);
  }
  cjs.on('connect', () => {
    if (isStreamHls(loadedUri) == false) {
      video.pause();
    } else {
      player.pause();
    }
  });
  cjs.on('disconnect', () => {
    if (isStreamHls(loadedUri) == false) {
      video.play();
    } else {
      player.play();
    }
  });
}

async function initShakaPlayer(uri, ref, drm, textTracks) {
  if (playersetup == false) {
    playersetup = true;
    initShakaPlayer_(uri, ref, drm, textTracks);
  } else {
    player.unload().then(function () {
      playersetup = true;
      initShakaPlayer_(uri, ref, drm, textTracks);
    });
  };
}
//Shaka for DASH, MP and DRM
async function initShakaPlayer_(uri, ref, drm, textTracks) {
  shaka.polyfill.installAll();
  console.log('shaka')
  loadedUri = uri;
  video = document.getElementById(ref);
  player = new shaka.Player(video);
  window.player = player;
  if (drm != undefined && drm != '') {
    if (drm.licenseServer != '' && drm.supplier == 'irdeto') {
      player.configure({
        drm: {
          servers: {
            'com.widevine.alpha': drm.licenseServer,
          }
        }
      })
    }
    if (drm.licenseServer != '' && drm.supplier == 'buydrm') {
      player.configure({
        drm: {
          servers: {
            'com.widevine.alpha': drm.licenseServer,
          },
        }
      });
      player.getNetworkingEngine().registerRequestFilter(function (type, request) {
        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
          request.headers['customData'] = drm.headers.customData;
        }
      });
    }
  }
  try {
    $('.shaka-controls-container').css('opacity', '1');
    $('#grouped').css('background-color', "#1d1d1d");
    await player.load(uri);
    setRemoteTextTracks(textTracks);
  } catch (e) {
    console.log(e)
  }
}
function setScreenSize(type) {
  if (type == "stretch") { type = "fill" }
  if (isStreamHls(loadedUri) == true) {
    $('#player_html5_api').css("object-fit", type)
  } else {
    $('#player').css("object-fit", type)
  }
}
function goFullScreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}




function setTrack(id, type) {
  if (type == "audio") {
    var tracks = player.audioTracks();
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.enabled = false;
      if (track.label === id) {
        track.enabled = true;
      }
    }
  }
  if (type == "subs") {
    var tracks = player.textTracks();
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      if ((track.kind == 'subtitles' || track.kind == 'captions') && track.label == id) {
        track.mode = 'showing';
      } else {
        track.mode = "hidden";
      }
    }
  }
}
function setUserAgent(window, userAgent) {
  // Works on Firefox, Chrome, Opera and IE9+
  if (navigator.__defineGetter__) {
    navigator.__defineGetter__('userAgent', function () {
      return userAgent;
    });
  } else if (Object.defineProperty) {
    Object.defineProperty(navigator, 'userAgent', {
      get: function () {
        return userAgent;
      }
    });
  }
  // Works on Safari
  if (window.navigator.userAgent !== userAgent) {
    var userAgentProp = {
      get: function () {
        return userAgent;
      }
    };
    try {
      Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
    } catch (e) {
      window.navigator = Object.create(navigator, {
        userAgent: userAgentProp
      });
    }
  }
}