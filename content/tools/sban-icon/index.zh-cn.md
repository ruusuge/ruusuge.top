---
title: "全所为头像生成器"
date: 2026-05-17
description: "自定义颜色的全所为头像生成工具"
---

<style>
  .sban-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .color-section {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .color-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .color-input label {
    font-weight: bold;
    font-size: 1.1em;
  }

  .color-input input[type="color"] {
    width: 60px;
    height: 40px;
    border: 2px solid #666;
    border-radius: 6px;
    cursor: pointer;
    background: none;
    padding: 2px;
  }

  .color-value {
    font-family: monospace;
    font-size: 13px;
    color: #aaa;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .preview-canvas {
    border: 2px solid #666;
    border-radius: 8px;
  }

  .controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .button-primary {
    background-color: #4CAF50;
    color: white;
  }

  .button-primary:hover {
    background-color: #45a049;
  }

  .button-secondary {
    background-color: #2196F3;
    color: white;
  }

  .button-secondary:hover {
    background-color: #0b7dda;
  }

  .scale-options {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .scale-options select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #2a2a2a;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }

  .status-message {
    display: none;
    text-align: center;
    padding: 10px;
    border-radius: 4px;
  }

  .status-message.visible {
    display: block;
  }

  .status-error {
    background-color: #ffdddd;
    color: #cc0000;
  }

  .status-success {
    background-color: #ddffdd;
    color: #00cc00;
  }

  .status-info {
    background-color: #ddddff;
    color: #0000cc;
  }
</style>

<div class="sban-container">
  <div class="color-section">
    <div class="color-input">
      <label for="bgColor">背景色</label>
      <input type="color" id="bgColor" value="#0288D1">
      <span id="bgColorVal" class="color-value">#0288D1</span>
    </div>
    <div class="color-input">
      <label for="iconColor">图标色</label>
      <input type="color" id="iconColor" value="#B2DBF1">
      <span id="iconColorVal" class="color-value">#B2DBF1</span>
    </div>
  </div>

  <div class="preview-section">
    <canvas id="previewCanvas" class="preview-canvas" width="500" height="500"></canvas>
    <div id="statusMessage" class="status-message"></div>
  </div>

  <div class="controls">
    <div class="scale-options">
      <label for="scaleSelect">放大:</label>
      <select id="scaleSelect">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4" selected>4x</option>
        <option value="8">8x</option>
      </select>
      <button id="downloadBtn" class="button button-secondary">下载</button>
    </div>
  </div>
</div>

<script>
  const bgColorInput = document.getElementById('bgColor');
  const iconColorInput = document.getElementById('iconColor');
  const bgColorVal = document.getElementById('bgColorVal');
  const iconColorVal = document.getElementById('iconColorVal');
  const previewCanvas = document.getElementById('previewCanvas');
  const previewCtx = previewCanvas.getContext('2d');
  const statusMessage = document.getElementById('statusMessage');
  const scaleSelect = document.getElementById('scaleSelect');
  const downloadBtn = document.getElementById('downloadBtn');

  let svgTemplate = null;
  let iconImage = null;

  function showStatus(message, type = 'info') {
    if (!message) {
      statusMessage.className = 'status-message';
      return;
    }
    statusMessage.textContent = message;
    statusMessage.className = 'status-message status-' + type + ' visible';
  }

  // 加载原始SVG文本
  async function loadSvgTemplate() {
    try {
      const response = await fetch('/img/unnamed.svg');
      svgTemplate = await response.text();
      showStatus('SVG加载成功', 'success');
    } catch (err) {
      showStatus('SVG加载失败: ' + err.message, 'error');
    }
  }

  // 根据颜色生成带颜色的SVG Blob URL并加载为Image
  function loadColoredIcon(color) {
    return new Promise((resolve, reject) => {
      if (!svgTemplate) {
        reject(new Error('SVG模板未加载'));
        return;
      }
      const coloredSvg = svgTemplate.replace(/fill="currentColor"/g, 'fill="' + color + '"');
      const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('图标渲染失败'));
      };
      img.src = url;
    });
  }

  // 渲染预览
  async function render() {
    const bgColor = bgColorInput.value;
    const iconColor = iconColorInput.value;

    bgColorVal.textContent = bgColor;
    iconColorVal.textContent = iconColor;

    // 绘制背景
    previewCtx.fillStyle = bgColor;
    previewCtx.fillRect(0, 0, 500, 500);

    try {
      iconImage = await loadColoredIcon(iconColor);
      previewCtx.drawImage(iconImage, 0, 0, 500, 500);
      showStatus('', 'info');
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  // 下载图片
  function downloadImage(scale) {
    const canvasWidth = 500 * scale;
    const canvasHeight = 500 * scale;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.imageSmoothingEnabled = false;

    // 填充背景
    tempCtx.fillStyle = bgColorInput.value;
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制放大的图标
    if (iconImage) {
      tempCtx.drawImage(iconImage, 0, 0, canvasWidth, canvasHeight);
    }

    tempCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sban-icon-' + scale + 'x-' + Date.now() + '.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showStatus('下载完成！', 'success');
    });
  }

  // 事件监听
  bgColorInput.addEventListener('input', render);
  iconColorInput.addEventListener('input', render);
  downloadBtn.addEventListener('click', () => {
    const scale = parseInt(scaleSelect.value);
    downloadImage(scale);
  });

  // 初始化
  loadSvgTemplate().then(() => render());
</script>
