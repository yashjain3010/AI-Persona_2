import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ViewPersonaSidebar from "../components/viewPersona/ViewPersonaSidebar";
import ViewPersonaHeader from "../components/viewPersona/ViewPersonaHeader";
import ViewPersonaTabs from "../components/viewPersona/ViewPersonaTabs";
import ViewPersonaStats from "../components/viewPersona/ViewPersonaStats";
import ViewPersonaSection from "../components/viewPersona/ViewPersonaSection";
import ViewPersonaChips from "../components/viewPersona/ViewPersonaChips";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import type { Persona } from "../types";

interface ViewPersonaPageProps {
  persona?: Persona;
}

interface Trait {
  _id: string;
  title: string;
  category: string;
  description: string;
}

interface PersonaData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  traits: Trait[];
}

const mockPersona = {
  id: "1",
  name: "Ethan Carter",
  role: "Head of payment",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  about: `Ethan Carter has  years of expertise in optimizing payment experiences across digital and in-store commerce. He specializes in transaction design, fraud prevention, partner integrations, and scalable payment architecture for B2B and B2C ecosystems.\nHe provides high-impact guidance on cost-efficient transaction flows, modern checkout UX, cross-border payment compliance, and omnichannel integration.`,
  communication: `Ethan's communication style is characterized by clarity, conciseness, and a collaborative approach. He excels at articulating complex ideas in a simple and understandable manner, fostering open dialogue and ensuring all team members are aligned. His approach is both professional and approachable, making him an effective communicator across all levels of the organization.`
};
const mockStats = [
  { label: "Avg. User Rating", value: "4.8/5" },
  { label: "Total Conversations", value: "23.4K" },
  { label: "Success Rate", value: "92%" },
];
const mockExpertise = [
  "Research Collaboration",
  "Fraud & Risk Management",
  "Checkout UX Optimization",
  "Terminal Hardware Advisory",
  "Payment Gateway Evaluation",
  "Regulatory Compliance",
  "Dynamic Routing Strategy",
];
const mockTraits = [
  "Strategic",
  "Decisive",
  "Detail-Oriented",
  "Collaborative",
  "Financially Astute",
];
const mockPainPoints = [
  "Difficulty evaluating multiple PSP/gateway vendors",
  "Lack of clarity on transaction-level costs",
  "Integrating modern payment features into legacy systems",
];
const mockResponsibilities = [
  "Optimize transaction cost efficiency",
  "Design omnichannel payment flows",
  "Ensure regulatory & PCI compliance",
];
const similarPersonas = [
  { id: "2", name: "David Lee", role: "Product Manager", avatar: "https://randomuser.me/api/portraits/men/33.jpg" },
  { id: "3", name: "Emily Carter", role: "Head of Engineering", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "4", name: "Jessica Davis", role: "CTO", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
];
const mockSampleQuestions = [
  {
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    text: 'How should I explain our fallback transaction mechanism in pitches?'
  },
  {
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    text: "What's the best way to position our QR settlement timelines?"
  },
  {
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    text: 'Can you help validate how we compare to Razorpay on uptime and disputes?'
  },
  {
    img: '',
    text: 'How do I counter merchant objections about T+1 settlements?'
  },
];
const mockExampleInteractions = [
  {
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    text: 'A client asked if we offer instant settlement. How flexible are we on that?'
  },
  {
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    text: "What's our standard SLA for resolving failed transactions during peak hours?"
  },
];
const mockUpdates = [
  {
    icon: <InsertDriveFileOutlinedIcon sx={{ fontSize: 28, color: '#222' }} />, 
    title: 'Integrated April 2025 Meta Ads update',
    date: 'April 20, 2025',
  },
  {
    icon: <ComputerOutlinedIcon sx={{ fontSize: 28, color: '#222' }} />, 
    title: 'Completed training on new product features',
    date: 'April 15, 2025',
  },
  {
    icon: <StorageOutlinedIcon sx={{ fontSize: 28, color: '#222' }} />, 
    title: 'Updated knowledge base with Q1 2025 data',
    date: 'April 10, 2025',
  },
  {
    icon: <EditOutlinedIcon sx={{ fontSize: 28, color: '#222' }} />, 
    title: "Refreshed persona's tone and style guidelines",
    date: 'April 5, 2025',
  },
  {
    icon: <PublicOutlinedIcon sx={{ fontSize: 28, color: '#222' }} />, 
    title: 'Added support for new languages',
    date: 'March 28, 2025',
  },
];

const ViewPersonaPage: React.FC<ViewPersonaPageProps> = ({ persona: propPersona }) => {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonaData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/personas/${id || '1'}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch persona data');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setPersonaData(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching persona:', err);
        setError('Failed to load persona data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersonaData();
  }, [id]);

  // Find trait by title
  const getTraitByTitle = (title: string) => {
    if (!personaData?.traits) return null;
    return personaData.traits.find(trait => 
      trait.title.toLowerCase() === title.toLowerCase()
    );
  };

  // Get about section content
  const getAboutContent = () => {
    const aboutTrait = getTraitByTitle('About');
    return aboutTrait?.description || mockPersona.about;
  };

  // Get communication style content
  const getCommunicationStyleContent = () => {
    const communicationTrait = getTraitByTitle('Communication Style');
    return communicationTrait?.description || mockPersona.communication;
  };

  // Get core expertise content
  const getCoreExpertiseItems = () => {
    const expertiseTrait = getTraitByTitle('Core Expertise');
    if (!expertiseTrait?.description) return mockExpertise;
    
    // Check if the description contains numbered items like "1) text" or "1. text"
    const numberedItemRegex = /^\d+[\s.)-]/;
    const hasNumberedItems = numberedItemRegex.test(expertiseTrait.description);
    
    if (hasNumberedItems) {
      // Split by new lines first for numbered lists
      const items = expertiseTrait.description
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        // Remove the numbering from each item
        .map(item => item.replace(/^\d+[\s.)-]/, '').trim());
      
      return items.length > 0 ? items : mockExpertise;
    }
    
    // First try to split by bullet points
    let bullets = expertiseTrait.description
      .split('•')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // If no bullet points found, try splitting by new lines
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === expertiseTrait.description)) {
      bullets = expertiseTrait.description
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // If still no items found, try splitting by periods followed by space or newline
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === expertiseTrait.description)) {
      bullets = expertiseTrait.description
        .split(/\.\s|\.\n/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => item + (item.endsWith('.') ? '' : '.'));
    }
    
    // Clean up any remaining numbered list prefixes
    bullets = bullets.map(item => item.replace(/^\d+[\s.)-]/, '').trim());
    
    return bullets.length > 0 ? bullets : mockExpertise;
  };

  // Get traits content
  const getTraitsItems = () => {
    const traitsTrait = getTraitByTitle('Traits');
    if (!traitsTrait?.description) return mockTraits;
    
    // First try to split by bullet points
    let bullets = traitsTrait.description
      .split('•')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // If no bullet points found, try splitting by new lines
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === traitsTrait.description)) {
      bullets = traitsTrait.description
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // If still no items found, try splitting by numbered list format (1), 2), etc.)
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === traitsTrait.description)) {
      // Match patterns like "1)", "2)", "3)..." with any amount of spacing
      const numberedListRegex = /\d+\s*\)/g;
      const matches = traitsTrait.description.match(numberedListRegex);
      
      if (matches && matches.length > 0) {
        // Split by numbered list markers
        bullets = traitsTrait.description
          .split(numberedListRegex)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
    }
    
    // Clean up any remaining numbered list prefixes
    bullets = bullets.map(item => item.replace(/^\d+[\s.)-]/, '').trim());
    
    return bullets.length > 0 ? bullets : mockTraits;
  };

  // Get pain points content
  const getPainPointsItems = () => {
    const painPointsTrait = getTraitByTitle('Pain Points');
    if (!painPointsTrait?.description) return mockPainPoints;
    
    // First try to split by bullet points
    let bullets = painPointsTrait.description
      .split('•')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // If no bullet points found, try splitting by new lines
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === painPointsTrait.description)) {
      bullets = painPointsTrait.description
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // If still no items found, try splitting by numbered list format (1), 2), etc.)
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === painPointsTrait.description)) {
      // Match patterns like "1)", "2)", "3)..." with any amount of spacing
      const numberedListRegex = /\d+\s*\)/g;
      const matches = painPointsTrait.description.match(numberedListRegex);
      
      if (matches && matches.length > 0) {
        // Split by numbered list markers
        bullets = painPointsTrait.description
          .split(numberedListRegex)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
    }
    
    // Clean up any remaining numbered list prefixes
    bullets = bullets.map(item => item.replace(/^\d+[\s.)-]/, '').trim());
    
    return bullets.length > 0 ? bullets : mockPainPoints;
  };

  // Get key responsibilities content
  const getKeyResponsibilitiesItems = () => {
    const responsibilitiesTrait = getTraitByTitle('Key Responsibilities');
    if (!responsibilitiesTrait?.description) return mockResponsibilities;
    
    // First try to split by bullet points
    let bullets = responsibilitiesTrait.description
      .split('•')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // If no bullet points found, try splitting by new lines
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === responsibilitiesTrait.description)) {
      bullets = responsibilitiesTrait.description
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // If still no items found, try splitting by numbered list format (1), 2), etc.)
    if (bullets.length === 0 || (bullets.length === 1 && bullets[0] === responsibilitiesTrait.description)) {
      // Match patterns like "1)", "2)", "3)..." with any amount of spacing
      const numberedListRegex = /\d+\s*\)/g;
      const matches = responsibilitiesTrait.description.match(numberedListRegex);
      
      if (matches && matches.length > 0) {
        // Split by numbered list markers
        bullets = responsibilitiesTrait.description
          .split(numberedListRegex)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
    }
    
    // Clean up any remaining numbered list prefixes
    bullets = bullets.map(item => item.replace(/^\d+[\s.)-]/, '').trim());
    
    return bullets.length > 0 ? bullets : mockResponsibilities;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Use either the prop persona or the fetched persona data
  const persona = propPersona || personaData || mockPersona;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Header />
      <Container maxWidth={false} sx={{ display: 'flex', pt: 4, pb: 6, maxWidth: 1200 }}>
        <ViewPersonaSidebar 
          personas={similarPersonas} 
          onSelect={(personaId) => {
            window.location.href = `/view-persona/${personaId}`;
          }} 
          currentPersonaId={id} 
        />
        <Box sx={{ flex: 1, pl: 2, maxWidth: 'calc(100% - 280px)', overflowX: 'hidden' }}>
          <ViewPersonaHeader
            avatar={persona.avatar}
            name={persona.name}
            role={persona.role}
            onStartChat={() => {}}
          />
          <ViewPersonaTabs value={tab} onChange={setTab} />
          {tab === 0 && (
            <>
              <ViewPersonaStats stats={mockStats} />
              <ViewPersonaSection title="About">
                {getAboutContent().split('\n').map((p: string, i: number) => (
                  <Box key={i} sx={{ mb: 1, overflowWrap: 'break-word' }}><span>{p}</span></Box>
                ))}
              </ViewPersonaSection>
              <ViewPersonaSection title="Core Expertise">
                <ViewPersonaChips chips={getCoreExpertiseItems()} />
              </ViewPersonaSection>
              <ViewPersonaSection title="Communication Style">
                <Box sx={{ overflowWrap: 'break-word' }}>
                  <span>{getCommunicationStyleContent()}</span>
                </Box>
              </ViewPersonaSection>
            </>
          )}
          {tab === 1 && (
            <>
              <ViewPersonaSection title="Traits">
                <ViewPersonaChips chips={getTraitsItems()} />
              </ViewPersonaSection>
              <ViewPersonaSection title="Pain Points">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {getPainPointsItems().map((point) => (
                    <Box key={point} sx={{ border: '1.5px solid #e0e0e0', borderRadius: 2, p: 2.2, minWidth: 260, maxWidth: '100%', fontWeight: 500, fontSize: 16, color: '#222', bgcolor: '#fff', flex: '1 1 260px', overflowWrap: 'break-word' }}>
                      {point}
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
              <ViewPersonaSection title="Key Responsibilities">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {getKeyResponsibilitiesItems().map((resp) => (
                    <Box key={resp} sx={{ border: '1.5px solid #e0e0e0', borderRadius: 2, p: 2.2, minWidth: 260, maxWidth: '100%', fontWeight: 500, fontSize: 16, color: '#222', bgcolor: '#fff', flex: '1 1 260px', overflowWrap: 'break-word' }}>
                      {resp}
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
            </>
          )}
          {tab === 2 && (
            <>
              <ViewPersonaSection title="Sample Questions">
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3, justifyContent: 'flex-start' }}>
                  {mockSampleQuestions.map((q, i) => (
                    <Box key={i} sx={{ width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', boxShadow: 'none', p: 0 }}>
                      <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px rgba(44,62,80,0.06)', bgcolor: '#fff', mb: 1 }}>
                        {q.img ? (
                          <Box component="img" src={q.img} alt="sample" sx={{ width: '100%', height: 110, objectFit: 'cover' }} />
                        ) : (
                          <Box sx={{ width: '100%', height: 110, bgcolor: '#111' }} />
                        )}
                      </Box>
                      <Box sx={{ textAlign: 'center', width: '100%' }}>
                        <span style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>{q.text}</span>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
              <ViewPersonaSection title="Example Interactions">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockExampleInteractions.map((ex, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box component="img" src={ex.avatar} alt={ex.name} sx={{ width: 46, height: 36, borderRadius: '50%', mt: 0.5 }} />
                      <Box>
                        <Typography sx={{ color: '#219653', fontWeight: 600, fontSize: 15, mb: 0.5 }}>{ex.name}</Typography>
                        <Box sx={{ bgcolor: '#e8f5e8', borderRadius: 2, px: 2, py: 1, fontSize: 16, color: '#222', fontWeight: 500, maxWidth: 420 }}>{ex.text}</Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
            </>
          )}
          {tab === 3 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 28, color: '#222', mb: 0.5 }}>Latest Updates</Typography>
                <Typography sx={{ color: '#888', fontWeight: 500, fontSize: 16, mb: 2 }}>
                  Stay informed about the latest knowledge enhancements and training events for your AI Persona.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pl: 1, position: 'relative' }}>
                {mockUpdates.map((u, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {u.icon}
                      {i < mockUpdates.length - 1 && (
                        <Box sx={{ position: 'absolute', left: '50%', top: 32, width: 2, height: 32, bgcolor: '#e0e0e0', transform: 'translateX(-50%)' }} />
                      )}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#222', mb: 0.2 }}>{u.title}</Typography>
                      <Typography sx={{ color: '#888', fontWeight: 500, fontSize: 16 }}>{u.date}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ViewPersonaPage; 