import React, { useState } from "react";
import { toast } from "@/component/ui/use-toast";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/component/ui/card";

// Import your actual UI component for the 30 inputs
import FeatureInputs from "@/component/FeatureInputs";

// Define the structure for your prediction state
interface Prediction {
  result: number; // 0 or 1
  confidence: {
    benign: number;
    malignant: number;
  };
}

// Define the type for the feature data
type FeatureData = number[];

const Index = () => {
  // State to hold the 30 features. It will be set by the FeatureInputs component.
  const [fileData, setFileData] = useState<FeatureData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  /**
   * This is your handleAnalyze function.
   * It now reads the 'fileData' state, which is populated by your FeatureInputs component.
   */
  const handleAnalyze = async () => {
    // Check if the fileData state has been set by the FeatureInputs component
    if (!fileData || fileData.length !== 30) {
      toast({
        title: "Error",
        description: "Please ensure all 30 feature inputs are filled correctly.",
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
        // Send the file data (from state) in the format the API expects
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

  /**
   * This is the JSX for your page.
   * It renders your FeatureInputs component and passes it the 'setFileData' function.
   */
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Breast Cancer Classifier</CardTitle>
          <CardDescription>
            Enter the 30 tumor features to predict benign or malignant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* This renders your component for the 30 inputs.
            We pass the 'setFileData' function to it so it can update this page's state.
            (Note: I am assuming the prop is named 'onDataChange'. If your
            FeatureInputs component uses a different prop name, like 'setFeatures',
            you will need to change 'onDataChange' to that name.)
          */}
          <FeatureInputs onDataChange={setFileData} />

          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full mt-4">
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>

          {/* This section displays the prediction result */}
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

// This is the export that fixes the build
export default Index;

//
// THIS IS THE MISSING LINE THAT FIXES THE BUILD
//
export default Index;
