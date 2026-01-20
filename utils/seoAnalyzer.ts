import { AuditMetrics } from '../types';

export const analyzeHtml = (htmlString: string): AuditMetrics => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // --- Content Metrics ---
  const htmlSizeBytes = htmlString.length;
  
  // Clean scripts/styles for text calculation
  const cleanDoc = doc.cloneNode(true) as Document;
  const scripts = cleanDoc.getElementsByTagName('script');
  const styles = cleanDoc.getElementsByTagName('style');
  while (scripts[0]) scripts[0].parentNode?.removeChild(scripts[0]);
  while (styles[0]) styles[0].parentNode?.removeChild(styles[0]);
  
  const textContent = cleanDoc.body.innerText || "";
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  const textSizeBytes = cleanText.length;
  const textToHtmlRatio = htmlSizeBytes > 0 ? (textSizeBytes / htmlSizeBytes) * 100 : 0;
  const wordCount = cleanText.split(' ').length;

  // --- Essentials ---
  const title = doc.title;
  const metaDescEl = doc.querySelector('meta[name="description"]');
  const metaDescription = metaDescEl ? metaDescEl.getAttribute('content') : null;
  const h1s = doc.querySelectorAll('h1');
  const h2s = doc.querySelectorAll('h2');
  const h3s = doc.querySelectorAll('h3');

  // --- Technical ---
  const canonicalEl = doc.querySelector('link[rel="canonical"]');
  const canonical = canonicalEl ? canonicalEl.getAttribute('href') : null;
  
  const viewportEl = doc.querySelector('meta[name="viewport"]');
  const viewport = viewportEl ? viewportEl.getAttribute('content') : null;

  const robotsEl = doc.querySelector('meta[name="robots"]');
  const robots = robotsEl ? robotsEl.getAttribute('content') : null;

  const charsetEl = doc.querySelector('meta[charset]');
  const charset = charsetEl ? charsetEl.getAttribute('charset') : null;

  const htmlEl = doc.querySelector('html');
  const lang = htmlEl ? htmlEl.getAttribute('lang') : null;

  const faviconEl = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  const favicon = faviconEl ? faviconEl.getAttribute('href') : null;

  // Simple Doctype check
  const hasDoctype = doc.doctype !== null || htmlString.trim().toLowerCase().startsWith('<!doctype html>');

  // Check for deprecated tags
  const deprecatedTags = doc.querySelectorAll('font, center, marquee, blink, big, strike, tt').length;

  // --- Images (CLS & Alt) ---
  const images = doc.querySelectorAll('img');
  let imagesWithoutAlt = 0;
  const missingAltImages: string[] = [];
  let imagesWithoutDimensions = 0;
  const missingDimensionImages: string[] = [];

  images.forEach(img => {
    const src = img.getAttribute('src') || 'unknown-src';
    
    // Alt Check
    if (!img.alt || img.alt.trim() === '') {
      imagesWithoutAlt++;
      missingAltImages.push(src);
    }

    // CLS Check: Google Core Web Vitals requires width AND height attributes
    const hasWidth = img.hasAttribute('width');
    const hasHeight = img.hasAttribute('height');
    // We also accept inline styles if they are explicit, but attributes are safer for aspect-ratio
    const styleWidth = img.style.width;
    const styleHeight = img.style.height;

    if ((!hasWidth && !styleWidth) || (!hasHeight && !styleHeight)) {
        imagesWithoutDimensions++;
        missingDimensionImages.push(src);
    }
  });

  // --- Links (Security & Quality) ---
  const links = doc.querySelectorAll('a');
  let internalLinks = 0;
  let externalLinks = 0;
  let linksWithGenericText = 0;
  let linksWithEmptyText = 0;
  let unsafeCrossOriginLinks = 0;
  const genericTextLinks: string[] = [];
  const unsafeLinks: string[] = [];

  const GENERIC_ANCHORS = [
    'click here', 'read more', 'learn more', 'more', 'here', 'link', 'go', 'view', 'website', 'this page'
  ];

  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = (link.textContent || '').trim().toLowerCase();
    const hasImg = link.querySelector('img') !== null;
    const target = link.getAttribute('target');
    const rel = (link.getAttribute('rel') || '').toLowerCase();

    if (href) {
      if (href.startsWith('http') || href.startsWith('//')) {
        externalLinks++;
        // Security Check: target="_blank" must have noopener or noreferrer
        if (target === '_blank' && !rel.includes('noopener') && !rel.includes('noreferrer')) {
            unsafeCrossOriginLinks++;
            unsafeLinks.push(href);
        }
      } else {
        internalLinks++;
      }
    }

    if (!text && !hasImg) {
      linksWithEmptyText++;
    } else if (text && GENERIC_ANCHORS.includes(text)) {
      linksWithGenericText++;
      if (href) genericTextLinks.push(`${text} -> ${href}`);
    }
  });

  // --- Forms & Accessibility ---
  const inputs = doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
  let inputsWithoutLabels = 0;

  inputs.forEach(input => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const title = input.getAttribute('title');
      
      let hasLabel = false;

      // 1. Check for aria-label or title
      if (ariaLabel || ariaLabelledBy || title) {
          hasLabel = true;
      } 
      // 2. Check for explicit <label for="id">
      else if (id && doc.querySelector(`label[for="${id}"]`)) {
          hasLabel = true;
      }
      // 3. Check for implicit wrapped label <label><input /></label>
      else if (input.closest('label')) {
          hasLabel = true;
      }

      if (!hasLabel) {
          inputsWithoutLabels++;
      }
  });


  // --- Social ---
  const ogTitleEl = doc.querySelector('meta[property="og:title"]');
  const ogTitle = ogTitleEl ? ogTitleEl.getAttribute('content') : null;
  
  const ogImageEl = doc.querySelector('meta[property="og:image"]');
  const ogImage = ogImageEl ? ogImageEl.getAttribute('content') : null;

  const twitterCardEl = doc.querySelector('meta[name="twitter:card"]');
  const twitterCard = twitterCardEl ? twitterCardEl.getAttribute('content') : null;

  // --- Semantic Structure ---
  const hasNav = doc.querySelector('nav') !== null;
  const hasFooter = doc.querySelector('footer') !== null;
  const hasMain = doc.querySelector('main') !== null;
  const hasArticle = doc.querySelector('article') !== null;
  const hasSection = doc.querySelector('section') !== null;

  return {
    textToHtmlRatio,
    htmlSizeBytes,
    textSizeBytes,
    wordCount,
    title: title || null,
    titleLength: title ? title.length : 0,
    metaDescription,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    h1Count: h1s.length,
    h1Content: h1s.length > 0 ? h1s[0].textContent : null,
    h2Count: h2s.length,
    h3Count: h3s.length,
    imagesTotal: images.length,
    imagesWithoutAlt,
    missingAltImages,
    imagesWithoutDimensions,
    missingDimensionImages,
    linksTotal: links.length,
    internalLinks,
    externalLinks,
    linksWithGenericText,
    genericTextLinks,
    linksWithEmptyText,
    unsafeCrossOriginLinks,
    unsafeLinks,
    inputsTotal: inputs.length,
    inputsWithoutLabels,
    canonical,
    viewport,
    robots,
    charset,
    lang,
    favicon,
    hasDoctype,
    deprecatedTags,
    ogTitle,
    ogImage,
    twitterCard,
    hasNav,
    hasFooter,
    hasMain,
    hasArticle,
    hasSection
  };
};

