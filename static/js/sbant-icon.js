(function() {
  var bgInput = document.getElementById('bgColor');
  var bgVal = document.getElementById('bgColorVal');
  var charInput = document.getElementById('charInput');
  var previewCanvas = document.getElementById('previewCanvas');
  var previewCtx = previewCanvas.getContext('2d');
  var scaleSelect = document.getElementById('scaleSelect');
  var downloadBtn = document.getElementById('downloadBtn');

  function render() {
    var bg = bgInput.value;
    var ch = charInput.value.charAt(0);
    bgVal.textContent = bg;

    previewCtx.fillStyle = bg;
    previewCtx.fillRect(0, 0, 500, 500);

    if (ch) {
      previewCtx.fillStyle = '#FFFFFF';
      previewCtx.font = '212px "Noto Sans JP", sans-serif';
      previewCtx.textAlign = 'center';
      previewCtx.textBaseline = 'middle';
      previewCtx.fillText(ch, 250, 250);
    }

    showStatus('');
  }

  function downloadImage(scale) {
    downloadToolImage(scale, 'sbant-icon', function(ctx, w, h) {
      ctx.fillStyle = bgInput.value;
      ctx.fillRect(0, 0, w, h);
      var ch = charInput.value.charAt(0);
      if (ch) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = (212 * scale) + 'px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ch, w / 2, h / 2);
      }
    });
  }

  charInput.addEventListener('input', function() {
    if (charInput.value.length > 1) charInput.value = charInput.value.charAt(0);
    render();
  });

  bgInput.addEventListener('input', render);
  downloadBtn.addEventListener('click', function() {
    downloadImage(parseInt(scaleSelect.value));
  });

  render();
})();
