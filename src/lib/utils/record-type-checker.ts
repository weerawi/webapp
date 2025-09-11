export function checkRecordType(record: any, fieldName: string): boolean {
  if (!record.type) return false;
  
  const typeMapping: Record<string, string[]> = {
    // Disconnection Status - exact from mobile app
    "dc": ["disconnected"],
    "alreadyDisconnected": ["already disconnected"],
    
    // Reconnection 
    "rc": ["reconnected", "rc"],
    
    // Payment Status - exact from mobile app
    "payment100": ["payment 100%"],
    "payment80": ["payment 80%"],
    "payment50": ["payment 50%"],
    "alreadyPaid": ["already paid"],
    
    // Access Issues - exact from mobile app
    "gateClosed": ["temporarily gate closed", "permanently gate closed"],
    "cantFind": ["can't find"],
    
    // Other Issues - exact from mobile app
    "objections": ["objection"],
    "stoppedByBoard": ["stopped by board"],
    
    // Additional fields - keeping minimal for now
    "unSolvedCusComp": ["complaint"],
    "meterRemoved": ["meter removed"],
    "wrongMeter": ["wrong meter"],
    "billingError": ["billing error"],
  };
  
  const patterns = typeMapping[fieldName] || [fieldName.toLowerCase()];
  const recordTypeLower = record.type.toLowerCase().trim();
  
  return patterns.some(pattern => recordTypeLower === pattern);
}

// Special function for DC time check (before noon)
export function checkDCBeforeNoon(record: any): boolean {
  if (!checkRecordType(record, 'dc')) return false;
  
  const recordTime = record.time.split(":");
  const recordHour = parseInt(recordTime[0]);
  return recordHour < 12;
}