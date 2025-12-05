import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { BreadRow } from "../types";

// Exported Place interface
export interface Place {
  id: string;
  name: string;
}

export const useFirebaseData = () => {
  const [marbyRows, setMarbyRows] = useState<BreadRow[]>([]);
  const [gardeniaRows, setGardeniaRows] = useState<BreadRow[]>([]);
  const [valleyRows, setValleyRows] = useState<BreadRow[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  /** Fetch breads from Firestore */
  const fetchBreads = async () => {
    try {
      const marbyCol = collection(db, "marby");
      const gardeniaCol = collection(db, "gardenia");
      const valleyCol = collection(db, "valleybread");

      const [marbySnapshot, gardeniaSnapshot, valleySnapshot] = await Promise.all([
        getDocs(marbyCol),
        getDocs(gardeniaCol),
        getDocs(valleyCol),
      ]);

      const mapDocsToRows = (snapshot: typeof marbySnapshot, brand: string): BreadRow[] =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            brand,
            name: data.name || doc.id,
            delivery: Number(data.delivery) || 0,
            offtake: Number(data.offtake) || 0,
            offtakePercent: Number(data.offtakePercent) || 0,
          };
        });

      setMarbyRows(mapDocsToRows(marbySnapshot, "MARBY"));
      setGardeniaRows(mapDocsToRows(gardeniaSnapshot, "GARDENIA"));
      setValleyRows(mapDocsToRows(valleySnapshot, "VALLEY BREAD"));
    } catch (error) {
      console.error("Error fetching breads:", error);
    }
  };

  /** Fetch places from Firestore */
  const fetchPlaces = async () => {
    try {
      const colRef = collection(db, "places");
      const snapshot = await getDocs(colRef);
      const placeList: Place[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || doc.id,
      }));
      setPlaces(placeList);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  /** Load data on mount */
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchBreads(), fetchPlaces()]);
    };
    fetchData();
  }, []);

  return {
    marbyRows,
    setMarbyRows,
    gardeniaRows,
    setGardeniaRows,
    valleyRows,
    setValleyRows,
    places,
    setPlaces,
  };
};
