import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ExcelService } from '../services/excel.service';
import { log } from 'console';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface StockItem {
  item_id: string;
  date: Date | string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  units: number;
  name: string;
  [key: string]: any; // Add this line for index signature
}

@Component({
  selector: 'app-stocks-inventory',
  templateUrl: './stocks-inventory.component.html',
  styleUrls: ['./stocks-inventory.component.scss']
})
export class StocksInventoryComponent {
  constructor(private excelService: ExcelService, private http: HttpClient) {};
  rowData: StockItem[] = [];
  originalData: StockItem[] = [];
  isDataLoaded = false;
  fileName = '';
  file: File | undefined;
  
  columnDefs: ColDef<StockItem>[] = [
    { 
      field: 'item_id', 
      headerName: 'Item ID',
      editable: true,
      width: 120
    },
    { 
      field: 'date', 
      headerName: 'Date',
      editable: true,
      width: 130,
      cellEditor: 'agDateCellEditor',
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        }
        return '';
      }
    },
    { 
      field: 'category', 
      headerName: 'Category',
      editable: true,
      width: 120
    },
    { 
      field: 'amount', 
      headerName: 'Amount',
      editable: true,
      width: 100,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: (params) => {
        if (params.value !== null && params.value !== undefined) {
          return parseFloat(params.value).toFixed(2);
        }
        return '0.00';
      }
    },
    { 
      field: 'type', 
      headerName: 'Type',
      editable: true,
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['income', 'expense']
      },
      cellStyle: (params) => {
        if (params.value === 'income') {
          return { color: 'green', fontWeight: 'bold' };
        } else if (params.value === 'expense') {
          return { color: 'red', fontWeight: 'bold' };
        }
        return null;
      }
    },
    { 
      field: 'description', 
      headerName: 'Description',
      editable: true,
      width: 200,
      cellEditor: 'agLargeTextCellEditor'
    },
    { 
      field: 'units', 
      headerName: 'Units',
      editable: true,
      width: 80,
      cellEditor: 'agNumberCellEditor'
    },
    { 
      field: 'name', 
      headerName: 'Name',
      editable: true,
      width: 150
    }
  ];

  defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true
  };

  fieldNames: string[] = this.columnDefs.map(c => c.field as string);

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      console.error('Please select exactly one file');
      return;
    }

    this.file = target.files[0];
    this.fileName = this.file.name;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(this.file.type)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const binaryStr = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Validate and transform data
        const transformedData = this.validateAndTransformData(data);
        
        if (transformedData.length > 0) {
          this.rowData = transformedData;
          this.originalData = JSON.parse(JSON.stringify(transformedData));
          this.isDataLoaded = true;
          console.log('Data loaded successfully:', transformedData);
        } else {
          alert('No valid data found in the Excel file. Please check the column names and data format.');
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Error reading Excel file. Please make sure it\'s a valid Excel file.');
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file');
    };
    
    reader.readAsBinaryString(this.file);
  }

  private validateAndTransformData(data: any[]): StockItem[] {
    const requiredColumns = ['item_id', 'date', 'category', 'amount', 'type', 'units', 'name'];
    
    if (data.length === 0) {
      return [];
    }

    // Check if required columns exist
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      alert(`Missing required columns: ${missingColumns.join(', ')}`);
      return [];
    }

    return data.map((row, index) => {
      try {
        return {
          item_id: String(row.item_id || ''),
          date: row.date ? new Date(row.date) : new Date(),
          category: String(row.category || ''),
          amount: parseFloat(row.amount) || 0,
          type: (row.type === 'income' || row.type === 'expense') ? row.type : 'expense',
          description: row.description ? String(row.description) : undefined,
          units: parseInt(row.units) || 0,
          name: String(row.name || '')
        } as StockItem;
      } catch (error) {
        console.warn(`Error processing row ${index + 1}:`, error);
        return null;
      }
    }).filter(item => item !== null) as StockItem[];
  }

  onSaveRowData(): void {
    if (!this.isDataLoaded || !this.rowData.length) {
      alert('No data to save. Please upload and edit your Excel data first.');
      return;
    }
    this.http.post('https://bizwise-351605267307.europe-west1.run.app/api/add', this.rowData, {
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json' }
    }).subscribe({
      next: (res) => {
        alert('Data saved successfully!');
        console.log('Save response:', res);
      },
      error: (err) => {
        alert('Failed to save data!');
        console.error('Save error:', err);
      }
    });
  }

  onSave(): void {
    if (!this.isDataLoaded) {
      alert('No data to save. Please upload an Excel file first.');
      return;
    }

    // Validate data before saving
    const invalidRows = this.validateRowData();
    if (invalidRows.length > 0) {
      alert(`Please fix the following rows before saving: ${invalidRows.join(', ')}`);
      return;
    }

    console.log('Saving data:', this.rowData);
    
    if (this.file) {
      this.excelService.uploadExcel(this.file).subscribe({
        next: (res) => {
          console.log('File uploaded successfully', res);
          alert('File uploaded successfully!');
        },
        error: (err) => {
          console.error('Upload failed', err);
          alert('File upload failed!');
        }
      });
    } else {
      alert('No file selected.');
    }
    
    alert('Data ready to be saved! Check console for details.');
  }

  onReset(): void {
    if (!this.isDataLoaded) {
      alert('No original data to reset to. Please upload an Excel file first.');
      return;
    }
    
    if (confirm('Are you sure you want to reset all changes? This will restore the original uploaded data.')) {
      this.rowData = JSON.parse(JSON.stringify(this.originalData));
      console.log('Data reset to original state');
    }
  }

  onDelete(): void {
    if (!this.isDataLoaded) {
      alert('No data to delete.');
      return;
    }
    
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      this.rowData = [];
      this.originalData = [];
      this.isDataLoaded = false;
      this.fileName = '';
      console.log('All data deleted');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  private validateRowData(): number[] {
    const invalidRows: number[] = [];
    
    this.rowData.forEach((row, index) => {
      if (!row.item_id || !row.name || !row.category || row.amount < 0 || row.units < 0) {
        invalidRows.push(index + 1);
      }
      
      if (row.type !== 'income' && row.type !== 'expense') {
        invalidRows.push(index + 1);
      }
    });
    
    return [...new Set(invalidRows)]; // Remove duplicates
  }

  onCellValueChanged(event: any): void {
    console.log('Cell value changed:', {
      field: event.colDef.field,
      oldValue: event.oldValue,
      newValue: event.newValue,
      data: event.data
    });
  }

  getRowClass = (params: any): string => {
    return params.data.type === 'income' ? 'income-row' : 'expense-row';
  };

  exportToExcel(): void {
    if (!this.isDataLoaded) {
      alert('No data to export.');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stocks Inventory');
    
    const fileName = `stocks_inventory_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
