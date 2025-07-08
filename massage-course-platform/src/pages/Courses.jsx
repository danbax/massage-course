import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useModules, useProgressOverview } from '../hooks/useApi'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  Spinner,
  Alert,
  Flex
} from '@chakra-ui/react'
import { 
  FaPlay,
  FaCheck,
  FaClock,
  FaVideo,
  FaGraduationCap,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
  FaLock
} from 'react-icons/fa'

const Courses = () => {
  const navigate = useNavigate()
  const [expandedModules, setExpandedModules] = useState({ 0: true })
  
  // Fetch modules and progress data from API
  const { data: modules, isLoading: modulesLoading, error: modulesError } = useModules()
  const { data: progressData, isLoading: progressLoading, error: progressError } = useProgressOverview()
  
  const isLoading = modulesLoading || progressLoading
  const hasError = modulesError || progressError
  
  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    )
  }

  if (hasError) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert.Root status="error">
          <Alert.Icon />
          <Alert.Title>Failed to load course content. Please try again.</Alert.Title>
        </Alert.Root>
      </Container>
    )
  }

  const completedLessons = (Array.isArray(modules) ? modules : []).reduce((total, module) => 
    total + (module.lessons || []).filter(lesson => lesson.progress?.is_completed).length, 0
  )
  
  const totalLessons = (Array.isArray(modules) ? modules : []).reduce((total, module) => 
    total + (module.lessons || []).length, 0
  )
  
  const totalDuration = (Array.isArray(modules) ? modules : []).reduce((total, module) => 
    total + (module.lessons || []).reduce((moduleTotal, lesson) => 
      moduleTotal + (lesson.duration || 0), 0
    ), 0
  )
  
  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  
  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }))
  }
  
  const handleLessonClick = (lesson) => {
    if (!Array.isArray(modules)) return
    
    // Check if lesson is available (current or previous lessons completed)
    const moduleIndex = modules.findIndex(m => m.lessons && m.lessons.some(l => l.id === lesson.id))
    if (moduleIndex === -1) return
    
    const lessonIndex = modules[moduleIndex].lessons.findIndex(l => l.id === lesson.id)
    if (lessonIndex === -1) return
    
    // Allow access if it's the first lesson or if previous lessons are completed
    const canAccess = lessonIndex === 0 || modules[moduleIndex].lessons
      .slice(0, lessonIndex)
      .every(prevLesson => prevLesson.progress?.is_completed)
    
    if (canAccess) {
      navigate(`/app/video/${lesson.id}`)
    }
  }

  const getLessonStatus = (lesson, moduleIndex, lessonIndex) => {
    if (lesson.progress?.is_completed) return 'completed'
    
    // Check if lesson is accessible
    if (!Array.isArray(modules) || !modules[moduleIndex]) return 'locked'
    
    const module = modules[moduleIndex]
    const canAccess = lessonIndex === 0 || (module.lessons && module.lessons
      .slice(0, lessonIndex)
      .every(prevLesson => prevLesson.progress?.is_completed))
    
    return canAccess ? 'available' : 'locked'
  }

  return (
    <Container maxW="7xl">
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box 
            bg="linear-gradient(135deg, #0ea5e9, #a855f7)" 
            color="white"
            borderRadius="xl"
            boxShadow="lg"
            overflow="hidden"
          >
            <Box p={8}>
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} alignItems="center">
                <VStack align="start" spacing={4}>
                  <Heading size="xl">
                    Professional Relaxation Massage Therapy Course
                  </Heading>
                  <Text fontSize="lg" color="blue.100">
                    From Zero to Hero - Complete Professional Training
                  </Text>
                  
                  <HStack spacing={6} pt={2}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold">{totalLessons}</Text>
                      <Text fontSize="sm" color="blue.200">Total Lessons</Text>
                    </VStack>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold">{completedLessons}</Text>
                      <Text fontSize="sm" color="blue.200">Completed</Text>
                    </VStack>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</Text>
                      <Text fontSize="sm" color="blue.200">Total Time</Text>
                    </VStack>
                  </HStack>
                </VStack>
                
                <VStack spacing={4}>
                  <Box w="full" textAlign="center">
                    <Text fontSize="4xl" fontWeight="bold">{Math.round(progressData?.completion_percentage || 0)}%</Text>
                    <Text color="blue.200">Course Complete</Text>
                  </Box>
                  <Box w="full" bg="blue.600" borderRadius="full" h="3">
                    <Box 
                      bg="whiteAlpha.800" 
                      h="full" 
                      borderRadius="full"
                      width={`${progressData?.completion_percentage || 0}%`}
                      transition="width 0.3s"
                    />
                  </Box>
                </VStack>
              </Grid>
            </Box>
          </Box>
        </motion.div>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <VStack spacing={6} align="stretch">
            <Heading size="lg" color="gray.900">
              Course Modules
            </Heading>
            
            <VStack spacing={4}>
              {modules?.map((module, moduleIndex) => {
                const lessons = module.lessons || []
                const moduleProgress = lessons.filter(l => l.progress?.is_completed).length / lessons.length * 100
                const moduleCompleted = lessons.filter(l => l.progress?.is_completed).length
                const isExpanded = expandedModules[moduleIndex]
                
                return (
                  <Box key={module.id} border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white">
                    <Button
                      variant="ghost"
                      w="full"
                      justifyContent="flex-start"
                      p={6}
                      h="auto"
                      borderRadius="xl"
                      _hover={{ bg: "gray.50" }}
                      onClick={() => toggleModule(moduleIndex)}
                    >
                      <Box flex="1" textAlign="left">
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                              Module {module.id}
                            </Text>
                            <Heading size="md" color="gray.900">
                              {module.name}
                            </Heading>
                            <HStack spacing={4} fontSize="sm" color="gray.500">
                              <HStack spacing={1}>
                                <Icon as={FaBookOpen} w={3} h={3} />
                                <Text>{lessons.length} lessons</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <Icon as={FaClock} w={3} h={3} />
                                <Text>{lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)} min</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                          <VStack align="end" spacing={2}>
                            <Badge
                              colorScheme={moduleProgress === 100 ? 'green' : moduleProgress > 0 ? 'blue' : 'gray'}
                              fontSize="xs"
                            >
                              {moduleCompleted}/{lessons.length} completed
                            </Badge>
                            <Box w="20" bg="gray.200" borderRadius="full" h="1">
                              <Box
                                bg={moduleProgress === 100 ? "green.500" : "blue.500"}
                                h="full"
                                borderRadius="full"
                                width={`${moduleProgress}%`}
                                transition="width 0.3s"
                              />
                            </Box>
                            <Icon as={isExpanded ? FaChevronUp : FaChevronDown} w={4} h={4} color="gray.400" />
                          </VStack>
                        </HStack>
                      </Box>
                    </Button>
                    
                    {isExpanded && (
                      <Box pb={4} pt={0} px={6}>
                      <VStack spacing={3} align="stretch">
                        {lessons.map((lesson, lessonIndex) => {
                          const status = getLessonStatus(lesson, moduleIndex, lessonIndex)
                          
                          return (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                            >
                              <Box
                                cursor={status === 'locked' ? 'not-allowed' : 'pointer'}
                                opacity={status === 'locked' ? 0.6 : 1}
                                _hover={status !== 'locked' ? { 
                                  transform: 'translateY(-1px)', 
                                  boxShadow: 'md' 
                                } : {}}
                                transition="all 0.2s"
                                onClick={() => handleLessonClick(lesson)}
                                borderWidth="1px"
                                borderColor={
                                  status === 'completed' ? 'green.200' : 
                                  status === 'locked' ? 'gray.200' : 'blue.200'
                                }
                                bg={
                                  status === 'completed' ? 'green.50' : 
                                  status === 'locked' ? 'gray.50' : 'blue.50'
                                }
                                borderRadius="lg"
                                ml={4}
                              >
                                <Box p={4}>
                                  <HStack spacing={3}>
                                    <Box
                                      w={8}
                                      h={8}
                                      borderRadius="lg"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      bg={
                                        status === 'completed' ? 'green.100' : 
                                        status === 'locked' ? 'gray.100' : 'blue.100'
                                      }
                                      color={
                                        status === 'completed' ? 'green.600' : 
                                        status === 'locked' ? 'gray.600' : 'blue.600'
                                      }
                                    >
                                      {status === 'completed' ? (
                                        <Icon as={FaCheck} w={4} h={4} />
                                      ) : status === 'locked' ? (
                                        <Icon as={FaLock} w={3} h={3} />
                                      ) : (
                                        <Icon as={FaPlay} w={3} h={3} />
                                      )}
                                    </Box>
                                    
                                    <VStack align="start" flex={1} spacing={1}>
                                      <Text fontWeight="medium" color="gray.900" fontSize="sm">
                                        {lesson.title}
                                      </Text>
                                      <HStack spacing={3} fontSize="xs" color="gray.500">
                                        <HStack spacing={1}>
                                          <Icon as={FaClock} w={2} h={2} />
                                          <Text>{lesson.duration} min</Text>
                                        </HStack>
                                        <HStack spacing={1}>
                                          <Icon as={FaVideo} w={2} h={2} />
                                          <Text>HD Video</Text>
                                        </HStack>
                                      </HStack>
                                    </VStack>
                                    
                                    <Button
                                      size="xs"
                                      colorScheme={status === 'completed' ? 'green' : 'blue'}
                                      variant={status === 'completed' ? 'outline' : 'solid'}
                                    >
                                      {status === 'completed' ? 'Rewatch' : 'Start'}
                                    </Button>
                                  </HStack>
                                </Box>
                              </Box>
                            </motion.div>
                          )
                        })}
                      </VStack>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </VStack>
          </VStack>

          <VStack spacing={6} align="stretch">
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box p={6}>
                <Heading size="md" color="gray.900" mb={4}>
                  Quick Actions
                </Heading>
                <VStack spacing={3} align="stretch">
                  <Button
                    leftIcon={<FaPlay />}
                    bg="blue.50"
                    color="blue.700"
                    _hover={{ bg: "blue.100" }}
                    justifyContent="flex-start"
                    onClick={() => {
                      const nextLesson = lessons.find(l => !l.completed) || lessons[0]
                      if (nextLesson) {
                        navigate(`/app/video/${nextLesson.id}`)
                      }
                    }}
                  >
                    Continue Learning
                  </Button>
                  <Button
                    leftIcon={<FaGraduationCap />}
                    bg="purple.50"
                    color="purple.700"
                    _hover={{ bg: "purple.100" }}
                    justifyContent="flex-start"
                    onClick={() => navigate('/app/certificates')}
                  >
                    View Certificates
                  </Button>
                  <Button
                    leftIcon={<FaCheck />}
                    bg="green.50"
                    color="green.700"
                    _hover={{ bg: "green.100" }}
                    justifyContent="flex-start"
                    onClick={() => navigate('/app/progress')}
                  >
                    Track Progress
                  </Button>
                </VStack>
              </Box>
            </Box>

            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box p={6}>
                <Heading size="md" color="gray.900" mb={4}>
                  Course Progress
                </Heading>
                <VStack spacing={4}>
                  <Box w="full">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">Overall Progress</Text>
                      <Text fontSize="sm" fontWeight="medium">{progressPercentage}%</Text>
                    </HStack>
                    <Box bg="gray.200" borderRadius="full" h="3">
                      <Box 
                        bg="blue.500" 
                        h="full" 
                        borderRadius="full"
                        width={`${progressPercentage}%`}
                        transition="width 0.3s"
                      />
                    </Box>
                  </Box>
                  
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                    <Box textAlign="center" p={3} bg="blue.50" borderRadius="lg">
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {completedLessons}
                      </Text>
                      <Text fontSize="sm" color="blue.600">Completed</Text>
                    </Box>
                    <Box textAlign="center" p={3} bg="orange.50" borderRadius="lg">
                      <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                        {totalLessons - completedLessons}
                      </Text>
                      <Text fontSize="sm" color="orange.600">Remaining</Text>
                    </Box>
                  </Grid>

                  <Box w="full" h="1px" bg="gray.200" />

                  <VStack spacing={2} w="full">
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">Module Progress</Text>
                    {(Array.isArray(modules) ? modules : []).map(module => {
                      const moduleProgress = (module.lessons || []).filter(l => l.progress?.is_completed).length / (module.lessons || []).length * 100
                      return (
                        <Box key={module.id} w="full">
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="xs" color="gray.600">Module {module.id}</Text>
                            <Text fontSize="xs" color="gray.600">{Math.round(moduleProgress)}%</Text>
                          </HStack>
                          <Box bg="gray.200" borderRadius="full" h="1">
                            <Box 
                              bg={moduleProgress === 100 ? "green.500" : "blue.500"}
                              h="full" 
                              borderRadius="full"
                              width={`${moduleProgress}%`}
                              transition="width 0.3s"
                            />
                          </Box>
                        </Box>
                      )
                    })}
                  </VStack>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </Grid>
      </VStack>
    </Container>
  )
}

export default Courses
