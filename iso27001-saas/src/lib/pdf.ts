import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export type CertificatePdfData = {
  certificateNumber: string;
  holderName: string;
  organizationName?: string | null;
  type: string;
  scopeDescription: string;
  issueDate: Date;
  expiryDate: Date;
  verifyUrl: string;
};

const NAVY = '#1e1b4b';
const BRAND = '#4338ca';
const GOLD = '#b17313';
const INK = '#282e3c';
const MUTED = '#717c92';

export async function buildCertificatePdf(data: CertificatePdfData): Promise<Buffer> {
  const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, { margin: 0, width: 200, color: { dark: '#1e1b4b' } });
  const qrImage = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { width: W, height: H } = doc.page;
    const margin = 42;

    // Outer + inner frame
    doc.lineWidth(1.4).strokeColor(NAVY).rect(margin, margin, W - margin * 2, H - margin * 2).stroke();
    doc
      .lineWidth(0.6)
      .strokeColor(GOLD)
      .rect(margin + 8, margin + 8, W - (margin + 8) * 2, H - (margin + 8) * 2)
      .stroke();

    const contentX = margin + 36;
    const contentW = W - contentX * 2;
    let y = margin + 40;

    // Shield mark
    const shieldCx = W / 2;
    doc
      .save()
      .translate(shieldCx - 12, y)
      .lineWidth(1.6)
      .strokeColor(BRAND)
      .path('M12 0 2 4v11c0 10 6.5 17.5 10 20 3.5-2.5 10-10 10-20V4L12 0Z')
      .stroke()
      .path('M6.5 12 10.5 16 18 7')
      .stroke()
      .restore();
    y += 46;

    doc
      .fillColor(NAVY)
      .font('Times-Bold')
      .fontSize(30)
      .text('Certificat ISO/IEC 27001', contentX, y, { width: contentW, align: 'center' });
    y = doc.y + 6;

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(11)
      .text(
        data.type === 'PERSON'
          ? "Certification individuelle de compétences en sécurité de l'information"
          : "Certification du système de management de la sécurité de l'information (SMSI)",
        contentX,
        y,
        { width: contentW, align: 'center' },
      );
    y = doc.y + 22;

    doc
      .fillColor(INK)
      .font('Times-Italic')
      .fontSize(13)
      .text('Ceci certifie que', contentX, y, { width: contentW, align: 'center' });
    y = doc.y + 8;

    doc
      .font('Times-Bold')
      .fontSize(25)
      .fillColor(BRAND)
      .text(data.organizationName || data.holderName, contentX, y, { width: contentW, align: 'center' });
    y = doc.y + 4;

    if (data.organizationName) {
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor(MUTED)
        .text(`Représentée par ${data.holderName}`, contentX, y, { width: contentW, align: 'center' });
      y = doc.y + 14;
    } else {
      y += 10;
    }

    doc
      .font('Times-Roman')
      .fontSize(12)
      .fillColor(INK)
      .text(
        data.type === 'PERSON'
          ? "a démontré, au terme de son évaluation, une maîtrise des exigences et bonnes pratiques de la norme ISO/IEC 27001 relatives au management de la sécurité de l'information."
          : "a fait l'objet d'une évaluation de son système de management de la sécurité de l'information et satisfait aux exigences de la norme ISO/IEC 27001.",
        contentX + 30,
        y,
        { width: contentW - 60, align: 'center' },
      );
    y = doc.y + 10;

    doc
      .font('Helvetica-Oblique')
      .fontSize(10.5)
      .fillColor(MUTED)
      .text(`Périmètre : ${data.scopeDescription}`, contentX + 40, y, { width: contentW - 80, align: 'center' });

    // Footer band: divider + three-column meta + QR
    const footerY = H - margin - 92;
    doc
      .moveTo(contentX, footerY)
      .lineTo(contentX + contentW, footerY)
      .lineWidth(0.6)
      .strokeColor('#dde1e8')
      .stroke();

    const qrSize = 68;
    const qrX = contentX + contentW - qrSize;
    const qrY = footerY + 14;
    doc.image(qrImage, qrX, qrY, { width: qrSize, height: qrSize });
    doc.font('Helvetica').fontSize(7).fillColor(MUTED).text('Scanner pour vérifier', qrX - 10, qrY + qrSize + 4, {
      width: qrSize + 20,
      align: 'center',
    });

    const metaX = contentX;
    const metaY = footerY + 18;
    const metaW = 190;
    drawMeta(doc, metaX, metaY, metaW, 'N° de certificat', data.certificateNumber);
    drawMeta(doc, metaX + metaW, metaY, metaW, "Date d'émission", data.issueDate.toLocaleDateString('fr-FR'));
    drawMeta(doc, metaX + metaW * 2, metaY, metaW, "Valide jusqu'au", data.expiryDate.toLocaleDateString('fr-FR'));

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(MUTED)
      .text(`Vérifiable à tout moment sur ${data.verifyUrl}`, contentX, H - margin - 20, {
        width: contentW - qrSize - 20,
        align: 'left',
      });

    doc.end();
  });
}

function drawMeta(doc: PDFKit.PDFDocument, x: number, y: number, width: number, label: string, value: string) {
  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor('#b17313')
    .text(label.toUpperCase(), x, y, { width, characterSpacing: 0.6 });
  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor('#282e3c')
    .text(value, x, doc.y + 2, { width });
}
