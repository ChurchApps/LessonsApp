import React, { ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface SimpleCarouselProps {
  children: ReactNode[];
  index: number;
  height?: string;
  autoPlay?: boolean;
  fullHeightHover?: boolean;
  navButtonsAlwaysVisible?: boolean;
  next?: (index: number) => void;
}

export function SimpleCarousel({
  children,
  index,
  height = '400px',
  autoPlay = false,
  fullHeightHover = false,
  navButtonsAlwaysVisible = false,
  next
}: SimpleCarouselProps) {
  const handlePrevious = () => {
    const newIndex = index > 0 ? index - 1 : children.length - 1;
    next?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = index < children.length - 1 ? index + 1 : 0;
    next?.(newIndex);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Content */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          transform: `translateX(-${index * 100}%)`,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {children.map((child, i) => (
          <Box
            key={i}
            sx={{
              minWidth: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      {/* Navigation Buttons */}
      {(navButtonsAlwaysVisible || children.length > 1) && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <ArrowForward />
          </IconButton>
        </>
      )}
    </Box>
  );
}