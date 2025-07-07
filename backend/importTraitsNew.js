const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = "mongodb+srv://harshg:h9982346893@cluster0.xiam8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Parse the trait file with the new format
function parseTraitFile(content) {
  const traits = [];
  
  // Define the sections we want to extract
  const sectionPatterns = [
    { title: 'About', pattern: /About:(.*?)(?=\n\nCore Expertise:|$)/s },
    { title: 'Core Expertise', pattern: /Core Expertise:(.*?)(?=\n\nCommunication Style:|$)/s },
    { title: 'Communication Style', pattern: /Communication Style:(.*?)(?=\n\nTraits:|$)/s },
    { title: 'Traits', pattern: /Traits:(.*?)(?=\n\nPain Points:|$)/s },
    { title: 'Pain Points', pattern: /Pain Points:(.*?)(?=\n\nKey Responsibilities:|$)/s },
    { title: 'Key Responsibilities', pattern: /Key Responsibilities:(.*?)(?=$)/s }
  ];
  
  // Extract each section using regex
  for (const section of sectionPatterns) {
    const match = content.match(section.pattern);
    if (match && match[1]) {
      traits.push({
        title: section.title,
        category: section.title,
        description: match[1].trim()
      });
    }
  }
  
  return traits;
}

async function importTraits() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('aiPersona');
    const traitsCollection = database.collection('traits');
    
    // Read the trait file
    const traitFilePath = path.resolve(__dirname, '../frontend/trait');
    console.log('Reading trait file from:', traitFilePath);
    const traitContent = fs.readFileSync(traitFilePath, 'utf8');
    console.log('File content length:', traitContent.length);
    
    // Parse the trait file
    const traits = parseTraitFile(traitContent);
    console.log('Parsed traits:', traits.length);
    
    // Print each trait for verification
    traits.forEach((trait, index) => {
      console.log(`Trait ${index + 1}: ${trait.title} (${trait.category})`);
      // Print first 50 characters of description
      console.log(`  Description: ${trait.description.substring(0, 50)}...`);
    });
    
    // Insert traits into MongoDB
    if (traits.length > 0) {
      // Delete existing traits first
      await traitsCollection.deleteMany({});
      console.log('Deleted existing traits');
      
      // Insert new traits
      const result = await traitsCollection.insertMany(traits);
      console.log(`${result.insertedCount} traits imported successfully`);
    } else {
      console.log('No traits found to import');
    }
    
  } catch (error) {
    console.error('Error importing traits:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the import
importTraits(); 