import { TemplateStyle, TemplateConfig } from '../types/index'

export const templateConfigs: Record<TemplateStyle, TemplateConfig> = {
  classic: {
    name: 'Classic',
    fonts: {
      heading: 'Georgia, "Times New Roman", serif',
      body: 'Georgia, "Times New Roman", serif',
      accent: '"Courier New", monospace',
    },
    colors: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      background: '#fafaf8',
      text: '#1a1a1a',
      accent: '#8b4513',
    },
    spacing: {
      margin: 60,
      gutter: 40,
      lineHeight: 1.6,
    },
  },
  modern: {
    name: 'Modern',
    fonts: {
      heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#2563eb',
    },
    spacing: {
      margin: 50,
      gutter: 30,
      lineHeight: 1.5,
    },
  },
  travel: {
    name: 'Travel',
    fonts: {
      heading: '"Playfair Display", Georgia, serif',
      body: '"Source Sans Pro", -apple-system, sans-serif',
      accent: '"Permanent Marker", cursive',
    },
    colors: {
      primary: '#2d3436',
      secondary: '#636e72',
      background: '#fdfbf7',
      text: '#2d3436',
      accent: '#d35400',
    },
    spacing: {
      margin: 55,
      gutter: 35,
      lineHeight: 1.55,
    },
  },
}

export function getTemplateConfig(style: TemplateStyle): TemplateConfig {
  return templateConfigs[style]
}

export function generateTemplateStyles(config: TemplateConfig): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@400;600&display=swap');
    
    :root {
      --color-primary: ${config.colors.primary};
      --color-secondary: ${config.colors.secondary};
      --color-background: ${config.colors.background};
      --color-text: ${config.colors.text};
      --color-accent: ${config.colors.accent};
      --font-heading: ${config.fonts.heading};
      --font-body: ${config.fonts.body};
      --font-accent: ${config.fonts.accent};
      --spacing-margin: ${config.spacing.margin}px;
      --spacing-gutter: ${config.spacing.gutter}px;
      --line-height: ${config.spacing.lineHeight};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background: var(--color-background);
      line-height: var(--line-height);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      color: var(--color-primary);
      font-weight: 600;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: var(--spacing-margin);
      margin: 0 auto;
      background: white;
      page-break-after: always;
      page-break-inside: avoid;
      position: relative;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: auto;
    }

    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      body {
        background: white;
      }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }
  `
}
