const ocanvas = document.getElementById('ocanvas');
const octx = ocanvas.getContext('2d');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fac = new FastAverageColor();

const fcanvas = document.getElementById('fcanvas');
const fctx = fcanvas.getContext('2d');
//const slider = document.getElementById("xpos");
//const yslider = document.getElementById("ypos");
import pixelmatch from './pixelmatch.js'

var zlayer = -100;

//ewofaijeiofjawoiefjwaoefwoiefjawjeiofjawoiefjawoiefjowaief
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

//-------------------------------------------------------------





function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var shrek = new Image();
shrek.addEventListener('load', () => {
    octx.drawImage(shrek, 0, 0);
    main();
}, false)
shrek.src = prompt("what image (enter url, has to be 100x75 resolution)", "shrek.webp");

function avgcolor(img, x, y, w, h) {
    var color = fac.getColorFromArray4(img.data);
    return color;
}

var total = 0;

var objects = "";

var canv;
var dcanv;
var dcanvd;

//console.log(canv);

var current = 2;

var final = false;
var wid;
var len;

var stuff = [];

var score = 0;
var bestdiff = 999999;

function getarray(img) {
    return img.data;
}

function main() {
    //c++;
    //await null;
    wid = 30 * current//randomIntFromInterval(1, 100);
    len = 30 * current//randomIntFromInterval(1, 75);

    var randx = randomIntFromInterval(0, 200) - wid / 2;
    var randy = randomIntFromInterval(0, 150) - len / 2;

    ctx.clearRect(0, 0, 200, 150);

    if (final) {
        ctx.putImageData(final, 0, 0);
    }

    canv = octx.getImageData(randx, randy, wid, len);
    var col = avgcolor(canv);
    ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
	ctx.beginPath();
	ctx.arc(randx, randy, wid/2, 0, 2 * Math.PI, false)
	ctx.strokeStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
	ctx.fill();
	ctx.stroke();
	
    //ctx.fillRect(randx, randy, wid, len);

    dcanv = octx.getImageData(0, 0, 200, 150);
    dcanvd = ctx.getImageData(0, 0, 200, 150);
    score = pixelmatch(dcanv.data, dcanvd.data, null, 200, 150, { threshold: 0.1 });
    if (score < bestdiff) {
        bestdiff = score;
        stuff = [randx, randy, wid, len, col, current];
    }

    //if(c < document.getElementById("tries").value) {
    //  requestAnimationFrame(main);
    //}
}
let c = 0;
let f = 0;
var gen = document.querySelector('#gen');
var thing = 1;
var oldstuff = [];

function thingie() {
    //for (let f = 0; f < document.getElementById("gens").value; f++) {
    for (let c = 0; c < document.getElementById("tries").value; c++) {
        //bestdiff = 999999999;

        main();

    }
    //fctx.clearRect(0, 0, 100, 75);
    //OBJ_ID: 211, 1888
    if(oldstuff != stuff) {
		 fctx.beginPath();
        fctx.fillStyle = `rgb(${stuff[4][0]}, ${stuff[4][1]}, ${stuff[4][2]})`;
		 fctx.arc(stuff[0], stuff[1], stuff[2]/2, 0, 2 * Math.PI, false)
	fctx.fill();
		 fctx.strokeStyle = `rgb(${stuff[4][0]}, ${stuff[4][1]}, ${stuff[4][2]})`;
		 fctx.stroke();
        //fctx.fillRect(stuff[0], stuff[1], stuff[2], stuff[3]);
        var hsv = rgb2hsv(stuff[4][0], stuff[4][1], stuff[4][2]);
        objects+=`
$.add(obj {
	 OBJ_ID: 1764,
    X: ${Math.round(stuff[0]*1)},
    Y: ${Math.round(stuff[1]*1)},
    SCALING: ${stuff[5]*5.5},
    HVS_ENABLED: true,
    HVS: "${hsv.h}a${hsv.s/100}a${hsv.v/100}a0a0",
    Z_ORDER: ${zlayer},
})`
zlayer++;
        final = fctx.getImageData(0, 0, 200, 150);
        oldstuff = stuff;
        total++;
        f++;
    }

    //console.log(f);

    document.getElementById("objs").innerHTML = `objects: ${total}`;

    if (f < document.getElementById("gens").value) {
        window.requestAnimationFrame(thingie);
    }
    //}
}

function go() {
    f = 0;
    thingie();
    //current-=0.25;
    current = current * 0.7;
    //console.log("total: " + total);
}

function click() {
    //if (current < ) {
    //    current = 2;
    //}
    document.getElementById("size").innerHTML = `size: ${current}`;
    go();
    //console.log("hi");
}

function aclick() {
    for (let l = 0; l < 11; l++) {
        if (current < 2) {
            current = 2;
        }
        document.getElementById("size").innerHTML = `size: ${current}`;
        go();
        //console.log("hi");
        //document.getElementById("tries").value = document.getElementById("tries").value + 5;
    }
}

