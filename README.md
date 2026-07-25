# Page Pulse - Web Page Audit Tool

Page Pulse is a lightweight full-stack web application designed to audit any web URL. It parses the target URL's HTML content and returns key metrics such as HTTP status, response time, page title, meta description, heading structure, image accessibility, and total word count.

---

## 🚀 Features

* **Instant Page Audit:** Evaluates any valid URL and returns structured metrics.
* **Metric Extraction:**
  * HTTP Status Code & Response Time (ms)
  * Page Title & Meta Description
  * `<h1>` tag count
  * Images missing `alt` attributes
  * Approximate visible word count
* **Robust Error Handling:** Handles invalid URLs, timeouts, non-HTML content, and non-existent domains gracefully without crashing.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **HTML Parsing & Fetching:** Axios, Cheerio
* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)

---

## ⚙️ Local Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* `npm` (comes bundled with Node)

```http
POST /api/audit
```

## Request Headers

```http
Content-Type: application/json
```

## Request Body

```json
{
  "url": "https://example.com"
}
```

## Success Response

```json
{
  "status": "success",
  "data": {
    "targetUrl": "https://example.com",
    "httpStatus": 200,
    "responseTimeMs": 182,
    "title": "Example Domain",
    "metaDescription": "No meta description found",
    "h1Count": 1,
    "imagesMissingAlt": 0,
    "wordCount": 38
  }
}
```

## Error Response

### Invalid URL Format

{
  "error": "Invalid URL format provided."
}

### Non HTML Content

{
  "error": "URL returned application/pdf instead of an HTML page."
}

### Request Timeout

{
  "error": "Request timed out. Target website took too long to respond."
}

## Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/page-pulse.git](https://github.com/YOUR_USERNAME/page-pulse.git)
   cd page-pulsenp


### Step 3: Save and Push to GitHub

Once you've added it to `README.md`, run these commands in your terminal:

```cmd
git add README.md
git commit -m "Add API Reference documentation to README"
git push origin main
---