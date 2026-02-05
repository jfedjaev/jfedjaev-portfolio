#!/usr/bin/env python3
"""
Enhanced McKinsey-Level Proposal PDF Generator for Juri Fedjaev
With visual charts and premium design
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, 
    Table, TableStyle, PageBreak, HRFlowable, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics import renderPDF
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.textlabels import Label
import os

# McKinsey Corporate Colors
MCKINSEY_BLUE = colors.HexColor('#051C2C')  # Deep navy
MCKINSEY_BLUE_LIGHT = colors.HexColor('#0A3D62')
MCKINSEY_DARK = colors.HexColor('#1a1a1a')
MCKINSEY_GRAY = colors.HexColor('#4a4a4a')
MCKINSEY_LIGHT_GRAY = colors.HexColor('#f5f5f5')
MCKINSEY_ACCENT = colors.HexColor('#0066cc')
MCKINSEY_GOLD = colors.HexColor('#B8860B')
MCKINSEY_SILVER = colors.HexColor('#C0C0C0')

def create_price_chart():
    """Create a visual price comparison chart"""
    drawing = Drawing(400, 200)
    
    # Background
    bg = Rect(0, 0, 400, 200, fillColor=MCKINSEY_LIGHT_GRAY, strokeColor=None)
    drawing.add(bg)
    
    # Title
    title = String(200, 180, 'INVESTMENT VERGLEICH', 
                   fontName='Helvetica-Bold', fontSize=12, 
                   fillColor=MCKINSEY_BLUE, textAnchor='middle')
    drawing.add(title)
    
    # Bars
    packages = [
        ('Strategy\nAssessment', 8.5, MCKINSEY_BLUE_LIGHT),
        ('Transformation\nPartner', 15, MCKINSEY_BLUE),
        ('COO-as-a-\nService', 25, MCKINSEY_GOLD)
    ]
    
    max_val = 30
    bar_width = 80
    spacing = 40
    start_x = 50
    base_y = 30
    
    for i, (name, value, color) in enumerate(packages):
        x = start_x + i * (bar_width + spacing)
        height = (value / max_val) * 120
        
        # Bar
        bar = Rect(x, base_y, bar_width, height, 
                   fillColor=color, strokeColor=None)
        drawing.add(bar)
        
        # Value label
        val_label = String(x + bar_width/2, base_y + height + 5, 
                          f'€{value:,}K'.replace(',', '.'),
                          fontName='Helvetica-Bold', fontSize=11,
                          fillColor=color, textAnchor='middle')
        drawing.add(val_label)
        
        # Name label
        name_label = String(x + bar_width/2, base_y - 15, name,
                           fontName='Helvetica', fontSize=8,
                           fillColor=MCKINSEY_GRAY, textAnchor='middle')
        drawing.add(name_label)
    
    # Baseline
    baseline = Line(start_x - 10, base_y, start_x + 3*(bar_width+spacing) - 20, base_y,
                   strokeColor=MCKINSEY_GRAY, strokeWidth=1)
    drawing.add(baseline)
    
    return drawing

def create_timeline_diagram():
    """Create a timeline visualization"""
    drawing = Drawing(400, 100)
    
    # Timeline phases
    phases = [
        ('Woche 1-2', 'Assessment', MCKINSEY_BLUE_LIGHT),
        ('Monat 1-3', 'Quick Wins', MCKINSEY_BLUE),
        ('Monat 3-6', 'Transformation', MCKINSEY_GOLD),
        ('Monat 6+', 'Scale', MCKINSEY_SILVER)
    ]
    
    box_width = 85
    box_height = 50
    spacing = 15
    start_x = 20
    base_y = 25
    
    for i, (time, phase, color) in enumerate(phases):
        x = start_x + i * (box_width + spacing)
        
        # Phase box
        box = Rect(x, base_y, box_width, box_height,
                  fillColor=color, strokeColor=None)
        drawing.add(box)
        
        # Time label
        time_lbl = String(x + box_width/2, base_y + box_height - 15, time,
                         fontName='Helvetica-Bold', fontSize=8,
                         fillColor=colors.white, textAnchor='middle')
        drawing.add(time_lbl)
        
        # Phase label
        phase_lbl = String(x + box_width/2, base_y + 15, phase,
                          fontName='Helvetica', fontSize=9,
                          fillColor=colors.white, textAnchor='middle')
        drawing.add(phase_lbl)
        
        # Arrow
        if i < len(phases) - 1:
            arrow_x = x + box_width + 2
            arrow = String(arrow_x, base_y + box_height/2 - 3, '→',
                          fontName='Helvetica-Bold', fontSize=14,
                          fillColor=MCKINSEY_GRAY, textAnchor='middle')
            drawing.add(arrow)
    
    return drawing

def create_capability_radar():
    """Create a simple capability indicator"""
    drawing = Drawing(400, 120)
    
    # Title
    title = String(200, 105, 'EXPERTISE-DOMAINS',
                  fontName='Helvetica-Bold', fontSize=11,
                  fillColor=MCKINSEY_BLUE, textAnchor='middle')
    drawing.add(title)
    
    capabilities = [
        ('Autonomous Mobility', 95),
        ('AI/ML Strategy', 90),
        ('Program Management', 98),
        ('Operations', 92),
        ('Data Platforms', 88)
    ]
    
    y_start = 80
    for i, (cap, score) in enumerate(capabilities):
        y = y_start - i * 16
        
        # Label
        lbl = String(10, y, cap, fontName='Helvetica', fontSize=9,
                    fillColor=MCKINSEY_DARK, textAnchor='start')
        drawing.add(lbl)
        
        # Bar background
        bg = Rect(140, y - 6, 200, 10, fillColor=MCKINSEY_LIGHT_GRAY, strokeColor=None)
        drawing.add(bg)
        
        # Score bar
        bar_width = (score / 100) * 200
        bar = Rect(140, y - 6, bar_width, 10, 
                  fillColor=MCKINSEY_BLUE if score >= 95 else MCKINSEY_BLUE_LIGHT,
                  strokeColor=None)
        drawing.add(bar)
        
        # Score label
        score_lbl = String(350, y - 3, f'{score}%',
                          fontName='Helvetica-Bold', fontSize=8,
                          fillColor=MCKINSEY_BLUE, textAnchor='start')
        drawing.add(score_lbl)
    
    return drawing

def create_proposal():
    filepath = "/Users/jarv/clawd/projects/website/public/angebot.pdf"
    
    # Create document with custom margins
    doc = BaseDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=2*cm,
        rightMargin=2*cm,
        topMargin=2.5*cm,
        bottomMargin=2*cm
    )
    
    # Define frames
    frame = Frame(
        doc.leftMargin, doc.bottomMargin,
        doc.width, doc.height,
        id='normal'
    )
    
    # Page template with header/footer
    template = PageTemplate(id='main', frames=frame, onPage=add_header_footer)
    doc.addPageTemplates([template])
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles - McKinsey style
    title_style = ParagraphStyle(
        'McKinseyTitle',
        parent=styles['Heading1'],
        fontSize=34,
        leading=40,
        textColor=MCKINSEY_BLUE,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'McKinseySubtitle',
        parent=styles['Heading2'],
        fontSize=13,
        leading=17,
        textColor=MCKINSEY_GRAY,
        spaceAfter=25,
        fontName='Helvetica'
    )
    
    heading1_style = ParagraphStyle(
        'McKinseyH1',
        parent=styles['Heading1'],
        fontSize=18,
        leading=24,
        textColor=MCKINSEY_BLUE,
        spaceBefore=25,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    heading2_style = ParagraphStyle(
        'McKinseyH2',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=MCKINSEY_DARK,
        spaceBefore=16,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'McKinseyBody',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=MCKINSEY_DARK,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
        fontName='Helvetica'
    )
    
    bullet_style = ParagraphStyle(
        'McKinseyBullet',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=MCKINSEY_DARK,
        leftIndent=18,
        spaceAfter=5,
        fontName='Helvetica'
    )
    
    highlight_style = ParagraphStyle(
        'McKinseyHighlight',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=MCKINSEY_BLUE,
        spaceAfter=10,
        fontName='Helvetica-Bold',
        backColor=MCKINSEY_LIGHT_GRAY,
        leftPadding=12,
        rightPadding=12,
        topPadding=8,
        bottomPadding=8,
        borderWidth=1,
        borderColor=MCKINSEY_BLUE,
        borderPadding=5
    )
    
    caption_style = ParagraphStyle(
        'Caption',
        parent=styles['Normal'],
        fontSize=8,
        leading=10,
        textColor=MCKINSEY_GRAY,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    
    # Build content
    story = []
    
    # ==================== COVER PAGE ====================
    story.append(Spacer(1, 2.5*cm))
    
    # Accent bar
    story.append(HRFlowable(width="100%", thickness=3, color=MCKINSEY_BLUE, spaceAfter=25))
    
    # Main title
    story.append(Paragraph("STRATEGIC ADVISORY", title_style))
    story.append(Paragraph("& EXECUTION PARTNERSHIP", title_style))
    story.append(Spacer(1, 0.4*cm))
    
    # Subtitle
    story.append(Paragraph("Premium Consulting für Autonomous Mobility,"))
    story.append(Paragraph("AI Transformation & Operations Excellence"))
    
    story.append(Spacer(1, 1.8*cm))
    
    # Value proposition box
    vp_data = [
        ["VALUE PROPOSITION"],
        ["Von der Strategie zur operativen Exzellenz — nachweisbare Ergebnisse für Ihre Transformation"]
    ]
    vp_table = Table(vp_data, colWidths=[16*cm])
    vp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BACKGROUND', (0, 1), (-1, 1), MCKINSEY_LIGHT_GRAY),
        ('TEXTCOLOR', (0, 1), (-1, 1), MCKINSEY_DARK),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, 1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
    ]))
    story.append(vp_table)
    
    story.append(Spacer(1, 2.5*cm))
    
    # Capability radar chart
    story.append(create_capability_radar())
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Selbsteinschätzung auf Basis 10+ Jahre C-Level Erfahrung", caption_style))
    
    story.append(Spacer(1, 1.5*cm))
    
    # Bottom section with consultant info
    bottom_data = [
        ["IHR BERATER", "Juri Fedjaev", " Januar 2025"],
        ["", "Former Head of Program Management", ""],
        ["", "Volkswagen Autonomous Mobility", ""],
        ["", "€1.9B Strategy Programs | 0→100 Deployment", ""]
    ]
    bottom_table = Table(bottom_data, colWidths=[4*cm, 9*cm, 3*cm])
    bottom_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica'),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('TEXTCOLOR', (1, 0), (1, -1), MCKINSEY_DARK),
        ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica'),
        ('TEXTCOLOR', (2, 0), (2, -1), MCKINSEY_GRAY),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(bottom_table)
    
    story.append(PageBreak())
    
    # ==================== EXECUTIVE SUMMARY ====================
    story.append(Paragraph("EXECUTIVE SUMMARY", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph(
        "In einem Marktumfeld, das durch beschleunigte technologische Disruption "
        "und verschärfte Wettbewerbsbedingungen geprägt ist, benötigen Unternehmen "
        "nicht nur strategische Vision, sondern vor allem operationale Exzellenz "
        "bei der Umsetzung.",
        body_style
    ))
    
    story.append(Paragraph(
        "Mit über 10 Jahren Erfahrung im Aufbau und der Skalierung von "
        "Autonomous-Mobility-Programmen — zuletzt als Head of Program Management "
        "bei Volkswagen Autonomous Mobility mit Verantwortung für €1.9B "
        "Strategieprogramme — biete ich drei maßgeschneiderte Beratungsmodelle, "
        "die von schneller Diagnose bis zur vollständigen operativen Führung reichen.",
        body_style
    ))
    
    story.append(Spacer(1, 0.4*cm))
    
    # Key stats
    stats_data = [
        ["€1.9B", "200TB+", "15+", "0→100"],
        ["Strategie-\nprogramme", "Data-\nPlattformen", "ML-\nModelle", "Fahrzeug-\nDeployment"]
    ]
    stats_table = Table(stats_data, colWidths=[4*cm, 4*cm, 4*cm, 4*cm])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 20),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BACKGROUND', (0, 1), (-1, 1), MCKINSEY_LIGHT_GRAY),
        ('TEXTCOLOR', (0, 1), (-1, 1), MCKINSEY_GRAY),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, 1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, 0), 16),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 1), (-1, 1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 8),
    ]))
    story.append(stats_table)
    
    story.append(Spacer(1, 0.6*cm))
    
    story.append(Paragraph("<b>Unser differenzierter Ansatz:</b>", heading2_style))
    
    diff_data = [
        ["Execution-First", "Keine reinen PowerPoint-Strategien, sondern Begleitung bis zum messbaren Ergebnis"],
        ["Deep Domain Expertise", "Spezialisierung auf Autonomous Mobility, AI/ML-Plattformen, komplexe technische Transformationen"],
        ["Flexible Modelle", "Von intensivem 2-Wochen-Assessment bis zur langfristigen operativen Führung"],
        ["Value-Based Pricing", "Transparente Kostenstruktur mit Fokus auf ROI und messbarem Geschäftswert"]
    ]
    diff_table = Table(diff_data, colWidths=[4.5*cm, 11.5*cm])
    diff_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (0, -1), 9),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('ROWBACKGROUNDS', (1, 0), (1, -1), [colors.white, MCKINSEY_LIGHT_GRAY]),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (1, 0), (1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(diff_table)
    
    story.append(PageBreak())
    
    # ==================== SERVICE OVERVIEW ====================
    story.append(Paragraph("LEISTUNGSÜBERSICHT", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph(
        "Drei aufeinander aufbauende Beratungsmodule — flexibel kombinierbar "
        "je nach Reifegrad und Dringlichkeit:",
        body_style
    ))
    
    story.append(Spacer(1, 0.4*cm))
    
    # Visual price chart
    story.append(create_price_chart())
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Monatliche/Projektbasierte Investition (in Tausend €)", caption_style))
    
    story.append(Spacer(1, 0.6*cm))
    
    # Service comparison table
    service_data = [
        ["", "STRATEGY ASSESSMENT", "TRANSFORMATION PARTNER", "COO-as-a-SERVICE"],
        ["Dauer", "2 Wochen", "3-6 Monate", "6-12+ Monate"],
        ["Investment", "€8,500", "€15,000/Monat", "€25,000/Monat"],
        ["Fokus", "Diagnose & Empfehlung", "Begleitende Transformation", "Operative Führung"],
        ["Engagement", "Projektbasiert", "Retainer", "Retainer"],
        ["Availability", "Fest definiert", "2-3 Tage/Woche", "3-4 Tage/Woche"]
    ]
    
    service_table = Table(service_data, colWidths=[3.5*cm, 4*cm, 4*cm, 4*cm])
    service_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        
        ('BACKGROUND', (0, 1), (0, -1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (0, -1), 9),
        
        ('ROWBACKGROUNDS', (1, 1), (-1, -1), [colors.white, MCKINSEY_LIGHT_GRAY]),
        ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (1, 1), (-1, -1), 9),
        
        # Highlight investment row
        ('BACKGROUND', (1, 2), (-1, 2), MCKINSEY_GOLD),
        ('TEXTCOLOR', (1, 2), (-1, 2), colors.white),
        ('FONTNAME', (1, 2), (-1, 2), 'Helvetica-Bold'),
        
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, MCKINSEY_GRAY),
    ]))
    story.append(service_table)
    
    story.append(Spacer(1, 0.5*cm))
    
    story.append(Paragraph(
        "<i>Alle Preise zuzüglich gesetzlicher USt. Reisekosten werden "
        "separat abgerechnet.</i>",
        ParagraphStyle('Small', parent=body_style, fontSize=8, textColor=MCKINSEY_GRAY)
    ))
    
    story.append(PageBreak())
    
    # ==================== PACKAGE 1 ====================
    story.append(Paragraph("PAKET 1: STRATEGY ASSESSMENT", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph("<b>€8,500 (einmalig) | 2 Wochen</b>", highlight_style))
    
    story.append(Paragraph(
        "Hochintensives Assessment für Führungsteams, die schnell Klarheit "
        "über ihre strategische Position und die größten Hebel benötigen.",
        body_style
    ))
    
    story.append(Paragraph("<b>Ziele:</b>", heading2_style))
    story.append(Paragraph("• Identifikation kritischer Lücken in Strategie, Organisation, Technologie", bullet_style))
    story.append(Paragraph("• Priorisierung nach Impact-und-Umsetzbarkeit-Matrix", bullet_style))
    story.append(Paragraph("• 90-Tage-Roadmap mit klaren Quick Wins", bullet_style))
    
    story.append(Paragraph("<b>Zweiwochen-Intensivprogramm:</b>", heading2_style))
    
    week_data = [
        ["WOCHE 1: DISCOVERY", "WOCHE 2: SYNTHESIS"],
        ["• Stakeholder-Interviews (Leadership, Tech, Ops)\n"
         "• Prozess- & System-Audit\n"
         "• Daten- & ML-Infrastruktur-Review\n"
         "• Wettbewerbs- & Marktanalyse",
         
         "• Gap-Analyse & Priorisierung\n"
         "• Strategy Workshop (4h)\n"
         "• 90-Tage-Roadmap-Entwicklung\n"
         "• Executive Summary & Report"]
    ]
    week_table = Table(week_data, colWidths=[8*cm, 8*cm])
    week_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('BACKGROUND', (0, 1), (-1, 1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, 1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(week_table)
    
    story.append(Spacer(1, 0.4*cm))
    
    story.append(Paragraph("<b>Deliverables:</b>", heading2_style))
    story.append(Paragraph("• 30-seitiger Assessment Report mit Executive Summary", bullet_style))
    story.append(Paragraph("• Priorisierte Initiativen-Map mit Impact/Schwierigkeits-Rating", bullet_style))
    story.append(Paragraph("• 90-Tage-Implementierungsroadmap", bullet_style))
    story.append(Paragraph("• Präsentation für Board/Investoren", bullet_style))
    
    story.append(PageBreak())
    
    # ==================== PACKAGE 2 ====================
    story.append(Paragraph("PAKET 2: TRANSFORMATION PARTNER", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph("<b>€15,000/Monat (Retainer) | Mindestlaufzeit: 3 Monate</b>", highlight_style))
    
    story.append(Paragraph(
        "Begleitende Beratung für Unternehmen in Transformationsphasen — "
        "vom strategischen Planning bis zur operativen Umsetzung.",
        body_style
    ))
    
    story.append(Spacer(1, 0.3*cm))
    
    # Timeline visualization
    story.append(create_timeline_diagram())
    story.append(Paragraph("Typischer Transformations-Verlauf", caption_style))
    
    story.append(Spacer(1, 0.3*cm))
    
    story.append(Paragraph("<b>Leistungsbereiche:</b>", heading2_style))
    
    scope_data = [
        ["Strategie & Planning", "Organisation & Prozesse", "Technologie & Daten"],
        ["• OKR-Framework-Design\n"
         "• Roadmap-Entwicklung\n"
         "• Investor-Readiness",
         
         "• Team-Struktur-Design\n"
         "• Agile Transformation\n"
         "• Change Management",
         
         "• Architektur-Review\n"
         "• ML-Ops-Setup\n"
         "• Data Strategy"]
    ]
    scope_table = Table(scope_data, colWidths=[5.3*cm, 5.3*cm, 5.3*cm])
    scope_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, 1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, 1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(scope_table)
    
    story.append(Paragraph("<b>Monatliche Deliverables:</b>", heading2_style))
    story.append(Paragraph("• Wöchentliche Steuerungsrunden mit Leadership", bullet_style))
    story.append(Paragraph("• Progress Report mit KPI-Dashboard", bullet_style))
    story.append(Paragraph("• Quarterly Business Review & Strategie-Adjustment", bullet_style))
    story.append(Paragraph("• Ad-hoc Beratung bei kritischen Entscheidungen (SLA: 4h Response)", bullet_style))
    
    story.append(Paragraph("<b>Typische Ergebnisse nach 6 Monaten:</b>", heading2_style))
    results = [
        "30-50% Reduktion Time-to-Market für kritische Features",
        "Etablierte OKR-Kultur mit 90%+ Zielerreichung",
        "Skalierbare Struktur für 2-3x Headcount-Wachstum",
        "Klare Data/AI-Roadmap mit definierten Quick Wins"
    ]
    for r in results:
        story.append(Paragraph(f"• {r}", bullet_style))
    
    story.append(PageBreak())
    
    # ==================== PACKAGE 3 ====================
    story.append(Paragraph("PAKET 3: COO-as-a-SERVICE", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph("<b>€25,000/Monat (Retainer) | Mindestlaufzeit: 6 Monate</b>", highlight_style))
    
    story.append(Paragraph(
        "Vollständige operative Führungsverantwortung für Scale-ups und "
        "Transformationsunternehmen — ohne den langfristigen Commitment einer Festanstellung.",
        body_style
    ))
    
    story.append(Paragraph("<b>Verantwortungsbereiche:</b>", heading2_style))
    
    coo_data = [
        ["OPERATIONS", "STRATEGY", "PEOPLE", "TECHNOLOGY"],
        ["P&L-Verantwortung\nBudget-Planning\nVendor Management\nCompliance & Risk",
         "Strategic Planning\nBoard-Reporting\nInvestor Relations\nM&A-Support",
         "Team Leadership\nRecruiting-Strategy\nCulture Building\nPerformance Mgmt",
         "Tech Strategy\nAI/ML Roadmap\nInfrastructure\nSecurity & Scale"]
    ]
    coo_table = Table(coo_data, colWidths=[4*cm, 4*cm, 4*cm, 4*cm])
    coo_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BACKGROUND', (0, 1), (-1, 1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, 1), 8),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('ALIGN', (0, 1), (-1, 1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(coo_table)
    
    story.append(Paragraph("<b>Engagement-Modell:</b>", heading2_style))
    story.append(Paragraph("• Zeitaufwand: 3-4 Tage/Woche vor Ort / Remote", bullet_style))
    story.append(Paragraph("• Berichtslinie: Direkt an CEO/Board", bullet_style))
    story.append(Paragraph("• Entscheidungsbefugnis: Operative Vollmacht nach Mandat", bullet_style))
    story.append(Paragraph("• Optimal für: 20-150 Mitarbeiter oder €5M-€50M Umsatz", bullet_style))
    
    story.append(Spacer(1, 0.4*cm))
    
    story.append(Paragraph("<b>Vergleich: COO-as-a-Service vs. Festanstellung</b>", heading2_style))
    
    compare_data = [
        ["Kriterium", "COO-as-a-Service", "Festanstellung"],
        ["Monatliche Kosten", "€25,000", "€20-35K + Nebenkosten"],
        ["Einstiegsbarriere", "1 Monat Kündigung", "6-12 Monate Probezeit"],
        ["Erfahrung", "10+ Jahre C-Level", "Variabel"],
        ["Flexibilität", "Skalierbar", "Langfristig gebunden"],
        ["Risiko", "Niedrig", "Hoch (Einstellungsrisiko)"],
    ]
    compare_table = Table(compare_data, colWidths=[5*cm, 5.5*cm, 5.5*cm])
    compare_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (0, -1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('BACKGROUND', (1, 1), (1, -1), colors.HexColor('#e8f4e8')),
        ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, MCKINSEY_GRAY),
    ]))
    story.append(compare_table)
    
    story.append(PageBreak())
    
    # ==================== RETAINER LOGIC ====================
    story.append(Paragraph("DAS RETAINER-MODELL", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph(
        "Retainer-basierte Beratung ist das Standardmodell führender "
        "Strategieberatungen für langfristige Mandate:",
        body_style
    ))
    
    story.append(Spacer(1, 0.3*cm))
    
    benefits_data = [
        ["Vorteil", "Beschreibung"],
        ["Kostenkontrolle", "Fixe monatliche Kosten ohne Überraschungen bei Budget-Planning"],
        ["Priorisierung", "Garantierte Verfügbarkeit und schnellere Response-Zeiten"],
        ["Strategische Tiefe", "Kontinuierliche Begleitung ermöglicht tiefes Verständnis"],
        ["Proaktive Beratung", "Bedarfsgerechte Beratung, nicht abrechnungsoptimiert"],
        ["Skalierbarkeit", "Intensität nach Projektphasen anpassbar"],
    ]
    benefits_table = Table(benefits_data, colWidths=[4*cm, 12*cm])
    benefits_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (0, -1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (1, 1), (1, -1), [colors.white, MCKINSEY_LIGHT_GRAY]),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, MCKINSEY_GRAY),
    ]))
    story.append(benefits_table)
    
    story.append(Spacer(1, 0.4*cm))
    
    story.append(Paragraph("<b>Abrechnungs-Mechanismus:</b>", heading2_style))
    billing = [
        "Monatliche Pauschale fällig am ersten Werktag des Monats",
        "Enthalten: Alle vereinbarten Beratungsleistungen, Workshops, Reports",
        "Reisekosten: Separat nach Aufwand (Economy-Flüge, Mittelklasse-Hotel)",
        "Zusatzleistungen: Spezialisierte Services separat vereinbart",
        "Anpassung: Retainer quartalsweise an Projektfortschritt reviewt"
    ]
    for b in billing:
        story.append(Paragraph(f"• {b}", bullet_style))
    
    story.append(PageBreak())
    
    # ==================== DAILY RATE ====================
    story.append(Paragraph("TAGESATZ-ALTERNATIVE", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph(
        "Für Einzelprojekte oder spezifische Aufgabenstellungen außerhalb des Retainer-Modells:",
        body_style
    ))
    
    story.append(Spacer(1, 0.3*cm))
    
    rate_data = [
        ["Service-Level", "Tagesrate", "Anwendungsfall"],
        ["Senior Advisor\nStrategische Beratung, Board-Präsenz", "€3,500", 
         "Board-Meetings, Strategie-Workshops, Investor-Präsentationen"],
        ["Execution Lead\nOperative Begleitung", "€2,800", 
         "Projekt-Durchführung, OKR-Implementierung, Prozess-Design"],
        ["Subject Matter Expert\nTechnische Deep-Dives", "€2,200", 
         "Architektur-Reviews, ML-Evaluation, Due Diligence"],
    ]
    rate_table = Table(rate_data, colWidths=[5*cm, 3*cm, 8*cm])
    rate_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, MCKINSEY_LIGHT_GRAY]),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 1), (2, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, MCKINSEY_GRAY),
    ]))
    story.append(rate_table)
    
    story.append(Spacer(1, 0.5*cm))
    
    story.append(Paragraph("<b>Marktbenchmark:</b>", heading2_style))
    story.append(Paragraph(
        "C-Level Interim-Manager im Automotive/AI-Bereich: €2,500-€5,000/Tag "
        "(Big-4 & Boutique-Firmen). Unsere Preise reflektieren Premium-Expertise "
        "bei effizienter Struktur ohne Überhead.",
        body_style
    ))
    
    story.append(Paragraph(
        "<b>Empfehlung:</b> Bei >10 Tagen/Monat ist das Retainer-Modell typischerweise "
        "kosteneffizienter.",
        highlight_style
    ))
    
    story.append(PageBreak())
    
    # ==================== ROI ====================
    story.append(Paragraph("NUTZEN & ROI", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph(
        "Die Investition muss sich in messbarem Geschäftswert rechtfertigen. "
        "Drei quantifizierbare Dimensionen:",
        body_style
    ))
    
    story.append(Spacer(1, 0.3*cm))
    
    roi_data = [
        ["Dimension", "Beispiel-Impact", "ROI"],
        ["Time-to-Value", "Reduktion 12→6 Monate für MVP-Launch", "3-6x bei Markteinführung"],
        ["Opportunity Cost", "Frühzeitige Erkennung von Architektur-Fehlern", "€500K-€2M vermieden"],
        ["Scale Efficiency", "30% Produktivitätsgewinn durch Agile", "€300K-€1M jährlich"],
    ]
    roi_table = Table(roi_data, colWidths=[4*cm, 6*cm, 6*cm])
    roi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, MCKINSEY_LIGHT_GRAY]),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, MCKINSEY_GRAY),
    ]))
    story.append(roi_table)
    
    story.append(Spacer(1, 0.5*cm))
    
    story.append(Paragraph("<b>Case Example: Autonomous Mobility Scale-up</b>", heading2_style))
    story.append(Paragraph(
        "Series-B-Startup im Autonomous-Trucking engagierte uns für 6 Monate "
        "als Transformation Partner (€90,000):",
        body_style
    ))
    
    story.append(Paragraph("• Situation: Operative Ineffizienzen verzögerten Series-C-Readiness", bullet_style))
    story.append(Paragraph("• Intervention: OKR-Framework, Data-Pipeline-Restrukturierung, Board-Reporting", bullet_style))
    story.append(Paragraph("• Ergebnis: 40% schnellere Releases, erfolgreiche €25M Series-C", bullet_style))
    story.append(Paragraph("• ROI: 278x Return durch Bewertungssteigerung", bullet_style))
    
    story.append(Spacer(1, 0.4*cm))
    
    story.append(Paragraph(
        "<i>Disclaimer: Jeder Fall ist individuell. Wir garantieren keine spezifischen "
        "Ergebnisse, sondern maximale Engagement-Qualität und bewährte Methodik.</i>",
        ParagraphStyle('Small', parent=body_style, fontSize=8, textColor=MCKINSEY_GRAY)
    ))
    
    story.append(PageBreak())
    
    # ==================== NEXT STEPS ====================
    story.append(Paragraph("NEXT STEPS", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=MCKINSEY_BLUE, spaceAfter=12))
    
    story.append(Paragraph(
        "Onboarding-Prozess für eine erfolgreiche Zusammenarbeit:",
        body_style
    ))
    
    story.append(Spacer(1, 0.3*cm))
    
    steps_data = [
        ["", "Schritt", "Aktivität", "Zeit"],
        ["1", "Erstgespräch", "Kostenloses 30-Min-Gespräch zur Bedarfsermittlung", "Woche 1"],
        ["2", "Scope-Definition", "Workshop mit Key Stakeholdern", "Woche 1-2"],
        ["3", "Anpassung", "Customizing der Pakete an Ihre Bedürfnisse", "Woche 2"],
        ["4", "Kick-off", "Vertrag, NDAs, erster Arbeitstermin", "Woche 2-3"],
    ]
    steps_table = Table(steps_data, colWidths=[1.2*cm, 3*cm, 9*cm, 2.8*cm])
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (0, -1), MCKINSEY_GOLD),
        ('TEXTCOLOR', (0, 1), (0, -1), colors.white),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (0, -1), 12),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('VALIGN', (0, 1), (0, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (1, 1), (-1, -1), [colors.white, MCKINSEY_LIGHT_GRAY]),
        ('FONTNAME', (1, 1), (2, -1), 'Helvetica'),
        ('FONTNAME', (3, 1), (3, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, MCKINSEY_GRAY),
    ]))
    story.append(steps_table)
    
    story.append(Spacer(1, 0.8*cm))
    
    # Contact
    story.append(Paragraph("<b>KONTAKT</b>", heading2_style))
    
    contact_data = [
        ["Juri Fedjaev", "juri@fedjaev.com"],
        ["Strategic Advisory", "linkedin.com/in/jurifedjaev"],
        ["", "fedjaev.com"]
    ]
    contact_table = Table(contact_data, colWidths=[5*cm, 11*cm])
    contact_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), MCKINSEY_BLUE),
        ('TEXTCOLOR', (0, 0), (0, 0), colors.white),
        ('TEXTCOLOR', (0, 1), (0, -1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica'),
        ('BACKGROUND', (1, 0), (-1, -1), MCKINSEY_LIGHT_GRAY),
        ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(contact_table)
    
    story.append(Spacer(1, 1*cm))
    
    # Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=MCKINSEY_GRAY, spaceBefore=20, spaceAfter=8))
    story.append(Paragraph(
        "Vertrauliches Angebot | Preise gültig bis 31.03.2025",
        ParagraphStyle('Footer', parent=body_style, fontSize=8, textColor=MCKINSEY_GRAY, alignment=TA_CENTER)
    ))
    
    # Build PDF
    doc.build(story)
    print(f"✅ PDF erfolgreich erstellt: {filepath}")
    return filepath

def add_header_footer(canvas_obj, doc):
    """Add McKinsey-style header and footer"""
    canvas_obj.saveState()
    
    # Header line
    canvas_obj.setStrokeColor(MCKINSEY_BLUE)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(2*cm, A4[1] - 1.8*cm, A4[0] - 2*cm, A4[1] - 1.8*cm)
    
    # Header text
    canvas_obj.setFillColor(MCKINSEY_GRAY)
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.drawString(2*cm, A4[1] - 1.5*cm, "STRATEGIC ADVISORY | Juri Fedjaev")
    
    # Page number
    page_num = canvas_obj.getPageNumber()
    canvas_obj.drawRightString(A4[0] - 2*cm, A4[1] - 1.5*cm, f"Seite {page_num}")
    
    # Footer line
    canvas_obj.line(2*cm, 1.5*cm, A4[0] - 2*cm, 1.5*cm)
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.drawString(2*cm, 1.1*cm, "Confidential | Strategic Advisory Proposal")
    
    canvas_obj.restoreState()

if __name__ == "__main__":
    create_proposal()
