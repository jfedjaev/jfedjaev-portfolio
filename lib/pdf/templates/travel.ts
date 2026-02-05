import { TemplateConfig } from '../types'

export const travelTemplate: TemplateConfig = {
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
}

export function getTravelStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Playfair+Display:wght@400;600;700&display=swap');
    
    .template-travel {
      font-family: "Source Sans Pro", -apple-system, sans-serif;
      color: #2d3436;
      background: #fdfbf7;
    }
    
    .template-travel h1,
    .template-travel h2 {
      font-family: "Playfair Display", Georgia, serif;
      font-weight: 700;
    }
    
    .template-travel .handwritten {
      font-family: "Permanent Marker", cursive;
    }
    
    .template-travel .stamp {
      border: 3px solid #d35400;
      border-radius: 50%;
      padding: 20px;
      display: inline-block;
      transform: rotate(-15deg);
      color: #d35400;
      font-family: "Permanent Marker", cursive;
      opacity: 0.7;
    }
    
    .template-travel .photo-polaroid {
      background: white;
      padding: 12px 12px 40px 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      transform: rotate(-2deg);
    }
    
    .template-travel .photo-polaroid:nth-child(even) {
      transform: rotate(2deg);
    }
    
    .template-travel .tape {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%) rotate(-3deg);
      width: 100px;
      height: 30px;
      background: rgba(255,255,255,0.5);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .template-travel .route-line {
      stroke: #d35400;
      stroke-width: 2;
      stroke-dasharray: 5,5;
      fill: none;
    }
    
    .template-travel .compass {
      width: 60px;
      height: 60px;
      border: 2px solid #d35400;
      border-radius: 50%;
      position: relative;
      opacity: 0.5;
    }
    
    .template-travel .compass::before {
      content: 'N';
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: bold;
      color: #d35400;
    }
    
    .template-travel .distance-badge {
      background: #d35400;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .template-travel .weather-icon {
      width: 40px;
      height: 40px;
      opacity: 0.7;
    }
  `
}
