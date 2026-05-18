---
title: "全所为头像生成器"
date: 2026-05-17
description: "自定义颜色的全所为头像生成工具"
---

<link rel="stylesheet" href="/css/tools-common.css">
<link rel="stylesheet" href="/css/sban-icon.css">

<div class="sban-container">
  <div class="sban-colors">
    <div class="sban-color-input">
      <label for="bgColor">背景色</label>
      <input type="color" id="bgColor" value="#0288D1">
      <span id="bgColorVal" class="sban-color-val">#0288D1</span>
    </div>
    <div class="sban-color-input">
      <label for="iconColor">图标色</label>
      <input type="color" id="iconColor" value="#B2DBF1">
      <span id="iconColorVal" class="sban-color-val">#B2DBF1</span>
    </div>
  </div>

  <div class="tool-preview">
    <canvas id="previewCanvas" class="tool-canvas" width="500" height="500"></canvas>
    <div id="statusMessage" class="tool-status"></div>
  </div>

  <div class="tool-controls">
    <div class="tool-scale">
      <label for="scaleSelect">放大:</label>
      <select id="scaleSelect">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4" selected>4x</option>
        <option value="8">8x</option>
      </select>
      <button id="downloadBtn" class="tool-btn tool-btn-secondary">下载</button>
    </div>
  </div>
</div>

<script src="/js/tools-common.js"></script>
<script src="/js/sban-icon.js"></script>
