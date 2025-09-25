const admin = require('firebase-admin');

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "web-app-2e147",
    clientEmail: "firebase-adminsdk-fbsvc@web-app-2e147.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC31xHK5y+OLDD9\nP9JXT89san9dEunm/8kbmur+6hVFiWf0FzjWcYSj+c08PRf/VDHKkGsTU87ZzK/S\nlThPMlVUFZSQzQo+dZLV2hFDNTDxeK3MdGNC5D9HgazlLRolG3ObkXIv+C3zocF8\nl5VYyT4ljAZkLecqW+Ak/+Uvhj0/QjI/A/JSi/MsvPMTO9YGDH64OsvOkFsLszRp\no3ZvRbKDIwpyn9vggRizo74N854wJGbYGgUlc6UgWv5wpkYIkw9Pq5a08zJEzSBy\noWEMly9IR2Qj09vJlqIUttOTqqW1TwPRgqxsKeQAtJyjs9Tiql72z4nqfWwVjbFP\nwhW+mjW9AgMBAAECggEAV3ia7CaEz4pCQvUvcUC1qlmfwRrDNRiGST60Slb5iQ0A\na7jy38HCgTzVxLAy71dRm5aMg/Uv6hyEmddLJA+IXwonlqAgnChYFa184jP4ViR7\n2ViVdBni6/SM3bxQgNBneOFC6gUVZCMWS2BafJTAH6BY2CipIVP2udQR6cNe9+4J\ny4aAuLotJRRJO4nPOS7loG+eofemcTJlMedZYAQpOpnMNrYTK+X6HFzVEt+5hPIW\nYwJQQZprNyRfkIJ3mL7czEPxAfGyXCim6yRbA38UwvB9euJUVWOX58pkK2SFlXNa\nMnBPBI+VZ2CgtkEV/gJpk+1netntf/c+8nxI6RoqhwKBgQDoNGwG3JUTR/GvnjRS\nWjRyjEJGLuKPe/j8TSozlPzCDgfyrl2xicY/XZVdrkA/YBwK2G6Saq3+kao0LDlZ\nqxnqkt2bpfblwVPZJxNnqU2GJDMD9hHnG6LO2YywjCOOewAySqa0LMAWweUbq/wc\n0AoygDcG1XSY2AX185X4owBcfwKBgQDKrd28x0MXN46P8c8JlZpP2Z3vaeUEx8n2\nVRd8K4c0OPglQVGtu09ph3Rf7LmaOJD5jQgOTgEFUmOtsbvUjRHJZipTXQV/3ujY\nEkTYPgTVESM+gvwEb7C/yppFEZhp2L1l88gm2v2yPm21bcZ4S28HjboQ5BF6vHeS\nXOOGKy+/wwKBgHRpk579B1/bObepwOFoh9LFrpQw/TSiGnmi1f12PCGtlx57fE19\nnP43lKKasWsUa/qj9wtAoGp37LSrVzU1KpEHgEKAOf+FpNvBU2Es58jQbSMXQnJy\n0HSTbI02NL1BvR95fYnmxYajPpFY79QiGHqo/O1YJlRaOOLNc+prDctRAoGAMwPw\nfEPrrzxctf63jkIJxW+RQWH2M23WeBqS/r42Gf789uOqG4C6TGW79SkwzpDObQIC\ntRcNSrmiPWYvUSDxCTCeFr2jVLxW/4wZqBR0Qu09Yc62gKdcZeopSplTM9FKWw8x\nohYdJXBxTOmEu2LBX7Vc0EOX4rztm/mli2/zZOECgYEAi7ZNEhsf+/W9svUSD8nn\ntcQuEQ9rbTA43cy/boQynKDALPHx41v/w3A6CCZM2BTmmOpbUSIyry/zPYqjARo3\nqp59eWLvuRQLM7H2k4wHGaUH9pLAnfl3SwTH1M1YmbULUuSVtY6MU7TC/0EoZeZw\nMupY4dGBAFGKlGHLxYiBdQg=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

