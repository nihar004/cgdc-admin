"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const BatchContext = createContext();

export function BatchProvider({ children }) {
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
        const res = await axios.get(`${backendUrl}/batches`, {
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

  const reloadBatches = async () => {
    try {
      const res = await axios.get(`${backendUrl}/batches`);
      const fetchedBatches = res.data;
      setBatches(fetchedBatches);

      // If no batch is selected and we have batches, select the first one
      if (!selectedBatch && fetchedBatches.length > 0) {
        setSelectedBatch(fetchedBatches[0].year);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
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
