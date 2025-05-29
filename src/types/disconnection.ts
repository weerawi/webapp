export interface DisconnectionRecord {
  id: string
  date: string
  time: string
  accountNo: string
  area: string
  supervisor: string
  teamNo: string
  helper: string
  dc: boolean
  rc: boolean
  payment100: boolean
  payment80: boolean
  payment50: boolean
  alreadyPaid: boolean
  unSolvedCusComp: boolean
  gateClosed: boolean
  meterRemoved: boolean
  alreadyDisconnected: boolean
  wrongMeter: boolean
  billingError: boolean
  cantFind: boolean
  objections: boolean
  stoppedByNWSDB: boolean
  photo?: string
}

export interface DisconnectionFilters {
  dateFrom: Date | null
  dateTo: Date | null
  area: string
  supervisor: string
  teamNo: string
  helper: string
  paymentStatus: string
  disconnectionStatus: string
}
