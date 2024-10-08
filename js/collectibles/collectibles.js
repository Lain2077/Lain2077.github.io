/**
 * collectibles.js - Library for adding collectible items to your website
 * @version v0.5.0
 * @link https://www.maxlaumeister.com/collectibles-js/
 * @license MIT
 */
function CollectiblesJS(e) {
    "use strict";
    const t = e.installID || 1,
        r = e.itemVersion || 1,
        n = e.persistent ? localStorage : sessionStorage,
        i = e.numItems || 5,
        o = e.theme || "keys",
        s = e.position || "left",
        a = e.keyCollectedCallback || null;
    function l(e) {
        const t = document.createElement("div");
        (t.className = "collectible-item collectible-item-collected"), (t.dataset.keyid = e);
        const r = document.createElement("div");
        return (r.className = "collectible-item-inner"), t.appendChild(r), t;
    }
    function c() {
        const e = JSON.parse(n.getItem("collectible-js-items-" + t));
        return !e || e.version < r ? new Array(i).fill(!1) : e.items;
    }
    function d(e) {
        e.every(Boolean)
            ? ((f.className = "allItems"),
              (function (e) {
                  const r = CollectiblesJS.redeemSecrets(e),
                      i = document.getElementById("collectible-secret-link");
                  (i.href = r),
                      i.addEventListener("click", function (e) {
                          n.removeItem("collectible-js-items-" + t);
                      });
              })(e))
            : (function (e) {
                  return e.some(Boolean);
              })(e) && (f.className = "someItems");
    }
    let h;
    function u(e) {
        const i = e.target,
            o = i.dataset.keyid,
            s = i.getBoundingClientRect(),
            l = p[o].getBoundingClientRect(),
            u = s.top - l.top,
            m = s.left - l.left,
            b = i.cloneNode(!0);
        (i.style.visibility = "hidden"),
            b.removeAttribute("style"),
            (b.style.visibility = "visible"),
            (b.style.position = "absolute"),
            (b.style.top = "0"),
            (b.style.left = "0"),
            (b.style["pointer-events"] = "none"),
            b.classList.add("collectible-item-collected"),
            p[o].appendChild(b),
            b.animate && b.animate({ transform: ["translate(" + m + "px, " + u + "px)", "none"] }, { duration: 500, easing: "ease-in-out" });
        const w = c();
        var g;
        (w[o] = b.dataset.key),
            (g = w),
            n.setItem("collectible-js-items-" + t, JSON.stringify({ version: r, items: g })),
            d(w),
            f.classList.add("presenting"),
            window.clearTimeout(h),
            (h = window.setTimeout(function () {
                f.classList.remove("presenting");
            }, 3e3)),
            a && a(o);
    }
    document.body.classList.add("collectible-theme-" + o), document.body.classList.add("collectible-position-" + s);
    const m = c();
    for (let e of Array.from(document.getElementsByClassName("collectible-item"))) {
        const t = document.createElement("div");
        (t.className = "collectible-item-inner"), e.appendChild(t), (e.title = "Click me!"), (e.alt = "Collectible item (Click me!)"), m[e.dataset.keyid] || (e.style.visibility = "visible"), e.addEventListener("click", u);
    }
    document.body.insertAdjacentHTML(
        "beforeend",
        '\n    <div id="collectible-item-drawer">\n        <div id="collectible-item-chest-holder">\n            <a id="collectible-secret-link">\n                <div id="collectible-item-chest"></div><br>\n                Click to<br>collect reward!\n            </a>\n        </div>\n        <div id="collectible-item-holder">\n        </div>\n    </div>'
    );
    const f = document.getElementById("collectible-item-drawer"),
        b = document.getElementById("collectible-item-holder"),
        p = [];
    for (let e = 0; e < i; e++) {
        const t = document.createElement("div");
        (t.className = "collectible-item-spot"), b.appendChild(t), p.push(t), m[e] && t.appendChild(l(e));
    }
    b.insertAdjacentHTML("beforeend", '<div class="collectible-help" aria-label="Find all ' + i + ' cryptographic keys on my site to form a secret url!" data-microtip-position="' + { left: "right", right: "left" }[s] + '" role="tooltip"></div>'), d(m);
}
!(function (e, t) {
    "use strict";
    "function" == typeof define && define.amd
        ? define([], function () {
              return (e.secrets = t());
          })
        : "object" == typeof exports
        ? (module.exports = t(require("crypto")))
        : (e.secrets = t(e.crypto));
})(this, function (e) {
    "use strict";
    var t, r, n, i, o, s;
    function a() {
        (t = { bits: 8, radix: 16, minBits: 3, maxBits: 20, bytesPerChar: 2, maxBytesPerChar: 6, primitivePolynomials: [null, null, 1, 3, 3, 5, 3, 3, 29, 17, 9, 5, 83, 27, 43, 3, 45, 9, 39, 39, 9, 5, 3, 33, 27, 9, 71, 39, 9, 5, 83] }),
            (r = {}),
            (n = new Array(1024).join("0")),
            (i = !0),
            (o = 10),
            (s = ["nodeCryptoRandomBytes", "browserCryptoGetRandomValues", "browserSJCLRandom", "testRandom"]);
    }
    function l() {
        return !(!r || !r.rng || "function" != typeof r.rng);
    }
    function c(e, t) {
        var i;
        if (0 === t || 1 === t) return e;
        if (t && t > 1024) throw new Error("Padding must be multiples of no larger than 1024 bits.");
        return (t = t || r.bits), e && (i = e.length % t), i ? (n + e).slice(-(t - i + e.length)) : e;
    }
    function d(e) {
        var t,
            r,
            n = "";
        for (r = e.length - 1; r >= 0; r--) {
            if (((t = parseInt(e[r], 16)), isNaN(t))) throw new Error("Invalid hex character.");
            n = c(t.toString(2), 4) + n;
        }
        return n;
    }
    function h(e) {
        var t,
            r,
            n = "";
        for (r = (e = c(e, 4)).length; r >= 4; r -= 4) {
            if (((t = parseInt(e.slice(r - 4, r), 2)), isNaN(t))) throw new Error("Invalid binary character.");
            n = t.toString(16) + n;
        }
        return n;
    }
    function u(t) {
        function n(e, t, r, n) {
            var i,
                o = 0,
                s = "";
            for (t && (i = t.length - 1); o < i || s.length < e; ) (s += c(Math.abs(parseInt(t[o], r)).toString(2), n)), o++;
            return ((s = s.substr(-e)).match(/0/g) || []).length === s.length ? null : s;
        }
        function s(t) {
            var r,
                i = null;
            for (16, 4, r = Math.ceil(t / 8); null === i; ) i = n(t, e.randomBytes(r).toString("hex"), 16, 4);
            return i;
        }
        function a(e) {
            var t,
                r = null;
            for (10, 32, t = Math.ceil(e / 32); null === r; ) r = n(e, window.crypto.getRandomValues(new Uint32Array(t)), 10, 32);
            return r;
        }
        function l(e) {
            var t;
            if ((10, 32, (t = Math.ceil(e / 32)), !sjcl.random.isReady(o))) throw new Error("SJCL isn't finished seeding the RNG yet.");
            return n(e, sjcl.random.randomWords(t, o), 10, 32);
        }
        return t && "testRandom" === t
            ? ((r.typeCSPRNG = t),
              function (e) {
                  var t,
                      r,
                      i = null;
                  (r = Math.ceil(e / 32)), (t = new Uint32Array(r));
                  for (var o = 0; o < t.length; o++) t[o] = 123456789;
                  for (; null === i; ) i = n(e, t, 10, 32);
                  return i;
              })
            : t && "nodeCryptoRandomBytes" === t
            ? ((r.typeCSPRNG = t), s)
            : t && "browserCryptoGetRandomValues" === t
            ? ((r.typeCSPRNG = t), a)
            : t && "browserSJCLRandom" === t
            ? ((i = !1), (r.typeCSPRNG = t), l)
            : "object" == typeof e && "function" == typeof e.randomBytes
            ? ((r.typeCSPRNG = "nodeCryptoRandomBytes"), s)
            : !window || !window.crypto || ("function" != typeof window.crypto.getRandomValues && "object" != typeof window.crypto.getRandomValues) || ("function" != typeof Uint32Array && "object" != typeof Uint32Array)
            ? window && window.sjcl && "object" == typeof window.sjcl && "object" == typeof window.sjcl.random
                ? ((i = !1), (r.typeCSPRNG = "browserSJCLRandom"), l)
                : void 0
            : ((r.typeCSPRNG = "browserCryptoGetRandomValues"), a);
    }
    function m(e, t) {
        var n,
            i = [];
        for (t && (e = c(e, t)), n = e.length; n > r.bits; n -= r.bits) i.push(parseInt(e.slice(n - r.bits, n), 2));
        return i.push(parseInt(e.slice(0, n), 2)), i;
    }
    function f(e, t) {
        var n,
            i = r.logs[e],
            o = 0;
        for (n = t.length - 1; n >= 0; n--) o = 0 !== o ? r.exps[(i + r.logs[o]) % r.maxShares] ^ t[n] : t[n];
        return o;
    }
    function b(e, t, n) {
        var i,
            o,
            s,
            a,
            l = 0;
        for (s = 0, i = t.length; s < i; s++)
            if (n[s]) {
                for (o = r.logs[n[s]], a = 0; a < i; a++)
                    if (s !== a) {
                        if (e === t[a]) {
                            o = -1;
                            break;
                        }
                        o = (o + r.logs[e ^ t[a]] - r.logs[t[s] ^ t[a]] + r.maxShares) % r.maxShares;
                    }
                l = -1 === o ? l : l ^ r.exps[o];
            }
        return l;
    }
    function p(e, t, n) {
        var i,
            o,
            s = [],
            a = [e];
        for (i = 1; i < n; i++) a[i] = parseInt(r.rng(r.bits), 2);
        for (i = 1, o = t + 1; i < o; i++) s[i - 1] = { x: i, y: f(i, a) };
        return s;
    }
    function w(e, t, n) {
        var i, o, s, a;
        if (
            ((t = parseInt(t, r.radix)),
            (i = (e = parseInt(e, 10) || r.bits).toString(36).toUpperCase()),
            (a = (s = Math.pow(2, e) - 1).toString(r.radix).length),
            (o = c(t.toString(r.radix), a)),
            "number" != typeof t || t % 1 != 0 || t < 1 || t > s)
        )
            throw new Error("Share id must be an integer between 1 and " + s + ", inclusive.");
        return i + o + n;
    }
    var g = {
        init: function (e, n) {
            var i,
                c,
                d = [],
                h = [],
                u = 1;
            if ((a(), e && ("number" != typeof e || e % 1 != 0 || e < t.minBits || e > t.maxBits))) throw new Error("Number of bits must be an integer between " + t.minBits + " and " + t.maxBits + ", inclusive.");
            if (n && -1 === s.indexOf(n)) throw new Error("Invalid RNG type argument : '" + n + "'");
            for (r.radix = t.radix, r.bits = e || t.bits, r.size = Math.pow(2, r.bits), r.maxShares = r.size - 1, i = t.primitivePolynomials[r.bits], c = 0; c < r.size; c++)
                (h[c] = u), (d[u] = c), (u <<= 1) >= r.size && ((u ^= i), (u &= r.maxShares));
            if (
                ((r.logs = d),
                (r.exps = h),
                n && this.setRNG(n),
                l() || this.setRNG(),
                "browserSJCLRandom" === r.typeCSPRNG && ((sjcl.random = new sjcl.prng(o)), sjcl.random.startCollectors()),
                !(l() && r.bits && r.size && r.maxShares && r.logs && r.exps && r.logs.length === r.size && r.exps.length === r.size))
            )
                throw new Error("Initialization failed.");
        },
        combine: function (e, t) {
            var n,
                i,
                o,
                s,
                a,
                l,
                u,
                f,
                p = "",
                w = [],
                g = [];
            for (t = t || 0, n = 0, s = e.length; n < s; n++) {
                if (((u = this.extractShareComponents(e[n])), void 0 === l)) l = u.bits;
                else if (u.bits !== l) throw new Error("Mismatched shares: Different bit settings.");
                if ((r.bits !== l && this.init(l), -1 === w.indexOf(u.id))) for (i = w.push(u.id) - 1, o = 0, a = (f = m(d(u.data))).length; o < a; o++) (g[o] = g[o] || []), (g[o][i] = f[o]);
            }
            for (n = 0, s = g.length; n < s; n++) p = c(b(t, w, g[n]).toString(2)) + p;
            return 0 === t ? ((i = p.indexOf("1")), h(p.slice(i + 1))) : h(p);
        },
        getConfig: function () {
            var e = {};
            return (e.radix = r.radix), (e.bits = r.bits), (e.maxShares = r.maxShares), (e.hasCSPRNG = l()), (e.typeCSPRNG = r.typeCSPRNG), e;
        },
        extractShareComponents: function (e) {
            var n,
                i,
                o,
                s,
                a,
                l = {};
            if ((n = parseInt(e.substr(0, 1), 36)) && ("number" != typeof n || n % 1 != 0 || n < t.minBits || n > t.maxBits))
                throw new Error("Invalid share : Number of bits must be an integer between " + t.minBits + " and " + t.maxBits + ", inclusive.");
            if (
                ((s = Math.pow(2, n) - 1),
                (o = (Math.pow(2, n) - 1).toString(r.radix).length),
                (a = new RegExp("^([a-kA-K3-9]{1})([a-fA-F0-9]{" + o + "})([a-fA-F0-9]+)$").exec(e)) && (i = parseInt(a[2], r.radix)),
                "number" != typeof i || i % 1 != 0 || i < 1 || i > s)
            )
                throw new Error("Invalid share : Share id must be an integer between 1 and " + r.maxShares + ", inclusive.");
            if (a && a[3]) return (l.bits = n), (l.id = i), (l.data = a[3]), l;
            throw new Error("The share data provided is invalid : " + e);
        },
        setRNG: function (e) {
            var t = "Random number generator is invalid ",
                n = " Supply an CSPRNG of the form function(bits){} that returns a string containing 'bits' number of random 1's and 0's.";
            if (e && "string" == typeof e && -1 === s.indexOf(e)) throw new Error("Invalid RNG type argument : '" + e + "'");
            if ((e || (e = u()), e && "string" == typeof e && (e = u(e)), i)) {
                if (e && "function" != typeof e) throw new Error(t + "(Not a function)." + n);
                if (e && "string" != typeof e(r.bits)) throw new Error(t + "(Output is not a string)." + n);
                if (e && !parseInt(e(r.bits), 2)) throw new Error(t + "(Binary string output not parseable to an Integer)." + n);
                if (e && e(r.bits).length > r.bits) throw new Error(t + "(Output length is greater than config.bits)." + n);
                if (e && e(r.bits).length < r.bits) throw new Error(t + "(Output length is less than config.bits)." + n);
            }
            return (r.rng = e), !0;
        },
        str2hex: function (e, r) {
            var n,
                i,
                o,
                s,
                a,
                l,
                d = "";
            if ("string" != typeof e) throw new Error("Input must be a character string.");
            if ((r || (r = t.bytesPerChar), "number" != typeof r || r < 1 || r > t.maxBytesPerChar || r % 1 != 0)) throw new Error("Bytes per character must be an integer between 1 and " + t.maxBytesPerChar + ", inclusive.");
            for (n = 2 * r, i = Math.pow(16, n) - 1, a = 0, l = e.length; a < l; a++) {
                if (((s = e[a].charCodeAt()), isNaN(s))) throw new Error("Invalid character: " + e[a]);
                if (s > i) throw ((o = Math.ceil(Math.log(s + 1) / Math.log(256))), new Error("Invalid character code (" + s + "). Maximum allowable is 256^bytes-1 (" + i + "). To convert this character, use at least " + o + " bytes."));
                d = c(s.toString(16), n) + d;
            }
            return d;
        },
        hex2str: function (e, r) {
            var n,
                i,
                o,
                s = "";
            if ("string" != typeof e) throw new Error("Input must be a hexadecimal string.");
            if ("number" != typeof (r = r || t.bytesPerChar) || r % 1 != 0 || r < 1 || r > t.maxBytesPerChar) throw new Error("Bytes per character must be an integer between 1 and " + t.maxBytesPerChar + ", inclusive.");
            for (i = 0, o = (e = c(e, (n = 2 * r))).length; i < o; i += n) s = String.fromCharCode(parseInt(e.slice(i, i + n), 16)) + s;
            return s;
        },
        random: function (e) {
            if ("number" != typeof e || e % 1 != 0 || e < 2 || e > 65536) throw new Error("Number of bits must be an Integer between 1 and 65536.");
            if ("browserSJCLRandom" === r.typeCSPRNG && sjcl.random.isReady(o) < 1) throw new Error("SJCL isn't finished seeding the RNG yet. Needs new entropy added or more mouse movement.");
            return h(r.rng(e));
        },
        share: function (e, t, n, i) {
            var o,
                s,
                a,
                l,
                u,
                f = new Array(t),
                b = new Array(t);
            if (((i = i || 128), "string" != typeof e)) throw new Error("Secret must be a string.");
            if ("number" != typeof t || t % 1 != 0 || t < 2) throw new Error("Number of shares must be an integer between 2 and 2^bits-1 (" + r.maxShares + "), inclusive.");
            if (t > r.maxShares)
                throw ((o = Math.ceil(Math.log(t + 1) / Math.LN2)), new Error("Number of shares must be an integer between 2 and 2^bits-1 (" + r.maxShares + "), inclusive. To create " + t + " shares, use at least " + o + " bits."));
            if ("number" != typeof n || n % 1 != 0 || n < 2) throw new Error("Threshold number of shares must be an integer between 2 and 2^bits-1 (" + r.maxShares + "), inclusive.");
            if (n > r.maxShares)
                throw (
                    ((o = Math.ceil(Math.log(n + 1) / Math.LN2)),
                    new Error("Threshold number of shares must be an integer between 2 and 2^bits-1 (" + r.maxShares + "), inclusive.  To use a threshold of " + n + ", use at least " + o + " bits."))
                );
            if (n > t) throw new Error("Threshold number of shares was " + n + " but must be less than or equal to the " + t + " shares specified as the total to generate.");
            if ("number" != typeof i || i % 1 != 0 || i < 0 || i > 1024) throw new Error("Zero-pad length must be an integer between 0 and 1024 inclusive.");
            for (a = 0, u = (e = m((e = "1" + d(e)), i)).length; a < u; a++) for (s = p(e[a], t, n), l = 0; l < t; l++) (f[l] = f[l] || s[l].x.toString(r.radix)), (b[l] = c(s[l].y.toString(2)) + (b[l] || ""));
            for (a = 0; a < t; a++) f[a] = w(r.bits, f[a], h(b[a]));
            return f;
        },
        newShare: function (e, t) {
            if ((e && "string" == typeof e && (e = parseInt(e, r.radix)), e && t && t[0])) return w(this.extractShareComponents(t[0]).bits, e, this.combine(t, e));
            throw new Error("Invalid 'id' or 'shares' Array argument to newShare().");
        },
        _reset: a,
        _padLeft: c,
        _hex2bin: d,
        _bin2hex: h,
        _getRNG: u,
        _isSetRNG: l,
        _splitNumStringToIntArray: m,
        _horner: f,
        _lagrange: b,
        _getShares: p,
        _constructPublicShareString: w,
    };
    return g.init(), g;
}),
    (CollectiblesJS.createSecrets = function (e, t) {
        t = parseInt(t, 10);
        const r = secrets.str2hex(e);
        return secrets.share(r, t, t);
    }),
    (CollectiblesJS.redeemSecrets = function (e) {
        const t = secrets.combine(e);
        return secrets.hex2str(t);
    }),
    (CollectiblesJS.changeTheme = function (e) {
        const t = "collectible-theme-" + e,
            r = document.body.className.match(/(collectible-theme-)\w+/)[0];
        document.body.classList.replace(r, t);
    });
