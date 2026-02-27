"""
PDF Report Generator
Generates downloadable PDF reports for skill analysis
"""

import io
from datetime import datetime
from typing import List, Dict, Any

# PDF generation
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Circle, String, Line
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart


class PDFReportGenerator:
    """Generates PDF reports for skill analysis results"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1e40af')
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors.HexColor('#64748b')
        ))
        
        # Section header
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#1e40af'),
            borderPadding=5,
        ))
        
        # Body text
        self.styles.add(ParagraphStyle(
            name='CustomBodyText',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=8,
            alignment=TA_JUSTIFY,
        ))
        
        # Highlight text
        self.styles.add(ParagraphStyle(
            name='Highlight',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#059669'),
            spaceBefore=5,
            spaceAfter=5,
        ))
    
    def generate_report(self, analysis_data: Dict[str, Any], recommendations: List[Dict] = None) -> bytes:
        """
        Generate a PDF report from analysis data
        
        Args:
            analysis_data: Analysis results dictionary
            recommendations: List of course recommendations
            
        Returns:
            PDF bytes
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Build content
        story = []
        
        # Header
        story.append(Paragraph("SkillLens Analysis Report", self.styles['CustomTitle']))
        story.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", self.styles['CustomSubtitle']))
        story.append(Spacer(1, 20))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#1e40af')))
        story.append(Spacer(1, 30))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", self.styles['SectionHeader']))
        
        match_percentage = analysis_data.get('match_percentage', 0)
        classification = analysis_data.get('classification', 'Unknown')
        matched_skills = analysis_data.get('matched_skills', [])
        missing_skills = analysis_data.get('missing_skills', [])
        
        summary_text = f"""
        Your resume shows a <b>{match_percentage}%</b> match with the job description. 
        Based on our analysis, you are classified as a <b>{classification}</b> candidate.
        <br/><br/>
        • <b>Matched Skills:</b> {len(matched_skills)} skills found in your resume
        <br/>
        • <b>Missing Skills:</b> {len(missing_skills)} skills not found in your resume
        <br/>
        • <b>Similarity Score:</b> {analysis_data.get('similarity_score', 0):.1f}%
        """
        story.append(Paragraph(summary_text, self.styles['CustomBodyText']))
        story.append(Spacer(1, 20))
        
        # Match Score Visualization (Text-based for simplicity)
        story.append(Paragraph("Match Score Breakdown", self.styles['SectionHeader']))
        
        # Create a simple table for score display
        score_data = [
            ['Metric', 'Value', 'Status'],
            ['Overall Match', f'{match_percentage}%', self._get_status(match_percentage)],
            ['Similarity Score', f"{analysis_data.get('similarity_score', 0):.1f}%", 'Informational'],
            ['Skills Found', str(len(matched_skills)), 'Matched'],
            ['Skills Missing', str(len(missing_skills)), 'Gap Area'],
        ]
        
        score_table = Table(score_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#1e293b')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(score_table)
        story.append(Spacer(1, 30))
        
        # Matched Skills
        if matched_skills:
            story.append(Paragraph("Matched Skills", self.styles['SectionHeader']))
            story.append(Paragraph(
                "The following skills from the job description were found in your resume:",
                self.styles['CustomBodyText']
            ))
            story.append(Spacer(1, 10))
            
            # Create skills table
            skill_rows = []
            for i in range(0, len(matched_skills), 3):
                row = matched_skills[i:i+3]
                while len(row) < 3:
                    row.append('')
                skill_rows.append(row)
            
            if skill_rows:
                skills_table = Table(skill_rows, colWidths=[1.8*inch, 1.8*inch, 1.8*inch])
                skills_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#dcfce7')),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#166534')),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bbf7d0')),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(skills_table)
            story.append(Spacer(1, 20))
        
        # Missing Skills
        if missing_skills:
            story.append(Paragraph("Missing Skills", self.styles['SectionHeader']))
            story.append(Paragraph(
                "The following skills from the job description were not found in your resume:",
                self.styles['CustomBodyText']
            ))
            story.append(Spacer(1, 10))
            
            # Create skills table
            skill_rows = []
            for i in range(0, len(missing_skills), 3):
                row = missing_skills[i:i+3]
                while len(row) < 3:
                    row.append('')
                skill_rows.append(row)
            
            if skill_rows:
                missing_table = Table(skill_rows, colWidths=[1.8*inch, 1.8*inch, 1.8*inch])
                missing_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fee2e2')),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#991b1b')),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fecaca')),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(missing_table)
            story.append(Spacer(1, 20))
        
        # Recommendations
        if recommendations:
            story.append(Paragraph("Recommended Courses", self.styles['SectionHeader']))
            story.append(Paragraph(
                "Based on your missing skills, we recommend the following courses to bridge the gap:",
                self.styles['CustomBodyText']
            ))
            story.append(Spacer(1, 10))
            
            rec_data = [['Course', 'Platform', 'Duration', 'Rating']]
            for rec in recommendations[:10]:  # Limit to 10 recommendations
                rec_data.append([
                    rec.get('title', 'N/A')[:30] + ('...' if len(rec.get('title', '')) > 30 else ''),
                    rec.get('platform', 'N/A'),
                    rec.get('duration', 'N/A'),
                    f"{rec.get('rating', 0):.1f}/5"
                ])
            
            rec_table = Table(rec_data, colWidths=[2.5*inch, 1.2*inch, 1*inch, 0.8*inch])
            rec_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#1e293b')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(rec_table)
            story.append(Spacer(1, 30))
        
        # Recommendations and Next Steps
        story.append(Paragraph("Recommendations", self.styles['SectionHeader']))
        
        if match_percentage >= 70:
            advice = """
            <b>Great job!</b> You have a strong match with the job requirements. 
            Consider the following next steps:
            <br/><br/>
            1. Highlight your matched skills prominently in your resume
            <br/>
            2. Prepare examples of how you've used these skills in previous roles
            <br/>
            3. Continue learning to stay current with industry trends
            """
        elif match_percentage >= 40:
            advice = """
            <b>Good potential!</b> You have a moderate match with the job requirements.
            Consider the following next steps:
            <br/><br/>
            1. Focus on developing the missing skills through online courses
            <br/>
            2. Consider adding projects to your portfolio that demonstrate related skills
            <br/>
            3. Network with professionals in the field to learn more about the role
            """
        else:
            advice = """
            <b>Keep learning!</b> There are significant skill gaps to address.
            Consider the following next steps:
            <br/><br/>
            1. Start with foundational courses in the missing skill areas
            <br/>
            2. Look for entry-level positions or internships to gain experience
            <br/>
            3. Consider a structured learning path or bootcamp program
            """
        
        story.append(Paragraph(advice, self.styles['CustomBodyText']))
        story.append(Spacer(1, 30))
        
        # Footer
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1')))
        story.append(Spacer(1, 10))
        story.append(Paragraph(
            f"Report generated by SkillLens | {datetime.now().year}",
            ParagraphStyle(
                name='Footer',
                parent=self.styles['Normal'],
                fontSize=8,
                textColor=colors.HexColor('#94a3b8'),
                alignment=TA_CENTER
            )
        ))
        
        # Build PDF
        doc.build(story)
        
        # Get PDF bytes
        buffer.seek(0)
        return buffer.getvalue()
    
    def _get_status(self, match_percentage: float) -> str:
        """Get status text based on match percentage"""
        if match_percentage >= 70:
            return 'Excellent'
        elif match_percentage >= 40:
            return 'Good'
        else:
            return 'Needs Improvement'


# Create singleton instance
pdf_generator = PDFReportGenerator()