document.querySelector('#btn').addEventListener('click', click);
document.querySelector('#export').addEventListener('click', convert);

function convert() {
    alert("check js console (ctrl+shift+j on most browsers)");
    console.log(`
    extract obj_props

    ${objects}
    `)
}

/**const ocanvas = document.getElementById('ocanvas');
const octx = ocanvas.getContext('2d');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fac = new FastAverageColor();

const fcanvas = document.getElementById('fcanvas');
const fctx = fcanvas.getContext('2d');
//const slider = document.getElementById("xpos");
//const yslider = document.getElementById("ypos");
import pixelmatch from './pixelmatch.js'


var zlayer = -100;

//ewofaijeiofjawoiefjwaoefwoiefjawjeiofjawoiefjawoiefjowaief
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

//-------------------------------------------------------------





function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var shrek = new Image();
shrek.addEventListener('load', () => {
    octx.drawImage(shrek, 0, 0);
    main();
}, false)
shrek.src = prompt("what image (enter url, has to be 100x75 resolution)", "shrek.webp");

function avgcolor(img, x, y, w, h) {
    var color = fac.getColorFromArray4(img.data);
    return color;
}

var total = 0;

var objects = "";

var canv;
var dcanv;
var dcanvd;

//console.log(canv);

var current = 2;

var final = false;
var wid;
var len;

var stuff = [];

var score = 0;
var bestdiff = 999999;

function getarray(img) {
    return img.data;
}

function main() {
    //c++;
    //await null;
    wid = 30 * current//randomIntFromInterval(1, 100);
    len = 30 * current//randomIntFromInterval(1, 75);

    var randx = randomIntFromInterval(0, 100) - wid / 2;
    var randy = randomIntFromInterval(0, 75) - len / 2;

    ctx.clearRect(0, 0, 100, 75);

    if (final) {
        ctx.putImageData(final, 0, 0);
    }

    canv = octx.getImageData(randx, randy, wid, len);
    var col = avgcolor(canv);
    ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
    ctx.fillRect(randx, randy, wid, len);

    dcanv = octx.getImageData(0, 0, 100, 75);
    dcanvd = ctx.getImageData(0, 0, 100, 75);
    score = pixelmatch(dcanv.data, dcanvd.data, null, 100, 75, { threshold: 0.1 });
    if (score < bestdiff) {
        bestdiff = score;
        stuff = [randx, randy, wid, len, col, current];
    }

    //if(c < document.getElementById("tries").value) {
    //  requestAnimationFrame(main);
    //}
}
let c = 0;
let f = 0;
var gen = document.querySelector('#gen');
var thing = 1;
var oldstuff = [];

function thingie() {
    //for (let f = 0; f < document.getElementById("gens").value; f++) {
    for (let c = 0; c < document.getElementById("tries").value; c++) {
        //bestdiff = 999999999;

        main();

    }
    //fctx.clearRect(0, 0, 100, 75);
    //OBJ_ID: 211, 1888
    if(oldstuff != stuff) {
        fctx.fillStyle = `rgb(${stuff[4][0]}, ${stuff[4][1]}, ${stuff[4][2]})`;
        fctx.fillRect(stuff[0], stuff[1], stuff[2], stuff[3]);
        var hsv = rgb2hsv(stuff[4][0], stuff[4][1], stuff[4][2]);
        objects+=`
$.add(obj {
	 OBJ_ID: 472,
    X: ${Math.round(stuff[0]*1)},
    Y: ${Math.round(stuff[1]*1)},
    SCALING: ${stuff[5]*18},
    HVS_ENABLED: true,
    HVS: "${hsv.h}a${hsv.s/100}a${hsv.v/100}a0a0",
    Z_ORDER: ${zlayer},
})`
zlayer++;
        final = fctx.getImageData(0, 0, 100, 75);
        oldstuff = stuff;
        total++;
        f++;
    }

    //console.log(f);

    document.getElementById("objs").innerHTML = `objects: ${total}`;

    if (f < document.getElementById("gens").value) {
        window.requestAnimationFrame(thingie);
    }
    //}
}

function go() {
    f = 0;
    thingie();
    //current-=0.25;
    current = current * 0.7;
    //console.log("total: " + total);
}

function click() {
    //if (current < ) {
    //    current = 2;
    //}
    document.getElementById("size").innerHTML = `size: ${current}`;
    go();
    //console.log("hi");
}

function aclick() {
    for (let l = 0; l < 11; l++) {
        if (current < 2) {
            current = 2;
        }
        document.getElementById("size").innerHTML = `size: ${current}`;
        go();
        //console.log("hi");
        //document.getElementById("tries").value = document.getElementById("tries").value + 5;
    }
}

document.querySelector('#btn').addEventListener('click', click);
document.querySelector('#export').addEventListener('click', convert);

function convert() {
    alert("check js console (ctrl+shift+j on most browsers)");
    console.log(`
    extract obj_props

    ${objects}
    `)
}**/
