const cheerio = require('cheerio');

function parseHtml(htmlContent) {
  const $ = cheerio.load(htmlContent);

  // Extract metrics
  const title = $('title').text().trim() || 'No title found';
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || 'No meta description found';
  const h1Count = $('h1').length;
  
  // Count images missing an alt attribute or having an empty alt string
  const imagesMissingAlt = $('img:not([alt]), img[alt=""]').length;

  // Approximate word count from body text
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText ? bodyText.split(' ').length : 0;

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount
  };
}

module.exports = { parseHtml };