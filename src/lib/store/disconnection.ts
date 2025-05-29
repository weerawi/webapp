import { create } from "zustand"
import type { DisconnectionRecord, DisconnectionFilters } from "@/types/disconnection"
import { mockDisconnectionRecords } from "@/lib/mock/disconnection-data"

interface DisconnectionState {
  // Data
  records: DisconnectionRecord[]
  filteredRecords: DisconnectionRecord[]
  isLoading: boolean
  error: string | null

  // Filters
  filters: DisconnectionFilters

  // Actions
  setRecords: (records: DisconnectionRecord[]) => void
  setFilters: (filters: Partial<DisconnectionFilters>) => void
  applyFilters: () => void
  resetFilters: () => void

  // Photo handling
  uploadPhoto: (recordId: string, photoUrl: string) => void

  // Firebase integration (to be implemented)
  fetchRecords: () => Promise<void>
}

const defaultFilters: DisconnectionFilters = {
  dateFrom: null,
  dateTo: null,
  area: "all",
  supervisor: "all",
  teamNo: "all",
  helper: "all",
  paymentStatus: "all",
  disconnectionStatus: "all",
}

export const useDisconnectionStore = create<DisconnectionState>((set, get) => ({
  // Initial state
  records: [],
  filteredRecords: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,

  // Set all records
  setRecords: (records) => {
    set({ records, filteredRecords: records })
  },

  // Update filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  // Apply current filters to records
  applyFilters: () => {
    const { records, filters } = get()

    let filtered = [...records]

    // Date range filtering
    if (filters.dateFrom) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date)
        return recordDate >= filters.dateFrom!
      })
    }

    if (filters.dateTo) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date)
        return recordDate <= filters.dateTo!
      })
    }

    // Area filtering
    if (filters.area && filters.area !== "all") {
      filtered = filtered.filter((record) => record.area === filters.area)
    }

    // Supervisor filtering
    if (filters.supervisor && filters.supervisor !== "all") {
      filtered = filtered.filter((record) => record.supervisor === filters.supervisor)
    }

    // Team number filtering
    if (filters.teamNo && filters.teamNo !== "all") {
      filtered = filtered.filter((record) => record.teamNo === filters.teamNo)
    }

    // Helper filtering
    if (filters.helper && filters.helper !== "all") {
      filtered = filtered.filter((record) => record.helper === filters.helper)
    }

    // Payment status filtering
    if (filters.paymentStatus && filters.paymentStatus !== "all") {
      switch (filters.paymentStatus) {
        case "100":
          filtered = filtered.filter((record) => record.payment100)
          break
        case "80":
          filtered = filtered.filter((record) => record.payment80)
          break
        case "50":
          filtered = filtered.filter((record) => record.payment50)
          break
        case "paid":
          filtered = filtered.filter((record) => record.alreadyPaid)
          break
      }
    }

    // Disconnection status filtering
    if (filters.disconnectionStatus && filters.disconnectionStatus !== "all") {
      switch (filters.disconnectionStatus) {
        case "dc":
          filtered = filtered.filter((record) => record.dc)
          break
        case "rc":
          filtered = filtered.filter((record) => record.rc)
          break
        case "gateClosed":
          filtered = filtered.filter((record) => record.gateClosed)
          break
        case "meterRemoved":
          filtered = filtered.filter((record) => record.meterRemoved)
          break
        case "alreadyDisconnected":
          filtered = filtered.filter((record) => record.alreadyDisconnected)
          break
        case "wrongMeter":
          filtered = filtered.filter((record) => record.wrongMeter)
          break
        case "billingError":
          filtered = filtered.filter((record) => record.billingError)
          break
        case "cantFind":
          filtered = filtered.filter((record) => record.cantFind)
          break
        case "objections":
          filtered = filtered.filter((record) => record.objections)
          break
        case "stoppedByNWSDB":
          filtered = filtered.filter((record) => record.stoppedByNWSDB)
          break
      }
    }

    set({ filteredRecords: filtered })
  },

  // Reset filters to default
  resetFilters: () => {
    set({ filters: defaultFilters })
    get().applyFilters()
  },

  // Upload photo for a record
  uploadPhoto: (recordId, photoUrl) => {
    set((state) => ({
      records: state.records.map((record) => (record.id === recordId ? { ...record, photo: photoUrl } : record)),
    }))
    get().applyFilters()
  },

  // Fetch records from Firebase (to be implemented)
  fetchRecords: async () => {
    set({ isLoading: true, error: null })

    try {
      /* 
      // Firebase implementation:
      const db = getFirestore()
      const disconnectionsRef = collection(db, 'disconnections')
      const snapshot = await getDocs(disconnectionsRef)
      
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DisconnectionRecord[]
      
      set({ records, filteredRecords: records, isLoading: false })
      */

      // Use mock data
      set({ records: mockDisconnectionRecords, filteredRecords: mockDisconnectionRecords, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
}))
