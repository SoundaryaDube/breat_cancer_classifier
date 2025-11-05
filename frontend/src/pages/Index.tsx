import React, { useState } from "react";
import { toast } from "@/component/ui/use-toast"; // Make sure this import is correct
import { Button } from "@/component/ui/button";   // Example: Import your button
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card"; // Example: Import other components

// Define the structure for your prediction state
interface Prediction {
  result: number; // 0 or 1
  confidence: {
    benign: number;
    malignant: number;
  };
}

const Index = () => {
  // Define your states INSIDE the component
  const [fileData, setFileData] = useState<number[] | null>(null); // State to hold the 30 features
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  //
  // Your handleAnalyze function goes INSIDE the component
  //
  const handleAnalyze = async () => {
    if (!fileData) {
      toast({
        title: "Error",
        description: "Please upload a valid file first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null); // Clear any old predictions

    // Get the API URL from the environment variable
    const apiUrl = import.meta.env.VITE_API_URL;

    // Check if the variable is set
    if (!apiUrl) {
      toast({
        title: "API Error",
        description: "URL is not configured. (VITE_API_URL is missing)",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      return;
    }

    try {
      // Make the POST request to the Flask API
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the file data in the format the API expects
        body: JSON.stringify({
          "features": fileData
        }),
      });

      if (!response.ok) {
        // Handle server-side errors
        throw new Error("Analysis failed. The server returned an error.");
      }

      // Get the JSON response from the server
      const data = await response.json();

      // Update the state with the REAL prediction data
      setPrediction({
        result: data.prediction_class, // 0 for Malignant, 1 for Benign
        confidence: {
          benign: data.confidence_benign * 100,    // Convert decimal to percentage
          malignant: data.confidence_malignant * 100 // Convert decimal to percentage
        }
      });

      toast({
        title: "Success",
        description: "Analysis complete!"
      });

    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Analysis Error:", error);
      const message = (error instanceof Error) ? error.message : "An unknown error occurred.";
      toast({
        title: "Analysis Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      // This will run whether the request succeeded or failed
      setIsAnalyzing(false);
    }
  };

  //
  // This is your page's UI.
  // You must return JSX from your component.
  //
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Breast Cancer Classifier</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Upload a file or enter the 30 tumor features to predict
            benign or malignant.
          </p>
          
          {/* You need to add your UI for uploading or entering 'fileData' here.
            For now, I'll add a placeholder button to set example data.
          */}
          <Button 
            onClick={() => setFileData([17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871, 1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193, 25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189])}
            variant="outline"
            className="mr-2"
          >
            Load Example Data
          </Button>

          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>

          {prediction && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="text-lg font-semibold">Prediction Result</h3>
              <p className={`text-2xl font-bold ${prediction.result === 1 ? 'text-green-600' : 'text-red-600'}`}>
                {prediction.result === 1 ? "Benign" : "Malignant"}
              </p>
              <div className="mt-2">
                <p>Confidence (Benign): {prediction.confidence.benign.toFixed(1)}%</p>
                <p>Confidence (Malignant): {prediction.confidence.malignant.toFixed(1)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

//
// THIS IS THE MISSING LINE THAT FIXES THE BUILD
//
export default Index;
