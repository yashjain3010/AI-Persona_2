const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const chatController = require('../controller/chatController');
const Chat = require('../models/Chat');
const PersonaTrait = require('../models/PersonaTrait');

// MongoDB connection string
const uri =
  "mongodb+srv://harshg:h9982346893@cluster0.xiam8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Chat message routes - MUST come before /:id routes
router.post('/chats', chatController.saveMessage);
router.get('/chats', chatController.getMessages);

// Get all traits for a persona
router.get('/traits', async (req, res) => {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('aiPersona');
    const traitsCollection = database.collection('traits');
    
    const traits = await traitsCollection.find({}).toArray();
    
    res.status(200).json({ success: true, data: traits });
  } catch (error) {
    console.error('Error fetching traits:', error);
    res.status(500).json({ success: false, message: 'Error fetching traits', error: error.message });
  } finally {
    await client.close();
  }
});

// Store new persona data
router.post('/store-persona', async (req, res) => {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('aiPersona');
    const personasCollection = database.collection('personas');
    
    // Check if we have the persona ID
    const { personaId, traits } = req.body;
    
    if (!personaId || !traits) {
      return res.status(400).json({ success: false, message: 'Missing required fields: personaId or traits' });
    }
    
    // Create traits array with proper structure
    const formattedTraits = [];
    
    // About trait
    if (traits.about) {
      formattedTraits.push({
        title: "About",
        category: "About",
        description: traits.about
      });
    }
    
    // Core Expertise trait
    if (traits.coreExpertise) {
      formattedTraits.push({
        title: "Core Expertise",
        category: "Core Expertise",
        description: traits.coreExpertise
      });
    }
    
    // Communication Style trait
    if (traits.communicationStyle) {
      formattedTraits.push({
        title: "Communication Style",
        category: "Communication Style",
        description: traits.communicationStyle
      });
    }
    
    // Traits trait
    if (traits.traits) {
      formattedTraits.push({
        title: "Traits",
        category: "Traits",
        description: traits.traits
      });
    }
    
    // Pain Points trait
    if (traits.painPoints) {
      formattedTraits.push({
        title: "Pain Points",
        category: "Pain Points",
        description: traits.painPoints
      });
    }
    
    // Key Responsibilities trait
    if (traits.keyResponsibilities) {
      formattedTraits.push({
        title: "Key Responsibilities",
        category: "Key Responsibilities",
        description: traits.keyResponsibilities
      });
    }
    
    // Create or update the persona document
    const personaData = {
      personaId,
      traits: formattedTraits,
      updatedAt: new Date()
    };
    
    // Update if exists, insert if not
    const result = await personasCollection.updateOne(
      { personaId },
      { $set: personaData },
      { upsert: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: result.upsertedCount ? 'Persona created successfully' : 'Persona updated successfully',
      data: personaData
    });
  } catch (error) {
    console.error('Error storing persona data:', error);
    res.status(500).json({ success: false, message: 'Error storing persona data', error: error.message });
  } finally {
    await client.close();
  }
});

// Get a specific persona by ID
router.get('/:id', async (req, res) => {
  const client = new MongoClient(uri);
  
  try {
    const personaId = req.params.id;
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('aiPersona');
    const personasCollection = database.collection('personas');
    
    // Define base persona info
    let personaData;
    
    switch (parseInt(personaId)) {
      case 1:
        personaData = {
          id: "1",
          name: "C-Level Bank ICP",
          role: "Chief Financial Officer",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          description: "Financial decision maker for banking institutions"
        };
        break;
      case 2:
        personaData = {
          id: "2",
          name: "Senior Executive",
          role: "Head of Retail Lending",
          avatar: "https://randomuser.me/api/portraits/men/33.jpg",
          description: "Growth and strategic partnerships specialist"
        };
        break;
      case 3:
        personaData = {
          id: "3",
          name: "Emily Carter",
          role: "Head of Engineering",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          description: "Technical leadership and engineering management"
        };
        break;
      case 4:
        personaData = {
          id: "4",
          name: "Jessica Davis",
          role: "CTO",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg",
          description: "Technology strategy and innovation leader"
        };
        break;
      default:
        personaData = {
          id: personaId.toString(),
          name: "AI Persona",
          role: "Default Role",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
          description: "Default persona description"
        };
    }
    
    // Try to fetch persona data from the database
    const storedPersona = await personasCollection.findOne({ personaId });
    
    if (storedPersona) {
      // Use stored traits if available
      personaData.traits = storedPersona.traits;
    } else {
      // If persona 1, use the old traits collection for backward compatibility
      if (parseInt(personaId) === 1) {
        const traitsCollection = database.collection('traits');
        const traits = await traitsCollection.find({}).toArray();
        personaData.traits = traits;
      } else {
        // Mock traits for other personas
        personaData.traits = [
          {
            _id: `mock-${personaId}-1`,
            title: "About",
            category: "About",
            description: `This is the about section for persona ${personaId}. This persona has different expertise and background than the main persona.`
          },
          {
            _id: `mock-${personaId}-2`,
            title: "Core Expertise",
            category: "Core Expertise",
            description: "1) Product strategy\n2) Market analysis\n3) User experience design\n4) Agile methodology\n5) Cross-functional team leadership"
          },
          {
            _id: `mock-${personaId}-3`,
            title: "Communication Style",
            category: "Communication Style",
            description: "Clear and concise communication with a focus on data-driven insights and collaborative problem-solving."
          }
        ];
      }
    }
    
    res.status(200).json({ success: true, data: personaData });
  } catch (error) {
    console.error('Error fetching persona:', error);
    res.status(500).json({ success: false, message: 'Error fetching persona', error: error.message });
  } finally {
    await client.close();
  }
});

// Get all chats for a user
router.get('/chats', async (req, res) => {
  try {
    const { user, persona, session_id } = req.query;
    let query = { user };

    if (persona && persona !== 'all') {
      query.persona = persona;
    }

    if (session_id) {
      query.session_id = session_id;
    }

    const chats = await Chat.find(query).sort({ timestamp: 1 });
    
    res.json({
      success: true,
      chats: chats
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chats'
    });
  }
});

// Store a new chat
router.post('/chats', async (req, res) => {
  try {
    const { user, persona, session_id, user_message, ai_response } = req.body;
    
    const newChat = new Chat({
      user,
      persona,
      session_id,
      user_message,
      ai_response
    });

    await newChat.save();
    
    res.json({
      success: true,
      message: 'Chat stored successfully'
    });
  } catch (error) {
    console.error('Error storing chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store chat'
    });
  }
});

// Get persona traits
router.get('/traits/:personaId', async (req, res) => {
  try {
    const { personaId } = req.params;
    const traits = await PersonaTrait.findOne({ personaId });
    
    if (!traits) {
      return res.status(404).json({
        success: false,
        error: 'Persona traits not found'
      });
    }
    
    res.json({
      success: true,
      traits: traits
    });
  } catch (error) {
    console.error('Error fetching persona traits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch persona traits'
    });
  }
});

// Get all persona traits
router.get('/traits', async (req, res) => {
  try {
    const traits = await PersonaTrait.find({});
    
    res.json({
      success: true,
      traits: traits
    });
  } catch (error) {
    console.error('Error fetching all persona traits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch persona traits'
    });
  }
});

module.exports = router; 