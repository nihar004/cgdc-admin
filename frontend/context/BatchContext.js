"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const BatchContext = createContext();

export function BatchProvider({ children }) {
  const { user, loading } = useAuth();

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Fetch batches on mount (run only once)
  useEffect(() => {
    const controller = new AbortController();

    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${backendUrl}/batches`, {
          signal: controller.signal,
        });
        const fetchedBatches = res.data;
        setBatches(fetchedBatches);

        // Only set selected batch if it is null
        if (!selectedBatch && fetchedBatches.length > 0) {
          // Try to get saved year from localStorage
          let savedBatchYear = null;
          if (typeof window !== "undefined" && window.localStorage) {
            savedBatchYear = localStorage.getItem("selectedBatchYear");
          }

          // Use saved year if exists, otherwise first batch
          if (savedBatchYear) {
            const matchedBatch = fetchedBatches.find(
              (b) => String(b.year) === savedBatchYear
            );
            if (matchedBatch) {
              setSelectedBatch(String(matchedBatch.year));
            } else {
              setSelectedBatch(String(fetchedBatches[0].year));
            }
          } else {
            setSelectedBatch(String(fetchedBatches[0].year));
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
    return () => controller.abort();
  }, []); // run only once

  // Save selected batch to localStorage whenever it changes
  useEffect(() => {
    if (selectedBatch && typeof window !== "undefined") {
      localStorage.setItem("selectedBatchYear", selectedBatch);
    }
  }, [selectedBatch]);

  // Function to reload batches manually
  const reloadBatches = async () => {
    try {
      const res = await axios.get(`${backendUrl}/batches`);
      const fetchedBatches = res.data;
      setBatches(fetchedBatches);

      if (fetchedBatches.length > 0) {
        const isValid = fetchedBatches.some(
          (b) => String(b.year) === selectedBatch
        );
        if (!isValid) {
          setSelectedBatch(String(fetchedBatches[0].year));
        }
      }
    } catch (error) {
      console.error("Error reloading batches:", error);
    }
  };

  return (
    <BatchContext.Provider
      value={{ selectedBatch, setSelectedBatch, batches, reloadBatches }}
    >
      {children}
    </BatchContext.Provider>
  );
}

export const useBatchContext = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error("useBatchContext must be used within a BatchProvider");
  }
  return context;
};
