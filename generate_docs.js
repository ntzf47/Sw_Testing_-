const fs = require('fs');
const path = require('path');

function generateHtmlDoc(studentName, tableRows, outputFile) {
    let rowsHtml = '';
    tableRows.forEach(row => {
        rowsHtml += '<tr>';
        row.forEach(cell => {
            rowsHtml += `<td>${cell.replace(/\n/g, '<br>').replace(/<br>/g, '<br/>')}</td>`;
        });
        rowsHtml += '</tr>';
    });

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        h1 { font-family: sans-serif; text-align: center; }
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 11pt; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Manual Test Cases - ${studentName}</h1>
    <table>
        <thead>
            <tr>
                <th>TC ID</th>
                <th>โมดูล</th>
                <th>ประเภท</th>
                <th>คำอธิบาย</th>
                <th>ขั้นตอนการทดสอบ</th>
                <th>ผลลัพธ์ที่คาดหวัง</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>
</body>
</html>`;

    fs.writeFileSync(outputFile, html);
    console.log('Generated ' + outputFile);
}

function parseMarkdownTable(content) {
    const lines = content.split('\n');
    const tableRows = [];
    let inTable = false;
    for (let line of lines) {
        if (line.trim().startsWith('| TC-')) {
            const cells = line.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
            if (cells.length >= 6) {
                // Remove <br> tags from Markdown and replace with newlines for the cell processing
                const cleanedCells = cells.slice(0, 6).map(c => c.replace(/<br\s*\/?>/gi, '\n'));
                tableRows.push(cleanedCells);
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
        const outPath = path.join(process.cwd(), s.dir, 'Manual_Test_Cases.doc');
        generateHtmlDoc(s.name, rows, outPath);
    }
});
