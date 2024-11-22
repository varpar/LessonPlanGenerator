import { jsPDF } from "jspdf";

const generatePDF = (plan, grade, subject, chapter) => {
  const { introduction, mainContent, classActivities } = plan;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10; // Margin on all sides
  const maxWidth = pageWidth - margin * 2; // Max width for text
  const lineHeight = 10; // Line height
  let yOffset = margin; // Starting position for text

  const addSection = (title, text) => {
    // Add section title
    doc.setFontSize(14);
    doc.text(title, margin, yOffset);
    yOffset += lineHeight;

    // Split text into lines
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, maxWidth);

    // Add text line by line
    lines.forEach((line) => {
      if (yOffset + lineHeight > pageHeight - margin) {
        doc.addPage(); // Add a new page
        yOffset = margin; // Reset yOffset to top of the new page
      }
      doc.text(line, margin, yOffset);
      yOffset += lineHeight;
    });
  };

  // Add sections to the PDF
  doc.setFontSize(16);
  doc.text(`Lesson Plan for Class ${grade}, Chapter ${chapter} (${subject})`, margin, yOffset);
  yOffset += lineHeight * 2; // Add some space after the title

  addSection("Introduction:", introduction);
  yOffset += lineHeight; // Add space between sections
  addSection("Main Body:", mainContent);
  yOffset += lineHeight; // Add space between sections
  addSection("Class Activities:", classActivities);

  // Save the PDF
  doc.save("lesson-plan.pdf");
};

export default generatePDF;
