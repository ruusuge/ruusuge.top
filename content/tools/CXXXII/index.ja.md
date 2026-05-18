---
title: "CXXXII アルバムカバー生成ツール"
date: 2026-05-07
description: "これは CXXXII スタイルのアルバムカバーを作成できるツールです"
---

<link rel="stylesheet" href="/css/tools-common.css">
<link rel="stylesheet" href="/css/cxxxii.css">

<div class="cxxxii-container">
  <div class="cxxxii-input">
    <label for="textInput">テキスト</label>
    <textarea id="textInput" placeholder="（A-Z、0-9、Ⅰ、Ⅱ、Ⅲに対応）"></textarea>
  </div>

  <div class="tool-preview">
    <canvas id="previewCanvas" class="tool-canvas" width="500" height="500"></canvas>
    <div id="statusMessage" class="tool-status"></div>
  </div>

  <div class="tool-controls">
    <button id="generateBtn" class="tool-btn tool-btn-primary">生成</button>
    <div class="tool-scale">
      <label for="scaleSelect">拡大:</label>
      <select id="scaleSelect">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4" selected>4x</option>
        <option value="8">8x</option>
      </select>
      <button id="downloadBtn" class="tool-btn tool-btn-secondary" disabled>ダウンロード</button>
    </div>
  </div>
</div>

<script src="/js/tools-common.js"></script>
<script src="/js/cxxxii.js"></script>
