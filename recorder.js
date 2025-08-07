
// Hi TWI and all the other Technical Goober Dash players

(() => {
  if (document.getElementById('kbd-ui-wrap')) return;

  const d = document;

  const wrapper = d.createElement('div');
  wrapper.id = 'kbd-ui-wrap';
  wrapper.style.position = 'fixed';
  wrapper.style.left = '10%';
  wrapper.style.top = '80%';
  wrapper.style.width = '180px';
  wrapper.style.height = '80px';
  wrapper.style.resize = 'both';
  wrapper.style.overflow = 'hidden';
  wrapper.style.zIndex = '99999';
  wrapper.style.userSelect = 'none';
  wrapper.style.background = 'transparent';

  let percentX = 0.1;
  let percentY = 0.8;

  const scaleBox = d.createElement('div');
  scaleBox.id = 'kbd-ui';
  scaleBox.style.width = '180px';
  scaleBox.style.height = '80px';
  scaleBox.style.transformOrigin = 'top left';
  scaleBox.style.position = 'absolute';
  scaleBox.style.left = '0';
  scaleBox.style.top = '0';

  const panel = d.createElement('div');
  panel.style.width = '100%';
  panel.style.height = '100%';
  panel.style.background = 'rgba(0, 0, 0, 0.6)';
  panel.style.borderRadius = '8px';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'row';
  panel.style.alignItems = 'flex-end';
  panel.style.gap = '10px';
  panel.style.padding = '16px 10px 10px 10px';
  panel.style.boxSizing = 'border-box';
  panel.style.fontFamily = 'sans-serif';
  panel.style.fontSize = '16px';
  panel.style.color = '#fff';
  panel.style.position = 'relative';

  const closeBtn = document.createElement('div');
  closeBtn.textContent = '×';
  closeBtn.title = 'Close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '4px';
  closeBtn.style.left = '6px';
  closeBtn.style.fontSize = '14px';
  closeBtn.style.color = '#fff';
  closeBtn.style.opacity = '0.2';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.transition = 'opacity 0.2s';
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.2');
  closeBtn.addEventListener('click', () => {
    d.removeEventListener('keydown', keydownHandler);
    d.removeEventListener('keyup', keyupHandler);
    d.removeEventListener('mousemove', dragMove);
    d.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('resize', resizeHandler);
    observer.disconnect();
    wrapper.remove();
  });
  panel.appendChild(closeBtn);

  const buttons = {};
  function createKey(label, keyName) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.dataset.key = keyName;
    btn.style.background = '#222';
    btn.style.border = 'none';
    btn.style.color = 'white';
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '4px';
    btn.style.opacity = '0.8';
    btn.style.cursor = 'default';
    btn.style.transition = 'all 0.1s';
    btn.style.userSelect = 'none';
    btn.style.minWidth = '32px';
    btn.style.textAlign = 'center';
    btn.style.fontSize = '1em';
    buttons[keyName.toUpperCase()] = btn;
    return btn;
  }

  const xBtn = createKey('X', 'X');
  const arrowKeys = {
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→'
  };
  for (const key in arrowKeys) {
    createKey(arrowKeys[key], key);
  }

  const arrowContainer = document.createElement('div');
  arrowContainer.style.display = 'flex';
  arrowContainer.style.flexDirection = 'column';
  arrowContainer.style.alignItems = 'center';
  arrowContainer.style.gap = '4px';

  const rowUp = document.createElement('div');
  rowUp.appendChild(buttons['ARROWUP']);

  const rowBottom = document.createElement('div');
  rowBottom.style.display = 'flex';
  rowBottom.style.gap = '4px';
  rowBottom.appendChild(buttons['ARROWLEFT']);
  rowBottom.appendChild(buttons['ARROWDOWN']);
  rowBottom.appendChild(buttons['ARROWRIGHT']);

  arrowContainer.appendChild(rowUp);
  arrowContainer.appendChild(rowBottom);

  panel.appendChild(xBtn);
  panel.appendChild(arrowContainer);
  scaleBox.appendChild(panel);
  wrapper.appendChild(scaleBox);
  d.body.appendChild(wrapper);

  function highlight(key, on) {
    const btn = buttons[key.toUpperCase()];
    if (btn) btn.style.background = on ? '#555' : '#222';
  }

  function keydownHandler(e) {
    const k = e.key.toUpperCase();
    if (buttons[k]) highlight(k, true);
    else if ((k === ' ' || k === 'X') && buttons['X']) highlight('X', true);
  }

  function keyupHandler(e) {
    const k = e.key.toUpperCase();
    if (buttons[k]) highlight(k, false);
    else if ((k === ' ' || k === 'X') && buttons['X']) highlight('X', false);
  }

  d.addEventListener('keydown', keydownHandler);
  d.addEventListener('keyup', keyupHandler);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function isInResizeCorner(e) {
    const rect = wrapper.getBoundingClientRect();
    return e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20;
  }

  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON' || isInResizeCorner(e)) return;
    isDragging = true;
    offsetX = e.clientX - wrapper.getBoundingClientRect().left;
    offsetY = e.clientY - wrapper.getBoundingClientRect().top;
    wrapper.style.cursor = 'grabbing';
    e.preventDefault();
  });

  function dragMove(e) {
    if (!isDragging) return;
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    const rect = wrapper.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width;
    const maxTop = window.innerHeight - rect.height;
    const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
    const clampedTop = Math.max(0, Math.min(newTop, maxTop));
    wrapper.style.left = clampedLeft + 'px';
    wrapper.style.top = clampedTop + 'px';
    percentX = clampedLeft / window.innerWidth;
    percentY = clampedTop / window.innerHeight;
  }

  function dragEnd() {
    isDragging = false;
    wrapper.style.cursor = 'grab';
  }

  d.addEventListener('mousemove', dragMove);
  d.addEventListener('mouseup', dragEnd);

  function resizeHandler() {
    const rect = wrapper.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    const targetRatio = 2.25;

    const correctedHeight = width / targetRatio;
    if (Math.abs(height - correctedHeight) > 1) {
      height = correctedHeight;
      wrapper.style.height = height + 'px';
    }

    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    width = Math.min(width, maxWidth);
    height = Math.min(height, maxHeight);

    const scaleX = width / 180;
    const scaleY = height / 80;
    const scale = Math.min(scaleX, scaleY);
    scaleBox.style.transform = `scale(${scale})`;

    const newLeft = window.innerWidth * percentX;
    const newTop = window.innerHeight * percentY;
    wrapper.style.left = Math.max(0, Math.min(newLeft, window.innerWidth - width)) + 'px';
    wrapper.style.top = Math.max(0, Math.min(newTop, window.innerHeight - height)) + 'px';
  }

  resizeHandler();
  window.addEventListener('resize', resizeHandler);
  const observer = new ResizeObserver(resizeHandler);
  observer.observe(wrapper);
})();