export const calculateScore = (metrics: AuditMetrics): number => {
  let score = 100;

  // --- Essentials (35 pts) ---
  if (metrics.h1Count !== 1) score -= 10;
  if (!metrics.title) score -= 10;
  if (!metrics.metaDescription) score -= 8;
  if (metrics.viewport === null) score -= 7; 
  
  // --- Technical & Security (20 pts) ---
  if (!metrics.lang) score -= 3;
  if (!metrics.canonical) score -= 3;
  if (metrics.deprecatedTags > 0) score -= 3;
  if (metrics.unsafeCrossOriginLinks > 0) score -= 5;
  if (metrics.inputsWithoutLabels > 0) score -= 6; // Accessibility is huge for Google now

  // --- Content Quality (15 pts) ---
  if (metrics.titleLength > 70 || metrics.titleLength < 10) score -= 3;
  if (metrics.metaDescriptionLength < 50 || metrics.metaDescriptionLength > 300) score -= 2;
  if (metrics.textToHtmlRatio < 10) score -= 5; 
  if (metrics.wordCount < 200) score -= 5;
  
  // --- Links & Strategy (15 pts) ---
  if (metrics.linksWithGenericText > 0) score -= 5;
  if (metrics.linksWithEmptyText > 0) score -= 5;
  if (metrics.internalLinks === 0 && metrics.linksTotal > 0) score -= 5; // Should link internally
  
  // --- Images & Core Web Vitals (15 pts) ---
  if (metrics.imagesTotal > 0) {
    // Alt Text Penalty
    const altMissingRatio = metrics.imagesWithoutAlt / metrics.imagesTotal;
    score -= (altMissingRatio * 7);

    // CLS Penalty (Dimensions missing)
    const dimMissingRatio = metrics.imagesWithoutDimensions / metrics.imagesTotal;
    score -= (dimMissingRatio * 8);
  }

  return Math.max(0, Math.round(score));
};