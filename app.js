const slides = document.querySelectorAll('.slide');
slides[0].classList.add('active');
drawBody(slides[0]);

slides.forEach(slide => slide
  .addEventListener('click', () => {
    clearActiveClasses();
    slide.classList.add('active');
    drawBody(slide);
  })
);

function drawBody(slide) {
  const imageProp = slide.style.backgroundImage;
  const imageURL = imageProp.substring(5, imageProp.length - 2);
  const imgEl = createImg(imageURL);

  imgEl.onload = () => {
    const {r, g, b} = getAverageRGB(imgEl);
    const body = document.querySelector('body');
    body.style.background = `linear-gradient(#fff, rgb(${r},${g},${b})`;
  }
}

function clearActiveClasses() {
  slides.forEach(slide => slide.classList.remove('active'));
}

function getAverageRGB(imgEl) {

  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    data, width, height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);


  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    console.log('security error, img on diff domain')
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

function createImg(src, alt, title) {
  const img = document.createElement('img');
  img.crossOrigin = '';
  img.src = src;

  if (alt != null) img.alt = alt;
  if (title != null) img.title = title;
  return img;
}
