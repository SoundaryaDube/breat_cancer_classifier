import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, CheckCircle2, FileText, Activity } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<number[] | null>(null);
  const [prediction, setPrediction] = useState<{
    result: number;
    confidence: { benign: number; malignant: number };
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    const validTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
    const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(uploadedFile.type) && !['csv', 'txt'].includes(fileExtension || '')) {
      toast.error("Invalid file type. Please upload a .csv or .txt file.");
      return;
    }

    setFile(uploadedFile);
    setPrediction(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const values = text.trim().split(',').map(v => parseFloat(v.trim()));
        
        if (values.length !== 30) {
          toast.error(`Invalid file. Expected 30 values, found ${values.length}.`);
          setFile(null);
          setFileData(null);
          return;
        }
        
        if (values.some(isNaN)) {
          toast.error("Invalid file. All values must be numbers.");
          setFile(null);
          setFileData(null);
          return;
        }
        
        setFileData(values);
        toast.success("File validated successfully!");
      } catch (error) {
        toast.error("Error reading file. Please check the format.");
        setFile(null);
        setFileData(null);
      }
    };
    
    reader.readAsText(uploadedFile);
  };

  const handleAnalyze = async () => {
    if (!fileData) {
      toast.error("Please upload a valid file first.");
      return;
    }

    setIsAnalyzing(true);
    
    // TODO: Replace with actual backend API call to your Python model
    // This is mock data for demonstration
    setTimeout(() => {
      const mockBenignProb = Math.random() * 0.3 + 0.6; // 60-90% for demo
      const mockMalignantProb = 1 - mockBenignProb;
      
      setPrediction({
        result: mockBenignProb > 0.5 ? 1 : 0,
        confidence: {
          benign: mockBenignProb * 100,
          malignant: mockMalignantProb * 100
        }
      });
      
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-br from-card via-card to-secondary/20 shadow-soft">
        <div className="container mx-auto px-4 py-8 lg:py-10">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary p-3 shadow-medium">
              <Activity className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Breast Cancer Classification & Analysis
              </h1>
              <p className="mt-1.5 text-sm lg:text-base text-muted-foreground">
                Upload patient data for advanced machine learning tumor classification
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 lg:py-10 max-w-5xl">
        <div className="grid grid-cols-1 gap-6">
          {/* File Upload Section */}
          <Card className="p-8 shadow-soft border-border/50 hover:shadow-medium transition-shadow">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <h2 className="text-2xl font-semibold text-foreground">Patient Data Input</h2>
            </div>
            
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please upload a .csv or .txt file containing exactly one row with 30 comma-separated numeric values (no header).
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-3 text-primary" />
                    <p className="mb-2 text-sm font-semibold text-foreground">
                      {file ? file.name : "Click to upload patient data"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV or TXT (30 comma-separated values)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {file && fileData && (
                <Alert className="bg-success/10 border-success/30">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    File validated successfully! Ready for analysis.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          {/* Analysis Button */}
          <Button 
            onClick={handleAnalyze}
            disabled={!fileData || isAnalyzing}
            size="lg"
            className="w-full h-16 text-lg font-semibold shadow-soft hover:shadow-medium transition-all"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5 animate-spin" />
                Analyzing Tumor...
              </span>
            ) : (
              "Analyze Tumor"
            )}
          </Button>

          {/* Results Section */}
          {prediction && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className={`p-8 border-2 shadow-medium ${
                prediction.result === 1 
                  ? 'bg-success/10 border-success' 
                  : 'bg-destructive/10 border-destructive'
              }`}>
                <div className="flex items-start gap-4">
                  {prediction.result === 1 ? (
                    <div className="rounded-full bg-success/10 p-2.5 ring-4 ring-success/20">
                      <CheckCircle2 className="w-10 h-10 text-success flex-shrink-0" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="rounded-full bg-destructive/10 p-2.5 ring-4 ring-destructive/20">
                      <AlertCircle className="w-10 h-10 text-destructive flex-shrink-0" strokeWidth={2.5} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-foreground">
                      Analysis Result: {prediction.result === 1 ? 'Benign' : 'Malignant'}
                    </h3>
                    <p className="text-base lg:text-lg text-foreground">
                      {prediction.result === 1 
                        ? 'The tumor appears to be non-cancerous based on the provided features.' 
                        : 'The tumor shows characteristics consistent with cancer based on the provided features.'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-muted/30 shadow-soft border-border/50">
                <h4 className="font-semibold mb-6 text-xl flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Model Confidence
                </h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-foreground">Benign (Not Cancerous)</span>
                      <span className="font-bold text-lg text-foreground">{prediction.confidence.benign.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-background rounded-full overflow-hidden border border-border">
                      <div 
                        className="h-full bg-success transition-all duration-700 ease-out"
                        style={{ width: `${prediction.confidence.benign}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-foreground">Malignant (Cancerous)</span>
                      <span className="font-bold text-lg text-foreground">{prediction.confidence.malignant.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-background rounded-full overflow-hidden border border-border">
                      <div 
                        className="h-full bg-destructive transition-all duration-700 ease-out"
                        style={{ width: `${prediction.confidence.malignant}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {fileData && (
                <Card className="p-6 bg-muted/20 shadow-soft border-border/50">
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-lg mb-4 hover:text-primary transition-colors text-foreground">
                      Show Input Data (30 Features)
                    </summary>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
                      {fileData.map((value, idx) => (
                        <div key={idx} className="p-2 bg-background rounded border border-border">
                          <div className="text-xs text-muted-foreground mb-1">Feature {idx + 1}</div>
                          <div className="font-mono font-semibold text-foreground">{value.toFixed(4)}</div>
                        </div>
                      ))}
                    </div>
                  </details>
                </Card>
              )}

              <Alert className="border-primary/30 bg-primary/5">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertDescription className="text-base text-foreground">
                  <strong>Important Disclaimer:</strong> This tool is for informational and educational purposes only. 
                  It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. 
                  Always consult with qualified healthcare professionals for proper medical evaluation and care.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!prediction && (
            <Card className="p-6 lg:p-8 shadow-soft border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <h3 className="text-lg font-semibold text-foreground">Next Steps</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Backend Integration:</strong> To use your actual ensemble_model.pkl and scaler.pkl files, 
                  you'll need to set up a Python backend API (Flask or FastAPI) that loads these models and exposes 
                  a prediction endpoint.
                </p>
                <p className="leading-relaxed">
                  I can help you create this backend or integrate it with Lovable Cloud edge functions if needed.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
