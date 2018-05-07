'use strict';

const colorRegex =/color-\d/;
const controlPanel = {
  height: 8,
  width: 17,
  scale: 100,
  rotation: 0
};
let activeColor = 'color-1';
let triangles;

const redraw = (width, height) => {
  const main = document.querySelector('main');
  while (main.firstChild) main.firstChild.remove();
  return createTriangleGrid(main, width, height);
}

const createTriangleGrid = (container, width, height) => {
  const triangles = [];
  for (let y = 0; y < height; y++) {
    const row = createChild(container, 'div', 'row');
    for (let x = 0; x < width; x++) {
      triangles.push(createTri(row, x % 2 ^ y % 2));
    }
  }

  return triangles;
}

const onContextMenu = e => {
  if (e.ctrlKey) return true;
  e.preventDefault();
};

const onTriClick = e => {
  if (!e.target.classList.contains('tri')) return;
  const tri = e.target;
  switch (e.which) {
    case 1: {
      if (tri.classList.contains('invisible')) {
        tri.classList.remove('invisible');
      } else if (colorRegex.test(tri.className)) {
        tri.className = tri.className.replace(colorRegex, activeColor);
      } else {
        tri.classList.add(activeColor);
      }
      break;
    }

    case 3: {
      if (e.ctrlKey) return;
      if (colorRegex.test(tri.className)) {
        tri.className = tri.className.replace(colorRegex, '');
      } else {
        tri.classList.toggle('invisible');
      }
    }
  }
}

const createTri = (parent, isUpsideDown) => {
  const tri = createChild(parent, 'div', 'tri' + (isUpsideDown ? ' upside-down' : ''));
  return tri;
}

const createChild = (parent, type, className) => {
  const child = document.createElement(type);
  child.className = className
  parent.appendChild(child);
  return child;
}

const setMainTransform = ({ rotation, scale }) => {
  document.querySelector('#rotation-label').textContent = rotation;
  document.querySelector('#scale-label').textContent = scale;
  document.querySelector('main').style.transform = `rotate(${rotation}deg) scale(${scale / 100})`;
}

const initRangeInput = (el, fieldName) => {
  el.addEventListener('input', () => {
    controlPanel[fieldName] = Number(el.value);
    setMainTransform(controlPanel);
  });
  el.addEventListener('wheel', e => {
    const stepValue = Number(e.deltaY > 0 ? -el.step : el.step);
    let newValue = Number(el.value) + stepValue;
    newValue = Math.min(el.max, newValue);
    newValue = Math.max(el.min, newValue);
    el.value = newValue;
    controlPanel[fieldName] = newValue;
    setMainTransform(controlPanel);
  });
}

window.addEventListener('load', () => {
  triangles = redraw(controlPanel.width, controlPanel.height);
  document.querySelector('main').addEventListener('contextmenu', onContextMenu);
  document.addEventListener('mousedown', onTriClick);
  document.querySelector('#width-input').addEventListener('change', e => {
    controlPanel.width = Number(e.target.value);
  });
  document.querySelector('#height-input').addEventListener('change', e => {
    controlPanel.height = Number(e.target.value);
  });
  document.querySelector('#redraw-button').addEventListener('click', () => {
    triangles = redraw(controlPanel.width, controlPanel.height);
  });
  initRangeInput(document.querySelector('#rotation-input'), 'rotation');
  initRangeInput(document.querySelector('#scale-input'), 'scale');
  document.addEventListener('keydown', e => {
    if (e.keyCode < 49 || e.keyCode > 54) return;
    activeColor = 'color-' + (e.keyCode - 48);
  });
});
