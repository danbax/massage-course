import { motion } from 'framer-motion'
import { Box } from '@chakra-ui/react'
import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  variant = 'elevated',
  size = 'md',
  className = '',
  animate = true,
  hover = true,
  ...props 
}, ref) => {
  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: 'var(--radius-2xl)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    }

    const sizes = {
      sm: { p: 4 },
      md: { p: 6 },
      lg: { p: 8 },
      xl: { p: 10 },
    }

    const variants = {
      elevated: {
        bg: 'white',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid',
        borderColor: 'gray.100',
        _hover: hover ? {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--shadow-xl)',
          borderColor: 'primary.200',
        } : {},
      },
      glass: {
        bg: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: 'var(--shadow-lg)',
        _hover: hover ? {
          transform: 'translateY(-2px)',
          bg: 'rgba(255, 255, 255, 0.98)',
          boxShadow: 'var(--shadow-xl)',
        } : {},
      },
      gradient: {
        bg: 'var(--gradient-primary)',
        color: 'white',
        boxShadow: 'var(--shadow-glow)',
        _hover: hover ? {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: 'var(--shadow-glow-purple)',
        } : {},
      },
      outline: {
        bg: 'transparent',
        border: '2px solid',
        borderColor: 'gray.200',
        _hover: hover ? {
          borderColor: 'primary.300',
          bg: 'primary.50',
          transform: 'translateY(-2px)',
        } : {},
      },
      subtle: {
        bg: 'gray.50',
        border: '1px solid',
        borderColor: 'gray.200',
        _hover: hover ? {
          bg: 'white',
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-2px)',
        } : {},
      },
    }

    return {
      ...baseStyles,
      ...sizes[size],
      ...variants[variant],
    }
  }

  const MotionBox = motion(Box)

  const cardComponent = (
    <MotionBox
      ref={ref}
      className={`${className} card-component`}
      sx={getCardStyles()}
      initial={animate ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={animate ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={animate && hover ? { y: -2 } : {}}
      transition={animate ? { duration: 0.3, ease: "easeOut" } : {}}
      {...props}
    >
      {children}
    </MotionBox>
  )

  return cardComponent
})

Card.displayName = 'Card'

export default Card
