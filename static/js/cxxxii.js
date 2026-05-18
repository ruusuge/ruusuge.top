(function() {
  var textInput = document.getElementById('textInput');
  var previewCanvas = document.getElementById('previewCanvas');
  var previewCtx = previewCanvas.getContext('2d', { willReadFrequently: true });
  var generateBtn = document.getElementById('generateBtn');
  var scaleSelect = document.getElementById('scaleSelect');
  var downloadBtn = document.getElementById('downloadBtn');

  previewCtx.fillStyle = '#1a1a1a';
  previewCtx.fillRect(0, 0, 500, 500);

  var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ⅠⅡⅢ ';
  var charWidth = 10;
  var charHeight = 10;
  var fontImage = null;

  function loadFontImage() {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.src = '/img/CXXXII.png';
      img.onload = function() { fontImage = img; resolve(); };
      img.onerror = function() { reject(new Error('Font load failed')); };
    });
  }

  function getCharIndex(ch) {
    return charset.indexOf(ch.toUpperCase());
  }

  function drawCharToCanvas(canvas, ch, x, y, scale) {
    if (!fontImage) return false;
    var idx = getCharIndex(ch);
    if (idx === -1) return false;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(fontImage, idx * charWidth, 0, charWidth, charHeight, x, y, charWidth * (scale || 1), charHeight * (scale || 1));
    return true;
  }

  function generateImage() {
    var text = textInput.value.trim();
    if (!text) { showStatus('No text entered!', 'error'); return; }
    if (!fontImage) { showStatus('Font not loaded!', 'error'); return; }

    previewCtx.fillStyle = '#1a1a1a';
    previewCtx.fillRect(0, 0, 500, 500);

    var columns = text.split('\n');
    var maxH = Math.max.apply(null, columns.map(function(c) { return c.length; })) * charHeight;
    var totalW = columns.length * charWidth;
    var startY = Math.max(0, (500 - maxH) / 2);
    var startX = Math.max(0, (500 - totalW) / 2);
    var hasInvalid = false;

    columns.forEach(function(col, ci) {
      col.split('').forEach(function(ch, ri) {
        var x = startX + (columns.length - 1 - ci) * charWidth;
        var y = startY + ri * charHeight;
        if (!drawCharToCanvas(previewCanvas, ch, x, y, 1)) hasInvalid = true;
      });
    });

    showStatus(hasInvalid ? 'Unsupported chars skipped' : '', 'info');
    downloadBtn.disabled = false;
  }

  function downloadImage(scale) {
    downloadToolImage(scale, 'cxxxii', function(ctx, w, h) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, w, h);
      var columns = textInput.value.trim().split('\n');
      var maxH = Math.max.apply(null, columns.map(function(c) { return c.length; })) * charHeight * scale;
      var totalW = columns.length * charWidth * scale;
      var startY = Math.max(0, (h - maxH) / 2);
      var startX = Math.max(0, (w - totalW) / 2);
      columns.forEach(function(col, ci) {
        col.split('').forEach(function(ch, ri) {
          var x = startX + (columns.length - 1 - ci) * charWidth * scale;
          var y = startY + ri * charHeight * scale;
          drawCharToCanvas(ctx.canvas, ch, x, y, scale);
        });
      });
    });
  }

  generateBtn.addEventListener('click', generateImage);
  downloadBtn.addEventListener('click', function() {
    downloadImage(parseInt(scaleSelect.value));
  });
  textInput.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') generateImage();
  });

  loadFontImage().catch(function(e) { console.error(e); });
})();
