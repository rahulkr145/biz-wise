import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private http: HttpClient) {}

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name); // field name 'file', with filename and type auto-detected
    return this.http.post('https://bizwise-351605267307.europe-west1.run.app/api/uploadExcel', formData, {
      headers: {
        // 'Content-Type' should NOT be set manually for FormData; Angular will set it with the correct boundary
        'accept': 'application/json'
      }
    });
  }
}