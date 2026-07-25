const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Main Audit Endpoint
app.post('/api/audit', async (req, res) => {
  let { url } = req.body;

  // 1. Basic URL Presence Check
  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  // 2. Prepend protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // 3. Strict URL Format Validation
  try {
    new URL(url);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL format provided.' });
  }

  const startTime = Date.now();

  try {
    // 4. Fetch Page Content with strict timeout and custom user-agent
    const response = await axios.get(url, {
      timeout: 6000, // 6 seconds timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PagePulseAuditBot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      validateStatus: () => true // Allow handling non-200 status codes smoothly
    });

    const responseTimeMs = Date.now() - startTime;
    const contentType = response.headers['content-type'] || '';

    // 5. Verify Content-Type is HTML
    if (!contentType.includes('text/html')) {
      return res.status(400).json({
        error: `URL returned ${contentType.split(';')[0] || 'non-HTML file'} instead of an HTML page.`
      });
    }

    // 6. Parse HTML with Cheerio
    const $ = cheerio.load(response.data);

    // Extraction Logic
    const title = $('title').text().trim() || 'No title tag found';
    
    const metaDescription = 
      $('meta[name="description"]').attr('content')?.trim() || 
      $('meta[property="og:description"]').attr('content')?.trim() || 
      'No meta description found';

    const h1Count = $('h1').length;

    // Count missing image alt attributes
    let imagesMissingAlt = 0;
    $('img').each((_, el) => {
      const alt = $(el).attr('alt');
      if (alt === undefined || alt.trim() === '') {
        imagesMissingAlt++;
      }
    });

    // Extract approximate word count
    const $body = $('body').clone();
    $body.find('script, style, noscript, svg, code').remove();
    const cleanText = $body.text().replace(/\s+/g, ' ').trim();
    const wordCount = cleanText ? cleanText.split(' ').length : 0;

    // 7. Return Audit Payload
    return res.json({
      status: 'success',
      data: {
        targetUrl: url,
        httpStatus: response.status,
        responseTimeMs,
        title,
        metaDescription,
        h1Count,
        imagesMissingAlt,
        wordCount
      }
    });

  } catch (error) {
    // 8. Error Catching Strategy
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timed out. Target website took too long to respond.' });
    }
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      return res.status(404).json({ error: 'Could not resolve domain name. Check the URL and try again.' });
    }
    return res.status(500).json({ error: 'Failed to fetch or parse the webpage.' });
  }
});

app.listen(PORT, () => {
  console.log(`Page Pulse server running on port ${PORT}`);
});