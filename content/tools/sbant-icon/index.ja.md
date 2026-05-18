---
title: "すべ貴方アイコン生成ツール"
date: 2026-05-17
description: "色と文字をカスタマイズできるすべ貴方アイコン生成ツール"
---

<link rel="stylesheet" href="/css/tools-common.css">
<link rel="stylesheet" href="/css/sbant-icon.css">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
</style>

<div class="sbant-container">
  <div class="sbant-inputs">
    <div class="sbant-input-group">
      <label for="bgColor">背景色</label>
      <input type="color" id="bgColor" value="#0288D1">
      <span id="bgColorVal" class="sbant-color-val">#0288D1</span>
    </div>
    <div class="sbant-input-group">
      <label for="charInput">文字</label>
      <input type="text" id="charInput" maxlength="1" placeholder="字">
    </div>
  </div>

  <div class="tool-preview">
    <canvas id="previewCanvas" class="tool-canvas" width="500" height="500"></canvas>
    <div id="statusMessage" class="tool-status"></div>
  </div>

  <div class="tool-controls">
    <div class="tool-scale">
      <label for="scaleSelect">拡大:</label>
      <select id="scaleSelect">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4" selected>4x</option>
        <option value="8">8x</option>
      </select>
      <button id="downloadBtn" class="tool-btn tool-btn-secondary">ダウンロード</button>
    </div>
  </div>
</div>

<script src="/js/tools-common.js"></script>
<script src="/js/sbant-icon.js"></script>
