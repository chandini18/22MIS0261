const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGFuZGluaWowMTRAZ21haWwuY29tIiwiZXhwIjoxNzc4OTMxNzQ0LCJpYXQiOjE3Nzg5MzA4NDQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJiMDgyZTZhYS02ZDc4LTQ1YjgtYTFmYy05Mjk3OTc0MzkyZDUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGFuZGluaSBqIiwic3ViIjoiYjBhYTBlN2EtNGIxZC00Nzk4LThmNDAtN2FmYWI5NWNiYmJhIn0sImVtYWlsIjoiY2hhbmRpbmlqMDE0QGdtYWlsLmNvbSIsIm5hbWUiOiJjaGFuZGluaSBqIiwicm9sbE5vIjoiMjJtaXMwMjYxeCIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6ImIwYWEwZTdhLTRiMWQtNDc5OC04ZjQwLTdhZmFiOTVjYmJiYSIsImNsaWVudFNlY3JldCI6IkRiZU1aWWh5RGZ5dHN5bWgifQ._KR_Fkzhj5NRBolFOXms1CrilD-65RgppqOnDGEUeoo";

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );
    console.log("Log success:", response.data);
  } catch (error) {
    console.log("Log error:", error.message);
  }
}

module.exports = Log;