import $ from 'jquery';
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

var stop = false; //Esta variable se usa para detener la animacion
var animbutton;

var canvas; // canvas
var container; // contenedor (no es un contenedor como tal, sólo es un rectángulo)
var mainSquare;
var leftSquare;
var rightSquare;
var checkButton;
var numberLine;
var nLineZero, nLineOne;
var ballMS, ballLS, ballRS;

var mainNum, mainFraq, mainDen;
var leftNum, leftFraq, leftDen;
var rightNum, rightFraq, rightDen;

var mainSelected, leftSelected, rightSelected;

var vSliderMS, vSliderLS, vSliderRS;
var ballVSMS, ballVSLS, ballVSRS;
var numVSMS, numVSLS, numVSRS;
var hSliderMS, hSliderLS, hSliderRS;
var ballHSMS, ballHSLS, ballHSRS;
var numHSMS, numHSLS, numHSRS;
var numberFontSize;

var mainDivisions = [], leftDivisions = [], rightDivisions = [];

var save;
var result;

var maxDiv = 12;
// Esta es una declaración de una clase de fabric, que me ripeé de los ejemplos
var Cross = fabric.util.createClass(fabric.Object, {
    objectCaching: false,
    initialize: function (options) {
        this.callSuper('initialize', options);
        this.width = options.width;
        this.height = options.width;
        this.angle = options.angle;
        this.fill = options.fill;
        this.w1 = this.h2 = this.width;
        this.h1 = this.w2 = this.w1 / 3;
    },

    _render: function (ctx) {
        ctx.fillRect(-this.w1 / 2, -this.h1 / 2, this.w1, this.h1);
        ctx.fillRect(-this.w2 / 2, -this.h2 / 2, this.w2, this.h2);
    }
});

function newCircleOnCenter(pleft, ptop, pradius) {
    return new fabric.Circle({ radius: pradius, left: (pleft - pradius), top: (ptop - pradius) });
}

// Usar esta funcion para obtener los nuevos datos de visualización del container cwidth y cheight se refieren al canvas
function updateContainerData(cwidth, cheight) {
    var auxleft, auxtop, width, height;
    if (cwidth < 700) {
        auxleft = 50;
    }
    auxleft = 50; // Agregar proceso para calcularlos si es necesario
    auxtop = 50;
    var data = { left: 50, top: 50, width: (cwidth - auxleft * 2), height: (cheight - auxtop * 2) };
    container.set({left: data.left, top: data.top, width: data.width, height: data.height});
    return data;
}

function computeSquaresSize() {
    var height;
    if (container.width / container.height >= 1.2){
        height = container.height*0.5*0.65;
    } else {
        height = container.width*0.3;
    }
    return height;
}
// Compute the factor for the space where the check button should go,
// this helps to place left and right squares in order to be enough space
// for the check button
function computeFSCB() {
    var factor = 0.2;
    if (container.width / container.height <= 1.2) {
        factor = 0.15;
    }
    return factor;
}

function updateMainSquareData(){
    var auxleft, auxtop, height;
    height = computeSquaresSize();
    auxtop = container.top +(container.height*0.5 - height)/2;
    auxleft = container.left + (container.width-height)/2;
    removeDivisions(mainDivisions);
    mainDivisions = [];
    mainDivisions[0] = [];
    mainDivisions[0][0] = new fabric.Rect({ fill: 'rgba(23, 121, 186, 0.3)', stroke: 'rgba(23, 121, 186, 1)', strokeWidth: 2, rx: 2, ry: 2 });
    mainSquare.set({left: auxleft, top: auxtop, width: height, height: height});
    mainDivisions[0][0].set({left: auxleft, top: auxtop, width: height, height: height});
    mainDivisions[0][0].hasBorders = mainDivisions[0][0].hasControls = mainDivisions[0][0].selectable = false;
    canvas.add(mainDivisions[0][0]);
}

function updateLeftSquareData() {
    var auxleft, auxtop, height, factor;
    height = computeSquaresSize();
    auxtop = container.top + container.height * 0.5 + (container.height * 0.5 - height) / 2;
    factor = computeFSCB();
    auxleft = container.left + ((container.width - (height*2))*factor);
    removeDivisions(leftDivisions);
    leftDivisions = [];
    leftDivisions[0] = [];
    leftDivisions[0][0] = new fabric.Rect({ fill: 'rgba(204, 75, 55, 0.3)', stroke: 'rgba(204, 75, 55, 1)', strokeWidth: 2, rx: 2, ry: 2 })
    leftDivisions[0][0].set({ left: auxleft, top: auxtop, width: height, height: height });
    leftDivisions[0][0].hasBorders = leftDivisions[0][0].hasControls = leftDivisions[0][0].selectable = false;
    canvas.add(leftDivisions[0][0]);
    leftSquare.set({left: auxleft, top: auxtop, width: height, height: height});
}

