const { neon } = require("@neondatabase/serverless");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");

const sql = neon("postgres://neondb_owner:VespkR8Sn4Xv@ep-floral-violet-a23wq3zg-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require");

async function populateDb() {
  try {
    // Create the table once
    await sql`CREATE TABLE IF NOT EXISTS chapters (
      class INT,
      subject TEXT,
      chapter INT,
      content TEXT
    )`;

    for (let i = 1; i <= 14; i++) {
      let BASE_URL = i < 10 
        ? `https://ncert.nic.in/textbook/pdf/fees10${i}.pdf` 
        : `https://ncert.nic.in/textbook/pdf/fees1${i}.pdf`;

      try {
        // Fetch the PDF file from the provided link
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          console.error(`Failed to fetch PDF #${i}: ${response.statusText}`);
          continue; // Skip to the next iteration
        }

        // Convert the response to an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Parse the PDF using pdf-parse
        const pdfData = await pdfParse(Buffer.from(arrayBuffer));
        const text = pdfData.text;

        // Insert the extracted data into the database
        await sql`
          INSERT INTO chapters (class, subject, chapter, content)
          VALUES (6, 'Social Science', ${i}, ${text})
        `;

        console.log(`SUCCESSFUL ENTRY #${i}`);
      } catch (error) {
        console.error(`Error processing PDF #${i}:`, error);
      }
    }
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

populateDb();
