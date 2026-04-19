const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function generateDocx(studentName, tableRows, outputFile) {
    const tmpDir = path.join(process.cwd(), 'tmp_docx_' + studentName);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    
    // Create folders
    fs.mkdirSync(path.join(tmpDir, '_rels'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'word'), { recursive: true });

    // [Content_Types].xml
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
    fs.writeFileSync(path.join(tmpDir, '[Content_Types].xml'), contentTypes);

    // _rels/.rels
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
    fs.writeFileSync(path.join(tmpDir, '_rels', '.rels'), rels);

    // word/document.xml
    let tableXml = '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tblBorders></w:tblPr>';
    
    // Headers
    const headers = ['TC ID', 'Module', 'Type', 'Description', 'Steps', 'Expected'];
    tableXml += '<w:tr>';
    headers.forEach(h => {
        tableXml += `<w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(h)}</w:t></w:r></w:p></w:tc>`;
    });
    tableXml += '</w:tr>';

    // Data rows
    tableRows.forEach(row => {
        tableXml += '<w:tr>';
        row.forEach(cell => {
            tableXml += `<w:tc><w:p><w:r><w:t>${escapeXml(cell)}</w:t></w:r></w:p></w:tc>`;
        });
        tableXml += '</w:tr>';
    });
    tableXml += '</w:tbl>';

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="32"/><w:b/></w:rPr><w:t>Manual Test Cases - ${studentName}</w:t></w:r></w:p>
    <w:p/>
    ${tableXml}
  </w:body>
</w:document>`;
    fs.writeFileSync(path.join(tmpDir, 'word', 'document.xml'), documentXml);

    // Zip it using PowerShell
    const outputAbs = path.resolve(outputFile);
    try {
        execSync(`powershell -Command "Compress-Archive -Path '${tmpDir}\\*' -DestinationPath '${outputAbs}' -Force"`);
        console.log('Generated ' + outputFile);
    } catch (e) {
        console.error('Failed to zip ' + studentName + ': ' + e.message);
    }

    // Cleanup
    // execSync(`rmdir /s /q "${tmpDir}"`);
}

// Extract data from Markdown (very simple parser for the table)
function parseMarkdownTable(content) {
    const lines = content.split('\n');
    const tableRows = [];
    let inTable = false;
    for (let line of lines) {
        if (line.includes('| TC-')) {
            inTable = true;
            const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
            if (cells.length >= 6) {
                tableRows.push(cells.slice(0, 6));
            }
        }
    }
    return tableRows;
}

const students = [
    { dir: 'Phisit650710706', name: 'Phisit' },
    { dir: 'Chonpasu650710234', name: 'Chonpasu' },
    { dir: 'Kittipong650710153', name: 'Kittipong' },
    { dir: 'Nutt660710170', name: 'Nutt' },
    { dir: 'Purin_650710872', name: 'Purin' }
];

students.forEach(s => {
    const mdPath = path.join(process.cwd(), s.dir, 'README.md');
    if (fs.existsSync(mdPath)) {
        const content = fs.readFileSync(mdPath, 'utf8');
        const rows = parseMarkdownTable(content);
        const outPath = path.join(process.cwd(), s.dir, 'Manual_Test_Cases.docx');
        generateDocx(s.name, rows, outPath);
    }
});
