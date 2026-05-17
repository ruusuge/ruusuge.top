---
title: "全贵方头像生成器"
date: 2026-05-17
description: "自定义颜色的全贵方头像生成工具"
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');

  .sbant-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .input-section {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .input-group label {
    font-weight: bold;
    font-size: 1.1em;
  }

  .input-group input[type="color"] {
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

  .input-group input[type="text"] {
    width: 60px;
    height: 42px;
    text-align: center;
    font-size: 24px;
    border: 2px solid #666;
    border-radius: 6px;
    background-color: #2a2a2a;
    color: #fff;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .input-group input[type="text"]:focus {
    border-color: #4CAF50;
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

<div class="sbant-container">
  <div class="input-section">
    <div class="input-group">
      <label for="bgColor">背景色</label>
      <input type="color" id="bgColor" value="#0288D1">
      <span id="bgColorVal" class="color-value">#0288D1</span>
    </div>
    <div class="input-group">
      <label for="charInput">文字</label>
      <input type="text" id="charInput" maxlength="1" placeholder="字">
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
  const bgColorVal = document.getElementById('bgColorVal');
  const charInput = document.getElementById('charInput');
  const previewCanvas = document.getElementById('previewCanvas');
  const previewCtx = previewCanvas.getContext('2d');
  const statusMessage = document.getElementById('statusMessage');
  const scaleSelect = document.getElementById('scaleSelect');
  const downloadBtn = document.getElementById('downloadBtn');

  function showStatus(message, type = 'info') {
    if (!message) {
      statusMessage.className = 'status-message';
      return;
    }
    statusMessage.textContent = message;
    statusMessage.className = 'status-message status-' + type + ' visible';
  }

  function render() {
    const bgColor = bgColorInput.value;
    const char = charInput.value.charAt(0);

    bgColorVal.textContent = bgColor;

    // 绘制背景
    previewCtx.fillStyle = bgColor;
    previewCtx.fillRect(0, 0, 500, 500);

    // 绘制文字
    if (char) {
      previewCtx.fillStyle = '#FFFFFF';
      previewCtx.font = '212px "Noto Sans JP", sans-serif';
      previewCtx.textAlign = 'center';
      previewCtx.textBaseline = 'middle';
      previewCtx.fillText(char, 250, 250);
    }

    showStatus('');
  }

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

    // 绘制文字
    const char = charInput.value.charAt(0);
    if (char) {
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.font = (212 * scale) + 'px "Noto Sans JP", sans-serif';
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillText(char, canvasWidth / 2, canvasHeight / 2);
    }

    tempCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sbant-icon-' + scale + 'x-' + Date.now() + '.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showStatus('下载完成！', 'success');
    });
  }

  // 自动去除多余字符
  charInput.addEventListener('input', () => {
    if (charInput.value.length > 1) {
      charInput.value = charInput.value.charAt(0);
    }
    render();
  });

  bgColorInput.addEventListener('input', render);
  downloadBtn.addEventListener('click', () => {
    const scale = parseInt(scaleSelect.value);
    downloadImage(scale);
  });

  // 初始化
  render();
</script>
