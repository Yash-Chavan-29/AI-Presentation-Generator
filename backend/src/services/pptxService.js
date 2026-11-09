const pptxgen = require('pptxgenjs');

/**
 * Generates a PowerPoint presentation from structured slide data.
 * @param {Array} slidesData - Array of slide objects containing title, bulletPoints, and codeSnippet
 * @param {string} filePath - Destination file path for saving the pptx file
 */
const createPPTX = async (slidesData, filePath) => {
  console.log(`[PPTX Service] Generating PowerPoint deck to: ${filePath}`);
  
  try {
    const pptx = new pptxgen();
    
    // Configure global layout properties
    pptx.layout = 'LAYOUT_16x9';
    pptx.defineLayout({ name: 'CUSTOM_LAYOUT', width: 13.33, height: 7.5 });
    
    slidesData.forEach((slideItem, index) => {
      const slide = pptx.addSlide();
      
      // Set background color
      slide.background = { fill: 'F8F9FA' };
      
      // Slide Title
      slide.addText(slideItem.title, {
        x: 0.8,
        y: 0.6,
        w: 11.7,
        h: 0.8,
        fontSize: 26,
        bold: true,
        fontFace: 'Arial',
        color: '1E293B', // Slate 800
      });
      
      // Left Column: Bullet Points
      const formattedBullets = slideItem.bulletPoints.map(bp => {
        return { text: bp, options: { bullet: true, color: '475569', fontSize: 15, breakLine: true } };
      });
      
      slide.addText(formattedBullets, {
        x: 0.8,
        y: 1.8,
        w: 5.5,
        h: 4.5,
        valign: 'top',
        fontFace: 'Arial'
      });
      
      // Right Column: Code Block (Styled like a VS Code Terminal)
      if (slideItem.codeSnippet) {
        // Draw Dark Background Box for Code
        slide.addText(slideItem.codeSnippet, {
          x: 6.8,
          y: 1.8,
          w: 5.7,
          h: 4.5,
          valign: 'top',
          fontSize: 11,
          fontFace: 'Courier New',
          color: 'F8F8F2', // Dracula Foreground
          fill: { color: '1E1E2E' }, // Dracula Background / Dark Slate 950
          inset: [0.3, 0.3, 0.3, 0.3],
          lineSpacing: 16
        });
      }
    });

    // Write file to output folder
    await pptx.writeFile({ fileName: filePath });
    console.log('[PPTX Service] PPTX successfully saved.');
    return filePath;

  } catch (error) {
    console.error('[PPTX Service] Error generating PPTX:', error);
    throw error;
  }
};

module.exports = {
  createPPTX
};
