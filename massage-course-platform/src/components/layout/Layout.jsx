import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  if (isLoading) {
    return (
      <Box 
        h="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.50"
      >
        Loading...
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Flex h="100vh" bg="gray.50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <Flex
        flex={1}
        direction="column"
        overflow="hidden"
        transition="all 0.3s"
        ml={sidebarOpen && !isMobile ? "320px" : "0"}
      >
        <Box flex={1} overflow="auto" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

export default Layout