function updateRightSquareData() {
    var auxleft, auxtop, height, factor;
    height = computeSquaresSize();
    auxtop = container.top + container.height * 0.5 + (container.height * 0.5 - height) / 2;
    factor = computeFSCB();
    auxleft = container.left + container.width - height - ((container.width - (height * 2)) * factor);
    removeDivisions(rightDivisions);
    rightDivisions = [];
    rightDivisions[0] = [];
    rightDivisions[0][0] = new fabric.Rect({ fill: 'rgba(58, 219, 118, 0.3)', stroke: 'rgba(58, 219, 118, 1)', strokeWidth: 2, rx: 2, ry: 2 })
    rightDivisions[0][0].set({ left: auxleft, top: auxtop, width: height, height: height });
    rightDivisions[0][0].hasBorders = rightDivisions[0][0].hasControls = rightDivisions[0][0].selectable = false;
    canvas.add(rightDivisions[0][0]);
    rightSquare.set({ left: auxleft, top: auxtop, width: height, height: height });
}

function computeCheckBoxData(){
    var data = {}, auxleft;
    if (container.width / container.height >= 1.3) {
        data.width = (rightSquare.left - (leftSquare.left + leftSquare.width)) * 0.3;
    } else {
        data.width = (rightSquare.left - (leftSquare.left + leftSquare.width)) * 0.55;
    }
    data.height = data.width;
    data.top = container.top + container.height*0.5 + (container.height*0.5-data.height)/2;
    auxleft = leftSquare.left + leftSquare.width;
    data.left = auxleft + (rightSquare.left-auxleft-data.width) /2;
    data.radius = data.width/2;
    
    return data;
}

function setCheckButton() {
    var data = computeCheckBoxData();
    var cb = fabric.Image.fromURL('assets/img/checkbutton.png', function (oImg) {
        
        oImg.set({
            top: data.top,
            left: data.left,
            width: data.width,
            height: data.width,
            clipTo: function (ctx) {
                ctx.arc(0, 0, data.radius - 1, 0, Math.PI * 2, true);
            }
        });
        oImg.hasBorders = oImg.hasControls =  oImg.selectable = false;
        oImg.hoverCursor = 'pointer';
        canvas.setActiveObject(oImg);
        checkButton = canvas.getActiveObject();
        canvas.add(oImg);
        canvas.renderAll();
    });

}

// Compute information all horizontal slider have in common such as width, height, rx and ry
function computeHSData() {
    var data = {};
    data.width = mainSquare.width * 0.95;
    data.height = (container.top + container.height*0.5 - (mainSquare.top+mainSquare.height))*0.1;
    data.ry = data.height/2;
    data.rx  = data.ry;
    return data;
}

// Compute information all vertical slider have in common such as width, height, rx and ry
function computeVSData() {
    var data = {};
    data.width = (computeHSData()).height;
    data.height = mainSquare.height * 0.95;
    data.rx = data.width/2;
    data.ry = data.rx;
    return data;
}

function updateVSMSData() {
    var data = computeVSData();
    data.left = mainSquare.left + mainSquare.width + data.width*2;
    data.top = mainSquare.top + (mainSquare.height-data.height)/2;
    vSliderMS.set({width: data.width, height: data.height, left: data.left, top: data.top, rx: data.rx, ry: data.ry});
}

function updateHSMSData() {
    var data = computeHSData();
    data.top = mainSquare.top + mainSquare.height + data.height * 2;
    data.left = mainSquare.left + (mainSquare.width - data.width) / 2;
    hSliderMS.set({ width: data.width, height: data.height, left: data.left, top: data.top, rx: data.rx, ry: data.ry });
}

function updateVSLSData() {
    var data = computeVSData();
    data.top = leftSquare.top + (leftSquare.height-data.height)/2;
    data.left = leftSquare.left + leftSquare.width + data.width*2;
    vSliderLS.set({ width: data.width, height: data.height, left: data.left, top: data.top, rx: data.rx, ry: data.ry });
}

function updateHSLSData() {
    var data = computeHSData();
    data.top = leftSquare.top + leftSquare.height + data.height*2;
    data.left = leftSquare.left + (leftSquare.width-data.width)/2;
    hSliderLS.set({width: data.width, height: data.height, left: data.left, top: data.top, rx: data.rx, ry: data.ry});
}

function updateVSRSData() {
    var data = computeVSData();
    data.top = rightSquare.top + (rightSquare.height - data.height) / 2;
    data.left = rightSquare.left + rightSquare.width + data.width * 2;
    vSliderRS.set({ width: data.width, height: data.height, left: data.left, top: data.top, rx: data.rx, ry: data.ry });
}

function updateHSRSData() {
    var data = computeHSData();
    data.top = rightSquare.top + rightSquare.height + data.height * 2;
    data.left = rightSquare.left + (rightSquare.width - data.width) / 2;
    hSliderRS.set({ width: data.width, height: data.height, left: data.left, top: data.top, rx: data.rx, ry: data.ry });
}

function getBallData() {
    var data = {};
    data.radius = vSliderMS.width*1.2;
    data.fill = 'rgba(9, 9, 9, 1)';
    data.stroke = data.fill;
    return data;
}

function setBMS() {
    var data = getBallData();
    data.x = numberLine.left;
    data.y = numberLine.top + numberLine.height/2;
    return newCircleOnCenter(data.x, data.y, data.radius).set({fill: mainSquare.stroke, stroke: mainSquare.stroke});
}

function setBLS() {
    var data = getBallData();
    data.x = numberLine.left;
    data.y = numberLine.top + numberLine.height / 2;
    return newCircleOnCenter(data.x, data.y, data.radius).set({ fill: leftSquare.stroke, stroke: leftSquare.stroke });
}

