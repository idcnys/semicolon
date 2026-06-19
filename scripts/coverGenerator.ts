import { TNR_FONT_BASE64 } from '../constants/cover';
import { CoverState } from '../types/cover';
import { formatDate, formatName, getLogoURI } from './coverHelpers';

export const generateCoverHTML = (state: CoverState, isPreview: boolean = false): string => {
    const {
        typeSelect,
        courseNo,
        courseTitle,
        typeNo,
        typeTitle,
        section,
        teacherName,
        teacherDesignation,
        teacherDept,
        studentName,
        studentRoll,
    } = state;

    const expDateFormatted = formatDate(state.expDate);
    const subDateFormatted = formatDate(state.subDate);

    const expDateHTML =
        typeSelect === 'lab-report' || typeSelect === 'project'
            ? `<div style="font-size:18px; margin-left:6mm; margin-top:4mm;">
                <b>Date of Experiment:</b> ${expDateFormatted || '—'}
              </div>`
            : '';

    const logoURI = getLogoURI();

    // For preview, use a scaled container that fits the screen
    const containerStyle = isPreview 
        ? `
            .cover-container {
              width: 100%;
              max-width: 210mm;
              aspect-ratio: 210 / 297;
              background: white;
              padding: 18mm 16mm;
              box-sizing: border-box;
              position: relative;
              font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              margin: 0 auto;
              transform: scale(0.95);
              transform-origin: top center;
            }
          `
        : `
            .cover-container {
              width: 210mm;
              height: 297mm;
              background: white;
              padding: 18mm 16mm;
              box-sizing: border-box;
              position: relative;
              font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              page-break-after: avoid;
              page-break-inside: avoid;
              margin: 0 auto;
            }
          `;

    return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
              @font-face {
                font-family: 'TimesNewRoman';
                src: url('${TNR_FONT_BASE64}') format('truetype');
                font-weight: normal;
                font-style: normal;
              }
              @font-face {
                font-family: 'TimesNewRoman';
                src: url('${TNR_FONT_BASE64}') format('truetype');
                font-weight: bold;
                font-style: normal;
              }
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                min-height: 100vh;
                background: ${isPreview ? '#f5f5f5' : 'white'};
                display: flex;
                justify-content: center;
                align-items: ${isPreview ? 'flex-start' : 'center'};
                ${isPreview ? 'padding: 10px;' : ''}
              }
              
              ${containerStyle}
              
              .cover-header {
                font-size: 16px;
                font-style: italic;
                text-align: center;
                letter-spacing: 1px;
                margin-top: 4mm;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .cover-university {
                font-size: 26px;
                font-weight: 600;
                text-align: center;
                margin: 4mm 0 2mm;
                letter-spacing: 1px;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .cover-logo {
                width: 100px;
                display: block;
                margin: 3mm auto;
              }
              
              .cover-logo img {
                width: 100%;
                height: auto;
                display: block;
              }
              
              .cover-department {
                font-size: 20px;
                text-align: center;
                margin: 3mm 0 6mm;
                font-weight: 500;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .cover-course {
                text-align: center;
                font-size: 18px;
                margin: 2mm 0;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .cover-assignment {
                font-size: 18px;
                margin: 2mm 0 2mm 16px;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .cover-submitted {
                display: flex;
                justify-content: space-between;
                margin: 8mm 0 10mm;
                font-size: 18px;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .submitted-left,
              .submitted-right {
                width: 45%;
                line-height: 1.8;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              .submitted-left {
                margin-left: 4mm;
              }
              
              .submitted-right {
                margin-right: 4mm;
              }
              
              .cover-date {
                font-size: 18px;
                margin-left: 4mm;
                margin-top: 3mm;
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
              }
              
              b, strong {
                font-family: 'TimesNewRoman', 'Times New Roman', Times, serif;
                font-weight: bold;
              }
              
              u {
                text-decoration: underline;
              }
              
              /* Print styles - exact match for PDF */
              @media print {
                html, body {
                  background: white;
                  margin: 0;
                  padding: 0;
                  display: block;
                }
                .cover-container {
                  border: none;
                  box-shadow: none;
                  margin: 0;
                  width: 100%;
                  height: 100vh;
                  transform: none !important;
                }
              }
              
              @page {
                size: A4;
                margin: 0;
              }
              
              /* Preview specific styles */
              @media screen and (max-width: 768px) {
                .cover-container {
                  padding: 12mm 10mm;
                }
                .cover-university {
                  font-size: 22px;
                }
                .cover-department {
                  font-size: 18px;
                }
                .cover-course {
                  font-size: 16px;
                }
                .cover-assignment {
                  font-size: 16px;
                  margin-left: 12px;
                }
                .cover-submitted {
                  font-size: 16px;
                  margin: 6mm 0 8mm;
                }
                .cover-date {
                  font-size: 16px;
                }
                .cover-header {
                  font-size: 14px;
                }
                .cover-logo {
                  width: 80px;
                }
              }
              
              @media screen and (max-width: 480px) {
                .cover-container {
                  padding: 10mm 8mm;
                }
                .cover-university {
                  font-size: 18px;
                }
                .cover-department {
                  font-size: 15px;
                }
                .cover-course {
                  font-size: 14px;
                }
                .cover-assignment {
                  font-size: 14px;
                  margin-left: 8px;
                }
                .cover-submitted {
                  font-size: 14px;
                  margin: 4mm 0 6mm;
                }
                .cover-date {
                  font-size: 14px;
                }
                .cover-header {
                  font-size: 12px;
                }
                .cover-logo {
                  width: 60px;
                }
                .submitted-left,
                .submitted-right {
                  width: 48%;
                  line-height: 1.6;
                }
              }
            </style>
          </head>
          <body>
            <div class="cover-container">
              <div class="cover-header">Heaven's Light is Our Guide</div>
              <div class="cover-university">Rajshahi University of Engineering & Technology</div>
              <div class="cover-logo">
                <img src="${logoURI}" alt="RUET Logo" />
              </div>
              <div class="cover-department"><b>Department of Computer Science & Engineering</b></div>
              <div class="cover-course"><b>Course No:</b> ${courseNo}</div>
              <div class="cover-course" style="margin-bottom:40px"><b>Course Title:</b> ${courseTitle}</div>
              <div class="cover-assignment"><b>${typeSelect.charAt(0).toUpperCase() + typeSelect.slice(1)} No:</b> ${typeNo}</div>
              <div class="cover-assignment"><b>${typeSelect.charAt(0).toUpperCase() + typeSelect.slice(1)} Title:</b> ${typeTitle}</div>
              
              <div class="cover-submitted">
                <div class="submitted-left">
                  <u><b>Submitted by:</b></u><br />
                  ${formatName(studentName)}<br />
                  Roll: ${studentRoll}<br />
                  Section: ${section}
                </div>
                <div class="submitted-right">
                  <u><b>Submitted to:</b></u><br />
                  ${teacherName}<br />
                  ${teacherDesignation}<br />
                  Dept. of ${teacherDept}, RUET
                </div>
              </div>
              ${expDateHTML}
              <div class="cover-date"><b>Date of Submission:</b> ${subDateFormatted}</div>
            </div>
          </body>
        </html>
    `;
};