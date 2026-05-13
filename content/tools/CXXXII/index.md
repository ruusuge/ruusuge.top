---
title: "CXXXII アルバムカバー生成ツール"
date: 2026-05-07
description: "これは CXXXII スタイルのアルバムカバーを作成できるツールです"
---

<style>
  .cxxxii-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input-section label {
    font-weight: bold;
    font-size: 1.1em;
  }

  .input-section textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
    background-color: #2a2a2a;
    color: #fff;
    resize: vertical;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .preview-canvas {
    border: 2px solid #666;
    background-color: #1a1a1a;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
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

  .button-primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .button-secondary {
    background-color: #2196F3;
    color: white;
  }

  .button-secondary:hover {
    background-color: #0b7dda;
  }

  .button-secondary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
    text-align: center;
    padding: 10px;
    border-radius: 4px;
    min-height: 20px;
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

<div class="cxxxii-container">
  <div class="input-section">
    <label for="textInput">テキスト</label>
    <textarea id="textInput" placeholder="（A-Z、0-9、Ⅰ、Ⅱ、Ⅲに対応）"></textarea>
  </div>

  <div class="preview-section">
    <label>プレビュー</label>
    <canvas id="previewCanvas" class="preview-canvas" width="500" height="500"></canvas>
    <div id="statusMessage" class="status-message"></div>
  </div>

  <div class="controls">
    <button id="generateBtn" class="button button-primary">生成</button>
    <div class="scale-options">
      <label for="scaleSelect">拡大:</label>
      <select id="scaleSelect">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4">4x</option>
        <option value="8">8x</option>
      </select>
      <button id="downloadBtn" class="button button-secondary" disabled>ダウンロード</button>
    </div>
  </div>
</div>

<script>
  const textInput = document.getElementById('textInput');
  const previewCanvas = document.getElementById('previewCanvas');
  const previewCtx = previewCanvas.getContext('2d', { willReadFrequently: true });
  const generateBtn = document.getElementById('generateBtn');
  const statusMessage = document.getElementById('statusMessage');
  const scaleSelect = document.getElementById('scaleSelect');
  const downloadBtn = document.getElementById('downloadBtn');

  // 设置 canvas 背景
  previewCtx.fillStyle = '#1a1a1a';
  previewCtx.fillRect(0, 0, 500, 500);

  // 字符集和对应的 x 坐标
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ⅠⅡⅢ ';
  const charWidth = 10;
  const charHeight = 10;
  let fontImage = null;

  // 加载字体图片
  function loadFontImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = '/img/CXXXII.png';
      img.onload = () => {
        fontImage = img;
        resolve();
      };
      img.onerror = () => {
        reject(new Error('Failed to load font image'));
      };
    });
  }

  function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message status-' + type;
  }

  function getCharIndex(char) {
    return charset.indexOf(char.toUpperCase());
  }

  function drawCharToCanvas(canvas, char, x, y, scale = 1) {
    if (!fontImage) return false;

    const charIndex = getCharIndex(char);
    if (charIndex === -1) return false;

    const ctx = canvas.getContext('2d');
    
    // 获取字体图片中的字符
    const sourceX = charIndex * charWidth;
    const sourceY = 0;

    // 使用临近算法（pixelated）
    ctx.imageSmoothingEnabled = false;

    // 绘制字符
    ctx.drawImage(
      fontImage,
      sourceX,
      sourceY,
      charWidth,
      charHeight,
      x,
      y,
      charWidth * scale,
      charHeight * scale
    );

    return true;
  }

  function generateImage() {
    const text = textInput.value.trim();
    if (!text) {
      showStatus('まだテキストを入力していません！', 'error');
      return;
    }

    if (!fontImage) {
      showStatus('フォントが読み込まれていません！', 'error');
      return;
    }

    // 清空预览
    previewCtx.fillStyle = '#1a1a1a';
    previewCtx.fillRect(0, 0, 500, 500);

    // 按换行符分割成多列
    const columns = text.split('\n');
    
    // 计算最长列的高度
    const maxHeight = Math.max(...columns.map(col => col.length)) * charHeight;
    const totalWidth = columns.length * charWidth;

    // 计算起始坐标（居中）
    let startY = (500 - maxHeight) / 2;
    if (startY < 0) startY = 0;

    let startX = (500 - totalWidth) / 2;
    if (startX < 0) startX = 0;

    // 绘制文本
    let hasInvalidChars = false;
    columns.forEach((column, colIndex) => {
      const chars = column.split('');
      chars.forEach((char, charIndex) => {
        const x = startX + (columns.length - 1 - colIndex) * charWidth;
        const y = startY + charIndex * charHeight;
        if (!drawCharToCanvas(previewCanvas, char, x, y, 1)) {
          hasInvalidChars = true;
        }
      });
    });

    if (hasInvalidChars) {
      showStatus('サポートされていない文字が含まれているため、スキップされました', 'info');
    } else {
      showStatus('画像の生成に成功しました！', 'success');
    }

    // 启用下载按钮
    downloadBtn.disabled = false;
  }

  function downloadImage(scale) {
    const text = textInput.value.trim();
    if (!text || !fontImage) return;

    const canvasWidth = 500 * scale;
    const canvasHeight = 500 * scale;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');

    // 禁用图片平滑（使用临近算法）
    tempCtx.imageSmoothingEnabled = false;

    // 填充背景
    tempCtx.fillStyle = '#1a1a1a';
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制缩放后的文本（按换行符分列，每列从上到下）
    const scaledCharHeight = charHeight * scale;
    const scaledCharWidth = charWidth * scale;
    const columns = text.split('\n');
    const maxHeight = Math.max(...columns.map(col => col.length)) * scaledCharHeight;
    const totalWidth = columns.length * scaledCharWidth;

    let startY = (canvasHeight - maxHeight) / 2;
    if (startY < 0) startY = 0;

    let startX = (canvasWidth - totalWidth) / 2;
    if (startX < 0) startX = 0;

    columns.forEach((column, colIndex) => {
      const chars = column.split('');
      chars.forEach((char, charIndex) => {
        const x = startX + (columns.length - 1 - colIndex) * scaledCharWidth;
        const y = startY + charIndex * scaledCharHeight;
        drawCharToCanvas(tempCanvas, char, x, y, scale);
      });
    });

    // 下载
    tempCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cxxxii-${scale}x-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // 事件监听
  generateBtn.addEventListener('click', generateImage);
  downloadBtn.addEventListener('click', () => {
    const scale = parseInt(scaleSelect.value);
    downloadImage(scale);
  });

  textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      generateImage();
    }
  });

  // 页面加载时加载字体
  loadFontImage().catch(err => console.error(err));
</script>
