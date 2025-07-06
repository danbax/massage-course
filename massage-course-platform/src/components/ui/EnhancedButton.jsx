import { motion } from 'framer-motion'
import { Button as ChakraButton } from '@chakra-ui/react'
import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  className = '',
  animate = true,
  ...props 
}, ref) => {
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: 'var(--radius-xl)',
      fontWeight: '600',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        transition: 'left 0.5s',
      },
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: 'var(--shadow-lg)',
        _before: {
          left: '100%',
        },
      },
      _active: {
        transform: 'translateY(0px)',
      },
    }

    const variants = {
      solid: {
        bg: colorScheme === 'primary' ? 'var(--gradient-primary)' : `${colorScheme}.500`,
        color: 'white',
        _hover: {
          ...baseStyles._hover,
          boxShadow: colorScheme === 'primary' ? 'var(--shadow-glow)' : 'var(--shadow-lg)',
        },
      },
      outline: {
        border: '2px solid',
        borderColor: `${colorScheme}.300`,
        color: `${colorScheme}.600`,
        bg: 'transparent',
        _hover: {
          ...baseStyles._hover,
          bg: `${colorScheme}.50`,
          borderColor: `${colorScheme}.400`,
        },
      },
      ghost: {
        bg: 'transparent',
        color: `${colorScheme}.600`,
        _hover: {
          ...baseStyles._hover,
          bg: `${colorScheme}.50`,
        },
      },
      gradient: {
        bg: 'var(--gradient-primary)',
        color: 'white',
        _hover: {
          ...baseStyles._hover,
          boxShadow: 'var(--shadow-glow)',
          transform: 'translateY(-3px) scale(1.02)',
        },
      },
    }

    return {
      ...baseStyles,
      ...variants[variant],
    }
  }

  const MotionButton = motion(ChakraButton)

  const buttonComponent = (
    <MotionButton
      ref={ref}
      variant="unstyled"
      size={size}
      isLoading={isLoading}
      loadingText={loadingText}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={`${className} ${animate ? 'button-animate' : ''}`}
      sx={getButtonStyles()}
      whileHover={animate ? { scale: 1.02 } : {}}
      whileTap={animate ? { scale: 0.98 } : {}}
      initial={animate ? { opacity: 0, y: 10 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={animate ? { duration: 0.2 } : {}}
      {...props}
    >
      {children}
    </MotionButton>
  )

  return buttonComponent
})

Button.displayName = 'Button'

export default Button
