const { parseHtml } = require('./parser');

describe('HTML Parsing Logic', () => {

  // 1. Happy Path
  test('Happy Path: should correctly parse complete HTML structure', () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="This is a test meta description." />
        </head>
        <body>
          <h1>Main Heading</h1>
          <p>Hello world, this is a sample body paragraph.</p>
          <img src="test1.jpg" alt="A sample image" />
          <img src="test2.jpg" />
        </body>
      </html>
    `;

    const result = parseHtml(mockHtml);

    expect(result.title).toBe('Test Page Title');
    expect(result.metaDescription).toBe('This is a test meta description.');
    expect(result.h1Count).toBe(1);
    expect(result.imagesMissingAlt).toBe(1);
    expect(result.wordCount).toBeGreaterThan(0);
  });

  // 2. Failure Case 1: Missing Tags / Sparse HTML
  test('Failure Case 1: should handle HTML missing title, meta, and headers gracefully', () => {
    const mockHtml = `
      <html>
        <body>
          <p>Just a simple body with no head or title.</p>
        </body>
      </html>
    `;

    const result = parseHtml(mockHtml);

    expect(result.title).toBe('No title found');
    expect(result.metaDescription).toBe('No meta description found');
    expect(result.h1Count).toBe(0);
    expect(result.imagesMissingAlt).toBe(0);
  });

  // 3. Failure Case 2: Empty or Malformed Input
  test('Failure Case 2: should return default values for empty HTML string', () => {
    const result = parseHtml('');

    expect(result.title).toBe('No title found');
    expect(result.metaDescription).toBe('No meta description found');
    expect(result.h1Count).toBe(0);
    expect(result.wordCount).toBe(0);
  });

});