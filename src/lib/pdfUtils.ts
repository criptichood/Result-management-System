import jsPDF from 'jspdf';
import { User } from '../types';
import { getGradePoint } from './academicUtils';

export interface PdfResultItem {
  code: string;
  title: string;
  units: number;
  result: {
    score: number;
    grade: string;
    status: string;
  };
}

export function generateOfficialResultPdf(
  user: User,
  items: PdfResultItem[],
  scopeLabel: string,
  cumulativeCgpa: number,
  totalUnitsRegistered: number,
  totalUnitsPassed: number,
  mode: 'download' | 'preview' = 'download'
): boolean {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    let y = 14;

    // --- OFFICIAL FUAZ UNIVERSITY CREST (Pure Vector Emblem) ---
    // Outer Gold Laurel Ring
    pdf.setDrawColor(202, 138, 4); // gold #ca8a04
    pdf.setFillColor(6, 78, 59);   // emerald-900 #064e3b
    pdf.setLineWidth(1.2);
    pdf.circle(pageWidth / 2, y + 8, 11, 'FD');

    // Inner shield / accent ring
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.6);
    pdf.circle(pageWidth / 2, y + 8, 9, 'S');

    // Crest Monogram Text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text('FUAZ', pageWidth / 2, y + 9.5, { align: 'center' });

    y += 24; // Generous spacing so logo never touches university name

    // Header - Institution Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(6, 78, 59); // #064e3b emerald-900
    pdf.text('FEDERAL UNIVERSITY OF AGRICULTURE, ZURU', pageWidth / 2, y, { align: 'center' });
    
    y += 5.5;
    pdf.setFontSize(9.5);
    pdf.setTextColor(71, 85, 105); // slate-600
    pdf.text('P.M.B. 66, Zuru, Kebbi State, Nigeria', pageWidth / 2, y, { align: 'center' });
    
    y += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.setTextColor(5, 150, 105); // emerald-600
    pdf.text('OFFICIAL STATEMENT OF ACADEMIC RESULTS', pageWidth / 2, y, { align: 'center' });

    y += 5;
    // Divider line
    pdf.setDrawColor(203, 213, 225); // slate-300
    pdf.setLineWidth(0.5);
    pdf.line(15, y, pageWidth - 15, y);

    y += 5;
    // Student Bio Box (Tabular Grid Layout)
    const bioBoxHeight = 28;
    pdf.setFillColor(248, 250, 252); // slate-50
    pdf.roundedRect(15, y, pageWidth - 30, bioBoxHeight, 2, 2, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(15, y, pageWidth - 30, bioBoxHeight, 2, 2, 'S');

    // Left Column
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text('STUDENT NAME:', 19, y + 6.5);
    pdf.text('MATRIC NO:', 19, y + 14);
    pdf.text('PROGRAMME:', 19, y + 21.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text((user.name || '').toUpperCase(), 52, y + 6.5);
    pdf.text(user.matricNumber || 'N/A', 52, y + 14);
    pdf.text(`B.Sc. ${user.department || 'Computer Science'}`, 52, y + 21.5);

    // Right Column
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('DEPARTMENT:', 118, y + 6.5);
    pdf.text('SEMESTER:', 118, y + 14);
    pdf.text('DATE ISSUED:', 118, y + 21.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(user.department || 'Computer Science', 148, y + 6.5);
    pdf.text(scopeLabel.replace(/_/g, ' '), 148, y + 14);
    pdf.text(new Date().toLocaleDateString('en-GB'), 148, y + 21.5);

    y += bioBoxHeight + 6;

    // Table Header
    pdf.setFillColor(6, 78, 59);
    pdf.rect(15, y, pageWidth - 30, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);

    pdf.text('S/N', 18, y + 5.5);
    pdf.text('COURSE CODE', 28, y + 5.5);
    pdf.text('COURSE TITLE', 60, y + 5.5);
    pdf.text('UNITS', 135, y + 5.5, { align: 'center' });
    pdf.text('SCORE', 152, y + 5.5, { align: 'center' });
    pdf.text('GRADE', 170, y + 5.5, { align: 'center' });
    pdf.text('GP', 187, y + 5.5, { align: 'center' });

    y += 8;

    // Table Rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(30, 41, 59);

    items.forEach((item, index) => {
      if (y > pageHeight - 35) {
        pdf.addPage();
        y = 20;
      }

      if (index % 2 === 1) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(15, y, pageWidth - 30, 7, 'F');
      }

      const score = item.result?.score ?? 0;
      const grade = item.result?.grade || 'F';
      const gp = getGradePoint(grade);

      pdf.text(String(index + 1), 18, y + 4.5);
      pdf.text(item.code, 28, y + 4.5);
      
      const title = item.title.length > 42 ? item.title.substring(0, 40) + '...' : item.title;
      pdf.text(title, 60, y + 4.5);
      
      pdf.text(String(item.units), 135, y + 4.5, { align: 'center' });
      pdf.text(String(score), 152, y + 4.5, { align: 'center' });
      pdf.text(grade, 170, y + 4.5, { align: 'center' });
      pdf.text(String(gp * item.units), 187, y + 4.5, { align: 'center' });

      y += 7;
    });

    y += 4;

    // Summary Box
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFillColor(240, 253, 244); // emerald-50
    pdf.setDrawColor(187, 247, 208); // emerald-200
    pdf.roundedRect(15, y, pageWidth - 30, 18, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(6, 78, 59);
    pdf.text('CUMULATIVE ACADEMIC SUMMARY', 20, y + 6);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);
    pdf.text(`Total Units Registered: ${totalUnitsRegistered}`, 20, y + 13);
    pdf.text(`Total Units Passed: ${totalUnitsPassed}`, 75, y + 13);
    pdf.text(`Cumulative CGPA: ${cumulativeCgpa.toFixed(2)}`, 135, y + 13);

    y += 24;

    // Footer / Verification Notice
    if (y > pageHeight - 20) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text('* This official statement of results is generated electronically from FUAZ SRMS for student record keeping.', pageWidth / 2, y, { align: 'center' });

    const filename = `FUAZ_Result_Slip_${user.matricNumber || 'Student'}_${scopeLabel}.pdf`;

    if (mode === 'preview') {
      const blobUrl = pdf.output('bloburl');
      window.open(blobUrl, '_blank');
    } else {
      pdf.save(filename);
    }

    return true;
  } catch (error) {
    console.error('Error generating PDF with jsPDF:', error);
    alert('PDF Generation Error: ' + (error instanceof Error ? error.message : String(error)));
    return false;
  }
}
