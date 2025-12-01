import { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

interface CellData {
  value: string | number;
  row: number;
  col: number;
}

function App() {
  const [data, setData] = useState<CellData[][]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      setFileName(file.name);

      const arrayBuffer = await file.arrayBuffer();
     
      // קרא את הקובץ עם אופציות ספציפיות לדפדפן
      const workbook = XLSX.read(arrayBuffer, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false
      });
     
      // קח את הגיליון הראשון
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
     
      // המר לJSON
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false
      });

      // קח 10 שורות ראשונות ו-10 עמודות
      const limited = jsonData.slice(0, 10).map((row, rowIndex) =>
        row.slice(0, 10).map((cell, colIndex) => ({
          value: cell ?? '',
          row: rowIndex,
          col: colIndex
        }))
      );

      setData(limited);
    } catch (err) {
      setError(`שגיאה בקריאת הקובץ: ${err instanceof Error ? err.message : 'שגיאה לא ידועה'}`);
      console.error('Error reading file:', err);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>📊 Excel Viewer</h1>
        <p>בחר קובץ Excel וראה את 10 השורות הראשונות × 10 העמודות</p>
      </div>

      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-button">
          📁 בחר קובץ Excel
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {fileName && <span className="file-name">הקובץ: {fileName}</span>}
      </div>

      {error && <div className="error">{error}</div>}

      {data.length > 0 && (
        <div className="table-container">
          <table className="excel-table">
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      {cell.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;