function setBRS() {
    var data = getBallData();
    data.x = numberLine.left;
    data.y = numberLine.top + numberLine.height / 2;
    return newCircleOnCenter(data.x, data.y, data.radius).set({ fill: rightSquare.stroke, stroke: rightSquare.stroke });
}

function setBVMS() {
    var data = getBallData();
    data.x= vSliderMS.left + vSliderMS.width/2;
    data.y = vSliderMS.top + vSliderMS.height-data.radius;
    return newCircleOnCenter(data.x, data.y, data.radius).set({fill: data.fill, stroke: data.stroke});
}

function setBHMS() {
    var data = getBallData();
    data.x = hSliderMS.left;
    data.y = hSliderMS.top + hSliderMS.height/2;
    return newCircleOnCenter(data.x, data.y, data.radius).set({fill: data.fill, stroke: data.stroke});
}

function setBVLS() {
    var data = getBallData();
    data.x = vSliderLS.left + vSliderLS.width/2;
    data.y = vSliderLS.top + vSliderLS.height-data.radius;
    return newCircleOnCenter(data.x, data.y, data.radius).set({ fill: data.fill, stroke: data.stroke });
}

function setBHLS() {
    var data = getBallData();
    data.x = hSliderLS.left;
    data.y = hSliderLS.top + hSliderLS.height / 2;
    return newCircleOnCenter(data.x, data.y, data.radius).set({ fill: data.fill, stroke: data.stroke });
}

function setBVRS() {
    var data = getBallData();
    data.x = vSliderRS.left + vSliderRS.width / 2;
    data.y = vSliderRS.top + vSliderRS.height - data.radius;
    return newCircleOnCenter(data.x, data.y, data.radius).set({ fill: data.fill, stroke: data.stroke });
}

function setBHRS() {
    var data = getBallData();
    data.x = hSliderRS.left;
    data.y = hSliderRS.top + hSliderRS.height / 2;
    return newCircleOnCenter(data.x, data.y, data.radius).set({ fill: data.fill, stroke: data.stroke });
}

function computeNumbersFontSize() {
    numberFontSize = ballVSMS.radius * 2;
}

function updateNVMSData() {
    var data  = {};
    data.fontSize = numberFontSize;
    data.left = ballVSMS.left + ballVSMS.radius*3;
    data.top = ballVSMS.top;// + ballVSMS.radius - numVSMS.height/2;
    numVSMS.set({left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica'});
}

function updateNHMSData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballHSMS.left + ballHSMS.radius/2;
    data.top = ballHSMS.top + ballVSMS.radius * 3;
    
    numHSMS.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica' });
}

function updateNVLSData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballVSLS.left + ballVSLS.radius * 3;
    data.top = ballVSLS.top;
    numVSLS.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica' });
}

function updateNHLSData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballHSLS.left + ballHSLS.radius / 2;
    data.top = ballHSLS.top + ballVSLS.radius * 3;

    numHSLS.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica' });
}

function updateNVRSData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballVSRS.left + ballVSRS.radius * 3;
    data.top = ballVSRS.top;
    numVSRS.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica' });
}

function updateNHRSData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballHSRS.left + ballHSRS.radius / 2;
    data.top = ballHSRS.top + ballVSRS.radius * 3;

    numHSRS.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica' });
}

function updateNumberLineData() {
    var data = {};
    data.width = container.width*0.8;
    data.height = hSliderMS.height;
    data.top = container.top + container.height/2 - data.height/2;
    data.left = container.left + (container.width - data.width)/2;
    data.rx = hSliderMS.rx;
    data.ry = data.rx;
    numberLine.set({left: data.left, top: data.top, width: data.width, height: data.height, rx: data.rx, ry: data.ry});
}

function updateNZeroData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = numberLine.left - ballMS.radius*3;
    data.top = numberLine.top + ballMS.radius *1.5;
    nLineZero.set({left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica'});
}

function updateNOneData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = numberLine.left + numberLine.width + ballMS.radius;
    data.top = numberLine.top + ballMS.radius * 1.5;
    nLineOne.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica' });
}

