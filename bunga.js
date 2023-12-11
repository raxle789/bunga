const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
   dimensions: [1080, 1080]
};

let image;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ width, height }) => {
   const cell = 20;
   const cols = Math.floor(width / cell);
   const rows = Math.floor(height / cell);
   const numCells = cols * rows;

   typeCanvas.width = cols;
   typeCanvas.height = rows;

   return ({ context, width, height }) => {
      typeContext.fillStyle = 'black';
      typeContext.fillRect(0, 0, cols, rows);

      // lukis Gambar
      typeContext.drawImage(image, 0, 0, cols, rows);

      const typeData = typeContext.getImageData(0, 0, cols, rows).data;

      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);

      context.textBaseline = 'middle';
      context.textAlign = 'center';

      console.log('numCells: ', numCells);
      console.log(typeData);


      for (let i = 0; i < numCells; i++) {
         const col = i % cols;
         const row = Math.floor(i / cols);

         const x = col * cell;
         const y = row * cell;

         const r = typeData[i * 4 + 0];
         const g = typeData[i * 4 + 1];
         const b = typeData[i * 4 + 2];
         const a = typeData[i * 4 + 3];

         const glyph = getGlyph();

         context.font = `${cell * 2}px ${fontFamily}`;
         if (Math.random() < 0.1) context.font = `${cell * 3}px ${fontFamily}`;
         context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

         context.save();
         context.translate(x, y);
         context.translate(cell * 0.5, cell * 0.5);
         context.fillText(glyph, 0, 0);
         context.restore();
      }

      // lukisan di kiri atas
      context.drawImage(typeCanvas, 0, 0);
   };
};

const getGlyph = () => {
   //settingan repaint lukisan bunga
   const glyphs = 'abmcuwr'.split('');
   const glyphs2 = './:-'.split('');
   
   return random.pick(glyphs);
};

const loadMeSomeImage = (url) => {
   return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = url;
   });
};

const start = async () => {
   // const url = './assets/bunga3-kotak.jpg';
   const url = './assets/bunga4.jpg';
   image = await loadMeSomeImage(url);
   manager = await canvasSketch(sketch, settings);
};

start();