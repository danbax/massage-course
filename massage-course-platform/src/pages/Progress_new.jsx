import { motion } from 'framer-motion'
import { useProgressOverview, useProgressAnalytics, useProgressCourse } from '../hooks/useApi'
import {
  Box,
  Container,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Icon,
  Badge,
  Spinner,
  Alert,
  Flex
} from '@chakra-ui/react'
import { 
  FaChartLine,
  FaClock,
  FaTrophy,
  FaFire,
  FaBookOpen,
  FaPlay,
  FaCheck,
  FaCalendar,
  FaAward,
  FaTarget
} from 'react-icons/fa'

const ProgressPage = () => {
  // Fetch progress data from API
  const { data: overallProgress, isLoading: overallLoading, error: overallError } = useProgressOverview()
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useProgressAnalytics()
  const { data: courseProgress, isLoading: courseLoading, error: courseError } = useProgressCourse()

  const isLoading = overallLoading || analyticsLoading || courseLoading
  const hasError = overallError || analyticsError || courseError

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
        <Alert status="error">
          <Alert.Icon />
          Failed to load progress data. Please try again.
        </Alert>
      </Container>
    )
  }

  const streakData = {
    current: analytics?.current_streak || 0,
    longest: analytics?.longest_streak || 0,
    lastActivity: analytics?.last_activity_date || null
  }

  const timeData = {
    totalMinutes: analytics?.total_time_spent || 0,
    weeklyMinutes: analytics?.weekly_time_spent || 0,
    averageSessionMinutes: analytics?.average_session_length || 0
  }

  const performanceData = {
    averageQuizScore: analytics?.average_quiz_score || 0,
    totalQuizzes: analytics?.total_quizzes_completed || 0,
    passedQuizzes: analytics?.quizzes_passed || 0
  }

  const mainStats = [
    {
      name: 'Overall Progress',
      value: `${Math.round(overallProgress?.completion_percentage || 0)}%`,
      icon: FaChartLine,
      color: 'blue',
      description: `${overallProgress?.completed_lessons || 0} of ${overallProgress?.total_lessons || 0} lessons completed`
    },
    {
      name: 'Study Time',
      value: `${Math.round(timeData.totalMinutes / 60)}h`,
      icon: FaClock,
      color: 'purple',
      description: `${Math.round(timeData.weeklyMinutes / 60)}h this week`
    },
    {
      name: 'Current Streak',
      value: `${streakData.current} days`,
      icon: FaFire,
      color: 'orange',
      description: `Longest: ${streakData.longest} days`
    },
    {
      name: 'Quiz Average',
      value: `${Math.round(performanceData.averageQuizScore)}%`,
      icon: FaTarget,
      color: 'green',
      description: `${performanceData.passedQuizzes}/${performanceData.totalQuizzes} passed`
    }
  ]

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heading size="xl" color="gray.900">
            Your Learning Progress
          </Heading>
          <Text color="gray.600" mt={2}>
            Track your journey through the Professional Massage Course
          </Text>
        </motion.div>

        {/* Main Stats Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
          {mainStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card.Root>
                <CardBody p={6}>
                  <VStack align="start" spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Box
                        w={12}
                        h={12}
                        bg={`${stat.color}.100`}
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={stat.icon} w={6} h={6} color={`${stat.color}.600`} />
                      </Box>
                    </HStack>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                        {stat.value}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {stat.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {stat.description}
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card.Root>
            </motion.div>
          ))}
        </Grid>

        {/* Progress Overview */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card.Root>
              <CardBody p={6}>
                <VStack align="stretch" spacing={6}>
                  <Heading size="md" color="gray.900">
                    Course Progress Details
                  </Heading>
                  
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">Overall Completion</Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.900">
                        {Math.round(overallProgress?.completion_percentage || 0)}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={overallProgress?.completion_percentage || 0} 
                      size="lg" 
                      colorScheme="blue"
                      borderRadius="full"
                    />
                  </Box>

                  {courseProgress?.modules?.map((module, index) => (
                    <Box key={module.id}>
                      <HStack justify="space-between" mb={2}>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.900">
                            {module.title}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {module.completed_lessons}/{module.total_lessons} lessons
                          </Text>
                        </VStack>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {Math.round(module.completion_percentage)}%
                        </Text>
                      </HStack>
                      <Progress 
                        value={module.completion_percentage} 
                        size="sm" 
                        colorScheme={module.completion_percentage === 100 ? "green" : "blue"}
                        borderRadius="full"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card.Root>
          </motion.div>

          <VStack spacing={6}>
            {/* Learning Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ width: '100%' }}
            >
              <Card.Root>
                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md" color="gray.900">
                      Learning Analytics
                    </Heading>
                    
                    <VStack spacing={4}>
                      <HStack justify="space-between" w="full">
                        <HStack spacing={3}>
                          <Icon as={FaClock} w={4} h={4} color="purple.500" />
                          <Text fontSize="sm" color="gray.600">Average Session</Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {Math.round(timeData.averageSessionMinutes)} min
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between" w="full">
                        <HStack spacing={3}>
                          <Icon as={FaCalendar} w={4} h={4} color="blue.500" />
                          <Text fontSize="sm" color="gray.600">Last Activity</Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {streakData.lastActivity ? new Date(streakData.lastActivity).toLocaleDateString() : 'No activity'}
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between" w="full">
                        <HStack spacing={3}>
                          <Icon as={FaAward} w={4} h={4} color="green.500" />
                          <Text fontSize="sm" color="gray.600">Quiz Success Rate</Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {performanceData.totalQuizzes > 0 
                            ? Math.round((performanceData.passedQuizzes / performanceData.totalQuizzes) * 100)
                            : 0}%
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card.Root>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{ width: '100%' }}
            >
              <Card.Root>
                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md" color="gray.900">
                      Achievements
                    </Heading>
                    
                    <VStack spacing={3}>
                      <HStack justify="space-between" w="full" p={3} bg="green.50" borderRadius="lg">
                        <HStack spacing={3}>
                          <Icon as={FaFire} w={4} h={4} color="orange.500" />
                          <Text fontSize="sm" color="gray.700">Learning Streak</Text>
                        </HStack>
                        <Badge colorScheme="orange" size="sm">
                          {streakData.current} days
                        </Badge>
                      </HStack>
                      
                      {overallProgress?.completion_percentage >= 25 && (
                        <HStack justify="space-between" w="full" p={3} bg="blue.50" borderRadius="lg">
                          <HStack spacing={3}>
                            <Icon as={FaBookOpen} w={4} h={4} color="blue.500" />
                            <Text fontSize="sm" color="gray.700">Quarter Complete</Text>
                          </HStack>
                          <Badge colorScheme="blue" size="sm">
                            Unlocked
                          </Badge>
                        </HStack>
                      )}
                      
                      {overallProgress?.completion_percentage >= 50 && (
                        <HStack justify="space-between" w="full" p={3} bg="purple.50" borderRadius="lg">
                          <HStack spacing={3}>
                            <Icon as={FaTarget} w={4} h={4} color="purple.500" />
                            <Text fontSize="sm" color="gray.700">Halfway Hero</Text>
                          </HStack>
                          <Badge colorScheme="purple" size="sm">
                            Unlocked
                          </Badge>
                        </HStack>
                      )}
                      
                      {overallProgress?.completion_percentage >= 100 && (
                        <HStack justify="space-between" w="full" p={3} bg="green.50" borderRadius="lg">
                          <HStack spacing={3}>
                            <Icon as={FaTrophy} w={4} h={4} color="green.500" />
                            <Text fontSize="sm" color="gray.700">Course Master</Text>
                          </HStack>
                          <Badge colorScheme="green" size="sm">
                            Unlocked
                          </Badge>
                        </HStack>
                      )}
                    </VStack>
                  </VStack>
                </CardBody>
              </Card.Root>
            </motion.div>
          </VStack>
        </Grid>
      </VStack>
    </Container>
  )
}

export default ProgressPage
