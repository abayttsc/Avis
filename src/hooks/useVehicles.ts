import { useState, useCallback, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import type { Vehicle } from '../types';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Firestore with Real-time Sync
  useEffect(() => {
    const q = query(collection(db, 'vehicles'), orderBy('lastUpdated', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicleData: Vehicle[] = [];
      snapshot.forEach((doc) => {
        vehicleData.push({ id: doc.id, ...doc.data() } as Vehicle);
      });

      // Save to LocalStorage for offline-first fallback
      localStorage.setItem('avis_vehicles_cache', JSON.stringify(vehicleData));
      setVehicles(vehicleData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      // Fallback to cache if offline
      const cache = localStorage.getItem('avis_vehicles_cache');
      if (cache) {
        setVehicles(JSON.parse(cache));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      await addDoc(collection(db, 'vehicles'), {
        ...vehicle,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      // If offline, we could queue this, but for now let's just log
    }
  }, []);

  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    try {
      const vehicleRef = doc(db, 'vehicles', id);
      await updateDoc(vehicleRef, {
        ...updates,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  }, []);

  return { vehicles, loading, addVehicle, updateVehicle };
}
