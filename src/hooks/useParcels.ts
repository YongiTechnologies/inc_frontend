"use client";

import { useEffect, useState } from "react";
import {
  getReconciliation, listParcels, listContainers,
  type Parcel, type Reconciliation, type ContainerSummary,
} from "@/services/parcels";

export interface ParcelData {
  reconciliation: Reconciliation;
  parcels: Parcel[];
  containers: ContainerSummary[];
  loading: boolean;
  /** true when the live API couldn't be reached. */
  loadError: boolean;
  reload: () => void;
}

const EMPTY_RECONCILIATION: Reconciliation = {
  total: 0, received: 0, receivedNotLoaded: 0, loaded: 0,
  arrived: 0, loadedNeverReceived: 0, needsPhone: 0, qtyMismatch: 0,
};

/**
 * Loads the parcel model from the live API. If the API can't be reached the
 * page keeps what it had (empty on first load) and flags loadError, so staff
 * never mistake sample data for real parcels.
 */
export function useParcels(): ParcelData {
  const [state, setState] = useState<Omit<ParcelData, "reload">>({
    reconciliation: EMPTY_RECONCILIATION,
    parcels: [],
    containers: [],
    loading: true,
    loadError: false,
  });

  const load = () => {
    setState((s) => ({ ...s, loading: true }));
    Promise.all([getReconciliation(), listParcels({ limit: 1000 }), listContainers()])
      .then(([reconciliation, parcelPage, containers]) => {
        setState({ reconciliation, parcels: parcelPage.parcels, containers, loading: false, loadError: false });
      })
      .catch(() => {
        setState((s) => ({ ...s, loading: false, loadError: true }));
      });
  };

  useEffect(load, []);
  return { ...state, reload: load };
}
