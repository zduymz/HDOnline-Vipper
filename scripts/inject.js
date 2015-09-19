chrome.extension.sendMessage({}, function(result) {
    var e = setInterval(function() {
        if ("interactive" === document.readyState) {
            clearInterval(e);

            //need to do
            var script = document.createElement("script");
            script.appendChild(document.createTextNode("(" + main + ")(\"" + result.vtoken + "\",\"" + result.vsig + "\");"));
            (document.body || document.head || document.documentElement).appendChild(script);

        }
    }, 10);
});

function main(v1, v2) {

    function addLink(v) {
        var t = document.createElement("input");
        t.setAttribute("type", "hidden");
        t.setAttribute("value", v);
        t.setAttribute("name", "duym");
        document.body.appendChild(t);
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function fuckConfig() {
        var a = getElementByXpath('/html/body/div[2]/div[1]/div[2]/div/script/text()') || getElementByXpath('//*[@id="trailer_player"]/div[2]/div/div[1]/script/text()');
            as = a.data.indexOf('jwconfig'),
            ae = a.data.indexOf('jwplayer(\'hdoplayer\')\.setup(jwconfig)'),
            b = a.data.substring(as, ae),
            bs = b.indexOf('{'),
            be = b.lastIndexOf('}') + 1,
            o = JSON.parse(b.substring(bs, be));

        //check vplugin exist
        for (var i in o.plugins) {
            if (i.indexOf('vplugin') > 0) {
                o.plugins[i].uvip = true;
                o.plugins[i].vads = false;
                o.plugins[i].vtoken = v1;
                o.plugins[i].vsig = v2;

                if (o.plugins[i].hasOwnProperty('videotag')) {
                    delete o.plugins[i]['videotag'];
                }

                if (o.plugins[i].hasOwnProperty('overlaytag')) {
                    delete o.plugins[i]['overlaytag'];
                }

                break;
            } else {
                console.log("[+] HDO: Can not find vplugin in config");
            }
        }

        if (o.hdonline.hasOwnProperty('ads')) {
            delete o.hdonline['ads'];
        }

        //disable check login - error code "Tai khoang dang dang nhap thiet bi khac - Dang nhap lai "
        if (o.hdonline.user.hasOwnProperty('checklogin')) {
            o.hdonline.user.checklogin = false;
        }

        console.log("[+] HDO: Inject VIPPER");
        jwplayer('hdoplayer').setup(o);

        //add link for download VLC
        addLink(o.playlist[0].file);
    }
    fuckConfig();
}

function m3u() {
    var u = 'http://hdonline.vn' + document.getElementsByName('duym')[0].value;
    var f = '';
    var xhr = new XMLHttpRequest;
    if (xhr.open("GET", u, !1), xhr.send(null), 200 === xhr.status) {
        var rs = xhr.responseText;
        var key = rs.substring(rs.indexOf('<jwplayer:file>') + 15, rs.indexOf('</jwplayer:file>'));
        f = vdecode.decode(key);

    }
    //download file
    downloadFile(f);
}

var downloadFile = function downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
}