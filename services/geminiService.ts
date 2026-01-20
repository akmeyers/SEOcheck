import { AuditMetrics, AiInsight } from '../types';

interface AnalysisResponse {
  insights: AiInsight[];
}

/**
 * Local Heuristic Engine
 * Replaces the AI dependency with deterministic rules based on best practices.
 */
export const getSeoInsights = async (metrics: AuditMetrics, fullHtml: string): Promise<AnalysisResponse> => {
  const insights: AiInsight[] = [];

  // --- 1. Content & Structure Insights ---
  if (metrics.h1Count === 0) {
    insights.push({
      category: 'content',
      severity: 'high',
      title: 'Missing H1 Heading',
      advice: 'The H1 tag is the most important heading. Add exactly one <h1> containing your main target keyword.'
    });
  } else if (metrics.h1Count > 1) {
    insights.push({
      category: 'content',
      severity: 'medium',
      title: 'Multiple H1 Tags',
      advice: 'Search engines prefer a single H1 per page to understand the primary topic. Convert secondary H1s to H2s.'
    });
  }

  if (metrics.wordCount < 300) {
    insights.push({
      category: 'content',
      severity: 'medium',
      title: 'Thin Content',
      advice: `Page only has ${metrics.wordCount} words. Aim for at least 300-500 words to provide enough context for search engines.`
    });
  }

  // --- 2. Technical & Security Insights ---
  if (metrics.unsafeCrossOriginLinks > 0) {
    insights.push({
      category: 'technical',
      severity: 'high',
      title: 'Security Vulnerability (Tabnabbing)',
      advice: `Found ${metrics.unsafeCrossOriginLinks} external links using target="_blank" without rel="noopener". This exposes your site to performance and security issues.`
    });
  }

  if (!metrics.viewport) {
    insights.push({
      category: 'technical',
      severity: 'high',
      title: 'Not Mobile Friendly',
      advice: 'Missing <meta name="viewport"> tag. This page will not scale correctly on mobile devices, hurting rankings.'
    });
  }

  if (metrics.imagesWithoutDimensions > 0) {
    insights.push({
      category: 'technical',
      severity: 'medium',
      title: 'High CLS Risk',
      advice: `${metrics.imagesWithoutDimensions} images are missing width/height attributes. This causes layout shifts while loading (Core Web Vitals failure).`
    });
  }

  // --- 3. Accessibility & UX ---
  if (metrics.inputsWithoutLabels > 0) {
    insights.push({
      category: 'accessibility',
      severity: 'high',
      title: 'Inaccessible Forms',
      advice: `${metrics.inputsWithoutLabels} input fields are missing labels. Use <label for="id">, aria-label, or title attributes to ensure screen readers work.`
    });
  }

  if (metrics.imagesWithoutAlt > 0) {
    insights.push({
      category: 'accessibility',
      severity: 'medium',
      title: 'Missing Alt Text',
      advice: `${metrics.imagesWithoutAlt} images lack description. Add alt text to help visually impaired users and rank in Google Images.`
    });
  }

  // --- 4. Linking Strategy ---
  if (metrics.linksWithGenericText > 0) {
    insights.push({
      category: 'linking',
      severity: 'medium',
      title: 'Poor Anchor Text',
      advice: `Avoid generic links like "click here" or "read more". Use descriptive text that tells Google what the linked page is about.`
    });
  }

  if (metrics.internalLinks === 0 && metrics.linksTotal > 0) {
    insights.push({
      category: 'linking',
      severity: 'medium',
      title: 'No Internal Links',
      advice: 'You are linking out to other sites but not to your own. Add internal links to keep users engaged and distribute page authority.'
    });
  }

  // --- 5. Social Signals ---
  if (!metrics.ogImage || !metrics.ogTitle) {
    insights.push({
      category: 'keywords',
      severity: 'low',
      title: 'Missing Social Cards',
      advice: 'Add OpenGraph (og:image, og:title) tags. Without them, shared links on Facebook/LinkedIn will look broken or empty.'
    });
  }

  // Simulate async delay slightly for UX consistency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ insights });
    }, 600);
  });
};