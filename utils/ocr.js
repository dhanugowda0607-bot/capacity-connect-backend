const Tesseract = require('tesseract.js');

async function extractText(filePath) {
  const { data } = await Tesseract.recognize(filePath, 'eng');
  return data.text;
}

function extractNameAndDob(text) {
  const dobMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
  const nameMatch = text.match(/(?:Name|NAME)[:\s]*([A-Za-z\s]{3,40})/);
  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    dob: dobMatch ? dobMatch[1] : null,
  };
}

module.exports = { extractText, extractNameAndDob };
