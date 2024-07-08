function p() {
  (this.s = !1), (this.l = null), (this.B = void 0), (this.j = 1), (this.C = this.F = 0), (this.o = null);
}
function t(e) {
  if (e.s) throw TypeError("Generator is already running");
  e.s = !0;
}
function v(e, n) {
  return (e.j = 3), { value: n };
}
function z(e) {
  (this.g = new p()), (this.I = e);
}
function C(e, n) {
  t(e.g);
  var i = e.g.l;
  return i
    ? A(
        e,
        "return" in i
          ? i.return
          : function (e) {
              return { value: e, done: !0 };
            },
        n,
        e.g.return
      )
    : (e.g.return(n), B(e));
}
function A(e, n, i, r) {
  try {
    var o = n.call(e.g.l, i);
    if (!(o instanceof Object)) throw TypeError("Iterator result " + o + " is not an object");
    if (!o.done) return (e.g.s = !1), o;
    var s = o.value;
  } catch (a) {
    return (e.g.l = null), e.g.A(a), B(e);
  }
  return (e.g.l = null), r.call(e.g, s), B(e);
}
function B(e) {
  for (; e.g.j; )
    try {
      var n = e.I(e.g);
      if (n) return (e.g.s = !1), { value: n.value, done: !1 };
    } catch (i) {
      (e.g.B = void 0), e.g.A(i);
    }
  if (((e.g.s = !1), e.g.o)) {
    if (((n = e.g.o), (e.g.o = null), n.H)) throw n.G;
    return { value: n.return, done: !0 };
  }
  return { value: void 0, done: !0 };
}
function D(e) {
  (this.next = function (n) {
    return e.u(n);
  }),
    (this.throw = function (n) {
      return e.A(n);
    }),
    (this.return = function (n) {
      return C(e, n);
    }),
    (this[Symbol.iterator] = function () {
      return this;
    });
}
function E(e) {
  function n(n) {
    return e.next(n);
  }
  function i(n) {
    return e.throw(n);
  }
  return new Promise(function (r, o) {
    !(function e(s) {
      s.done ? r(s.value) : Promise.resolve(s.value).then(n, i).then(e, o);
    })(e.next());
  });
}
function PLAYER(e) {
  (this.protocol = location.protocol), (this.J = "connect.idocdn.com"), (this.D = "cdn1.freeimagecdn.net"), (this.domain = "ping.iamcdn.net"), (this.v = this.m = "");
  var n = 3,
    i = 0,
    r = 0,
    o = this,
    s = SoTrym("player").notifyTime,
    a = 0 != window.screenX || !!navigator.userAgent.match(/Windows NT/i),
    u = {},
    l = null;
  var jwplayerInstance = jwplayer("player");
  var startTime = null; // Thời gian bắt đầu phần .ts
  var endTime = null; // Thời gian kết thúc phần .ts

  var playerState = "idle";
  var loadedTime = 0;
  var totalSegments = 0;
  var progressBar = document.getElementById("loader");
  var defaultConfig = {
    width: "100%",
    height: "100%",

    autostart: true,
    playbackRateControls: true,
    playbackRates: [0.25, 0.75, 1, 1.25, 1.5, 2],
    sources: [
      {
        file: e,
        type: "hls",
      },
    ],
    events: {
      ready: function () {
        void 0 !== s && s.key && s.notify();
      },

      seek: function (e) {
        window.TRACKER && (window.TRACKER.seek += 1), (i = e.offset);
      },
      levelsChanged: function (e) {
        window.TRACKER && (window.TRACKER.quality += 1);
      },
      fullscreen: function (e) {
        window.TRACKER && (e.fullscreen ? (window.TRACKER.fullscreen += 1) : (window.TRACKER.unfullscreen += 1));
      },
      time: function (e) {
        loadedTime = e.seekRange.end - e.seekRange.start;
        totalSegments = e.duration;
        var completionTime = (loadedTime / totalSegments) * 100;
        // progressBar.style.display = "block"; // Hiển thị thanh tiến trình
        // progressBar.textContent = completionTime.toFixed(2) + "%";
      },
      bufferChange: function (e) {
        loadedTime = e.seekRange.end - e.seekRange.start;
        totalSegments = e.duration;
        var completionTime = (loadedTime / totalSegments) * 100;

        var bufferingElement = document.querySelector(".jw-state-buffering::after");
        bufferingElement.textContent = completionTime.toFixed(2) + "%";
      },
    },
  };

  jwplayerInstance.setup(defaultConfig);
}
function P() {
  var e = navigator.language.split("-")[0],
    n = {
      sq: ["albanian"],
      ar: ["arabic"],
      az: ["azerbaijani"],
      be: ["belarusian"],
      bg: ["bulgarian", "bulgarian english"],
      bn: ["bengali"],
      bs: ["bosnian"],
      ca: ["catalan"],
      cs: ["czech"],
      da: ["danish"],
      de: ["english german", "german"],
      el: ["greek"],
      en: ["english"],
      eo: ["esperanto"],
      es: ["spanish"],
      et: ["estonian"],
      eu: ["basque"],
      fa: ["farsipersian"],
      fi: ["finnish"],
      fr: ["french"],
      he: ["hebrew"],
      hi: ["hindi"],
      hr: ["croatian"],
      hu: ["hungarian", "hungarian english"],
      hy: ["armenian"],
      id: ["indonesian"],
      is: ["icelandic"],
      it: ["italian"],
      ja: ["japanese"],
      ka: ["georgian"],
      kl: ["greenlandic"],
      km: ["cambodian khmer"],
      kn: ["kannada"],
      ko: ["korean"],
      ku: ["kurdish"],
      lt: ["lithuanian"],
      lv: ["latvian"],
      mk: ["macedonian"],
      ml: ["malayalam"],
      mn: ["mongolian"],
      mni: ["manipuri"],
      ms: ["malay"],
      my: ["burmese"],
      nb: ["norwegian"],
      ne: ["nepali"],
      nl: ["dutch", "dutch english"],
      pa: ["punjabi"],
      pl: ["polish"],
      ps: ["pashto"],
      pt: ["brazillian portuguese", "portuguese"],
      rhg: ["rohingya"],
      ro: ["romanian"],
      ru: ["russian"],
      si: ["sinhala"],
      sk: ["slovak"],
      sl: ["slovenian"],
      so: ["somali"],
      sr: ["serbian"],
      su: ["sundanese"],
      sv: ["swedish"],
      sw: ["swahili"],
      ta: ["tamil"],
      te: ["telugu"],
      th: ["thai"],
      tl: ["tagalog"],
      tr: ["turkish"],
      uk: ["ukrainian"],
      ur: ["urdu"],
      vi: ["vietnamese"],
      yo: ["yoruba"],
      zh: ["big 5 code", "chinese bg code"],
    };
  return !!n[e] && n[e];
}
(window.TRACKER = { seek: 0, quality: 0, fullscreen: 0, unfullscreen: 0 }),
  (p.prototype.u = function (e) {
    this.B = e;
  }),
  (p.prototype.A = function (e) {
    (this.o = { G: e, H: !0 }), (this.j = this.F || this.C);
  }),
  (p.prototype.return = function (e) {
    (this.o = { return: e }), (this.j = this.C);
  }),
  (z.prototype.u = function (e) {
    return t(this.g), this.g.l ? A(this, this.g.l.next, e, this.g.u) : (this.g.u(e), B(this));
  }),
  (z.prototype.A = function (e) {
    return t(this.g), this.g.l ? A(this, this.g.l.throw, e, this.g.u) : (this.g.A(e), B(this));
  }),
  (PLAYER.prototype.notify = function (e) {
    return (document.getElementById("player").innerText = e);
  });
