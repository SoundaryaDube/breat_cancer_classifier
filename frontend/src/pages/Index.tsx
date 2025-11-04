const handleAnalyze = async () => {
    if (!fileData) {
      toast.error("Please upload a valid file first.");
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null); // Clear any old predictions

    // Get the API URL from the environment variable
    const apiUrl = import.meta.env.VITE_API_URL;

    // Check if the variable is set
    if (!apiUrl) {
      toast.error("API Error: URL is not configured. (VITE_API_URL is missing)");
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

      toast.success("Analysis complete!");

    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Analysis Error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred during analysis.");
      }
    } finally {
      // This will run whether the request succeeded or failed
      setIsAnalyzing(false);
    }
  };