function updateMainFraqData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballMS.left + ballMS.radius/2;
    data.top = ballMS.top + ballMS.radius*3;
    data.stroke = mainSquare.stroke;
    mainNum.set({left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica', stroke: data.stroke});
    data.top = data.top + mainNum.height;
    mainFraq.set({left: data.left-data.fontSize/3.5, top:data.top, height: data.fontSize/6, width: data.fontSize, fill: data.stroke, stroke: data.stroke})
    data.top = data.top + mainFraq.height;
    data.left = mainNum.left;
    mainDen.set({left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica', stroke: data.stroke});
}

function updateLeftFraqData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballLS.left + ballLS.radius / 2;
    data.top = ballLS.top + ballLS.radius * 3;
    data.stroke = leftSquare.stroke;
    leftNum.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica', stroke: data.stroke });
    data.top = data.top + leftNum.height;
    leftFraq.set({ left: data.left - data.fontSize / 3.5, top: data.top, height: data.fontSize / 6, width: data.fontSize, fill: data.stroke, stroke: data.stroke })
    data.top = data.top + leftFraq.height;
    data.left = leftNum.left;
    leftDen.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica', stroke: data.stroke });
}

function updateRightFraqData() {
    var data = {};
    data.fontSize = numberFontSize;
    data.left = ballRS.left + ballRS.radius / 2;
    data.top = ballRS.top + ballRS.radius * 3;
    data.stroke = rightSquare.stroke;
    rightNum.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica', stroke: data.stroke });
    data.top = data.top + rightNum.height;
    rightFraq.set({ left: data.left - data.fontSize / 3.5, top: data.top, height: data.fontSize / 6, width: data.fontSize, fill: data.stroke, stroke: data.stroke })
    data.top = data.top + rightFraq.height;
    data.left = rightNum.left;
    rightDen.set({ left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: 'Helvetica', stroke: data.stroke });
}

function removeDivisions(divisions) {
    if (typeof divisions !== "undefined" && divisions != null) {
        for (var i = 0; i < divisions.length; i++) {
            for (var j = 0; j < divisions[i].length; j++) {
                console.log('removeDiv' + j);
                canvas.remove(divisions[i][j]);
            }
        }
    } else {
        console.log('divisions no tenía nada');
    }
}

function setDivisions(square, rows, columns) {
    var divisions = [];
    if (square == mainSquare) {
        divisions = mainDivisions;
    } else if (square == leftSquare) {
        divisions = leftDivisions;
    } else if (square == rightSquare) {
        divisions = rightDivisions;
    }
    removeDivisions(divisions);
    divisions = [];
    var r = parseInt(rows.text), c = parseInt(columns.text), height, width;
    height = square.height/r;
    width = square.width/c;
    for (var i = 0; i<r; i++) {
        divisions[i] = [];
        for(var j = 0; j<c; j++) {
            divisions[i][j] = new fabric.Rect({left:square.left+(j*width), top: square.top+(i*height),
                 height: height, width: width, stroke: square.stroke, fill: square.fill });
            divisions[i][j].hasBorders = divisions[i][j].hasControls = divisions[i][j].selectable = false;
            divisions[i][j].hoverCursor = 'pointer';
            canvas.add(divisions[i][j]);
        }
    }
    if (square == mainSquare) {
        mainDivisions = divisions;
    } else if (square == leftSquare) {
        leftDivisions = divisions;
    } else if (square == rightSquare) {
        rightDivisions = divisions;
    }
}

function verticalDragHandling(e, slider, number, otherNumber, square) {
    var value = 0, center, raw, lastValue;
    lastValue = number.text;
    if (e.target.top > slider.top + slider.height - e.target.radius) {
        e.target.set({ top: slider.top + slider.height - e.target.radius});
    } else if (e.target.top < slider.top - e.target.radius) {
        e.target.set({top: slider.top - e.target.radius+1});
    }
    center = e.target.top + e.target.radius;
    raw = slider.top + slider.height - center;
    value = (-1) * Math.floor(-1 * (raw / (slider.height / maxDiv)));
    number.set({top: e.target.top, text: value.toString()});
    if (value != lastValue) {
        setDivisions(square, number, otherNumber);
    }
}

function horizontalDragHandling(e, slider, number, otherNumber,square) {
    var value, center, raw, lastValue;
    lastValue = number.text;
    if(e.target.left > slider.left + slider.width - e.target.radius) {
        e.target.set({left: slider.left + slider.width - e.target.radius});
    } else if (e.target.left < slider.left - e.target.radius) {
        e.target.set({left: slider.left - e.target.radius +1});
    }
    center = e.target.left + e.target.radius;
    raw = slider.width - (slider.left + slider.width - center);
    value = (-1)*Math.floor(-1*(raw / (slider.width / maxDiv)));
    number.set({left: e.target.left + e.target.radius/2, text: value.toString() });
    if (value != lastValue) {
        setDivisions(square, otherNumber, number);
    }
    
}

function dragHandling(e) {
    if (e.target == ballVSMS) {
        verticalDragHandling(e, vSliderMS, numVSMS, numHSMS, mainSquare);
        mainSelected = [];
        updateMainFraq();
    } else if (e.target == ballVSLS) {
        verticalDragHandling(e, vSliderLS, numVSLS, numHSLS, leftSquare);
        leftSelected = [];
        updateLeftFraq();
    } else if (e.target == ballVSRS) {
        verticalDragHandling(e, vSliderRS, numVSRS, numHSRS, rightSquare);
        rightSelected = [];
        //updateRightFraq();
    } else if (e.target == ballHSMS) {
        horizontalDragHandling(e, hSliderMS, numHSMS, numVSMS, mainSquare);
        mainSelected = [];
        updateMainFraq();
    } else if (e.target == ballHSLS) {
        horizontalDragHandling(e, hSliderLS, numHSLS, numVSLS, leftSquare);
        leftSelected = [];
        updateLeftFraq();
    } else if (e.target == ballHSRS) {
        horizontalDragHandling(e, hSliderRS, numHSRS, numVSRS, rightSquare);
        rightSelected = [];
        //updateRightFraq();
    }
}

function isInMainDiv(target) {
    var i, j;
    var coords = {x: -1, y: -1};
    for (i=0; i<mainDivisions.length; i++) {
        for (j=0; j<mainDivisions[i].length; j++) {
            if(mainDivisions[i][j]==target) {
                coords.x = i;
                coords.y = j;
                break;
            }
        }
    }
    return coords;
}

function isInLeftDiv(target) {
    var i, j;
    var coords = { x: -1, y: -1 };
    for (i = 0; i < leftDivisions.length; i++) {
        for (j = 0; j < leftDivisions[i].length; j++) {
            if (leftDivisions[i][j] == target) {
                coords.x = i;
                coords.y = j;
                break;
            }
        }
    }
    return coords;
}

function isInRightDiv(target) {
    var i, j;
    var coords = { x: -1, y: -1 };
    for (i = 0; i < rightDivisions.length; i++) {
        for (j = 0; j < rightDivisions[i].length; j++) {
            if (rightDivisions[i][j] == target) {
                coords.x = i;
                coords.y = j;
                break;
            }
        }
    }
    return coords;
}

function getindexOf(array, object) {
    var i;
    for (i=0; i<array.length; i++) {
        if (array[i].x == object.x && array[i].y == object.y){
            return i;
        }
    }
    return -1;
}
function updateMainFraq() {
    var denominator = parseInt(numVSMS.text) * parseInt(numHSMS.text);
    var numerator = mainSelected.length;
    console.log('la fraccion vale' + (numerator/denominator));
    var auxleft = numberLine.left + numberLine.width*(numerator/denominator) - ballMS.radius;
    mainDen.set({text: denominator.toString()});
    mainNum.set({text: numerator.toString()});
    ballMS.set({left: auxleft});
    updateMainFraqData();
}

function updateLeftFraq() {
    var denominator = parseInt(numVSLS.text) * parseInt(numHSLS.text);
    var numerator = leftSelected.length;
    var auxleft = numberLine.left + numberLine.width * (numerator / denominator) - ballLS.radius;
    leftDen.set({ text: denominator.toString() });
    leftNum.set({ text: numerator.toString() });
    ballLS.set({ left: auxleft });
    updateLeftFraqData();
}

function updateRightFraq() {
    var denominator = parseInt(numVSRS.text) * parseInt(numHSRS.text);
    var numerator = rightSelected.length;
    var auxleft = numberLine.left + numberLine.width * (numerator / denominator) - ballRS.radius;
    rightDen.set({ text: denominator.toString() });
    rightNum.set({ text: numerator.toString() });
    ballRS.set({ left: auxleft });
    updateRightFraqData();
}

function updateSaveButtonData() {
    var data = {};
    data.fontFamily = 'Helvetica';
    data.fontSize = numHSLS.fontSize *2;
    data.left = container.left + container.width - save.width  - container.width*0.1;
    data.top = container.top + container.height*0.1;
    save.set({left: data.left, top: data.top, fontFamily: data.fontFamily, fontSize: data.fontSize});
}

function setResultInitialSate(){
    var data = {};
    data.fontSize = numHSLS.fontSize * 2;
    data.fontFamily = 'Helvetica';
    data.left = container.left + container.width * 0.1;
    data.top = container.top + container.height * 0.1;
    result.set({ text: "Resuelve", left: data.left, top: data.top, fontSize: data.fontSize, fontFamily: data.fontFamily });
}

function clickHandlingMain(e, x, y) {
    if (typeof mainSelected != "undefined" && mainSelected != null) {
        var index;
        if ((index = getindexOf(mainSelected, {x: x, y: y}))!= -1) {
            mainSelected.splice(index,1);
            e.target.set({fill: mainSquare.fill});
        } else {
            mainSelected.push({x: x, y: y});
            e.target.set({fill: mainSquare.stroke});
        }
    } else {
        mainSelected = [];
        mainSelected.push({x: x, y: y});
        e.target.set({fill: mainSquare.stroke});
    }
    $("#selecteds").val(mainSelected.length);
    updateMainFraq();
}

function clickHandlingLeft(e, x, y) {
    if (typeof leftSelected != "undefined" && leftSelected != null) {
        // console.log('Estaba definido');
        var index;
        if ((index = getindexOf(leftSelected, { x: x, y: y })) != -1) {
            // console.log('Pertenecia al arreglo');
            leftSelected.splice(index, 1);
            e.target.set({ fill: leftSquare.fill });
        } else {
            leftSelected.push({ x: x, y: y });
            e.target.set({ fill: leftSquare.stroke });
        }
    } else {
        // console.log('No estaba definido');
        leftSelected = [];
        leftSelected.push({ x: x, y: y });
        e.target.set({ fill: leftSquare.stroke });
    }
    updateLeftFraq();
}

function clickHandlingRight(e, x, y) {
    if (typeof rightSelected != "undefined" && rightSelected != null) {
        // console.log('Estaba definido');
        var index;
        if ((index = getindexOf(rightSelected, { x: x, y: y })) != -1) {
            // console.log('Pertenecia al arreglo');
            rightSelected.splice(index, 1);
            e.target.set({ fill: rightSquare.fill });
        } else {
            rightSelected.push({ x: x, y: y });
            e.target.set({ fill: rightSquare.stroke });
        }
    } else {
        // console.log('No estaba definido');
        rightSelected = [];
        rightSelected.push({ x: x, y: y });
        e.target.set({ fill: rightSquare.stroke });
    }
    updateRightFraq();
}

function checkEquality() {
    if(mainDen.text == leftDen.text || mainDen == rightDen.text){
        result.set({text: 'Utiliza denominadores\n distintos al ejemplo'});
    } else {
        var mainVal, leftVal, rightVal;
        mainVal = parseInt(mainNum.text)/(parseInt(mainDen.text));
        mainVal = mainVal.toFixed(2);
        leftVal = parseInt(leftNum.text) / (parseInt(leftDen.text));
        leftVal = leftVal.toFixed(2);
        rightVal = parseInt(rightNum.text) / (parseInt(rightDen.text));
        rightVal = rightVal.toFixed(2);
        // console.log('mainVal ' + mainVal);
        // console.log('leftVal ' + leftVal);
        // console.log('rightVal ' +rightVal);
        if (mainVal == leftVal && mainVal == rightVal) {
            result.set({text: "Correcto"});
        } else {
            result.set({text: "Incorrecto"});
        }
    }
    canvas.renderAll();
}

function clickHandling(e) {
    var coords = {};
    if(e.target == checkButton) {
        checkEquality(e);
    }else if(e.target == save){
        // console.log('se clickeo save');
        $("#rows").val(mainDivisions.length);
        $("#columns").val(mainDivisions[0].length);
        $("#selecteds").val(mainSelected.length);
        
        $("#form").submit();
    } else if ( (coords = isInMainDiv(e.target)).x != -1) {
        clickHandlingMain(e, coords.x, coords.y);
    } else if ((coords = isInLeftDiv(e.target)).x != -1) {
        clickHandlingLeft(e, coords.x, coords.y);
    } else if ((coords = isInRightDiv(e.target)).x != -1) {
        clickHandlingRight(e, coords.x, coords.y);
    }
    
}
function setInitialSliderPositions(columns, rows) {
    numHSMS.set({text: columns.toString()});
    numVSMS.set({text: rows.toString()});
    ballHSMS.set({left: hSliderMS.left + (hSliderMS.width/maxDiv)*columns - ballHSMS.radius});
    ballVSMS.set({ top: vSliderMS.top + (vSliderMS.height / maxDiv) * columns - ballVSMS.radius });
}

function setInitialDivisions(rows, columns, count) {
    var divisions = [];
    mainSelected = [];
    var square = mainSquare;
    var r = rows, c = columns, height, width;
    height = square.height/r;
    width = square.width/c;

    for (var i = 0; i<r; i++) {
        divisions[i] = [];
        for(var j = 0; j<c; j++) {
            divisions[i][j] = new fabric.Rect({left:square.left+(j*width), top: square.top+(i*height),
                 height: height, width: width, stroke: square.stroke, fill: square.fill });
            divisions[i][j].hasBorders = divisions[i][j].hasControls = divisions[i][j].selectable = false;
            divisions[i][j].hoverCursor = 'pointer';
            canvas.add(divisions[i][j]);
            if(count > 0) {
                divisions[i][j].set({fill: square.stroke});
                mainSelected.push({x: i, y: j});
            }
            count = count - 1;
        }
    }
    mainDivisions = divisions;
    setInitialSliderPositions(columns, rows);
}

function setInitialProblem() {
    var url = new URL(window.location.href);
    var rows, columns, selecteds, idExercise;
    rows = url.searchParams.get('rows');
    columns = url.searchParams.get('columns');
    selecteds = url.searchParams.get('selecteds');
    idExercise = url.searchParams.get('idExercise');
    
    $("#rows").val(rows);
    $("#columns").val(columns);
    $("#selecteds").val(selecteds);
    $("#idExercise").val(idExercise);
    console.log('rows ' + rows);
    console.log('columns ' + columns);
    console.log('selected ' + selecteds);
    if (rows != null && columns != null && selecteds != null) {
        setInitialDivisions(rows, columns, selecteds);
        updateMainFraq();
    }
}


function start() {
   
    var data = {}; // Esta variable se utiliza para obtener la información de visualizacion de algunos objetos
    this.__canvases = [];
    canvas = new fabric.Canvas('c');
    console.log(canvas);

    // Variables con el ancho y alto de el div.build-container (padre del padre del canvas lowerCanvasEl)
    var cwidth = canvas.lowerCanvasEl.parentElement.parentElement.offsetWidth;
    var cheight = canvas.lowerCanvasEl.parentElement.parentElement.offsetHeight;
    canvas.setHeight(cheight);
    canvas.setWidth(cwidth);
    // Como calcularemos las dimensiones de los objetos, ocupamos  variables auxiliares
    var auxleft, auxtop, auxwidth, auxheight;

    // Variables para mantener siempre los valores del contenedor
    var cleft, ctop, cwidth, cheight;
    container = new fabric.Rect({ fill: 'rgba(5,5,5,0.01)', stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, rx: 10, ry: 10 });
    container.hasControls = container.hasBorders = container.selectable = false;
    container.hoverCursor = 'default';

    data = updateContainerData(cwidth, cheight);
    cleft = data.left;
    ctop = data.top;
    cwidth = data.width;
    cheight = data.height;

    canvas.add(container);

    mainSquare = new fabric.Rect({ fill: 'rgba(23, 121, 186, 0.25)', stroke: 'rgba(23, 121, 186, 1)', strokeWidth: 2, rx:2, ry:2});
    mainSquare.hasBorders = mainSquare.hasControls = mainSquare.selectable = false;
    mainSquare.hoverCursor = 'pointer';
    canvas.add(mainSquare);
    updateMainSquareData();

    leftSquare = new fabric.Rect({ fill: 'rgba(204, 75, 55, 0.25)', stroke: 'rgba(204, 75, 55, 1)', strokeWidth: 2, rx: 2, ry: 2 });
    leftSquare.hasBorders = leftSquare.hasControls = leftSquare.selectable = false;
    leftSquare.hoverCursor = 'pointer';
    canvas.add(leftSquare);    
    updateLeftSquareData();

    rightSquare = new fabric.Rect({ fill: 'rgba(58, 219, 118, 0.25)', stroke: 'rgba(58, 219, 118, 1)', strokeWidth: 2, rx: 2, ry: 2 });
    rightSquare.hasBorders = rightSquare.hasControls = rightSquare.selectable = false;
    rightSquare.hoverCursor = 'pointer';
    canvas.add(rightSquare);
    updateRightSquareData();

    setCheckButton();

    vSliderMS = new fabric.Rect({fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1})
    vSliderMS.hasBorders = vSliderMS.hasControls = vSliderMS.selectable  = false;
    vSliderMS.hoverCursor = 'default';
    updateVSMSData();
    canvas.add(vSliderMS);

    hSliderMS = new fabric.Rect({ fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1 })
    hSliderMS.hasBorders = hSliderMS.hasControls = hSliderMS.selectable = false;
    hSliderMS.hoverCursor = 'default';
    updateHSMSData();
    canvas.add(hSliderMS);

    vSliderLS = new fabric.Rect({ fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1 })
    vSliderLS.hasBorders = vSliderLS.hasControls = vSliderLS.selectable = false;
    vSliderLS.hoverCursor = 'default';
    updateVSLSData();
    canvas.add(vSliderLS);

    hSliderLS = new fabric.Rect({ fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1 })
    hSliderLS.hasBorders = hSliderLS.hasControls = vSliderLS.selectable = false;
    hSliderLS.hoverCursor = 'default';
    updateHSLSData();
    canvas.add(hSliderLS);

    vSliderRS = new fabric.Rect({ fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1 })
    vSliderRS.hasBorders = vSliderRS.hasControls = vSliderRS.selectable = false;
    vSliderRS.hoverCursor = 'default';
    updateVSRSData();
    canvas.add(vSliderRS);

    hSliderRS = new fabric.Rect({ fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1 })
    hSliderRS.hasBorders = hSliderRS.hasControls = vSliderRS.selectable = false;
    hSliderRS.hoverCursor = 'default';
    updateHSRSData();
    canvas.add(hSliderRS);

    ballVSMS = setBVMS();
    ballVSMS.hasBorders = ballVSMS.hasControls = false;
    ballVSMS.lockMovementX = true;
    canvas.add(ballVSMS);

    ballHSMS = setBHMS();
    ballHSMS.hasBorders = ballHSMS.hasControls = false;
    ballHSMS.lockMovementY = true;
    canvas.add(ballHSMS);

    ballVSLS = setBVLS();
    ballVSLS.hasBorders = ballVSLS.hasControls = false;
    ballVSLS.lockMovementX = true;
    canvas.add(ballVSLS);

    ballHSLS = setBHLS();
    ballHSLS.hasBorders = ballHSLS.hasControls = false;
    ballHSLS.lockMovementY = true;
    canvas.add(ballHSLS);

    ballVSRS = setBVRS();
    ballVSRS.hasBorders = ballVSRS.hasControls = false;
    ballVSRS.lockMovementX = true;
    canvas.add(ballVSRS);

    ballHSRS = setBHRS();
    ballHSRS.hasBorders = ballHSRS.hasControls = false;
    ballHSRS.lockMovementY = true;
    canvas.add(ballHSRS);

    computeNumbersFontSize();

    numVSMS = new fabric.Text("1");
    numVSMS.hasBorders = numVSMS.hasControls = numVSMS.selectable = false;
    numVSMS.hoverCursor = 'default';
    updateNVMSData();
    canvas.add(numVSMS);

    numHSMS = new fabric.Text("1");
    numHSMS.hasBorders = numHSMS.hasControls = numHSMS.selectable = false;
    numHSMS.hoverCursor = 'default';
    updateNHMSData();
    canvas.add(numHSMS);

    numVSLS = new fabric.Text("1");
    numVSLS.hasBorders = numVSLS.hasControls = numVSLS.selectable = false;
    numVSLS.hoverCursor = 'default';
    updateNVLSData();
    canvas.add(numVSLS);

    numHSLS = new fabric.Text("1");
    numHSLS.hasBorders = numHSLS.hasControls = numHSLS.selectable = false;
    numHSLS.hoverCursor = 'default';
    updateNHLSData();
    canvas.add(numHSLS);

    numVSRS = new fabric.Text("1");
    numVSRS.hasBorders = numVSRS.hasControls = numVSRS.selectable = false;
    numVSRS.hoverCursor = 'default';
    updateNVRSData();
    canvas.add(numVSRS);

    numHSRS = new fabric.Text("1");
    numHSRS.hasBorders = numHSRS.hasControls = numHSRS.selectable = false;
    numHSRS.hoverCursor = 'default';
    updateNHRSData();
    canvas.add(numHSRS);

    numberLine = new fabric.Rect({ fill: 'rgba(175, 175, 175, 1)', stroke: 'rgba(175, 175, 175, 1)', strokeWidth: 1 });
    numberLine.hasBorders = numberLine.hasControls = numberLine.selectable = false;
    numberLine.hoverCursor = 'default';
    updateNumberLineData();
    canvas.add(numberLine);

    ballLS = setBLS();
    ballLS.hasBorders = ballLS.hasControls = ballLS.selectable = false;
    ballLS.hoverCursor = 'default';
    canvas.add(ballLS);

    ballRS = setBRS();
    ballRS.hasBorders = ballRS.hasControls = ballRS.selectable = false;
    ballRS.hoverCursor = 'default';
    canvas.add(ballRS);

    ballMS = setBMS();
    ballMS.hasBorders = ballMS.hasControls = ballMS.selectable = false;
    ballMS.hoverCursor = 'default';
    canvas.add(ballMS);

    nLineZero = new fabric.Text("0");
    nLineZero.hasBorders = nLineZero.hasControls = nLineZero.selectable = false;
    nLineZero.hoverCursor = 'default';
    updateNZeroData();
    canvas.add(nLineZero);

    nLineOne = new fabric.Text("1");
    nLineOne.hasBorders = nLineOne.hasControls = nLineOne.selectable = false;
    nLineOne.hoverCursor = 'default';
    updateNOneData();
    canvas.add(nLineOne);

    leftNum = new fabric.Text("0");
    leftNum.hasBorders = leftNum.hasControls = leftNum.selectable = false;
    leftNum.hoverCursor = 'default';
    canvas.add(leftNum);

    leftFraq = new fabric.Rect({ stroke: 'rgba(23, 121, 186, 1)', fill: 'rgba(23, 121, 186, 1)' });
    leftFraq.hasBorders = leftFraq.hasControls = leftFraq.selectable = false;
    leftFraq.hoverCursor = 'default';
    canvas.add(leftFraq);

    leftDen = new fabric.Text("1");
    leftDen.hasBorders = leftDen.hasControls = leftDen.selectable = false;
    leftDen.hoverCursor = 'default';
    canvas.add(leftDen);

    updateLeftFraqData();

    rightNum = new fabric.Text("0");
    rightNum.hasBorders = rightNum.hasControls = rightNum.selectable = false;
    rightNum.hoverCursor = 'default';
    canvas.add(rightNum);

    rightFraq = new fabric.Rect({ stroke: 'rgba(23, 121, 186, 1)', fill: 'rgba(23, 121, 186, 1)' });
    rightFraq.hasBorders = rightFraq.hasControls = rightFraq.selectable = false;
    rightFraq.hoverCursor = 'default';
    canvas.add(rightFraq);

    rightDen = new fabric.Text("1");
    rightDen.hasBorders = rightDen.hasControls = rightDen.selectable = false;
    rightDen.hoverCursor = 'default';
    canvas.add(rightDen);

    updateRightFraqData();

    mainNum = new fabric.Text("0");
    mainNum.hasBorders = mainNum.hasControls = mainNum.selectable = false;
    mainNum.hoverCursor = 'default';
    canvas.add(mainNum);

    mainFraq = new fabric.Rect({ stroke: 'rgba(23, 121, 186, 1)', fill: 'rgba(23, 121, 186, 1)'});
    mainFraq.hasBorders = mainFraq.hasControls = mainFraq.selectable = false;
    mainFraq.hoverCursor = 'default';
    canvas.add(mainFraq);

    mainDen = new fabric.Text("1");
    mainDen.hasBorders = mainDen.hasControls = mainDen.selectable = false;
    mainDen.hoverCursor = 'default';
    canvas.add(mainDen);
    
    updateMainFraqData();

    save = new fabric.Text("Guardar");
    save.hasBorders = save.hasControls = save.selectable = false;
    save.hoverCursor = 'pointer';
    canvas.add(save);

    updateSaveButtonData();

    result = new fabric.Text("");
    result.hasBorders = result.hasControls = result.selectable = false;
    result.hoverCursor = 'default';
    canvas.add(result);

    setResultInitialSate();

    setInitialProblem();
    


    canvas.on({
        'object:moving': function(e) {
            dragHandling(e);
            $("#rows").val(numHSMS.text);
            $("#columns").val(numVSMS.text);

        },
        'mouse:up': function(e) {
            clickHandling(e);
        }
    });

    canvas.selection = false;
    this.__canvases.push(canvas);
    
}

function resizeCanvas() {
    var cwidth, cheight;
    var data;
    var auxleft, auxtop, auxwidth, auxheight;
    cheight = canvas.lowerCanvasEl.parentElement.parentElement.offsetHeight;
    cwidth = canvas.lowerCanvasEl.parentElement.parentElement.offsetWidth;
    canvas.setHeight(cheight);
    canvas.setWidth(cwidth);
    data = updateContainerData(cwidth, cheight);

    canvas.renderAll();
}
window.addEventListener('load', start, false);
window.addEventListener('resize', resizeCanvas, false);