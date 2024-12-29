// textUtils.js

/**
 * Formats the response text from Gemini API based on content type
 * @param {string} text - The raw response text from Gemini
 * @returns {string} Formatted text with appropriate markdown/formatting
 */
export const formatGeminiResponse = (text) => {
    // If empty or not string, return as is
    if (!text || typeof text !== 'string') {
      return text;
    }
  
    // Check if it's code block (surrounded by ``` or has common code indicators)
    const isCodeBlock = (
      (text.startsWith('```') && text.endsWith('```')) ||
      /^(const|let|var|function|class|import|export|def|public|private)/.test(text.trim())
    );
  
    if (isCodeBlock) {
      // If already wrapped in backticks, return as is
      if (text.startsWith('```') && text.endsWith('```')) {
        return text;
      }
      // Otherwise wrap in code block
      return `\`\`\`\n${text}\n\`\`\``;
    }
  
    // Check if it's a numbered sequence/list
    const isNumberedList = /^\d+\.\s/.test(text.trim());
    if (isNumberedList) {
      return text.split('\n').map((line, index) => {
        // If line already starts with a number, leave it
        if (/^\d+\.\s/.test(line.trim())) {
          return line;
        }
        // Otherwise add numbering
        return `${index + 1}. ${line}`;
      }).join('\n');
    }
  
    // Check if it's a bullet point list
    const isBulletList = /^[-*•]\s/.test(text.trim());
    if (isBulletList) {
      return text.split('\n').map(line => {
        // If line already starts with a bullet, leave it
        if (/^[-*•]\s/.test(line.trim())) {
          return line;
        }
        // Otherwise add bullet point
        return `- ${line}`;
      }).join('\n');
    }
  
    // Check if it's a table (contains | characters in a structured way)
    const isTable = (
      text.includes('|') &&
      text.split('\n').filter(line => line.includes('|')).length > 1
    );
    if (isTable) {
      const lines = text.split('\n');
      // Ensure table has header separator
      if (!lines[1]?.includes('---')) {
        const columnCount = (lines[0].match(/\|/g) || []).length - 1;
        lines.splice(1, 0, '|' + ' --- |'.repeat(columnCount));
      }
      return lines.join('\n');
    }
  
    // For regular text paragraphs, ensure proper spacing
    return text.split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(Boolean)
      .join('\n\n');
  };
  
  /**
   * Detects the programming language from code text
   * @param {string} code - The code string to analyze
   * @returns {string|null} Detected language or null if not detected
   */
  export const detectCodeLanguage = (code) => {
    const indicators = {
      javascript: ['const', 'let', 'var', 'function', 'console.log', 'export', 'import', '=>'],
      python: ['def', 'import', 'print', 'class', 'if __name__'],
      java: ['public class', 'private', 'protected', 'void', 'String[]'],
      html: ['<!DOCTYPE', '<html>', '<div>', '<p>'],
      css: ['{', 'margin:', 'padding:', 'color:'],
      sql: ['SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'CREATE TABLE']
    };
  
    for (const [language, patterns] of Object.entries(indicators)) {
      if (patterns.some(pattern => code.includes(pattern))) {
        return language;
      }
    }
  
    return null;
  };
  
  /**
   * Formats code with appropriate language tag
   * @param {string} code - The code to format
   * @returns {string} Formatted code with language tag
   */
  export const formatCode = (code) => {
    const language = detectCodeLanguage(code);
    if (!language) {
      return `\`\`\`\n${code}\n\`\`\``;
    }
    return `\`\`\`${language}\n${code}\n\`\`\``;
  };