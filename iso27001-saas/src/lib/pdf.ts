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

export async function buildCertificatePdf(data: CertificatePdfData): Promise<Buffer> {
  const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, { margin: 1, width: 160 });
  const qrImage = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 60 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .rect(0, 0, doc.page.width, 12)
      .fill('#1f47d6');

    doc
      .fillColor('#182c6f')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('Certificat ISO/IEC 27001', { align: 'center' })
      .moveDown(0.3);

    doc
      .fillColor('#444')
      .fontSize(12)
      .font('Helvetica')
      .text(
        data.type === 'PERSON'
          ? 'Certification individuelle de compétences en sécurité de l\'information'
          : 'Certification du système de management de la sécurité de l\'information (SMSI)',
        { align: 'center' },
      )
      .moveDown(2);

    doc
      .fillColor('#111')
      .fontSize(14)
      .text('Ceci certifie que', { align: 'center' })
      .moveDown(0.4);

    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#1f47d6')
      .text(data.organizationName || data.holderName, { align: 'center' })
      .moveDown(0.3);

    if (data.organizationName) {
      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#444')
        .text(`Représentée par ${data.holderName}`, { align: 'center' })
        .moveDown(0.6);
    } else {
      doc.moveDown(0.6);
    }

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#111')
      .text(
        data.type === 'PERSON'
          ? 'a démontré, au terme de son évaluation, une maîtrise des exigences et bonnes pratiques de la norme ISO/IEC 27001 relatives au management de la sécurité de l\'information.'
          : 'a fait l\'objet d\'une évaluation de son système de management de la sécurité de l\'information et satisfait aux exigences de la norme ISO/IEC 27001.',
        { align: 'center' },
      )
      .moveDown(1.2);

    doc
      .fontSize(11)
      .fillColor('#333')
      .text(`Périmètre : ${data.scopeDescription}`, { align: 'center' })
      .moveDown(1.5);

    const infoTop = doc.y;
    doc
      .fontSize(11)
      .fillColor('#111')
      .text(`N° de certificat : ${data.certificateNumber}`, 60, infoTop)
      .text(`Date d'émission : ${data.issueDate.toLocaleDateString('fr-FR')}`)
      .text(`Valide jusqu'au : ${data.expiryDate.toLocaleDateString('fr-FR')}`);

    doc.image(qrImage, doc.page.width - 60 - 110, infoTop - 10, { width: 110, height: 110 });
    doc
      .fontSize(8)
      .fillColor('#666')
      .text('Scannez pour vérifier', doc.page.width - 60 - 110, infoTop + 102, { width: 110, align: 'center' });

    doc.moveDown(4);
    doc
      .fontSize(9)
      .fillColor('#888')
      .text(
        `Ce certificat peut être vérifié à tout moment sur ${data.verifyUrl}`,
        60,
        doc.page.height - 100,
        { align: 'center', width: doc.page.width - 120 },
      );

    doc.end();
  });
}
