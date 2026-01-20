export interface AuditMetrics {
  // Content
  textToHtmlRatio: number;
  htmlSizeBytes: number;
  textSizeBytes: number;
  wordCount: number;
  
  // Essentials
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  h1Content: string | null;
  h2Count: number; // Google hierarchy check
  h3Count: number;
  
  // Images & Links
  imagesTotal: number;
  imagesWithoutAlt: number;
  missingAltImages: string[];
  imagesWithoutDimensions: number; // CLS Check
  missingDimensionImages: string[];
  
  linksTotal: number;
  internalLinks: number;
  externalLinks: number;
  linksWithGenericText: number;
  genericTextLinks: string[];
  linksWithEmptyText: number;
  unsafeCrossOriginLinks: number; // Security Check (target_blank without noopener)
  unsafeLinks: string[];

  // Technical
  canonical: string | null;
  viewport: string | null;
  robots: string | null;
  charset: string | null;
  lang: string | null;
  favicon: string | null;
  hasDoctype: boolean;
  deprecatedTags: number;

  // Forms / Accessibility
  inputsTotal: number;
  inputsWithoutLabels: number; // Accessibility check

  // Social
  ogTitle: string | null;
  ogImage: string | null;
  twitterCard: string | null;

  // Semantic Structure
  hasNav: boolean;
  hasFooter: boolean;
  hasMain: boolean;
  hasArticle: boolean;
  hasSection: boolean;
}

export interface AiInsight {
  category: 'content' | 'technical' | 'keywords' | 'accessibility' | 'linking';
  severity: 'high' | 'medium' | 'low';
  title: string;
  advice: string;
}

export interface FullAuditReport {
  metrics: AuditMetrics;
  aiInsights?: AiInsight[];
  score: number;
}