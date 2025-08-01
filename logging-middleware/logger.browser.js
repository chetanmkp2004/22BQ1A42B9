// Browser-compatible logging middleware
const API_URL = 'http://20.244.56.144/evaluation-service/logs';
// Updated token from the authentication response - trying without Bearer prefix
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGV0YW5ta3AyMDA0QGdtYWlsLmNvbSIsImV4cCI6MTc1NDAyODQ4OCwiaWF0IjoxNzU0MDI3NTg4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMzZmOTMxNzctMjAzOS00YTcxLTg3MDItZDdlZTJkYWE3OTE3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGVudW11ZGkgY2hldGFuIG1hbmkga3Jpc2huYSIsInN1YiI6IjYzODllY2U4LTkzYmQtNDA2MS04ZGQ3LTExZWYwMTE2NDBmOSJ9LCJlbWFpbCI6ImNoZXRhbm1rcDIwMDRAZ21haWwuY29tIiwibmFtZSI6InBlbnVtdWRpIGNoZXRhbiBtYW5pIGtyaXNobmEiLCJyb2xsTm8iOiIyMmJxMWE0MmI5IiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiNjM4OWVjZTgtOTNiZC00MDYxLThkZDctMTFlZjAxMTY0MGY5IiwiY2xpZW50U2VjcmV0IjoiUlRKSGNIY3R2a1d2SFpFZyJ9.MXyZIW80HJXkL6tY4odQugrgcCXFIj5Ax_p1rPiLkqc';

export async function Log(stack, level, pkg, message) {
  try {
    const logData = {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    };
    
    // Temporary debugging
    console.log("Sending log data:", logData);
    console.log("Using token:", TOKEN.substring(0, 20) + "...");
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Log error: ${response.status} - ${errorText}`);
    } else {
      const data = await response.json();
      console.log("Log created:", data);
    }
  } catch (error) {
    console.error("Log error:", error.message);
  }
}

// Example log entry
Log("backend", "info", "server", "Server running on port 3000");
