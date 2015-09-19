var vdecode = {
    s: "1234567890qwertyuiopasdfghjklzxcvbnm".split(""),
    hk: CryptoJS.MD5('somethingstupididontwanttoshare').toString().split(""),
    encode: function(a) {
        var s1 = "";
        var s2 = "";
        var t = 0;
        var a1 = a.split("");
        var sl = this.s.length;
        var r = [];

        while (r.length < sl) {
            r.push(this.s[Math.floor(Math.random() * sl)]);
        }

        for (var i = 0; i < a1.length; i++) {
            t = a1[i].charCodeAt(0) + r[i % sl].charCodeAt(0);
            s1 = s1 + this.s[Math.floor(t / sl)];
            s1 = s1 + this.s[t % sl];
        }

        for (var i = 0; i < sl; i++) {
            t = r[i].charCodeAt(0) + this.hk[i % this.hk.length].charCodeAt(0);
            s2 = s2 + this.s[Math.floor(t / sl)];
            s2 = s2 + this.s[t % sl];
        }
        return s2 + CryptoJS.MD5(a).toString() + s1;
    },

    decode: function(a) {
        var sl = this.s.length;
        var s1 = a.substr(((sl * 2) + 32)).split("");
        var s2 = a.substr(0, (sl * 2)).split("");
        var ha = a.substr((sl * 2), 32);
        var t = 0;
        var sl = this.s.length;

        var rs2 = '';
        for (var i = 0; i < sl * 2; i = i + 2) {
            t = this.s.indexOf(s2[i]) * sl;
            t = t + this.s.indexOf(s2[i + 1]);
            t = t - (this.hk[Math.floor(i / 2) % this.hk.length]).charCodeAt(0);
            rs2 = rs2 + String.fromCharCode(t);
        }

        var rs1 = '';
        for (var i = 0; i < s1.length; i = i + 2) {
            t = this.s.indexOf(s1[i]) * sl;
            t = t + this.s.indexOf(s1[i + 1]);
            t = t - (rs2[Math.floor(i / 2) % sl]).charCodeAt(0);
            rs1 = rs1 + String.fromCharCode(t);
        }

        return rs1;
    }

};