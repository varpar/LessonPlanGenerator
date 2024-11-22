import { neon } from "@neondatabase/serverless";

const sql = neon("postgres://neondb_owner:VespkR8Sn4Xv@ep-floral-violet-a23wq3zg-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require");


export async function getData() {
    const data = await sql`SELECT * FROM Chapters;`;
    return data;
}

export async function populateDb(){
    for(let i = 1; i<15; i++){
        let BASE_URL = ""
        if(i<10) { BASE_URL = `https://ncert.nic.in/textbook/pdf/fees10${i}.pdf`}
        else{ BASE_URL = `https://ncert.nic.in/textbook/pdf/fees1${i}.pdf`}
      
            try {
              // Fetch the PDF file from the provided link
              const response = await fetch(BASE_URL);
              if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.statusText}`);
              }
        
              // Convert the response to an ArrayBuffer
              const arrayBuffer = await response.arrayBuffer();
        
              // Parse the PDF using pdf-par
              const pdfData = await pdfParse(Buffer.from(arrayBuffer));
        
              // Log the extracted text content
              text = pdfData.text

              await sql`CREATE TABLE IF NOT EXISTS chapters (
    class INT,
    subject TEXT,
    chapter TEXT,
    content TEXT
);

INSERT INTO chapters (class, subject, chapter, content)
VALUES 
    (6, 'Social Science', ${i}, ${text})`
    console.log(`SUCCESSFUL ENTRY #${i}`)
            } catch (error) {
              console.error("Error processing PDF:", error);
            }
        
    }
}





