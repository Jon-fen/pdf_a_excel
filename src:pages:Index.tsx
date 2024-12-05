import { useState } from "react";
import FileUpload from "../components/FileUpload";
import DocumentPreview from "../components/DocumentPreview";
import ExportOptions from "../components/ExportOptions";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"single" | "multiple">("single");
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setExtractedText("");
    setSelectedText("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF a Excel by Jonfen</h1>
          <p className="text-gray-600">Sube archivo Excel o imagen para extraer y exportar el texto</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="mb-6">
              <RadioGroup
                defaultValue="single"
                value={uploadMode}
                onValueChange={(value) => setUploadMode(value as "single" | "multiple")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Sólo un documento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">Por lotes de documentos</Label>
                </div>
              </RadioGroup>
            </div>
            <FileUpload onFileSelect={handleFileSelect} multiple={uploadMode === "multiple"} />
          </Card>

          {file && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Previzualización del documento</h2>
              {isProcessing ? (
                <div className="space-y-3">
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              ) : (
                <DocumentPreview 
                  file={file}
                  extractedText={extractedText}
                  onTextSelect={setSelectedText}
                  setExtractedText={setExtractedText}
                  setIsProcessing={setIsProcessing}
                />
              )}
            </Card>
          )}

          {extractedText && (
            <Card className="p-6">
              <ExportOptions 
                extractedText={selectedText || extractedText}
                fileName={file?.name || "document"}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;