async function fillAttendanceData() {
  console.log('🚀 Starting attendance data population...');
  
  // Check if attendance collection exists by trying to get any document
  try {
    const attendanceCollection = await db.collection('attendance').limit(1).get();
    if (!attendanceCollection.empty) {
      console.log('⚠️  Attendance collection already exists with data.');
      console.log('🔄 Clearing existing attendance data first...');
      
      // Optional: Clear existing data (comment out if you want to preserve existing data)
      const batch = db.batch();
      const existingDocs = await db.collection('attendance').get();
      existingDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('✅ Existing attendance data cleared.');
    }
  } catch (error) {
    console.log('📁 Attendance collection will be created.');
  }
  
  // Get all helpers and supervisors
  const [helpersSnapshot, supervisorsSnapshot] = await Promise.all([
    db.collection('helpers').get(),
    db.collection('supervisors').get()
  ]);
  
  console.log(`Found ${helpersSnapshot.size} helpers and ${supervisorsSnapshot.size} supervisors`);
  
  // Combine staff into one array
  const allStaff = [];
  
  helpersSnapshot.forEach(doc => {
    const data = doc.data();
    // Skip deleted or inactive staff
    if (data.status !== 'Deleted' && data.isActive !== false) {
      allStaff.push({
        uid: doc.id,
        type: 'Helper',
        area: data.area || 'Galle',
        teamNumber: data.teamNumber || 1,
        username: data.username || data.userName || 'Unknown',
        imageUrl: data.imageUrl || `https://i.pravatar.cc/150?u=${doc.id}`
      });
    }
  });
  
  supervisorsSnapshot.forEach(doc => {
    const data = doc.data();
    // Skip deleted or inactive staff
    if (data.status !== 'Deleted' && data.isActive !== false) {
      allStaff.push({
        uid: doc.id,
        type: 'Supervisor',
        area: data.area || 'Galle',
        teamNumber: data.teamNumber || 1,
        username: data.username || data.userName || 'Unknown',
        imageUrl: data.imageUrl || `https://i.pravatar.cc/150?u=${doc.id}`
      });
    }
  });
  
  console.log(`Processing ${allStaff.length} active staff members`);
  
  if (allStaff.length === 0) {
    console.log('⚠️  No active staff found. Please add staff first.');
    process.exit(0);
  }
  
  // Generate dates for last 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentHour = new Date().getHours();
  
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - dayOffset);
    const dateString = currentDate.toISOString().split('T')[0];
    const isToday = dayOffset === 0;
    
    console.log(`\n📅 Processing date: ${dateString}${isToday ? ' (TODAY)' : ''}`);
    
    const dateDoc = db.collection('attendance').doc(dateString);
    const attendanceData = {};
    
    // For each staff member, create attendance record
    for (const staff of allStaff) {
      // Random chance of attendance (90% chance they attended)
      if (Math.random() > 0.1) {
        const timeInHour = 7 + Math.floor(Math.random() * 2); // 7-8 AM
        const timeInMinute = Math.floor(Math.random() * 60);
        const timeOutHour = 16 + Math.floor(Math.random() * 3); // 4-6 PM
        const timeOutMinute = Math.floor(Math.random() * 60);
        
        // For today, simulate some staff only checked in (morning scenario)
        const shouldBeCheckedIn = isToday && currentHour < 16 && Math.random() > 0.3;
        
        if (shouldBeCheckedIn) {
          // Only checked in - morning scenario
          attendanceData[staff.uid] = {
            area: staff.area,
            teamNumber: staff.teamNumber,
            role: staff.type,
            timeIn: `${String(timeInHour).padStart(2, '0')}:${String(timeInMinute).padStart(2, '0')}`,
            timeOut: null, // No checkout yet
            gpsLocationIn: `https://maps.google.com/?q=${6.0329 + Math.random() * 0.01},${80.2168 + Math.random() * 0.01}`,
            gpsLocationOut: null, // No checkout location
            imageUrl: staff.imageUrl,
            status: 'in' // Currently checked in
          };
        } else {
          // Full day - both check in and check out
          attendanceData[staff.uid] = {
            area: staff.area,
            teamNumber: staff.teamNumber,
            role: staff.type,
            timeIn: `${String(timeInHour).padStart(2, '0')}:${String(timeInMinute).padStart(2, '0')}`,
            timeOut: `${String(timeOutHour).padStart(2, '0')}:${String(timeOutMinute).padStart(2, '0')}`,
            gpsLocationIn: `https://maps.google.com/?q=${6.0329 + Math.random() * 0.01},${80.2168 + Math.random() * 0.01}`,
            gpsLocationOut: `https://maps.google.com/?q=${6.0329 + Math.random() * 0.01},${80.2168 + Math.random() * 0.01}`,
            imageUrl: staff.imageUrl,
            status: 'out' // Checked out
          };
        }
      }
    }
    
    // Set the document with all staff attendance for this date
    if (Object.keys(attendanceData).length > 0) {
      await dateDoc.set(attendanceData);
      
      // Count in/out status for logging
      const inCount = Object.values(attendanceData).filter(a => a.status === 'in').length;
      const outCount = Object.values(attendanceData).filter(a => a.status === 'out').length;
      
      console.log(`✅ Added attendance for ${Object.keys(attendanceData).length} staff`);
      if (isToday) {
        console.log(`   📊 Status: ${inCount} checked in, ${outCount} checked out`);
      }
    } else {
      console.log(`⏭️  No attendance records for ${dateString}`);
    }
  }
  
  console.log('\n🎉 Attendance data population complete!');
  console.log('📊 Summary:');
  console.log(`   - Created attendance records for ${allStaff.length} staff members`);
  console.log(`   - Generated data for last 30 days`);
  console.log(`   - Today's data includes both "in" and "out" status`);
  
  process.exit(0);
}

// Run the script
fillAttendanceData().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});