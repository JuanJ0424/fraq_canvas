function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

var stop = false; //Esta variable se usa para detener la animacion
var animbutton;

var canvas; // canvas
var container; // contenedor (no es un contenedor como tal, sólo es un rectángulo)
var obj_frac_square;

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
    container.set({left: data.left, top: data.top, width: data.width, height: data.height})
    return data;
}


function cloneWithData(o, type) {
    var data;
    if (type == 'electron') {
        data = elecdata;
    } else if (type == 'neutron') {
        data = neutdata;
    } else {
        data = protdata;
    }
    var vobj = o;
    if (vobj) {
        vobj.set({
            left: data.left,
            top: data.top // ...
        });
        canvas.add(vobj);
        canvas.renderAll();
        canvas.calcOffset();
        vobj.hasBorders = vobj.hasControls = false;
        vobj.data = {};
        vobj.data.type = type;
        vobj.data.place = 'box';
    } else {
        alert("Sorry Object Not Initialized");
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