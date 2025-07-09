import { motion } from 'framer-motion'
import { useCourse } from '../hooks/useCourse'
import { useLanguage } from '../hooks/useLanguage'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Button
} from '@chakra-ui/react'
import { 
  FaGraduationCap,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa'

const ProgressPage = () => {
  const { 
    lessons, 
    getProgress, 
    getTotalLessons, 
    getCompletedLessons, 
    watchProgress, 
    isLoading, 
    refreshProgress,
    courseProgress 
  } = useCourse()
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <Container maxW="6xl">
        <Box textAlign="center" py={20}>
          <Heading color="gray.500">Loading progress...</Heading>
        </Box>
      </Container>
    )
  }

  const completedLessons = getCompletedLessons()
  const totalLessons = getTotalLessons()
  const remainingLessons = totalLessons - completedLessons
  const progress = getProgress()
  
  // Calculate estimated completion based on current pace
  const getEstimatedCompletion = () => {
    if (completedLessons === 0) return 'Get started!'
    if (remainingLessons === 0) return 'Completed!'
    
    // Assume 2-3 lessons per week based on remaining lessons
    const weeksRemaining = Math.ceil(remainingLessons / 2.5)
    if (weeksRemaining === 1) return '1 week'
    if (weeksRemaining < 4) return `${weeksRemaining} weeks`
    if (weeksRemaining < 8) return `${Math.ceil(weeksRemaining / 4)} month${Math.ceil(weeksRemaining / 4) > 1 ? 's' : ''}`
    return `${Math.ceil(weeksRemaining / 4)} months`
  }

  const stats = [
    {
      name: 'Total Lessons',
      value: totalLessons,
      icon: FaGraduationCap,
      color: 'blue'
    },
    {
      name: 'Completed',
      value: completedLessons,
      icon: FaCheckCircle,
      color: 'green'
    },
    {
      name: 'Remaining',
      value: remainingLessons,
      icon: FaClock,
      color: 'orange'
    },
    {
      name: 'Estimated Completion',
      value: getEstimatedCompletion(),
      icon: FaCalendarAlt,
      color: 'purple'
    }
  ]

  return (
    <Container maxW="6xl">
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Box p={8}>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading size="xl" color="gray.900">
                  Learning Progress
                </Heading>
                <Button
                  onClick={refreshProgress}
                  variant="outline"
                  size="sm"
                  isLoading={isLoading}
                  loadingText="Refreshing..."
                >
                  Refresh Progress
                </Button>
              </HStack>
              
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} alignItems="center">
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="lg" fontWeight="medium" color="gray.900">
                      Overall Progress
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      {progress}%
                    </Text>
                  </HStack>
                  
                  <Box w="full">
                    <Box bg="gray.200" h="4" borderRadius="full">
                      <Box
                        bg="blue.500"
                        h="full"
                        borderRadius="full"
                        width={`${progress}%`}
                        transition="width 0.3s"
                      />
                    </Box>
                  </Box>
                  
                  <Text color="gray.600">
                    You've completed {completedLessons} out of {totalLessons} lessons.
                    {courseProgress?.formatted_time_spent && (
                      <> Time spent: {courseProgress.formatted_time_spent}.</>
                    )}
                    {' '}Keep up the great work!
                  </Text>
                </VStack>
                
                <Box display="flex" justifyContent="center">
                  <Box position="relative" w={48} h={48}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) 
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <Box
                      position="absolute"
                      inset={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                        {progress}%
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Box>
        </motion.div>

        <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                textAlign="center"
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.100"
                p={6}
              >
                <Box
                  w={12}
                  h={12}
                  bg={`${stat.color}.100`}
                  color={`${stat.color}.600`}
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={stat.icon} w={6} h={6} />
                </Box>
                <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {stat.name}
                </Text>
              </Box>
            </motion.div>
          ))}
        </Grid>

        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Box p={6}>
            <Heading size="lg" color="gray.900" mb={6}>
              Lesson by Lesson Progress
            </Heading>
            
            <VStack spacing={4} align="stretch">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HStack spacing={4} p={4} borderRadius="lg" bg="gray.50">
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={
                        lesson.completed 
                          ? 'green.500' 
                          : lesson.current 
                          ? 'blue.500' 
                          : 'gray.300'
                      }
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {lesson.completed ? (
                        <Icon as={FaCheckCircle} w={5} h={5} />
                      ) : (
                        <Text fontSize="sm" fontWeight="bold">{index + 1}</Text>
                      )}
                    </Box>
                    
                    <VStack align="start" flex={1} spacing={1}>
                      <Text fontWeight="medium" color="gray.900">
                        {lesson.title.en}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {lesson.duration} minutes
                      </Text>
                      {watchProgress[lesson.id] && !lesson.completed && (
                        <Box w="full" mt={2}>
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="xs" color="gray.500">Watch Progress</Text>
                            <Text fontSize="xs" color="blue.600" fontWeight="medium">
                              {Math.round(watchProgress[lesson.id])}%
                            </Text>
                          </HStack>
                          <Box bg="gray.200" h="1.5" borderRadius="full">
                            <Box
                              bg="blue.500"
                              h="full"
                              borderRadius="full"
                              width={`${watchProgress[lesson.id]}%`}
                              transition="width 0.3s"
                            />
                          </Box>
                        </Box>
                      )}
                    </VStack>
                    
                    <VStack align="end" spacing={1}>
                      <Badge
                        colorScheme={
                          lesson.completed 
                            ? 'green' 
                            : lesson.current 
                            ? 'blue' 
                            : 'gray'
                        }
                      >
                        {lesson.completed ? 'Completed' : lesson.current ? 'Current' : 'Locked'}
                      </Badge>
                      {lesson.completed && (
                        <Text fontSize="xs" color="green.600">
                          100% watched
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </motion.div>
              ))}
            </VStack>
          </Box>
        </Box>
      </VStack>
    </Container>
  )
}

export default ProgressPage