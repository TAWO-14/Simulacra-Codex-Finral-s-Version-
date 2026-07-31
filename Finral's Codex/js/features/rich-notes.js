// ── RICH NOTES ───────────────────────────────────────────────
function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function parseHeading(line) {

    const parts = line.split("::");

    const title = inlineFormat(parts.shift().trim());

    const tags = parts
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => `<span class="src">${inlineFormat(t)}</span>`)
        .join("");

    return `
        <button class="rn-collapse">▼</button>
        ${title}
        ${tags}
    `;
}

function parseHeading(line) {
    const parts = line.split("::");
    const title = inlineFormat(parts.shift().trim());
    const tags = parts
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => `<span class="src">${inlineFormat(t)}</span>`)
        .join("");

    return `
        <button class="rn-collapse">▼</button>
        ${title}
        ${tags}
    `;
}

function toggleFold(e) {
    e.stopPropagation();
    const headingDiv = e.currentTarget;
    const body = headingDiv.nextElementSibling;
    if (!body) return;

    const willClose = !body.classList.contains('closed');
    body.classList.toggle('closed', willClose);

    const btn = headingDiv.querySelector('.rn-collapse');
    if (btn) btn.classList.toggle('closed', willClose);
}

function parseRichText(text) {
    const lines = text.split('\n');
    let html = '';

    let headingStack = [];
    let listStack = [];
    let inBlockquote = false;
    let inCodeBlock = false;
    let codeBlockLines = [];

    function closeLists(toIndent = -1) {
        while (listStack.length && listStack[listStack.length - 1].indent > toIndent) {
            const l = listStack.pop();
            html += l.type === 'ol' ? '</ol>' : '</ul>';
        }
    }
    function closeBlockquote() {
        if (inBlockquote) { html += '</blockquote>'; inBlockquote = false; }
    }
    function closeHeadingsTo(level) {
        while (headingStack.length && headingStack[headingStack.length - 1] >= level) {
            headingStack.pop();
            html += '</div></div>';
        }
    }

    lines.forEach(rawLine => {
        const line = rawLine;

        const fence = line.match(/^\s*```(.*)$/);
        if (fence) {
            if (!inCodeBlock) {
                closeLists(); closeBlockquote();
                inCodeBlock = true;
                codeBlockLines = [];
            } else {
                html += `<pre class="rn-pre"><code>${escHtml(codeBlockLines.join('\n'))}</code></pre>`;
                inCodeBlock = false;
            }
            return;
        }
        if (inCodeBlock) { codeBlockLines.push(rawLine); return; }

        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
            closeLists(); closeBlockquote();
            const level = h[1].length;
            closeHeadingsTo(level);
            headingStack.push(level);
            html += `<div class="rn-section" data-level="${level}"><div class="rn-heading rn-h${level} collapsible" onclick="toggleFold(event)">${parseHeading(h[2])}</div><div class="rn-content">`;
            return;
        }

        if (line.trim() === '') { return; }

        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
            closeLists(); closeBlockquote();
            html += '<hr class="rn-hr">';
            return;
        }

        const bq = line.match(/^\s*>\s?(.*)$/);
        if (bq) {
            closeLists();
            if (!inBlockquote) { html += '<blockquote class="rn-quote">'; inBlockquote = true; }
            html += `<div class="rn-quote-line">${inlineFormat(bq[1])}</div>`;
            return;
        }
        closeBlockquote();

        const indent = (line.match(/^(\s*)/) || ['', ''])[1].length;
        const cb = line.match(/^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/);
        const ol = !cb && line.match(/^\s*\d+[.)]\s+(.*)$/);
        const ul = !cb && !ol && line.match(/^\s*[-*+]\s+(.*)$/);

        if (cb || ol || ul) {
            const type = ol ? 'ol' : 'ul';
            while (listStack.length && listStack[listStack.length - 1].indent > indent) {
                const l = listStack.pop();
                html += l.type === 'ol' ? '</ol>' : '</ul>';
            }
            if (listStack.length && listStack[listStack.length - 1].indent === indent && listStack[listStack.length - 1].type !== type) {
                const l = listStack.pop();
                html += l.type === 'ol' ? '</ol>' : '</ul>';
            }
            if (!listStack.length || listStack[listStack.length - 1].indent < indent) {
                html += type === 'ol' ? '<ol class="rn-ol">' : '<ul class="rn-ul">';
                listStack.push({ type, indent });
            }

            if (cb) {
                const checked = /x/i.test(cb[1]);
                html += `<li class="rn-li rn-check"><input type="checkbox" ${checked ? 'checked' : ''} onclick="event.stopPropagation()">${inlineFormat(cb[2])}</li>`;
            } else if (ol) {
                html += `<li class="rn-li">${inlineFormat(ol[1])}</li>`;
            } else {
                html += `<li class="rn-li">${inlineFormat(ul[1])}</li>`;
            }
            return;
        }
        closeLists();

        html += `<div class="rn-p">${inlineFormat(line)}</div>`;
    });

    closeLists();
    closeBlockquote();
    if (inCodeBlock) html += `<pre class="rn-pre"><code>${escHtml(codeBlockLines.join('\n'))}</code></pre>`;
    closeHeadingsTo(0);

    return html;
}

function inlineFormat(s) {
    let escaped = escHtml(s);

    const codeSpans = [];
    escaped = escaped.replace(/`([^`]+)`/g, (_, code) => {
        codeSpans.push(code);
        return `\u0000CODE${codeSpans.length - 1}\u0000`;
    });

    let out = escaped
        .replace(/!\[([^\]]*)\]\((https?:\/\/[\w\.\/\-\?%&=]+|data:image\/[^;]+;base64,[\w\+\/=]+)\)/g, '<img class="rn-img" src="$2" alt="$1">')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a class="rn-link" href="$2" target="_blank" rel="noopener" onclick="event.stopPropagation()">$1</a>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/(?<![a-zA-Z0-9])_(.+?)_(?![a-zA-Z0-9])/g, '<em>$1</em>')
        .replace(/~~(.+?)~~/g, '<del>$1</del>');

    out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code class="rn-code">${codeSpans[+i]}</code>`);
    return out;
}

function toggleRN(id, btn) {
    const ta = document.getElementById(id);
    const preview = document.getElementById('rn-' + id);
    if (!ta || !preview) return;
    const isPreview = preview.classList.contains('rn-active');
    if (isPreview) {
        preview.classList.remove('rn-active');
        preview.style.display = 'none';
        ta.style.display = '';
        btn.classList.remove('active');
        btn.textContent = '👁';
    } else {
        preview.innerHTML = parseRichText(ta.value);
        preview.classList.add('rn-active');
        preview.style.display = 'block';
        ta.style.display = 'none';
        btn.classList.add('active');
        btn.textContent = '✏️';
    }
}

function editRN(id, preview) {
    const ta = document.getElementById(id);
    const btn = preview.previousElementSibling?.querySelector('.rn-toggle') ||
        preview.parentElement.querySelector('.rn-toggle');
    if (!ta) return;
    preview.classList.remove('rn-active');
    preview.style.display = 'none';
    ta.style.display = '';
    if (btn) {
        btn.classList.remove('active');
        btn.textContent = '👁';
    }
    ta.focus();
}
