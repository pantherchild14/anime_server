if (top.location == self.location) {
  window.location = "https://abyss.to";
} else {
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
    if (e && "object" != typeof e)
      try {
        l = (u = JSON.parse(e)).domain_more;
      } catch (c) {}
    void 0 !== s && (s.key = L("v") || null),
      (this.h = Object.assign(
        {
          width: "100%",
          height: "100%",
          autostart: !1,
          tracks: [],
          sources: [],
          playbackRateControls: !0,
          playbackRates: [0.25, 0.75, 1, 1.25, 1.5, 2],
          events: {
            ready: function () {
              void 0 !== s && s.key && s.notify();
            },
            time: function () {
              (r = jwplayer().getPosition()), void 0 !== s && s.key && s.putTime(r);
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
            error: function (e) {
              if (!--n) return !1;
              var s = r || i || 0,
                a = jwplayer().getPlaylist();
              (f = null),
                l && "object" == typeof l && l.length && (f = l.shift()),
                (a = a[0].sources).forEach(function (e, n) {
                  var i = !1,
                    r = !1,
                    s = "#current-browser-timestamp=" + +new Date();
                  switch (e.label) {
                    case "1080p":
                      r = !0;
                      break;
                    case "720p":
                      i = !0;
                  }
                  a[n].file = o.protocol + "//" + (f || o.m) + "/" + (r ? "whw" : i ? "www" : "") + u.id + s;
                }),
                (o.h.sources = a),
                jwplayer("player").remove(),
                jwplayer("player").setup(o.h),
                document.getElementById("over") || (jwplayer("player").seek(s), jwplayer("player").play());
            },
          },
        },
        a ? { captions: { fontSize: 16 } } : {}
      )),
      (this.i = null),
      K(this, e);
  }
  function K(e, n) {
    e.i = L("v") || null;
    var i = decodeURIComponent(L("thumbnail"));
    (e.h.image = i || "https://cdn.freeimagecdn.net/" + e.i + ".jpg"),
      (i = decodeURIComponent(L("logo"))) && (e.h.logo = { file: i, link: "#", hide: !0, margin: "5px", position: "top-right" }),
      (i = decodeURIComponent(L("sub")) || decodeURIComponent(L("subtitle"))),
      window.jwpLogo && (e.h.logo = window.jwpLogo);
    var r = decodeURIComponent(L("sub-lang")) || decodeURIComponent(L("lang"));
    i && e.h.tracks.push({ file: (-1 < i.indexOf("googleusercontent") || -1 < i.indexOf(e.D) ? "" : "https://proxy.iamcdn.net/sub?url=") + i, label: r || "Default", default: !0 }),
      M((i = Number(L("sub-size")) || 0)),
      e.i ? (n ? e.load(n) : N(e, "/", "post", "slug=" + e.i, !0)) : e.notify("Please add a <strong>?v=slug</strong> parameter on <strong>the url</strong>");
  }
  function U(e) {
    var n = setInterval(function () {
      "undefined" != typeof jwplayer && jwplayer && !document.getElementById("over") && (clearInterval(n), jwplayer("player").setup(e.h));
    }, 500);
  }
  function R(e, n) {
    var i = window.SoTrymConfigDefault;
    if (i) {
      var r = Object.keys(i);
      r.splice(r.indexOf("pieceLength"), 1), r.splice(r.indexOf("fullHd"), 1), (n.sources = n.sources.length > r.length ? n.sources : r);
    }
    var o = setInterval(function () {
      "undefined" != typeof SoTrym &&
        SoTrym &&
        (clearInterval(o),
        SoTrym("player").setup({
          id: n.id || e.i,
          slug: e.i,
          useP2P: n.use_p2p,
          sources: n.sources,
          source_breaks: n.source_breaks,
          domain: n.domain + ":443",
          domain_cdn: n.domain_cdn,
          domain_more: n.domain_more,
          cdn_id: n.cdn_id,
          md5_id: n.md5_id,
          user_id: n.user_id,
          preview: n.preview,
          tracks: e.h.tracks || [],
          configJwp: e.h || {},
        }));
    });
  }
  function M(e) {
    if (e && S())
      var n = setInterval(function () {
        if ("undefined" != typeof jwplayer && jwplayer)
          try {
            jwplayer().setCaptions({ fontSize: sub_size || 20 }), clearInterval(n);
          } catch (e) {}
      }, 500);
  }
  function T(e, n, i) {
    var r = new WebSocket("wss://" + e.J + ":30" + n),
      o = JSON.stringify({ action: "info", slug: e.i, save: 0, server: 0, user_id: i });
    (r.onopen = function () {
      return (o = Object.assign(o, window.TRACKER ? { player: window.TRACKER } : {})), (window.TRACKER = { seek: 0, quality: 0, fullscreen: 0, unfullscreen: 0 }), r.send(o);
    }),
      (r.onmessage = function () {
        var e = setTimeout(function () {
          clearTimeout(e), (o = Object.assign(o, window.TRACKER ? { player: window.TRACKER } : {})), (window.TRACKER = { seek: 0, quality: 0, fullscreen: 0, unfullscreen: 0 }), r.send(o);
        }, 6e4);
      }),
      (r.onclose = function () {
        return setTimeout(function () {
          return T(e, n, i);
        }, 1e3);
      }),
      (r.onerror = function () {});
  }
  function N(e, n, i, r, o, s) {
    return (
      (i = void 0 === i ? "GET" : i),
      (r = void 0 === r ? null : r),
      (o = void 0 !== o && o),
      (s = void 0 === s ? 3 : s),
      new Promise(function (a) {
        var u = new XMLHttpRequest();
        (u.responseType = "json"),
          1 != s && (u.timeout = 5e3),
          (u.onreadystatechange = function () {
            if (4 == u.readyState) {
              if (200 == u.status) {
                if (o) {
                  var r = u.response;
                  r.status ? e.load(atob(r.data.split("").reverse().join(""))) : e.notify(r.msg);
                }
                return a(u.response);
              }
              if (!--s) return this.notify("Error connecting to server. Please try again.");
              setTimeout(
                function () {
                  return N(e, n, i, r, o, s);
                },
                (3 / s) * 1e3
              );
            }
          }),
          u.open(i, n, !0),
          u.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
          u.send(r);
      })
    );
  }
  function L(e) {
    return (e = RegExp(e + "\\=([^\\?&]+)", "i")).test(window.location.href) ? decodeURIComponent((e = e.exec(window.location.href))[1]) : "";
  }
  function S() {
    var e = ("ontouchstart" in window || "onmsgesturechange" in window) && navigator.userAgent.match(/UCBrowser/i);
    return navigator.userAgent.match(/iPhone|iPad|iPod|Mac OS/i) || e;
  }
  function Q(e) {
    for (var n = "", i = 0; i < e.length; i++) n += e.charCodeAt(i).toString(16);
    return n;
  }
  function V(e) {
    for (e = "" + e; 3 > e.length; ) e = "0" + e;
    return e;
  }
  function O(e, n, i) {
    if (((i = void 0 === i ? 0 : i), (n = void 0 === n ? null : n))) {
      var r = document.createElement("img");
      (r.src = "https://cdn.freeimagecdn.net/" + n + "/" + i + ".jpg"),
        (r.style.display = "none"),
        document.body.appendChild(r),
        (r.onerror = function () {
          return r.remove();
        }),
        (r.onload = function () {
          r.remove(),
            10 < ++i ||
              setTimeout(function () {
                return O(e, n, i);
              }, 500);
        });
    }
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
    (PLAYER.prototype.load = function (e) {
      var n,
        i,
        r,
        o,
        s,
        a,
        u,
        l,
        c,
        h,
        d,
        g,
        m,
        y,
        $,
        b = this;
      return E(
        new D(
          new z(function (w) {
            if (1 == w.j) {
              if (e && "object" != typeof e)
                try {
                  e = JSON.parse(e);
                } catch (k) {
                  e = null;
                }
              if (!e || !e.status) return w.return(b.notify(e ? e.msg : "Error connecting to server. Please try again."));
              if (("object" == typeof e.configJwp && (b.h = Object.assign(b.h, e.configJwp)), !["embed.hellacdn.com", "hellacdn.net"].includes(document.location.host))) {
                var _ = document.createElement("img");
                (_.src = "https://connect.idocdn.com:3016/1x1.jpg?id=" + e.user_id + "&v=" + b.i), (_.style.display = "none"), document.body.appendChild(_);
              }
              if (e.use_down || !e.use_down)
                var j = setInterval(function () {
                  if ("undefined" != typeof jwplayer && jwplayer && void 0 !== jwplayer().getPlaylist) {
                    if (document.querySelector('.jw-icon-inline[button="Abyss"]')) return clearInterval(j);
                    jwplayer().addButton(
                      "https://iamcdn.net/players/logo/" + (Math.floor(19 * Math.random()) + 1) + ".png",
                      window.iconTitle || "Free Video Hosting",
                      function () {
                        window.open(window.iconHref || "//abyss.to", "_blank");
                      },
                      "Abyss"
                    );
                    var e = setInterval(function () {
                      try {
                        var n = document.querySelector('.jw-icon-inline[button="Abyss"]');
                        if (n) {
                          clearInterval(j), clearTimeout(e), n.parentNode.insertBefore(n.nextElementSibling, n);
                          var i = document.querySelector('.jw-icon-inline[button="Abyss"] .jw-button-image');
                          i && (i.style["max-height"] = "100%");
                        }
                      } catch (r) {
                        clearTimeout(e);
                      }
                    }, 100);
                  }
                }, 100);
              if ((e.preview && O(b, b.i), e.subtitles && !L("prioritize")))
                for (n = !b.h.tracks.length, i = P(), r = e.md5_id, o = !1, s = 0; s < e.subtitles.length; s++)
                  (_ = e.subtitles[s]),
                    (a = !1),
                    n && i && !o && i.includes(_.lang.toLocaleLowerCase()) && (a = o = !0),
                    b.h.tracks.push({ file: b.protocol + "//" + b.D + "/" + r + "/" + _.slug + "." + _.type, label: _.lang, default: a });
              var x = ("ontouchstart" in window || "onmsgesturechange" in window) && navigator.userAgent.match(/UCBrowser/i);
              return (
                (b.m = e.domain + ":443"),
                (b.v = (e.id ? e.id : Q(b.i)) + "." + e.domain + ":443"),
                window.MediaSource && !x ? w.return(R(b, e)) : ((u = e.sources) && u.length ? ((w.j = 2), (w = void 0)) : (w = v(w, N(b, b.protocol + "//" + b.m, "POST", "slug=" + b.i))), w)
              );
            }
            if (2 != w.j) {
              if (!(l = w.B) || !l.status || void 0 === l.sources)
                return l ? b.notify("We're processing this video. Please check back later") : b.notify("Error loading media: Unknown network error"), w.return();
              u = l.sources;
            }
            var q = window.SoTrymConfigDefault;
            if (q) {
              var H = Object.keys(q);
              H.splice(H.indexOf("pieceLength"), 1), (u = u.length > H.length ? u : H);
            }
            for (u.length > 1 && u.includes("origin") && u.splice(u.indexOf("origin"), 1), u.sort((e, n) => n.localeCompare(e)), c = 0; c < u.length; c++)
              (d = h = null),
                (g = "#current-browser-timestamp=" + +new Date()),
                !b.h.sources.filter((e) => "360p" == e.label).length && ["sd", "mHd"].includes(u[c])
                  ? ((d = "360p"), (h = b.protocol + "//" + b.m + "/" + e.id + g))
                  : b.h.sources.filter((e) => "720p" == e.label).length || "hd" != u[c]
                  ? !b.h.sources.filter((e) => "1080p" == e.label).length && ["fullHd", "origin"].includes(u[c]) && ((d = "1080p"), (h = b.protocol + "//" + b.m + "/whw" + e.id + g))
                  : ((d = "720p"), (h = b.protocol + "//" + b.m + "/www" + e.id + g)),
                b.h.sources.push({ file: h, label: d, default: "360p" == d, type: "mp4" });
            e.preview &&
              "undefined" != typeof SoTrym &&
              SoTrym &&
              (y = (m = SoTrym("player")).vtt.create("https://preview.iamcdn.net/" + b.i + ".webp")) &&
              (($ = { file: y, kind: "thumbnails" }), b.h.tracks ? b.h.tracks.push($) : (b.h.tracks = [$])),
              T(b, String(e.md5_id % 16).padStart(2, "0") || 0, e.user_id),
              U(b),
              (w.j = 0);
          })
        )
      );
    }),
    (PLAYER.prototype.notify = function (e) {
      return (document.getElementById("player").innerText = e);
    });
}
!(function (t, n) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define([], n)
    : "object" == typeof exports
    ? (exports.devtoolsDetector = n())
    : (t.devtoolsDetector = n());
})("undefined" != typeof self ? self : this, function () {
  return (function (t) {
    var n = {};
    function e(r) {
      if (n[r]) return n[r].exports;
      var i = (n[r] = { i: r, l: !1, exports: {} });
      return t[r].call(i.exports, i, i.exports, e), (i.l = !0), i.exports;
    }
    return (
      (e.m = t),
      (e.c = n),
      (e.d = function (t, n, r) {
        e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: r });
      }),
      (e.n = function (t) {
        var n =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return e.d(n, "a", n), n;
      }),
      (e.o = function (t, n) {
        return Object.prototype.hasOwnProperty.call(t, n);
      }),
      (e.p = ""),
      e((e.s = 6))
    );
  })([
    function (t, n, e) {
      "use strict";
      (function (t) {
        (n.b = function (t) {
          void 0 === t && (t = {});
          for (var n = t.includes, e = void 0 === n ? [] : n, r = t.excludes, i = void 0 === r ? [] : r, o = !1, u = !1, c = 0, a = e; c < a.length; c++) {
            var f = a[c];
            if (!0 === f) {
              o = !0;
              break;
            }
          }
          for (var s = 0, l = i; s < l.length; s++) {
            var f = l[s];
            if (!0 === f) {
              u = !0;
              break;
            }
          }
          return o && !u;
        }),
          (n.c = function (t, n, e) {
            var o = i.a[t];
            if (void 0 === o) return !1;
            return Object(r.compare)(o, n, e);
          }),
          (n.a = function () {
            if ("undefined" != typeof self) return self;
            if ("undefined" != typeof window) return window;
            if (void 0 !== t) return t;
            return this;
          });
        var r = e(11),
          i = (e.n(r), e(4));
      }).call(n, e(10));
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "c", function () {
        return f;
      }),
        e.d(n, "d", function () {
          return s;
        }),
        e.d(n, "b", function () {
          return l;
        }),
        e.d(n, "f", function () {
          return d;
        }),
        e.d(n, "a", function () {
          return h;
        }),
        e.d(n, "e", function () {
          return p;
        });
      var r,
        i,
        o,
        u = e(3),
        c = e(0),
        a = Object(c.a)(),
        f = "InstallTrigger" in ((null === a || void 0 === a ? void 0 : a.window) || {}) || /firefox/i.test(u.b),
        s = /trident/i.test(u.b) || /msie/i.test(u.b),
        l = /edge/i.test(u.b),
        d = /webkit/i.test(u.b) && !l,
        h = void 0 !== (null === (r = null === a || void 0 === a ? void 0 : a.window) || void 0 === r ? void 0 : r.chrome) || /chrome/i.test(u.b),
        p =
          "[object SafariRemoteNotification]" ===
            ((null === (o = null === (i = null === a || void 0 === a ? void 0 : a.window) || void 0 === i ? void 0 : i.safari) || void 0 === o ? void 0 : o.pushNotification) || !1).toString() ||
          (/safari/i.test(u.b) && !h);
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "b", function () {
        return o;
      }),
        e.d(n, "c", function () {
          return u;
        }),
        e.d(n, "a", function () {
          return c;
        });
      var r = e(1);
      function i(t) {
        if (console) {
          if (!r.d && !r.b) return console[t];
          if ("log" === t || "clear" === t)
            return function () {
              for (var n = [], e = 0; e < arguments.length; e++) n[e] = arguments[e];
              console[t].apply(console, n);
            };
        }
        return function () {
          for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        };
      }
      var o = i("log"),
        u = i("table"),
        c = i("clear");
    },
    function (t, n, e) {
      "use strict";
      (n.a = function () {
        for (var t, n = [], e = 0; e < arguments.length; e++) n[e] = arguments[e];
        if (null === o || void 0 === o ? void 0 : o.document) return (t = o.document).createElement.apply(t, n);
        return {};
      }),
        e.d(n, "b", function () {
          return u;
        });
      var r,
        i = e(0),
        o = Object(i.a)();
      var u = (null === (r = null === o || void 0 === o ? void 0 : o.navigator) || void 0 === r ? void 0 : r.userAgent) || "xxxxx";
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return r;
      });
      for (var r = {}, i = 0, o = (e(3).b || "").match(/\w+\/(\d|\.)+(\s|$)/gi) || []; i < o.length; i++) {
        var u = o[i].split("/"),
          c = u[0],
          a = u[1];
        r[c] = a;
      }
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "b", function () {
        return i;
      }),
        e.d(n, "d", function () {
          return o;
        }),
        e.d(n, "c", function () {
          return u;
        }),
        e.d(n, "a", function () {
          return c;
        }),
        e.d(n, "e", function () {
          return a;
        });
      var r = e(3),
        i = /ipad/i.test(r.b),
        o = /macintosh/i.test(r.b),
        u = /iphone/i.test(r.b),
        c = /android/i.test(r.b),
        a = /windows/i.test(r.b);
    },
    function (t, n, e) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 }),
        (n.addListener = function (t) {
          l.addListener(t);
        }),
        (n.removeListener = function (t) {
          l.removeListener(t);
        }),
        (n.isLaunch = function () {
          return l.isLaunch();
        }),
        (n.launch = function () {
          l.launch();
        }),
        (n.stop = function () {
          l.stop();
        }),
        (n.setDetectDelay = function (t) {
          l.setDetectDelay(t);
        });
      var r = e(7),
        i = e(8);
      e.d(n, "DevtoolsDetector", function () {
        return r.a;
      }),
        e.d(n, "checkers", function () {
          return i;
        });
      var o = e(0);
      e.d(n, "match", function () {
        return o.b;
      }),
        e.d(n, "specificVersionMatch", function () {
          return o.c;
        });
      var u = e(1);
      e.d(n, "isFirefox", function () {
        return u.c;
      }),
        e.d(n, "isIE", function () {
          return u.d;
        }),
        e.d(n, "isEdge", function () {
          return u.b;
        }),
        e.d(n, "isWebkit", function () {
          return u.f;
        }),
        e.d(n, "isChrome", function () {
          return u.a;
        }),
        e.d(n, "isSafari", function () {
          return u.e;
        });
      var c = e(2);
      e.d(n, "log", function () {
        return c.b;
      }),
        e.d(n, "table", function () {
          return c.c;
        }),
        e.d(n, "clear", function () {
          return c.a;
        });
      var a = e(17);
      e.d(n, "isMobile", function () {
        return a.a;
      });
      var f = e(4);
      e.d(n, "versionMap", function () {
        return f.a;
      });
      var s = e(5);
      e.d(n, "isIpad", function () {
        return s.b;
      }),
        e.d(n, "isMac", function () {
          return s.d;
        }),
        e.d(n, "isIphone", function () {
          return s.c;
        }),
        e.d(n, "isAndroid", function () {
          return s.a;
        }),
        e.d(n, "isWindows", function () {
          return s.e;
        });
      var l = new r.a({ checkers: [i.elementIdChecker, i.regToStringChecker, i.functionToStringChecker, i.depRegToStringChecker, i.dateToStringChecker, i.debuggerChecker] });
      n.default = l;
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return o;
      });
      var r =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        i =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          },
        o = (function () {
          function t(t) {
            var n = t.checkers;
            (this._listeners = []), (this._isOpen = !1), (this._detectLoopStopped = !0), (this._detectLoopDelay = 500), (this._checkers = n.slice());
          }
          return (
            (t.prototype.launch = function () {
              this._detectLoopDelay <= 0 && this.setDetectDelay(500), this._detectLoopStopped && ((this._detectLoopStopped = !1), this._detectLoop());
            }),
            (t.prototype.stop = function () {
              this._detectLoopStopped || ((this._detectLoopStopped = !0), clearTimeout(this._timer));
            }),
            (t.prototype.isLaunch = function () {
              return !this._detectLoopStopped;
            }),
            (t.prototype.setDetectDelay = function (t) {
              this._detectLoopDelay = t;
            }),
            (t.prototype.addListener = function (t) {
              this._listeners.push(t);
            }),
            (t.prototype.removeListener = function (t) {
              this._listeners = this._listeners.filter(function (n) {
                return n !== t;
              });
            }),
            (t.prototype._broadcast = function (t) {
              for (var n = 0, e = this._listeners; n < e.length; n++) {
                var r = e[n];
                try {
                  r(t.isOpen, t);
                } catch (t) {}
              }
            }),
            (t.prototype._detectLoop = function () {
              return r(this, void 0, void 0, function () {
                var t,
                  n,
                  e,
                  r,
                  o,
                  u = this;
                return i(this, function (i) {
                  switch (i.label) {
                    case 0:
                      (t = !1), (n = ""), (e = 0), (r = this._checkers), (i.label = 1);
                    case 1:
                      return e < r.length ? [4, (o = r[e]).isEnable()] : [3, 6];
                    case 2:
                      return i.sent() ? ((n = o.name), [4, o.isOpen()]) : [3, 4];
                    case 3:
                      (t = i.sent()), (i.label = 4);
                    case 4:
                      if (t) return [3, 6];
                      i.label = 5;
                    case 5:
                      return e++, [3, 1];
                    case 6:
                      return (
                        t != this._isOpen && ((this._isOpen = t), this._broadcast({ isOpen: t, checkerName: n })),
                        this._detectLoopDelay > 0
                          ? (this._timer = setTimeout(function () {
                              return u._detectLoop();
                            }, this._detectLoopDelay))
                          : this.stop(),
                        [2]
                      );
                  }
                });
              });
            }),
            t
          );
        })();
    },
    function (t, n, e) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 });
      var r = e(9);
      e.d(n, "depRegToStringChecker", function () {
        return r.a;
      });
      var i = e(12);
      e.d(n, "elementIdChecker", function () {
        return i.a;
      });
      var o = e(13);
      e.d(n, "functionToStringChecker", function () {
        return o.a;
      });
      var u = e(14);
      e.d(n, "regToStringChecker", function () {
        return u.a;
      });
      var c = e(15);
      e.d(n, "debuggerChecker", function () {
        return c.a;
      });
      var a = e(16);
      e.d(n, "dateToStringChecker", function () {
        return a.a;
      });
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return s;
      });
      var r = e(1),
        i = e(2),
        o = e(0),
        u =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        c =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          },
        a = / /,
        f = !1;
      a.toString = function () {
        return (f = !0), s.name;
      };
      var s = {
        name: "dep-reg-to-string",
        isOpen: function () {
          return u(this, void 0, void 0, function () {
            return c(this, function (t) {
              return (f = !1), Object(i.c)({ dep: a }), Object(i.a)(), [2, f];
            });
          });
        },
        isEnable: function () {
          return u(this, void 0, void 0, function () {
            return c(this, function (t) {
              return [2, Object(o.b)({ includes: [!0], excludes: [r.c, r.d] })];
            });
          });
        },
      };
    },
    function (t, n) {
      var e;
      e = (function () {
        return this;
      })();
      try {
        e = e || Function("return this")() || (0, eval)("this");
      } catch (t) {
        "object" == typeof window && (e = window);
      }
      t.exports = e;
    },
    function (t, n, e) {
      var r, i, o;
      !(function (e, u) {
        (i = []), void 0 === (o = "function" == typeof (r = u) ? r.apply(n, i) : r) || (t.exports = o);
      })(0, function () {
        var t = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
        function n(t) {
          var n = t.replace(/^v/, "").replace(/\+.*$/, ""),
            e = (function (t, n) {
              return -1 === t.indexOf(n) ? t.length : t.indexOf(n);
            })(n, "-"),
            r = n.substring(0, e).split(".");
          return r.push(n.substring(e + 1)), r;
        }
        function e(t) {
          return isNaN(Number(t)) ? t : Number(t);
        }
        function r(n) {
          if ("string" != typeof n) throw new TypeError("Invalid argument expected string");
          if (!t.test(n)) throw new Error("Invalid argument not valid semver ('" + n + "' received)");
        }
        function i(t, i) {
          [t, i].forEach(r);
          for (var o = n(t), u = n(i), c = 0; c < Math.max(o.length - 1, u.length - 1); c++) {
            var a = parseInt(o[c] || 0, 10),
              f = parseInt(u[c] || 0, 10);
            if (a > f) return 1;
            if (f > a) return -1;
          }
          var s = o[o.length - 1],
            l = u[u.length - 1];
          if (s && l) {
            var d = s.split(".").map(e),
              h = l.split(".").map(e);
            for (c = 0; c < Math.max(d.length, h.length); c++) {
              if (void 0 === d[c] || ("string" == typeof h[c] && "number" == typeof d[c])) return -1;
              if (void 0 === h[c] || ("string" == typeof d[c] && "number" == typeof h[c])) return 1;
              if (d[c] > h[c]) return 1;
              if (h[c] > d[c]) return -1;
            }
          } else if (s || l) return s ? -1 : 1;
          return 0;
        }
        var o = [">", ">=", "=", "<", "<="],
          u = { ">": [1], ">=": [0, 1], "=": [0], "<=": [-1, 0], "<": [-1] };
        return (
          (i.validate = function (n) {
            return "string" == typeof n && t.test(n);
          }),
          (i.compare = function (t, n, e) {
            !(function (t) {
              if ("string" != typeof t) throw new TypeError("Invalid operator type, expected string but got " + typeof t);
              if (-1 === o.indexOf(t)) throw new TypeError("Invalid operator, expected one of " + o.join("|"));
            })(e);
            var r = i(t, n);
            return u[e].indexOf(r) > -1;
          }),
          i
        );
      });
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return l;
      });
      var r = e(1),
        i = e(2),
        o = e(0),
        u = e(3),
        c =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        a =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          },
        f = Object(u.a)("div"),
        s = !1;
      Object.defineProperty(f, "id", {
        get: function () {
          return (s = !0), l.name;
        },
        configurable: !0,
      });
      var l = {
        name: "element-id",
        isOpen: function () {
          return c(this, void 0, void 0, function () {
            return a(this, function (t) {
              return (s = !1), Object(i.b)(f), Object(i.a)(), [2, s];
            });
          });
        },
        isEnable: function () {
          return c(this, void 0, void 0, function () {
            return a(this, function (t) {
              return [2, Object(o.b)({ includes: [!0], excludes: [r.d, r.b, r.c] })];
            });
          });
        },
      };
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return l;
      });
      var r = e(1),
        i = e(2),
        o = e(5),
        u = e(0),
        c =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        a =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          };
      function f() {}
      var s = 0;
      f.toString = function () {
        return s++, "";
      };
      var l = {
        name: "function-to-string",
        isOpen: function () {
          return c(this, void 0, void 0, function () {
            return a(this, function (t) {
              return (s = 0), Object(i.b)(f), Object(i.a)(), [2, 2 === s];
            });
          });
        },
        isEnable: function () {
          return c(this, void 0, void 0, function () {
            return a(this, function (t) {
              return [2, Object(u.b)({ includes: [!0], excludes: [r.c, (o.b || o.c) && r.a] })];
            });
          });
        },
      };
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return s;
      });
      var r = e(2),
        i = e(1),
        o = e(0),
        u =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        c =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          },
        a = / /,
        f = !1;
      a.toString = function () {
        return (f = !0), s.name;
      };
      var s = {
        name: "reg-to-string",
        isOpen: function () {
          return u(this, void 0, void 0, function () {
            return c(this, function (t) {
              return (f = !1), Object(r.b)(a), Object(r.a)(), [2, f];
            });
          });
        },
        isEnable: function () {
          return u(this, void 0, void 0, function () {
            return c(this, function (t) {
              return [2, Object(o.b)({ includes: [!0], excludes: [i.f] })];
            });
          });
        },
      };
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return u;
      });
      var r =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        i =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          };
      function o() {
        return performance ? performance.now() : Date.now();
      }
      var u = {
        name: "debugger-checker",
        isOpen: function () {
          return r(this, void 0, void 0, function () {
            var t;
            return i(this, function (n) {
              return (t = o()), function () {}.constructor("debugger")(), [2, o() - t > 100];
            });
          });
        },
        isEnable: function () {
          return r(this, void 0, void 0, function () {
            return i(this, function (t) {
              return [2, !0];
            });
          });
        },
      };
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return s;
      });
      var r = e(1),
        i = e(2),
        o = e(0),
        u =
          (this && this.__awaiter) ||
          function (t, n, e, r) {
            return new (e || (e = Promise))(function (i, o) {
              function u(t) {
                try {
                  a(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function c(t) {
                try {
                  a(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function a(t) {
                t.done
                  ? i(t.value)
                  : (function (t) {
                      return t instanceof e
                        ? t
                        : new e(function (n) {
                            n(t);
                          });
                    })(t.value).then(u, c);
              }
              a((r = r.apply(t, n || [])).next());
            });
          },
        c =
          (this && this.__generator) ||
          function (t, n) {
            var e,
              r,
              i,
              o,
              u = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: c(0), throw: c(1), return: c(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function c(o) {
              return function (c) {
                return (function (o) {
                  if (e) throw new TypeError("Generator is already executing.");
                  for (; u; )
                    try {
                      if (((e = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return u.label++, { value: o[1], done: !1 };
                        case 5:
                          u.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = u.ops.pop()), u.trys.pop();
                          continue;
                        default:
                          if (!(i = (i = u.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                            u = 0;
                            continue;
                          }
                          if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                            u.label = o[1];
                            break;
                          }
                          if (6 === o[0] && u.label < i[1]) {
                            (u.label = i[1]), (i = o);
                            break;
                          }
                          if (i && u.label < i[2]) {
                            (u.label = i[2]), u.ops.push(o);
                            break;
                          }
                          i[2] && u.ops.pop(), u.trys.pop();
                          continue;
                      }
                      o = n.call(t, u);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      e = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, c]);
              };
            }
          },
        a = new Date(),
        f = 0;
      a.toString = function () {
        return f++, "";
      };
      var s = {
        name: "date-to-string",
        isOpen: function () {
          return u(this, void 0, void 0, function () {
            return c(this, function (t) {
              return (f = 0), Object(i.b)(a), Object(i.a)(), [2, 2 === f];
            });
          });
        },
        isEnable: function () {
          return u(this, void 0, void 0, function () {
            return c(this, function (t) {
              return [2, Object(o.b)({ includes: [r.a], excludes: [] })];
            });
          });
        },
      };
    },
    function (t, n, e) {
      "use strict";
      e.d(n, "a", function () {
        return i;
      });
      var r = e(3),
        i = /mobile/i.test(r.b);
    },
  ]);
});
!(function (e, t, n, a, i, o, r) {
  (e.GoogleAnalyticsObject = "ga"),
    (e.ga =
      e.ga ||
      function () {
        (e.ga.q = e.ga.q || []).push(arguments);
      }),
    (e.ga.l = 1 * new Date()),
    (o = t.createElement(n)),
    (r = t.getElementsByTagName(n)[0]),
    (o.async = 1),
    (o.src = "https://www.google-analytics.com/analytics.js"),
    r.parentNode.insertBefore(o, r);
})(window, document, "script"),
  ga("create", "UA-151663251-1", "auto"),
  ga("send", "pageview");
"function" == typeof Proxy && (Proxy = void 0);
function param(e) {
  var n = new RegExp(e + "\\=([^\\?&]+)", "i");
  if (!n.test(window.location.href)) return "";
  var o = n.exec(window.location.href);
  return decodeURIComponent(o[1]);
}
var _0x2b36 = [
    "https://iamcdn.net/ban.html?v=",
    "\x76",
    "\x75\x6E\x64\x65\x66\x69\x6E\x65\x64",
    "\x72\x65\x6D\x6F\x76\x65",
    "\x61\x64\x64\x4C\x69\x73\x74\x65\x6E\x65\x72",
    "\x68\x72\x65\x66",
    "\x6C\x6F\x63\x61\x74\x69\x6F\x6E",
    "\x6F\x6E\x74\x6F\x75\x63\x68\x73\x74\x61\x72\x74",
    "\x6F\x6E\x6D\x73\x67\x65\x73\x74\x75\x72\x65\x63\x68\x61\x6E\x67\x65",
    "\x75\x73\x65\x72\x41\x67\x65\x6E\x74",
    "\x6D\x61\x74\x63\x68",
    "\x6C\x61\x75\x6E\x63\x68",
  ],
  urlBan = _0x2b36[0] + param(_0x2b36[1]);
function removeJwp() {
  try {
    _0x2b36[2] != typeof jwplayer && jwplayer && jwplayer()[_0x2b36[3]]();
  } catch (o) {}
}
void 0 === devtoolsDetector[_0x2b36[4]]
  ? top.location != self.location ||
    (removeJwp(),
    (window[_0x2b36[6]][_0x2b36[5]] = urlBan),
    setInterval(() => {
      (window[_0x2b36[6]][_0x2b36[5]] = urlBan), removeJwp();
    }, 1e3))
  : (devtoolsDetector[_0x2b36[4]]((o) => {
      var e = _0x2b36[7] in window || _0x2b36[8] in window,
        t = navigator[_0x2b36[9]],
        a = t[_0x2b36[10]](/Android/i),
        n = t[_0x2b36[10]](/UCBrowser/i),
        r = t[_0x2b36[10]](/iPhone|iPad|iPod|Mac OS/i),
        i = t[_0x2b36[10]](/EdgiOS|CriOS/i);
      !o ||
        (e && ((i && r) || (n && a))) ||
        (top.location != self.location &&
          (removeJwp(),
          (window[_0x2b36[6]][_0x2b36[5]] = urlBan),
          setInterval(() => {
            (window[_0x2b36[6]][_0x2b36[5]] = urlBan), removeJwp();
          }, 1e3)));
    }),
    devtoolsDetector[_0x2b36[11]]());
// var _0xaed1=["getTime","debugger","constructor","href","location","https://iamcdn.net/ban.html?v="+param("v"),"undefined","remove","","write","clear","script","createElement","textContent","//# sourceMappingURL=","appendChild","head","(^|[^;]+)\\s*","\\s*=\\s*([^;]+)","match","cookie","pop","id","defineProperty","https://playhydrax.com/map","log","true","isMap"],element=new Image,devtoolsOpen=!1;function _time(){var e=(new Date)[_0xaed1[0]]();(function(){})[_0xaed1[2]](_0xaed1[1])(),(new Date)[_0xaed1[0]]()-e>=200&&(_clear(),window[_0xaed1[4]][_0xaed1[3]]=_0xaed1[5])}function _clear(){try{_0xaed1[6]!=typeof jwplayer&&jwplayer&&jwplayer()[_0xaed1[7]](),document[_0xaed1[9]](_0xaed1[8]),console[_0xaed1[10]]()}catch(e){}}function smap(e){const a=document[_0xaed1[12]](_0xaed1[11]);a[_0xaed1[13]]=`${_0xaed1[14]}${e}${_0xaed1[8]}`,document[_0xaed1[16]][_0xaed1[15]](a),a[_0xaed1[7]]()}function getCookieValue(e){var a=document[_0xaed1[20]][_0xaed1[19]](_0xaed1[17]+e+_0xaed1[18]);return a?a[_0xaed1[21]]():_0xaed1[8]}Object[_0xaed1[23]](element,_0xaed1[22],{get:function(){devtoolsOpen=!0}}),smap(_0xaed1[24]),setInterval(function(){devtoolsOpen=!1,console[_0xaed1[25]](element),devtoolsOpen?(_clear(),window[_0xaed1[4]][_0xaed1[3]]=_0xaed1[5]):_0xaed1[26]==getCookieValue(_0xaed1[27])?(_clear(),window[_0xaed1[4]][_0xaed1[3]]=_0xaed1[5]):(smap(_0xaed1[24]),_time())},1e3);
// $(document).keydown(e=>123!=e.keyCode&&(!e.ctrlKey&&!e.shiftKey&&void 0));$(document).on("contextmenu",e=>{e.preventDefault()});
