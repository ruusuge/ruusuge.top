(function() {
  var bgInput = document.getElementById('bgColor');
  var iconInput = document.getElementById('iconColor');
  var bgVal = document.getElementById('bgColorVal');
  var iconVal = document.getElementById('iconColorVal');
  var previewCanvas = document.getElementById('previewCanvas');
  var previewCtx = previewCanvas.getContext('2d');
  var scaleSelect = document.getElementById('scaleSelect');
  var downloadBtn = document.getElementById('downloadBtn');

  var svgTemplate = null;
  var iconImage = null;

  async function loadSvgTemplate() {
    try {
      var res = await fetch('/img/unnamed.svg');
      svgTemplate = await res.text();
      showStatus('SVG loaded', 'success');
    } catch (e) {
      showStatus('SVG load failed: ' + e.message, 'error');
    }
  }

  function loadColoredIcon(color) {
    return new Promise(function(resolve, reject) {
      if (!svgTemplate) { reject(new Error('SVG template not loaded')); return; }
      var colored = svgTemplate.replace(/fill="currentColor"/g, 'fill="' + color + '"');
      var blob = new Blob([colored], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function() { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function() { URL.revokeObjectURL(url); reject(new Error('Icon render failed')); };
      img.src = url;
    });
  }

  async function render() {
    var bg = bgInput.value;
    var ic = iconInput.value;
    bgVal.textContent = bg;
    iconVal.textContent = ic;

    previewCtx.fillStyle = bg;
    previewCtx.fillRect(0, 0, 500, 500);

    try {
      iconImage = await loadColoredIcon(ic);
      previewCtx.drawImage(iconImage, 0, 0, 500, 500);
      showStatus('');
    } catch (e) {
      showStatus(e.message, 'error');
    }
  }

  function downloadImage(scale) {
    downloadToolImage(scale, 'sban-icon', function(ctx, w, h) {
      ctx.fillStyle = bgInput.value;
      ctx.fillRect(0, 0, w, h);
      if (iconImage) ctx.drawImage(iconImage, 0, 0, w, h);
    });
  }

  bgInput.addEventListener('input', render);
  iconInput.addEventListener('input', render);
  downloadBtn.addEventListener('click', function() {
    downloadImage(parseInt(scaleSelect.value));
  });

  loadSvgTemplate().then(function() { render(); });
})();
