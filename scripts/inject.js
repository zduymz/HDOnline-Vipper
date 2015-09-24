chrome.extension.sendMessage({}, function(result) {
    var e = setInterval(function() {
        if ("interactive" === document.readyState) {
            clearInterval(e);
            removeads();
            //need to do
            var script = document.createElement("script");
            script.appendChild(document.createTextNode("(" + main + ")(\"" + result.vtoken + "\",\"" + result.vsig + "\");"));
            (document.body || document.head || document.documentElement).appendChild(script);


        }
    }, 10);
});

//add remove ads
function removeads() {
    var floatleft = document.getElementById('floatleft');
    var floatright = document.getElementById('floatright');
    var bswrapper_inhead = document.getElementById('bswrapper_inhead');
    var float_left = document.getElementsByClassName('float-left');
    var float_right = document.getElementsByClassName('float-right');
    var ads_right = document.getElementsByClassName('ads_right');
    var socialTitle = document.getElementsByClassName('socialTitle');

    var ads = document.querySelectorAll('*[id^="ads"]');

    //now remove
    floatleft.parentNode.removeChild(floatleft);
    floatright.parentNode.removeChild(floatright);
    bswrapper_inhead.parentNode.removeChild(bswrapper_inhead);

    for (var i = 0; i < float_left.length; i++) {
        float_left[i].parentNode.removeChild(float_left[i]);
    }
    for (i= 0; i < float_right.length; i++) {
        float_right[i].parentNode.removeChild(float_right[i]);
    }
    for (i = 0; i < ads_right.length; i++) {
        ads_right[i].parentNode.removeChild(ads_right[i]);
    }
    for (i = 0; i < socialTitle.length; i++) {
        socialTitle[i].parentNode.removeChild(socialTitle[i]);
    }
    for (i = 0; i < ads.length; i++) {
        ads[i].parentNode.removeChild(ads[i]);
    }
}

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
        //var a = getElementByXpath('/html/body/div[2]/div[1]/div[2]/div/script/text()') || getElementByXpath('//*[@id="trailer_player"]/div[2]/div/div[1]/script/text()');
        var a = document.getElementsByClassName('tn-playerdv')[0].getElementsByTagName('script')[0].innerHTML;
        as = a.indexOf('jwconfig'),
        ae = a.indexOf('jwplayer(\'hdoplayer\')'),
        b = a.substring(as, ae),
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

        //fix 720hd resolution.
        if (o.hasOwnProperty('vhls_maxlevel')) {
            o.vhls_maxlevel = 4;
        }
        if (o.hasOwnProperty('vhls_maxwidth')) {
            o.vhls_maxwidth = 1280;
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