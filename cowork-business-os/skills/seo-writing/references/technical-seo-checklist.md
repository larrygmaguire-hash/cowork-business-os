# Technical SEO Checklist

Use this checklist when performing a technical SEO audit. Check each item and report findings grouped by severity (critical, important, minor).

## Crawlability

### robots.txt
- File exists at `/robots.txt`
- Not blocking important pages or resources
- Sitemap URL declared
- No overly broad disallow rules (e.g., `Disallow: /`)
- User-agent directives are specific where needed

### XML Sitemap
- Sitemap exists and is accessible
- Listed in robots.txt
- Contains only canonical, indexable URLs
- No 4xx or 5xx URLs in sitemap
- Last modified dates are accurate
- Sitemap size under 50MB / 50,000 URLs (split if larger)

### Crawl Efficiency
- No redirect chains (max 1 redirect hop)
- No redirect loops
- 301 (permanent) used for permanent moves, 302 (temporary) only for genuinely temporary redirects
- No soft 404s (pages returning 200 but showing error content)
- Crawl depth: important pages reachable within 3 clicks from homepage

## Indexability

### Canonical Tags
- Every page has a self-referencing canonical tag
- Duplicate content pages point canonical to the preferred version
- Canonical URLs are absolute, not relative
- No conflicting signals (canonical says A, but noindex, or redirect to B)

### Meta Robots
- Important pages are indexable (no accidental noindex)
- Pages that should not be indexed have noindex (thank-you pages, internal search results, staging)
- nofollow used only where link equity should not pass

### Duplicate Content
- No substantial duplicate pages without canonical tags
- URL parameters handled (canonical or parameter handling in Search Console)
- www vs non-www resolved (one redirects to the other)
- HTTP vs HTTPS resolved (HTTP redirects to HTTPS)
- Trailing slash consistency

### Pagination
- Paginated content uses rel="next" and rel="prev" or view-all page
- Paginated pages are indexable (not noindexed)

### Hreflang (Multi-language Sites)
- hreflang tags present for all language/region variants
- Self-referencing hreflang on each page
- Return tags present (page A references B, B references A)
- x-default specified for language selector or fallback

## Performance

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | Under 2.5s | 2.5-4.0s | Over 4.0s |
| **FID** (First Input Delay) | Under 100ms | 100-300ms | Over 300ms |
| **CLS** (Cumulative Layout Shift) | Under 0.1 | 0.1-0.25 | Over 0.25 |
| **INP** (Interaction to Next Paint) | Under 200ms | 200-500ms | Over 500ms |

### Page Speed
- Total page size under 3MB
- Above-the-fold content loads within 1.5s
- Render-blocking CSS and JS minimised
- Critical CSS inlined
- Non-critical JS deferred or async

### Image Optimisation
- Images served in modern formats (WebP, AVIF)
- Images sized appropriately (not serving 2000px image in 400px container)
- Lazy loading on below-the-fold images
- Alt text on all images
- Width and height attributes set (prevents CLS)

### Minification and Compression
- CSS and JS minified
- Gzip or Brotli compression enabled
- Browser caching headers set (Cache-Control, ETag)

## Mobile

### Responsive Design
- Viewport meta tag present: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Content readable without horizontal scrolling on mobile
- No fixed-width elements wider than viewport
- Font size at least 16px for body text on mobile

### Mobile-First Indexing
- Mobile and desktop versions have the same content
- Structured data present on mobile version
- Images and videos accessible on mobile
- No mobile-specific noindex tags

### Tap Targets
- Clickable elements at least 48x48px
- Adequate spacing between tap targets (at least 8px)

## Structure

### URL Structure
- URLs are descriptive, lowercase, hyphenated
- No special characters, underscores, or spaces in URLs
- No excessively long URLs (under 75 characters preferred)
- Logical hierarchy matching site structure (e.g., `/services/consulting/`)
- No unnecessary URL parameters for navigation pages

### Breadcrumbs
- Breadcrumb navigation present on all pages except homepage
- Breadcrumbs match URL hierarchy
- BreadcrumbList schema markup applied

### Internal Linking
- Hub-and-spoke model: pillar pages link to cluster content and vice versa
- Contextual links within body content (not just navigation)
- Anchor text is descriptive (not "click here")
- No orphan pages (every page has at least one internal link pointing to it)
- Reasonable internal link count per page (under 100)

### Site Hierarchy
- Clear category structure
- Important pages within 3 clicks of homepage
- Flat architecture preferred over deep nesting

## Security

### HTTPS
- All pages served over HTTPS
- Valid SSL/TLS certificate
- Certificate not expired or expiring soon
- HSTS header present (Strict-Transport-Security)

### Mixed Content
- No HTTP resources loaded on HTTPS pages (images, scripts, stylesheets)
- All external resources loaded over HTTPS

## Links

### Broken Links
- No internal 404 links
- No external links to dead pages
- No links to redirected URLs (update to final destination)

### Anchor Text
- Descriptive anchor text (not "click here" or "read more")
- Variety in anchor text (not all links using the same text)
- No excessive exact-match anchor text to the same page

### Nofollow
- User-generated content links are nofollow (comments, forums)
- Paid/sponsored links marked with rel="sponsored"
- Internal links are NOT nofollowed (allow equity to flow)

## Structured Data (JSON-LD)

### Common Schema Types

**Article:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {"@type": "Person", "name": "Author Name"},
  "datePublished": "2026-01-15",
  "dateModified": "2026-01-20",
  "publisher": {"@type": "Organization", "name": "Company Name"}
}
```

**FAQPage:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {"@type": "Answer", "text": "Answer text."}
    }
  ]
}
```

**LocalBusiness:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "address": {"@type": "PostalAddress", "streetAddress": "123 Main St", "addressLocality": "City"},
  "telephone": "+44-xxx-xxx-xxxx",
  "openingHours": "Mo-Fr 09:00-17:00"
}
```

### Validation
- Test all structured data with Google Rich Results Test
- No errors in structured data (warnings acceptable if intentional)
- Structured data matches visible page content (no hidden or misleading data)
