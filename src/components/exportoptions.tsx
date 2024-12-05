import { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { FileSpreadsheet, FileText } from "lucide-react";

interface ExportOptionsProps {
  extractedTexts: Array<{
    fileName: string;
    text: string;
  }>;
}

const ExportOptions = ({ extractedTexts }: ExportOptionsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const parseExtractedText = (text: string) => {
    // This is a basic example of parsing the text
    // You might need to adjust this based on your actual text structure
    const lines = text.split('\n').filter(line => line.trim());
    return {
      patientName: lines.find(line => 
        line.toLowerCase().includes('name') || 
        line.toLowerCase().includes('patient'))?.replace(/name:|patient:/i, '').trim() || '',
      date: lines.find(line => 
        line.toLowerCase().includes('date'))?.replace(/date:/i, '').trim() || '',
      diagnosis: lines.find(line => 
        line.toLowerCase().includes('diagnosis') || 
        line.toLowerCase().includes('condition'))?.replace(/diagnosis:|condition:/i, '').trim() || '',
      notes: lines.filter(line => 
        !line.toLowerCase().includes('name:') && 
        !line.toLowerCase().includes('date:') && 
        !line.toLowerCase().includes('diagnosis:')
      ).join(' ').trim()
    };
  };

  const exportToExcel = () => {
    try {
      setIsExporting(true);
      
      // Convert the extracted texts to structured rows for Excel
      const rows = extractedTexts.map(({ fileName, text }) => {
        const parsedData = parseExtractedText(text);
        return [
          fileName,
          parsedData.patientName,
          parsedData.date,
          parsedData.diagnosis,
          parsedData.notes
        ];
      });
      
      // Add headers
      rows.unshift([
        'File Name',
        'Patient Name',
        'Date',
        'Diagnosis',
        'Additional Notes'
      ]);
      
      const ws = XLSX.utils.aoa_to_sheet(rows);
      
      // Set column widths
      const colWidths = [
        { wch: 20 }, // File Name
        { wch: 20 }, // Patient Name
        { wch: 15 }, // Date
        { wch: 30 }, // Diagnosis
        { wch: 50 }, // Additional Notes
      ];
      ws['!cols'] = colWidths;
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Extracted Text");
      XLSX.writeFile(wb, `extracted_texts.xlsx`);
      
      toast({
        title: "Export successful",
        description: "Your file has been exported to Excel",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = () => {
    try {
      setIsExporting(true);
      const content = extractedTexts
        .map(({ fileName, text }) => `File: ${fileName}\n\n${text}\n\n---\n\n`)
        .join('');
      
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `extracted_texts.docx`);
      
      toast({
        title: "Export successful",
        description: "Your file has been exported to Word",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Export Options</h2>
      <div className="flex gap-4">
        <Button
          onClick={exportToExcel}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </Button>
        <Button
          onClick={exportToWord}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export to Word
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
