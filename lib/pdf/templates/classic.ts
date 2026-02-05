import { TemplateConfig } from '../types'

export const classicTemplate: TemplateConfig = {
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
}

export function getClassicStyles(): string {
  return `
    .template-classic {
      font-family: Georgia, "Times New Roman", serif;
      color: #1a1a1a;
      background: #fafaf8;
    }
    
    .template-classic h1, 
    .template-classic h2, 
    .template-classic h3 {
      font-weight: 400;
      font-style: italic;
    }
    
    .template-classic .drop-cap::first-letter {
      float: left;
      font-size: 4em;
      line-height: 0.8;
      margin-right: 0.1em;
      font-weight: 400;
      color: #8b4513;
    }
    
    .template-classic .ornament {
      text-align: center;
      margin: 2em 0;
      color: #8b4513;
      opacity: 0.5;
    }
    
    .template-classic .page-number {
      font-family: "Courier New", monospace;
      font-size: 12px;
      color: #666;
    }
    
    .template-classic .photo-frame {
      border: 8px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `
}
