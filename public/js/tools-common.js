function showStatus(msg, type) {
  var el = document.getElementById('statusMessage');
  if (!el) return;
  if (!msg) { el.className = 'tool-status'; return; }
  el.textContent = msg;
  el.className = 'tool-status tool-status-' + (type || 'info') + ' visible';
}

function downloadToolImage(scale, filenamePrefix, renderFn) {
  var w = 500 * scale;
  var h = 500 * scale;
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  var ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  renderFn(ctx, w, h);
  c.toBlob(function(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filenamePrefix + '-' + scale + 'x-' + Date.now() + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('Download complete!', 'success');
  });
}
