import React from 'react';

interface MarkdownViewProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`
 */
function renderInline(text: string, isUser = false): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const raw = match[0];
    const key = `inline-${lastIdx}-${match.index}`;

    if (raw.startsWith('**') && raw.endsWith('**')) {
      const boldText = raw.slice(2, -2);
      parts.push(
        <strong
          key={key}
          className={isUser ? 'font-bold text-white' : 'font-semibold text-slate-900'}
        >
          {renderInline(boldText, isUser)}
        </strong>
      );
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      const codeText = raw.slice(1, -1);
      parts.push(
        <code
          key={key}
          className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
            isUser ? 'bg-slate-800 text-indigo-200' : 'bg-slate-200/70 text-indigo-700'
          }`}
        >
          {codeText}
        </code>
      );
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      const italicText = raw.slice(1, -1);
      parts.push(
        <em key={key} className="italic">
          {italicText}
        </em>
      );
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts;
}

interface Block {
  type: 'paragraph' | 'ul' | 'ol' | 'table' | 'heading';
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  level?: number;
}

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const rawSections = content.trim().split(/\n\s*\n/);

  for (const section of rawSections) {
    const lines = section.trim().split('\n');
    if (!lines.length || !lines[0].trim()) continue;

    // Check for Markdown Table
    if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('-')) {
      const headers = lines[0]
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      const rows = lines
        .slice(2)
        .map((line) =>
          line
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
        )
        .filter((r) => r.length > 0);
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Check if entire section or part is a list
    const firstListIdx = lines.findIndex((l) => /^([-*]|\d+\.)\s+/.test(l.trim()));

    if (firstListIdx === 0 && lines.every((l) => /^([-*]|\d+\.)\s+/.test(l.trim()))) {
      const isOrdered = /^\d+\.\s+/.test(lines[0].trim());
      const items = lines.map((l) => l.trim().replace(/^([-*]|\d+\.)\s+/, ''));
      blocks.push({ type: isOrdered ? 'ol' : 'ul', items });
    } else if (firstListIdx > 0 && lines.slice(firstListIdx).every((l) => /^([-*]|\d+\.)\s+/.test(l.trim()))) {
      // Intro paragraph followed by list
      const intro = lines.slice(0, firstListIdx).join(' ');
      blocks.push({ type: 'paragraph', text: intro });
      const listLines = lines.slice(firstListIdx);
      const isOrdered = /^\d+\.\s+/.test(listLines[0].trim());
      const items = listLines.map((l) => l.trim().replace(/^([-*]|\d+\.)\s+/, ''));
      blocks.push({ type: isOrdered ? 'ol' : 'ul', items });
    } else if (lines.length === 1 && lines[0].startsWith('#')) {
      const match = lines[0].match(/^#+/);
      const level = match ? match[0].length : 1;
      blocks.push({ type: 'heading', level, text: lines[0].replace(/^#+\s*/, '') });
    } else {
      // Single block with a numbered item (e.g. "1. **Task Disparity**: ...")
      const numMatch = lines[0].trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch && lines.length <= 3) {
        blocks.push({
          type: 'ol',
          items: [lines.map((l, i) => (i === 0 ? l.trim().replace(/^\d+\.\s+/, '') : l.trim())).join(' ')],
        });
      } else {
        blocks.push({ type: 'paragraph', text: lines.join(' ') });
      }
    }
  }

  return blocks;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, isUser = false, className = '' }) => {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-2.5 text-xs ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h2' : block.level === 2 ? 'h3' : 'h4';
          return (
            <Tag
              key={idx}
              className={`font-bold ${
                block.level === 1
                  ? 'text-sm sm:text-base mt-3 mb-1 text-slate-900'
                  : 'text-xs sm:text-sm mt-2 mb-1 text-slate-800'
              }`}
            >
              {renderInline(block.text || '', isUser)}
            </Tag>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-1.5 my-2">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                      isUser ? 'bg-indigo-300' : 'bg-indigo-600'
                    }`}
                  />
                  <div className="flex-1 leading-relaxed">{renderInline(item, isUser)}</div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="space-y-2 my-2">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-slate-800 text-indigo-200 border border-slate-700'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {itemIdx + 1}
                  </span>
                  <div className="flex-1 leading-relaxed">{renderInline(item, isUser)}</div>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'table') {
          return (
            <div
              key={idx}
              className="my-3 overflow-x-auto border border-slate-200 rounded-lg shadow-xs bg-white"
            >
              <table className="min-w-full text-xs divide-y divide-slate-200">
                {block.headers && (
                  <thead className="bg-slate-100">
                    <tr>
                      {block.headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-3 py-2 text-left text-[11px] font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap"
                        >
                          {renderInline(h, isUser)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                {block.rows && (
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 text-slate-800 whitespace-nowrap">
                            {renderInline(cell, isUser)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(block.text || '', isUser)}
          </p>
        );
      })}
    </div>
  );
};
