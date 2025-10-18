function switchTab(tabName) {
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => section.classList.remove('active'));

  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach((btn) => btn.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  if (typeof event !== 'undefined' && event && event.target) {
    event.target.classList.add('active');
  }
}

function toggleStep(button) {
  const expanded = button.closest('div').nextElementSibling;
  if (expanded && expanded.classList.contains('step-content-expanded')) {
    expanded.classList.toggle('show');
    button.textContent = expanded.classList.contains('show') ? '▲' : '▼';
  }
}

function toggleHistory(button) {
  const expanded = button.closest('div').parentElement.nextElementSibling;
  if (expanded && expanded.classList.contains('history-expanded')) {
    expanded.classList.toggle('show');
    button.textContent = expanded.classList.contains('show') ? '▲' : '▼';
  }
}

function openFolderPicker() {
  document.getElementById('folderInput').click();
}

function handleFolderSelect(event) {
  const files = event.target.files;
  if (files.length > 0) {
    console.log('Folder selected with files:', files);
    alert(`Folder uploaded with ${files.length} files!`);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.remove('dragover');

  const items = event.dataTransfer.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const entry = items[i].webkitGetAsEntry && items[i].webkitGetAsEntry();
        if (entry && entry.isDirectory) {
          console.log('Folder dropped:', entry.name);
          alert(`Folder "${entry.name}" dropped successfully!`);
        }
      }
    }
  }
}

// Format a Date to "MM-DD-YYYY HH:MM:SS"
function formatTimestamp(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Save current Results into History (name = current date/time)
function saveResult() {
  const name = formatTimestamp(new Date());

  const total = document.getElementById('totalMotorsValue')?.textContent?.trim() || '0';
  const avgDist = document.getElementById('avgDistanceValue')?.textContent?.trim() || '';
  const avgF = document.getElementById('avgFbetaValue')?.textContent?.trim() || '';
  const avgProc = document.getElementById('avgProcTimeValue')?.textContent?.trim() || '';

  const high = document.getElementById('highConfCount')?.textContent?.trim() || '0';
  const med = document.getElementById('medConfCount')?.textContent?.trim() || '0';
  const low = document.getElementById('lowConfCount')?.textContent?.trim() || '0';

  const historyList = document.querySelector('.history-list');
  if (!historyList) {
    console.warn('History list not found.');
    return;
  }

  // Build DOM structure matching existing history entries
  const container = document.createElement('div');

  const item = document.createElement('div');
  item.className = 'history-item';
  item.innerHTML = `
    <div class="history-timestamp">${name}</div>
    <div class="history-count">${total}</div>
    <div class="history-controls">
      <button class="delete-btn" onclick="toggleHistory(this)">▼</button>
    </div>
  `;

  const expanded = document.createElement('div');
  expanded.className = 'history-expanded';
  expanded.innerHTML = `
    <div class="stats-grid" style="margin-top: 0">
      <div class="stat-box">
        <div class="stat-label">Total Motors Detected</div>
        <div class="stat-value">${total}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Avg. Euclidean Distance</div>
        <div class="stat-value">${avgDist}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Avg. F Beta Score</div>
        <div class="stat-value">${avgF}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Avg. Processing time</div>
        <div class="stat-value">${avgProc}</div>
      </div>
      <div style="grid-column: 1 / -1; margin-top: 12px; text-align: left; font-size: 13px;">
        <strong>Detection breakdown:</strong> High: ${high}, Medium: ${med}, Low: ${low}
      </div>
    </div>
  `;

  // Add delete button to expanded area
  const deleteBtnHtml = `<button class="delete-history-btn" onclick="deleteHistory(this)">Delete</button>`;
  expanded.innerHTML = expanded.innerHTML + deleteBtnHtml;

  container.appendChild(item);
  container.appendChild(expanded);

  // Insert right after the header (history title) so newest appears first
  historyList.insertBefore(container, historyList.children[1] || null);

  // Give brief feedback on button
  const btn = document.getElementById('saveResultBtn');
  if (btn) {
    const prev = btn.textContent;
    btn.textContent = 'Saved';
    setTimeout(() => (btn.textContent = prev), 1200);
  }
}

// Delete a history entry. `btn` is the 'Delete' button inside .history-expanded
function deleteHistory(btn) {
  const expanded = btn.closest('.history-expanded');
  if (!expanded) return;
  const wrapper = expanded.previousElementSibling ? expanded.previousElementSibling.parentElement : expanded.parentElement;
  // If items were created as container -> item + expanded, wrapper is the container
  if (wrapper && wrapper.parentElement) {
    wrapper.remove();
    return;
  }
  // Fallback: remove the pair (item + expanded)
  const item = expanded.previousElementSibling;
  if (item) {
    item.remove();
  }
  expanded.remove();
}

// Cleanup: remove stray text nodes that contain only the character "2"
document.addEventListener('DOMContentLoaded', () => {
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const toRemove = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.trim() === '2') toRemove.push(node);
    }
    toRemove.forEach(n => n.parentNode && n.parentNode.removeChild(n));
    if (toRemove.length) console.log(`Removed ${toRemove.length} stray '2' text node(s)`);
  } catch (e) {
    console.warn('Cleanup routine failed', e);
  }
});
