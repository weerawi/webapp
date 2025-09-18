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

async function uploadBulkJobs() {
  // User to Helper mapping
  const userHelperMap = {
    'IEzfAZiNVUZZlZrbhO5iWjoEbEK2': 'mEPjrcDqPxxxaffMeN1',
    'OHGLLtMlRAf9Hh0ey7q1uBwcWZg1': '8zkQtnwcw1EzuDJaWczW',
    'Vjt4n82iJkhki9MSq9rnppYyQE92': 'kqFifn4xdcSfAdJDTPdx',
    'W5xI3907rWgSX100OpnfBO2CsiM2': '5HzC7kSVc7OgI1nO03JV',
    'aoPHVJDj7Vf5nLUcFFwSdoyEHjV2': 'mEPjrcDqPzvoorfrMeRh'
  };

  // Random selection arrays
  const paymentTypes = ["payment 100%", "payment 80%", "payment 50%", "already paid"];
  const disconnectionActions = ["payment proof pending", "DISCONNECTED" ];
  
  // Helper function to get random item from array
  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const today = new Date();
  
  for (const [userId, helperId] of Object.entries(userHelperMap)) {
    console.log(`\n📝 Processing user: ${userId} with helper: ${helperId}`);
    let jobCount = 0;
    let batch = db.batch();
    let batchCount = 0;

    // Add 50 jobs for TODAY
    for (let i = 0; i < 50; i++) {
      const todayDate = new Date();
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      todayDate.setHours(hours, minutes, 0, 0);
      
      const jobId = `42-38-150-${String(jobCount++).padStart(3, '0')}-${today.getDate()}`;
      
      // Random disconnection action and type
      const randomDisconnectionAction = getRandomItem(disconnectionActions);
      const jobType = randomDisconnectionAction === "DISCONNECTED" 
        ? "disconnected" 
        : getRandomItem(paymentTypes);
      
      const jobRef = db.collection('completed_jobs').doc(userId).collection('jobs').doc(jobId);
      batch.set(jobRef, {
        completedAt: admin.firestore.Timestamp.fromDate(todayDate),
        date: todayDate.toISOString().split('T')[0],
        disconnectionAction: randomDisconnectionAction,
        helperId: helperId,
        imageLocalPath: `/data/user/0/com.example.hiconnectionmanager/files/.disconnection_photos/disconnect_${Date.now()}_${i}.jpg`,
        imageUrl: "",
        jobId: jobId,
        latitude: 37.4219983 + (Math.random() * 0.01),
        longitude: -122.084 + (Math.random() * 0.01),
        status: 'To Be Completed',
        time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`,
        timestamp: todayDate.getTime(),
        type: jobType,
        uploadStatus: 'pending_image_upload',
        userId: userId, 
      });

      batchCount++;
      
      if (batchCount >= 400) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
        console.log(`  ✅ Committed batch for today's jobs`);
      }
    }

    // Add 450 jobs for DIFFERENT MONTHS
    const monthsData = [
      { month: 0, days: 31, count: 45 },
      { month: 1, days: 28, count: 45 },
      { month: 2, days: 31, count: 45 },
      { month: 3, days: 30, count: 45 },
      { month: 4, days: 31, count: 45 },
      { month: 5, days: 30, count: 45 },
      { month: 6, days: 31, count: 45 },
      { month: 7, days: 31, count: 45 },
      { month: 8, days: 30, count: 45 },
      { month: 9, days: 31, count: 45 },
    ];

    for (const monthData of monthsData) {
      for (let i = 0; i < monthData.count; i++) {
        const randomDay = Math.floor(Math.random() * monthData.days) + 1;
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        
        const jobDate = new Date(2025, monthData.month, randomDay, randomHour, randomMinute, 0);
        
        if (jobDate.toDateString() === today.toDateString()) continue;
        
        const jobId = `42-38-150-${String(jobCount++).padStart(3, '0')}-${monthData.month + 1}`;
        
        // Random disconnection action and type
        const randomDisconnectionAction = getRandomItem(disconnectionActions);
        const jobType = randomDisconnectionAction === "DISCONNECTED" 
          ? "disconnected" 
          : getRandomItem(paymentTypes);
        
        const jobRef = db.collection('completed_jobs').doc(userId).collection('jobs').doc(jobId);
        batch.set(jobRef, {
          completedAt: admin.firestore.Timestamp.fromDate(jobDate),
          date: jobDate.toISOString().split('T')[0],
          disconnectionAction: randomDisconnectionAction,
          helperId: helperId,
          imageLocalPath: `/data/user/0/com.example.hiconnectionmanager/files/.disconnection_photos/disconnect_${jobDate.getTime()}_${i}.jpg`,
          imageUrl: "",
          jobId: jobId,
          latitude: 37.4219983 + (Math.random() * 0.01),
          longitude: -122.084 + (Math.random() * 0.01),
          status: 'To Be Completed',
          time: `${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}:00`,
          timestamp: jobDate.getTime(),
          type: jobType,
          uploadStatus: 'pending_image_upload',
          userId: userId, 
        });

        batchCount++;
        
        if (batchCount >= 400) {
          await batch.commit();
          batch = db.batch();
          batchCount = 0;
          console.log(`  ✅ Committed batch for month ${monthData.month + 1}`);
        }
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      console.log(`  ✅ Final batch committed`);
    }

    console.log(`✅ Added ${jobCount} jobs for user ${userId}`);
  }
  
  console.log('\n🎉 Bulk upload complete! Total: 2500 jobs');
  process.exit(0);
}

// Run the upload
uploadBulkJobs().catch(error => {
  console.error('❌ Upload failed:', error);
  process.exit(1);
});