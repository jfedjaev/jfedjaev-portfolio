import { TemplateConfig } from '../types'

export const modernTemplate: TemplateConfig = {
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
}

export function getModernStyles(): string {
  return `
    .template-modern {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #1a1a1a;
      background: #ffffff;
    }
    
    .template-modern h1 {
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    
    .template-modern h2, 
    .template-modern h3 {
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    
    .template-modern .highlight {
      background: linear-gradient(120deg, #dbeafe 0%, #dbeafe 100%);
      background-repeat: no-repeat;
      background-size: 100% 40%;
      background-position: 0 88%;
      padding: 0 4px;
    }
    
    .template-modern .tag {
      display: inline-block;
      padding: 4px 12px;
      background: #f3f4f6;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
    }
    
    .template-modern .photo-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
    
    .template-modern .stat {
      display: flex;
      flex-direction: column;
    }
    
    .template-modern .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #2563eb;
    }
    
    .template-modern .stat-label {
      font-size: 13px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `
}
