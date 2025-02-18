import * as xlsx from 'xlsx';
import { parse as fastCsvParse } from 'fast-csv';

export class FileParser {
  static parseCSV(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = fastCsvParse({ headers: true })
        .on('error', (error) => reject(error))
        .on('data', (row) => {
          for (const key in row) {
            if (typeof row[key] === 'string' && row[key].includes(',')) {
              row[key] = row[key]
                .split(',')
                .map((item) => item.trim()) // Trim spaces
                .map((item) => (isNaN(Number(item)) ? item : Number(item))); // Convert numbers
            }
          }
          results.push(row);
        })
        .on('end', () => resolve(results));

      stream.write(buffer.toString());
      stream.end();
    });
  }

  static parseExcel(buffer: Buffer): any[] {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
}
