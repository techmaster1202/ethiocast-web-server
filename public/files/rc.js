window.addEventListener('load', function () {
  SpatialNavigation.init();
  SpatialNavigation.add({
    selector: 'input, .r-userSelect-lrvibr, .r-lrvibr'
  });
  SpatialNavigation.makeFocusable();
  SpatialNavigation.focus();
});

var inputFocussed = false;
var enclosingDiv = null;
$t = null;

var isMobile = {
  isPhone: function () {
    var md = new MobileDetect(window.navigator.userAgent);
    return md.phone() == null ? false : true;
  },
  isTablet: function () {
    var md = new MobileDetect(window.navigator.userAgent);
    return md.tablet() == null ? false : true;
  },
  isPWA: function () {
    return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');
  },
  Samsung: function () {
    return navigator.userAgent.match(/SamsungBrowser/i);
  },
  Chrome: function () {
    return navigator.userAgent.match(/CriOS/i);
  },
  ChromeAndroid: function () {
    return navigator.userAgent.match(/Chrome/i);
  },
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    //alert(navigator.userAgent)
    return navigator.userAgent.match(/iPhone|iPad|iPod|Version/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

$(document).ready(function () {
  //we moeten device info portrait of landscape zetten denk ik
  var md = new MobileDetect(window.navigator.userAgent);
  if (md.phone() != null) {
    style = document.createElement('style');
    style.id = "custom-styles";
    document.head.appendChild(style);
    style.innerHTML = "@media only screen and (orientation:landscape) { body { height: 100vw; transform: rotate(90deg);}}";
    if (!isMobile.isPWA()) {
      if (window.innerHeight < window.innerWidth) {
        alert('This page is best viewed in Portrait Orientation');
      }
    }
  }
  if (md.tablet() != null) {
    style = document.createElement('style');
    style.id = "custom-styles";
    document.head.appendChild(style);
    style.innerHTML = "@media only screen and (orientation:portrait) { body { height: 100vw;transform: rotate(0deg);}}";
    if (!isMobile.isPWA()) {
      if (window.innerHeight > window.innerWidth) {
        alert('This page is best viewed in Landscape Orientation');
      }
    }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      }, function (err) {
      }).catch(function (err) {

      });
    });
  }
});

window.addEventListener("orientationchange", function (event) {
  var md = new MobileDetect(window.navigator.userAgent);
  if (md.phone() || md.tablet()) {
    if (document.title.indexOf('Player: ') < 0) {
      location.reload();
    }
  }
});

document.onkeydown = function (event) {
  if (event.keyCode == 13) {
    if (jQuery(':focus').find("input").length > 0) {
      enclosingDiv = jQuery(':focus')
      jQuery(':focus').find("input").focus();
      inputFocussed = true;
    }
  }
  if (event.keyCode != 13 && inputFocussed == true && event.keyCode == "37" || event.keyCode == "38" || event.keyCode == "39" || event.keyCode == "40") {
    if (enclosingDiv) {
      jQuery(':focus').blur();
      enclosingDiv.focus();
      inputFocussed = false;
      enclosingDiv = null;
    }
  }
}

$(window).resize(function () {
  var md = new MobileDetect(window.navigator.userAgent);
  if (!md.phone() && !md.tablet()) {
    if (document.title.indexOf('Player: ') < 0) {
      location.reload();
    }
  }
});