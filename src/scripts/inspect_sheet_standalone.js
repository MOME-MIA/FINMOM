const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function inspect() {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
        console.error('Missing environment variables');
        return;
    }

    const jwt = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, jwt);
    await doc.loadInfo();
    console.log(`Loaded doc: ${doc.title}`);

    const sheet = doc.sheetsByTitle['INGRESOS MENSUALES'];
    if (!sheet) {
        console.error('Sheet INGRESOS MENSUALES not found');
        return;
    }

    await sheet.loadCells('A1:L100');
    console.log('Cells loaded');

    // Search for "ME DEBEN PLATA"
    console.log("\n--- SEARCHING FOR 'ME DEBEN PLATA' ---");
    let debtRow = -1;
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 12; j++) {
            const val = String(sheet.getCell(i, j).value || '').trim();
            if (val === 'ME DEBEN PLATA') {
                debtRow = i;
                console.log(`Found 'ME DEBEN PLATA' at Row ${i + 1}, Col ${j}`);

                // Inspect area below it
                for (let k = 1; k <= 6; k++) {
                    const r = i + k;
                    const rowVals = [];
                    for (let c = j - 2; c < j + 4; c++) { // Look around the header
                        if (c >= 0 && c < 12) {
                            rowVals.push(`[${c}]: ${sheet.getCell(r, c).formattedValue || ''}`);
                        }
                    }
                    console.log(`Debt Row ${r + 1}: ${rowVals.join(' | ')}`);
                }
                break;
            }
        }
        if (debtRow !== -1) break;
    }

    const sheetExpenses = doc.sheetsByTitle['GASTOS MENSUALES'];
    if (sheetExpenses) {
        await sheetExpenses.loadCells('A1:O20'); // Limit to O (15 columns)
        console.log("\n--- GASTOS MENSUALES (Headers) ---");
        const headers = [];
        for (let c = 0; c < 15; c++) {
            headers.push(sheetExpenses.getCell(0, c).formattedValue);
        }
        console.log(headers.join(' | '));

        console.log("\n--- GASTOS MENSUALES (First 3 rows) ---");
        for (let r = 1; r < 4; r++) {
            const vals = [];
            for (let c = 0; c < 15; c++) {
                vals.push(sheetExpenses.getCell(r, c).formattedValue);
            }
            console.log(`Row ${r + 1}:`, vals.join(' | '));
        }
    } else {
        console.log("GASTOS MENSUALES not found");
    }
}

inspect().catch(console.error);
