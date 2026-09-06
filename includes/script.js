let a = [5,2,8,1,7,3,6,4];
let original = [...a];

let comp = 0;
let swaps = 0;

let running = false;
let paused = false;
let generation = 0;

const $ = id => document.getElementById(id);

const sleep = ms => new Promise(r => {

  const start = performance.now();

  function f(t){

    if(generation !== currentGen){
      r(false);
      return;
    }

    if(!paused && t - start >= ms){
      r(true);
      return;
    }

    requestAnimationFrame(f);
  }

  requestAnimationFrame(f);
});

let currentGen = 0;

function speed(){
  return 700 - Number($('speed').value) * 58;
}

function draw(active = [], pivot = -1, done = false){

  const max = Math.max(...a);

  $('bars').innerHTML = '';

  a.forEach((v,i)=>{

    const w = document.createElement('div');

    w.className = 'barwrap';

    const b = document.createElement('div');

    b.className = 'bar';

    if(i === pivot)
      b.classList.add('pivot');

    if(active.includes(i))
      b.classList.add('active');

    if(done)
      b.classList.add('done');

    b.style.setProperty(
      '--h',
      Math.max(35,(v/max)*82) + '%'
    );

    b.innerHTML = '<span>' + v + '</span>';

    w.appendChild(b);

    if(i === pivot){

      const p = document.createElement('div');

      p.className = 'pivot-label';
      p.textContent = 'p';

      w.appendChild(p);
    }

    $('bars').appendChild(w);
  });
}

function highlight(n){

  document
    .querySelectorAll('.line')
    .forEach(x =>
      x.classList.toggle(
        'hl',
        Number(x.dataset.l) === n
      )
    );
}

function vars(lo,hi,i,j,p){

  $('lo').textContent = lo;
  $('hi').textContent = hi;
  $('ii').textContent = i;
  $('jj').textContent = j;
  $('pv').textContent = p;
}

draw();


async function qs(lo,hi){

  if(lo >= hi || generation !== currentGen)
    return true;

  let p = a[hi];
  let i = lo;

  vars(lo,hi,i,lo,p);

  highlight(4);

  draw([],hi);

  $('note').textContent =
    'EL ÚLTIMO DE LA LISTA ES EL PIVOTE';

  if(!await sleep(speed()))
    return false;


  for(let j = lo; j < hi; j++){

    comp++;

    $('comp').textContent = comp;

    vars(lo,hi,i,j,p);

    highlight(5);

    draw([j],hi);

    $('note').textContent =
      `COMPARA ${a[j]} CON EL PIVOTE ${p}`;

    if(!await sleep(speed()))
      return false;


    if(a[j] < p){

      highlight(6);

      if(i !== j){

        [a[i],a[j]] =
          [a[j],a[i]];

        swaps++;

        $('swap').textContent =
          swaps;

        highlight(7);

        draw([i,j],hi);

        if(!await sleep(speed()))
          return false;
      }

      i++;

      vars(lo,hi,i,j,p);

      highlight(8);
    }
  }


  [a[i],a[hi]] =
    [a[hi],a[i]];

  swaps++;

  $('swap').textContent =
    swaps;

  vars(lo,hi,i,hi,p);

  highlight(10);

  draw([i],-1);

  $('note').textContent =
    `PIVOTE ${p} EN SU POSICIÓN`;

  if(!await sleep(speed()))
    return false;


  if(!await qs(lo,i-1))
    return false;

  if(!await qs(i+1,hi))
    return false;

  return true;
}


async function start(){

  if(running)
    return;

  running = true;
  paused = false;

  currentGen = ++generation;

  $('start').textContent =
    '▶ EJECUTANDO';

  $('note').textContent =
    'ORDENANDO...';

  const ok =
    await qs(0,a.length-1);

  if(generation !== currentGen)
    return;

  if(ok){

    draw([], -1, true);

    highlight(10);

    $('note').textContent =
      '✓ LISTA ORDENADA';

    $('start').textContent =
      '✓ TERMINADO';
  }

  running = false;
}


$('start').onclick = start;


$('pause').onclick = ()=>{

  if(!running)
    return;

  paused = !paused;

  $('pause').textContent =
    paused
      ? '▶ CONTINUAR'
      : 'Ⅱ PAUSAR';
};


$('reset').onclick = ()=>{

  generation++;
  currentGen = generation;

  running = false;
  paused = false;

  a = [...original];

  comp = 0;
  swaps = 0;

  $('comp').textContent = '0';
  $('swap').textContent = '0';

  $('start').textContent =
    '▶ INICIAR';

  $('pause').textContent =
    'Ⅱ PAUSAR';

  vars(0,7,0,0,4);

  highlight(4);

  $('note').textContent =
    'EL ÚLTIMO DE LA LISTA ES EL PIVOTE';

  draw();
};


$('new').onclick = ()=>{

  generation++;
  currentGen = generation;

  running = false;
  paused = false;

  a = Array.from(
    {length:8},
    () => Math.floor(Math.random()*9)+1
  );

  original = [...a];

  comp = 0;
  swaps = 0;

  $('comp').textContent = '0';
  $('swap').textContent = '0';

  $('start').textContent =
    '▶ INICIAR';

  $('pause').textContent =
    'Ⅱ PAUSAR';

  $('note').textContent =
    'EL ÚLTIMO DE LA LISTA ES EL PIVOTE';

  draw();
};
