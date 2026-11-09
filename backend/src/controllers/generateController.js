const path = require('path');
const llmService = require('../services/llmService');
const pptxService = require('../services/pptxService');
const pdfService = require('../services/pdfService');

/**
 * Handles presentation and explanation generation requests.
 */
const generate = async (req, res, next) => {
  try {
    const { prompt, code } = req.body;

    // Validation
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'A generation prompt is required.'
      });
    }

    console.log(`[Generate] Received presentation request. Prompt length: ${prompt.length}, Code length: ${code ? code.length : 0}`);

    // 1. Generate structured content via LLM
    const aiContent = await llmService.generateAIContent(prompt, code);

    // 2. Generate PowerPoint file using pptxService
    const pptxFileName = `presentation_${Date.now()}.pptx`;
    const pptxFilePath = path.join(__dirname, '../../temp', pptxFileName);
    await pptxService.createPPTX(aiContent.slides, pptxFilePath);

    // 3. Generate PDF file using pdfService
    const pdfFileName = `presentation_${Date.now()}.pdf`;
    const pdfFilePath = path.join(__dirname, '../../temp', pdfFileName);
    await pdfService.createPDF(aiContent.slides, pdfFilePath);

    // 4. Construct relative download links
    // Serving files via Express static '/downloads/'
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const pptxUrl = `${baseUrl}/downloads/${pptxFileName}`;
    const pdfUrl = `${baseUrl}/downloads/${pdfFileName}`;

    // 5. Send back output
    return res.status(200).json({
      success: true,
      explanation: aiContent.explanation,
      pptxUrl: pptxUrl,
      pdfUrl: pdfUrl,
      slides: aiContent.slides
    });

  } catch (error) {
    console.error('[Generate] Controller Error:', error);
    next(error);
  }
};

module.exports = {
  generate
};
