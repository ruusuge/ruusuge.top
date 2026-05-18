(function() {
  const btn = document.getElementById('passthemBtn');
  const count = document.getElementById('passthemCount');
  if (!btn || !count) return;

  const API_BASE = 'https://legacy.passthem.top/api/mainpage';
  let pending = false;

  // 从API返回中递归提取第一个数值
  function extractCount(data) {
    if (data == null) return null;
    if (typeof data === 'number') return data;
    if (typeof data === 'string') {
      const n = parseInt(data, 10);
      return isNaN(n) ? null : n;
    }
    if (Array.isArray(data)) {
      for (const item of data) {
        const v = extractCount(item);
        if (v !== null) return v;
      }
      return null;
    }
    if (typeof data === 'object') {
      for (const key of Object.keys(data)) {
        const v = extractCount(data[key]);
        if (v !== null) return v;
      }
    }
    return null;
  }

  function setCount(value) {
    count.textContent = (value != null) ? String(value) : '---';
  }

  async function fetchCount() {
    try {
      const res = await fetch(API_BASE + '/get_click');
      const data = await res.json();
      setCount(extractCount(data));
    } catch (err) {
      setCount(null);
    }
  }

  btn.addEventListener('click', async () => {
    if (pending) return;
    pending = true;
    btn.disabled = true;
    const prev = count.textContent;
    try {
      const res = await fetch(API_BASE + '/click');
      const data = await res.json();
      const val = extractCount(data);
      if (val !== null) setCount(val);
      else setCount(prev);
    } catch (err) {
      // 失败时保留原数字，静默恢复
      setCount(prev === '---' ? null : prev);
    }
    btn.disabled = false;
    pending = false;
  });

  fetchCount();
})();
