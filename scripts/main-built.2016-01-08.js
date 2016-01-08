define("layout", ["jquery"], function () {
    var e = $(document).height() - 20;
    $("#tracklist").animate({height: e - 350}), $("#cue").animate({height: e - 173}), $("#cue").one("click", function () {
        $(this).select()
    });
    var t = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    if (t) {
        var n = document.createElement("script");
        n.src = "chrome-extension://phoaoafhahilmaoddhppejobcmgnglmc/manifest.json", document.body.appendChild(n), n.onerror = function () {
            var e = document.getElementById("chrome-extension");
            e.style.display = "block";
            var t = Math.round((document.body.offsetWidth - e.offsetWidth) / 2);
            e.style.left = t + "px"
        }
    }
}), define("cue/parser", [], function () {
    function e(e) {
        return e.trim()
    }

    function t(e) {
        return e.trim()
    }

    function n(e) {
        return e.trim()
    }

    function a(e) {
        var t = [], n = [], a, f, l, c, h, p, d;
        n = e.split("\n");
        for (var v = 0, m = 1; v < n.length; v++, m++) {
            a = n[v].trim();
            if (!a.length) {
                m--;
                continue
            }
            f = r(a), f.performer ? (l = i(f.performer), h = s(l.time), p = o(l.residue), d = u(f.title)) : (c = i(f.title), h = s(c.time), p = "", d = o(c.residue)), t.push({
                track: m,
                performer: p,
                title: d,
                time: h
            })
        }
        return t
    }

    function f(e) {
        var t = [], n = "", r = e.split("\n");
        for (var i = 0; i < r.length; i++) {
            var s = r[i].trim(), o = s.match(/(\d{2}:\d{2}:\d{2}[\.,:]\d{2})/i);
            if (null != o) {
                var n = o[0].split(":"), u = n.shift(), a = n.shift();
                if (n.length > 1)var f = n.shift(), l = n.shift(); else {
                    var c = n.shift();
                    switch (!0) {
                        case-1 != c.indexOf("."):
                            c = c.split(".");
                            var f = c.shift(), l = c.shift();
                            break;
                        case-1 != c.indexOf(","):
                            c = c.split(",");
                            var f = c.shift(), l = c.shift()
                    }
                }
                a = parseInt(a, 10) + parseInt(u, 10) * 60, n = (a < 10 ? "0" + a : a) + ":" + f + ":" + l, t.push(n);
                continue
            }
            var o = s.match(/(\d{2,3}:\d{2}[\.:]\d{2})/i);
            if (null != o) {
                var n = o[0].split(":"), a = n.shift();
                if (n.length == 1)var c = n[0].split("."), f = c.shift(), l = c.shift(); else var f = n.shift(), l = n.shift();
                n = a + ":" + f + ":" + l, t.push(n);
                continue
            }
            var o = s.match(/(\d{1,5}).(\d{6})/i);
            if (null != o) {
                var h = o[2], p = o[1], d = Math.floor(p / 60), a = d > 0 ? d : 0, f = p % 60, l = Math.floor(parseFloat("0." + h) * 75);
                n = (a < 10 ? "0" + a : a) + ":" + (f < 10 ? "0" + f : f) + ":" + (l < 10 ? "0" + l : l), t.push(n);
                continue
            }
            var o = s.match(/(\d{2}:\d{2}:\d{2})/i);
            if (null != o) {
                n = o[0].split(":");
                var a = parseInt(n[0], 10), f = parseInt(n[1], 10), l = parseInt(n[2], 10);
                n = (a < 10 ? "0" + a : a) + ":" + (f < 10 ? "0" + f : f) + ":" + (l < 10 ? "0" + l : l), t.push(n);
                continue
            }
        }
        return t
    }

    String.prototype.trim || (String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "")
    });
    var r = function (e) {
        var t = [" - ", " – ", " ‒ ", " — ", " ― "], n = [], r = "", i = "";
        return -1 !== e.search(t[0]) ? n = e.split(t[0]) : -1 !== e.search(t[1]) ? n = e.split(t[1]) : -1 !== e.search(t[2]) ? n = e.split(t[2]) : -1 !== e.search(t[3]) ? n = e.split(t[3]) : -1 !== e.search(t[4]) ? n = e.split(t[4]) : n = [e], 1 === n.length ? (r = "", i = n.shift()) : (r = n.shift(), i = n.join(" ")), {
            performer: r.trim(),
            title: i.trim()
        }
    }, i = function (e) {
        var t = "", n = "", r = /^(?:\d{2}\.)?\[?((?:\d{1,2}:)?\d{2,3}:\d{2})\]?.*$/i, i = e.match(r);
        return i && i[1] ? (t = i[1].trim(), n = e.substring(e.indexOf(i[1]) + i[1].length).trim()) : n = e.trim(), {
            time: t,
            residue: n
        }
    }, s = function (e) {
        e = e.trim();
        var t = /^\d{1,2}:\d{2}:\d{2}$/, n = e.match(t);
        if (n) {
            var r = e.split(":"), i = parseInt(r[0], 10), s = parseInt(r[1], 10), o = r[2];
            s = i * 60 + s, e = s + ":" + o + ":00"
        } else {
            var t = /^\d{2}:\d{2}$/, n = e.match(t);
            n ? e += ":00" : e = "00:00:00"
        }
        return e
    }, o = function (e) {
        var t = /^(?:\]? )?(?:\d{2}\)?\.? )?(.*)$/i, n = e.match(t);
        return n && n[1] && (e = n[1]), e = u(e), e
    }, u = function (e) {
        return e = e.replace(/"/g, ""), e
    };
    return {
        performer: e,
        title: t,
        filename: n,
        tracklist: a,
        regionsList: f,
        _splitTitlePerformer: r,
        _separateTime: i,
        _cleanOffTime: o,
        _cleanDoubleQuotes: u,
        _castTime: s
    }
}), define("cue/formatter", [], function () {
    function e(e) {
        return 'PERFORMER "' + e + '"\n'
    }

    function t(e) {
        return 'TITLE "' + e + '"\n'
    }

    /**
     * Checks the input file extension in order to set WAVE, MP3, or BINARY in the "FILE line" of the resulting .cue
     * @param User sound file
     * @returns {String} File line
     */
    function n(e) {
        var lossless = ["wav", "aiff", "au", "flac", "ape", "wv", "tta", "atrac", "m4a"];
        var ans = 'FILE "' + e + '" ';
        var ext = e.toLowerCase().split('.').pop();
        var fd = false;
        for (var i = 0; !fd && i < lossless.length; i++) {
            if (ext == lossless[i]) {
                ans = ans + "WAVE";
                fd = true;
            }
        }
        if (!fd) {
            if (ext == "bin") {
                ans = ans + "BINARY";
            } else {
                ans = ans + "MP3";
            }
        }
        return (ans + "\n");
    }

    function r(e, t, n) {
        var r = "", i, s;
        for (var o = 0; o < e.length; o++)i = e[o], s = i.performer || n, r += "  TRACK " + (i.track < 10 ? "0" + i.track : i.track) + " AUDIO\n", r += '    PERFORMER "' + s + '"\n', r += '    TITLE "' + i.title + '"\n', r += "    INDEX 01 " + (t[o] || i.time) + "\n";
        return r
    }

    return {performer: e, title: t, filename: n, tracklist: r}
}), define("cue", ["cue/parser", "cue/formatter", "jquery"], function (e, t) {
    function n(n, r, i, s, o) {
        var u, a, f, l, c;
        return n = e.performer(n), a = t.performer(n), r = e.title(r), f = t.title(r), i = e.filename(i), l = t.filename(i), s = e.tracklist(s), o = e.regionsList(o), c = t.tracklist(s, o, n), u = a + f + l + c, u
    }

    $("#cue_fields input, #cue_fields textarea").keyup(function (e) {
        var t = $("#perfomer").val(), r = $("#title").val(), i = $("#filename").val(), s = $("#tracklist").val(), o = $("#regions_list").val(), u = n(t, r, i, s, o);
        $("#cue").val(u)
    })
}), requirejs.config({
    baseUrl: "scripts",
    urlArgs: require.specified("main") ? "bust=" + (new Date).getTime() : null,
    paths: {jquery: ["//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min", "lib/jquery-1.9.1.min"]}
}), require(["layout", "cue"], function () {
}), define("main", function () {
});