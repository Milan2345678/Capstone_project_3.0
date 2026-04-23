import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI college counselor. I can help you with questions about JEE counseling, college choices, admission chances, and career advice. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/colleges/chat", {
        message: inputMessage,
        context: "JEE counseling and college admission discussion",
      });

      const aiMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Should I wait for the next JoSAA round?",
    "What's the difference between NIT and IIIT?",
    "How important is NIRF ranking for placements?",
    "Which branch should I choose: CSE or ECE?",
    "What are my chances with a rank of 15,000 in General category?",
  ];

  return (
    <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI College Counselor
      </Typography>

      <Card
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", mb: 2 }}
      >
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 0 }}
        >
          {/* Messages Container */}
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, maxHeight: "60vh" }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    bgcolor:
                      message.sender === "user" ? "primary.main" : "grey.100",
                    color: message.sender === "user" ? "white" : "text.primary",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      {message.sender === "user" ? (
                        <PersonIcon fontSize="small" />
                      ) : (
                        <SmartToyIcon fontSize="small" />
                      )}
                    </Avatar>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.sender === "user" ? "You" : "AI Counselor"}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
              >
                <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="body2">Thinking...</Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="subtitle2" gutterBottom>
                Try asking:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => setInputMessage(question)}
                    sx={{ textTransform: "none" }}
                  >
                    {question}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about JEE counseling, colleges, or career advice..."
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                sx={{ minWidth: 50 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Chat;
