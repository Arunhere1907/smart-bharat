import React from "react";

interface MarkdownTextProps {
  text: string;
}

export function MarkdownText({ text }: MarkdownTextProps) {
  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let listKeyCounter = 0;

  const flushList = () => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${listKeyCounter++}`} className="list-disc pl-5 space-y-1.5 my-2">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      renderedElements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Check for headings
    if (trimmedLine.startsWith("#")) {
      flushList();
      const match = trimmedLine.match(/^(#+)\s*(.*)/);
      if (match) {
        const level = match[1].length;
        const headingText = match[2];
        const content = renderInline(headingText);

        if (level === 1) {
          renderedElements.push(<h1 key={`h-${i}`} className="text-lg font-black text-gray-900 uppercase mt-4 mb-2">{content}</h1>);
        } else if (level === 2) {
          renderedElements.push(<h2 key={`h-${i}`} className="text-base font-bold text-gray-950 uppercase mt-3 mb-1.5">{content}</h2>);
        } else {
          renderedElements.push(<h3 key={`h-${i}`} className="text-sm font-bold text-gray-900 mt-2.5 mb-1">{content}</h3>);
        }
      } else {
        renderedElements.push(<p key={`p-${i}`} className="text-[14.5px] leading-relaxed font-medium text-bento-text">{renderInline(line)}</p>);
      }
      continue;
    }

    // Check for bullet lists (lines starting with * or - or •)
    const listMatch = trimmedLine.match(/^[*•-]\s+(.*)/);
    if (listMatch) {
      const itemText = listMatch[1];
      currentListItems.push(
        <li key={`li-${i}`} className="text-[14px] leading-relaxed text-bento-text">
          {renderInline(itemText)}
        </li>
      );
      continue;
    }

    // Check for numbered lists (lines starting with digits followed by period)
    const numListMatch = trimmedLine.match(/^\d+\.\s+(.*)/);
    if (numListMatch) {
      const itemText = numListMatch[1];
      currentListItems.push(
        <li key={`li-${i}`} className="text-[14px] leading-relaxed text-bento-text list-decimal">
          {renderInline(itemText)}
        </li>
      );
      continue;
    }

    // Regular paragraph line
    flushList();
    renderedElements.push(
      <p key={`p-${i}`} className="text-[14.5px] leading-relaxed font-medium text-bento-text">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1.5 text-left">{renderedElements}</div>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return <strong key={idx} className="font-black text-gray-950">{boldText}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      const codeText = part.slice(1, -1);
      return <code key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 font-mono text-[11px] text-rose-600 font-bold">{codeText}</code>;
    }
    return part;
  });
}
