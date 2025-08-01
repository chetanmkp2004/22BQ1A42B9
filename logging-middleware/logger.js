const axios = require('axios');

const API_URL = 'http://20.244.56.144/evaluation-service/logs';
// Updated token from the authentication response - trying without Bearer prefix
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGV0YW5ta3AyMDA0QGdtYWlsLmNvbSIsImV4cCI6MTc1NDAyODQ4OCwiaWF0IjoxNzU0MDI3NTg4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMzZmOTMxNzctMjAzOS00YTcxLTg3MDItZDdlZTJkYWE3OTE3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGVudW11ZGkgY2hldGFuIG1hbmkga3Jpc2huYSIsInN1YiI6IjYzODllY2U4LTkzYmQtNDA2MS04ZGQ3LTExZWYwMTE2NDBmOSJ9LCJlbWFpbCI6ImNoZXRhbm1rcDIwMDRAZ21haWwuY29tIiwibmFtZSI6InBlbnVtdWRpIGNoZXRhbiBtYW5pIGtyaXNobmEiLCJyb2xsTm8iOiIyMmJxMWE0MmI5IiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiNjM4OWVjZTgtOTNiZC00MDYxLThkZDctMTFlZjAxMTY0MGY5IiwiY2xpZW50U2VjcmV0IjoiUlRKSGNIY3R2a1d2SFpFZyJ9.MXyZIW80HJXkL6tY4odQugrgcCXFIj5Ax_p1rPiLkqc';

async function Log(stack, level, pkg, message) {
  try {
    const logData = {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    };
    
    const response = await axios.post(
      API_URL,
      logData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Log created:", response.data);
  } catch (error) {
    const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error("Log error:", errorMessage);
  }
}

module.exports = { Log };
