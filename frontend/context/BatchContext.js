import { createContext, useState, useEffect } from "react";
import axios from "axios";

const BatchContext = createContext();

function BatchProvider({ children }) {
  const [selectedBatch, setSelectedBatch] = useState(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined" && window.localStorage) {
      const savedBatch = localStorage.getItem("selectedBatch");
      return savedBatch ? JSON.parse(savedBatch) : null;
    }
    return null;
  });

  const [batches, setBatches] = useState([]); // store all available batches

  // Fetch batches only once when the app loads
  useEffect(() => {
    const controller = new AbortController();
    async function fetchBatches() {
      try {
        const res = await axios.get("http://localhost:5000/students/batches", {
          signal: controller.signal,
        });
        const fetchedBatches = res.data;
        setBatches(fetchedBatches);

        // Check if localStorage is available before using it
        if (typeof window !== "undefined" && window.localStorage) {
          if (
            !localStorage.getItem("selectedBatch") &&
            fetchedBatches.length > 0
          ) {
            setSelectedBatch(fetchedBatches[0]);
          }
        } else if (fetchedBatches.length > 0) {
          // Fallback for SSR - just set the first batch
          setSelectedBatch(fetchedBatches[0]);
        }
      } catch (error) {
        if (axios.isCancel(error)) return; // request was cancelled
        console.error("Error fetching batches:", error);
      }
    }
    fetchBatches();
    return () => controller.abort();
  }, []);

  // Whenever selectedBatch changes → save to localStorage (client-side only)
  useEffect(() => {
    if (selectedBatch && typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("selectedBatch", JSON.stringify(selectedBatch));
    }
  }, [selectedBatch]);

  return (
    <BatchContext.Provider value={{ selectedBatch, setSelectedBatch, batches }}>
      {children}
    </BatchContext.Provider>
  );
}

export { BatchContext, BatchProvider };
