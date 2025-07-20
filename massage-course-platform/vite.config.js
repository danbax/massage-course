// vite.config.js - Fixed version to prevent circular dependencies
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Handle node_modules with better dependency resolution
          if (id.includes('node_modules')) {
            
            // Keep React ecosystem together to avoid circular deps
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor'
            }
            
            // Keep React Router separate
            if (id.includes('react-router')) {
              return 'react-router'
            }
            
            // IMPORTANT: Keep all Chakra UI and Emotion together to prevent circular deps
            if (id.includes('@chakra-ui') || 
                id.includes('@emotion') ||
                id.includes('@ark-ui') ||
                id.includes('@zag-js')) {
              return 'chakra-vendor'
            }
            
            // Keep animation libraries together
            if (id.includes('framer-motion')) {
              return 'animation-vendor'
            }
            
            // Icons
            if (id.includes('react-icons')) {
              return 'icons-vendor'
            }
            
            // i18n
            if (id.includes('react-i18next') || id.includes('i18next')) {
              return 'i18n-vendor'
            }
            
            // Utils (only if you actually use these)
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('uuid')) {
              return 'utils-vendor'
            }
            
            // PDF (lazy load this)
            if (id.includes('pdf') || id.includes('jspdf')) {
              return 'pdf-vendor'
            }
            
            // Everything else together to prevent splitting issues
            return 'vendor'
          }
          
          // Your app code - be more conservative with splitting
          if (id.includes('/pages/')) {
            return 'pages'
          }
          
          if (id.includes('/components/')) {
            return 'components'
          }
          
          if (id.includes('/hooks/')) {
            return 'hooks'
          }
          
          // Default
          return 'app'
        },
        
        // Ensure proper chunk loading order
        manualChunks: undefined, // Let Rollup handle some automatic chunking
      }
    },
    
    // Important: Use more conservative settings for production
    target: 'es2020', // More compatible than 'esnext'
    minify: 'terser', // Better than esbuild for production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Don't be too aggressive with optimization
        unsafe: false,
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_methods: false,
      },
      mangle: {
        // Conservative mangling to prevent variable conflicts
        reserved: ['P', 'React', 'ReactDOM'],
        safari10: true,
      },
      format: {
        // Preserve some formatting to avoid issues
        comments: false,
        semicolons: true,
      }
    },
    
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    
    // Important: Ensure proper module resolution
    rollupOptions: {
      external: [],
      output: {
        // Simpler chunking strategy
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chakra-vendor': ['@chakra-ui/react'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['react-icons'],
        }
      }
    }
  },
  
  // Ensure proper dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@chakra-ui/react',
      'framer-motion',
      'react-icons',
    ],
    // Force include Chakra UI dependencies
    force: true
  },
  
  // Ensure proper ESM handling
  esbuild: {
    target: 'es2020',
    format: 'esm',
    platform: 'browser'
  }
})