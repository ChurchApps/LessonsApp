"use client";

import React from "react";
import { Box, Button, Container, Icon, Stack, Typography } from "@mui/material";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center" }}>
        <Icon sx={{ fontSize: 64, color: "error.main", mb: 2 }}>error_outline</Icon>
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </Typography>

        {process.env.NODE_ENV === "development" && error && (
          <Box sx={{ mb: 4, p: 2, bgcolor: "grey.100", borderRadius: 1, textAlign: "left" }}>
            <Typography variant="body2" component="pre" sx={{ fontSize: 12, overflow: "auto" }}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={reset}>
            Try Again
          </Button>
          <Button variant="outlined" href="/">
            Go Home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default ErrorBoundary;
