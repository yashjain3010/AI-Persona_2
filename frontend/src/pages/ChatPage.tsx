import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  InputBase,
  Paper,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IoSend } from "react-icons/io5";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import type { Persona } from "../types";
import ChatHeader from "../components/ChatHeader";
import Sidebar from "../components/sidebar/Sidebar";
import { mockPersonas } from "../data/mockData";
import { useParams, useNavigate } from "react-router-dom";
import { sendToWebhook, isWebhookPersona } from "../services/webhookService";
import ChatInputBar from "../components/ChatInputBar";
import FormattedOutput from "../components/FormattedOutput";

interface ChatPageProps {
  onBack: () => void;
}

const TypingIndicator = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 1 }}>
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#52946B",
        animation: "typing 1.4s infinite ease-in-out",
        animationDelay: "0s",
        "@keyframes typing": {
          "0%, 80%, 100%": {
            opacity: 0.3,
            transform: "scale(0.8)",
          },
          "40%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    />
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#52946B",
        animation: "typing 1.4s infinite ease-in-out",
        animationDelay: "0.2s",
        "@keyframes typing": {
          "0%, 80%, 100%": {
            opacity: 0.3,
            transform: "scale(0.8)",
          },
          "40%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    />
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#52946B",
        animation: "typing 1.4s infinite ease-in-out",
        animationDelay: "0.4s",
        "@keyframes typing": {
          "0%, 80%, 100%": {
            opacity: 0.3,
            transform: "scale(0.8)",
          },
          "40%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    />
  </Box>
);

export default function ChatPage({ onBack }: ChatPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const persona = mockPersonas.find((p) => p.id === id);
  if (!persona) {
    return <div>Persona not found</div>;
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string; isTyping?: boolean }[]
  >([]);
  const [messageInput, setMessageInput] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  // Get user avatar from localStorage
  let userAvatar = "";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    userAvatar = user.avatar || "";
  } catch {}

  // Handler to open sidebar from header
  const handleMenuClick = () => setSidebarOpen(true);
  // Handler to close sidebar
  const handleSidebarClose = () => setSidebarOpen(false);
  const SIDEBAR_WIDTH = isMobile ? 280 : 160;

  // Handler to open persona switcher
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSwitcherOpen(true);
  };
  // Handler to close persona switcher
  const handleSwitcherClose = () => {
    setSwitcherOpen(false);
    setAnchorEl(null);
  };
  // Handler to switch persona
  const handlePersonaSelect = (p: Persona) => {
    // Instead of updating local state, navigate to the new persona's chat route
    window.location.href = `/chat/${p.id}`;
    handleSwitcherClose();
  };

  const handleAvatarClick = () => {
    navigate(`/view-persona/${persona.id}`);
  };

  const handleRoleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSwitcherOpen(true);
  };

  // Updated handleSendMessage to work with ChatInputBar
  const handleSendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);

    // Check if this persona uses webhook
    if (isWebhookPersona(persona.id)) {
      try {
        // Add a typing indicator
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "", isTyping: true },
        ]);

        // Call the webhook
        const webhookResponse = await sendToWebhook(
          trimmed,
          persona.id,
          persona.name
        );

        // Replace the typing indicator with the actual response
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "ai",
            text: webhookResponse,
            isTyping: false,
          };
          return newMessages;
        });

        // Force scroll to bottom after AI response
        setTimeout(() => {
          if (messageListRef.current) {
            messageListRef.current.scrollTo({
              top: messageListRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 200);
      } catch (error) {
        console.error("Error processing webhook:", error);
        // Replace typing indicator with error message
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "ai",
            text: "I'm experiencing technical difficulties. Please try again or contact support.",
            isTyping: false,
          };
          return newMessages;
        });
      }
    } else {
      // For other personas, add typing indicator first
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "", isTyping: true },
      ]);

      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "ai",
            text: "This is a sample response from your AI Persona.",
            isTyping: false,
          };
          return newMessages;
        });
      }, 800);
    }
  };

  // Dynamic suggestion chips based on persona department
  const getSuggestionChips = (department: string, personaId: string) => {
    // Special handling for Head of Payment persona
    if (personaId === "1") {
      return [
        "Analyze payment gateway performance",
        "Review transaction failure rates",
        "Optimize checkout conversion rates",
        "Check payment processing costs",
        "Evaluate fraud detection metrics",
      ];
    }

    // Special handling for Product Manager persona
    if (personaId === "2") {
      return [
        "Review product roadmap priorities",
        "Analyze feature adoption metrics",
        "Get user feedback insights",
        "Check sprint progress status",
        "Evaluate market competitive analysis",
      ];
    }

    switch (department) {
      case "Tech":
        return [
          "Ask about QR transaction flows",
          "Get merchant risk metrics",
          "Clarify settlement SLA",
        ];
      case "Marketing":
        return [
          "Request latest campaign stats",
          "Ask for competitor analysis",
          "Get social media insights",
        ];
      case "Sales":
        return [
          "Ask for sales pipeline update",
          "Request lead conversion rates",
          "Get monthly sales summary",
        ];
      default:
        return ["Ask a question", "Request a report", "Get latest updates"];
    }
  };
  const suggestionChips = React.useMemo(
    () => getSuggestionChips(persona.department, persona.id),
    [persona]
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messageListRef.current) {
        messageListRef.current.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully updated
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Check if user has sent first message
  const hasUserMessages =
    messages.filter((msg) => msg.sender === "user").length > 0;

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100vw",
        maxWidth: "100vw",
      }}
    >
      {/* Full-width ChatHeader at the top */}
      <ChatHeader
        onBack={onBack}
        onMenu={handleMenuClick}
        isSidebarOpen={sidebarOpen}
        backIcon={
          <ChevronLeftIcon
            sx={{ fontSize: { xs: 24, sm: 28 }, color: "#012A1F" }}
          />
        }
      />

      {/* Content area with sidebar and main chat */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar onClose={handleSidebarClose} currentPersonaId={persona.id} />
        )}

        {/* Main chat area wrapper */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
            ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
            height: "100%",
            width: "100%",
            maxWidth: "100vw",
            overflow: "hidden",
          }}
        >
          {/* Scrollable message list */}
          <Box
            ref={messageListRef}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "100vw",
              mx: 0,
              overflowY: "auto",
              overflowX: "hidden",
              pb: { xs: 20, sm: 30 },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: 900 },
                mx: "auto",
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                px: { xs: 2, sm: 0 },
                overflow: "visible",
              }}
            >
              {/* Persona Profile with separate click handlers */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: { xs: 2, sm: 3 },
                  px: { xs: 2, sm: 0 },
                  pt: { xs: 2, sm: 3 },
                  pb: { xs: 1, sm: 2 },
                }}
              >
                {/* Avatar - clicks to view persona */}
                <Avatar
                  src={persona.avatar}
                  sx={{
                    width: { xs: 80, sm: 96 },
                    height: { xs: 80, sm: 96 },
                    mb: { xs: 1.5, sm: 2 },
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={handleAvatarClick}
                />

                {/* Name */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#222",
                    mb: 0.5,
                    fontSize: { xs: "20px", sm: "24px" },
                    textAlign: "center",
                  }}
                >
                  {persona.name}
                </Typography>

                {/* Role - clicks to show persona switcher */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0,
                    flexDirection: { xs: "column", sm: "row" },
                    cursor: "pointer",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  onClick={handleRoleClick}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#2e7d32",
                      fontWeight: 400,
                      fontSize: { xs: 16, sm: 18 },
                      textAlign: "center",
                    }}
                  >
                    {persona.role}
                  </Typography>
                  <AutorenewIcon
                    sx={{ color: "#2e7d32", fontSize: { xs: 16, sm: 18 } }}
                  />
                </Box>
              </Box>

              {/* Messages */}
              {messages.map((msg, idx) =>
                msg.sender === "ai" ? (
                  <Box
                    key={idx}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ width: 42, height: 42, mb: 0.5 }}>
                        <img
                          src={persona.avatar}
                          alt="AI"
                          style={{ width: 48, height: 48, borderRadius: "50%" }}
                        />
                      </Avatar>
                      <Box>
                        <Box
                          sx={{
                            color: "#52946B",
                            fontWeight: 500,
                            fontSize: 16,
                            mb: 1,
                            fontFamily:
                              "Inter, Roboto, Helvetica, Arial, sans-serif",
                          }}
                        >
                          {persona.name}
                        </Box>
                        <Box
                          sx={{
                            bgcolor: "#F0F5F2",
                            color: "#4e5357",
                            px: { xs: 2.5, sm: 2 },
                            py: { xs: 2, sm: 2.5 },
                            borderRadius: 3,
                            fontSize: 16,
                            fontWeight: 400,
                            maxWidth: { xs: "100%", sm: 600 },
                            wordBreak: "break-word",
                            boxShadow: "none",
                            lineHeight: 1.5,
                            fontFamily:
                              "Inter, Roboto, Helvetica, Arial, sans-serif",
                            textAlign: "left",
                          }}
                        >
                          {msg.isTyping ? (
                            <TypingIndicator />
                          ) : msg.text.match(/(\n\s*[-*]|^\d+\.|^#)/m) ? (
                            <FormattedOutput content={msg.text} />
                          ) : (
                            msg.text
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    key={idx}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 2,
                      mr: { xs: 0, sm: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        alignItems: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ width: 42, height: 42, mb: 0.5 }}>
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="User"
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                              fontWeight: 500,
                              color: "#fff",
                            }}
                          >
                            U
                          </span>
                        )}
                      </Avatar>
                      <Box
                        sx={{
                          bgcolor: "#00875A",
                          color: "#fff",
                          px: { xs: 2.5, sm: 3 },
                          py: { xs: 2, sm: 2.5 },
                          borderRadius: 3,
                          fontSize: 16,
                          fontWeight: 400,
                          maxWidth: { xs: "100%", sm: 400 },
                          wordBreak: "break-word",
                          boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
                          lineHeight: 1.5,
                          fontFamily:
                            "Inter, Roboto, Helvetica, Arial, sans-serif",
                          textAlign: "justify",
                        }}
                      >
                        {msg.text}
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>

            {/* Persona Switcher Popup */}
            {switcherOpen && anchorEl && (
              <ClickAwayListener onClickAway={handleSwitcherClose}>
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 140, sm: 160 },
                    left: { xs: "50%", sm: "calc(50% + 100px)" },
                    transform: { xs: "translateX(-50%)", sm: "none" },
                    bgcolor: "#fafbfa",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px 0 rgba(44,62,80,0.10)",
                    p: { xs: 1, sm: 1.1 },
                    minWidth: { xs: 200, sm: 160 },
                    zIndex: 30,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#888",
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: 14, sm: 15 },
                    }}
                  >
                    Switch Persona
                  </Typography>
                  {mockPersonas
                    .filter((p) => p.id !== persona.id)
                    .slice(0, 3)
                    .map((p) => (
                      <Box
                        key={p.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          cursor: "pointer",
                          pl: { xs: 1.5, sm: 2 },
                          "&:hover": { background: "#f5f5f5", borderRadius: 1 },
                        }}
                        onClick={() => handlePersonaSelect(p)}
                      >
                        <Avatar
                          src={p.avatar}
                          sx={{
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            mr: 1,
                          }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: 12, sm: 13 },
                              color: "#222",
                            }}
                          >
                            {p.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#388e3c",
                              fontWeight: 400,
                              fontSize: { xs: 10, sm: 11 },
                            }}
                          >
                            {p.role}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </ClickAwayListener>
            )}
          </Box>

          {/* Reusable Chat Input Bar */}
          <ChatInputBar
            value={messageInput}
            onChange={setMessageInput}
            onSend={handleSendMessage}
            placeholder="Send a message"
            showSuggestions={!hasUserMessages}
            persona={persona}
            sidebarOpen={sidebarOpen}
            sidebarWidth={SIDEBAR_WIDTH}
            maxWidth={960}
          />
        </Box>
      </Box>
    </Box>
  );
}
