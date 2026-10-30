import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
export function exportCSV(rows, filename="lifeline-report.csv"){if(!rows?.length){window.alert("No data to export");return;}const csv=XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));const blob=new Blob(["\uFEFF",csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
export function exportExcel(rows, filename="lifeline-report.xlsx"){if(!rows?.length){window.alert("No data to export");return;}const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),"Report");XLSX.writeFile(wb,filename);}
export function exportPDF(rows, filename="lifeline-report.pdf"){if(!rows?.length){window.alert("No data to export");return;}const doc=new jsPDF({orientation:"landscape"});doc.text("LifeLine Management Report",14,15);autoTable(doc,{head:[Object.keys(rows[0])],body:rows.map(r=>Object.values(r).map(v=>String(v??""))),startY:22,styles:{fontSize:8}});doc.save(filename);}
