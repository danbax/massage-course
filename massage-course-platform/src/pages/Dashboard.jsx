import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCurrentUser, useProgressOverview, useProgressAnalytics } from '../hooks/useApi'
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
  Button,
  Flex,
  Spinner,
  Alert
} from '@chakra-ui/react'
import { 
  FaPlayCircle,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaFire,
  FaBookOpen,
  FaPlay
} from 'react-icons/fa'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Fetch user data and progress
  const { data: userData, isLoading: userLoading, error: userError } = useCurrentUser()
  const { data: progressData, isLoading: progressLoading, error: progressError } = useProgressOverview()
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useProgressAnalytics()

  const isLoading = userLoading || progressLoading || analyticsLoading
  const hasError = userError || progressError || analyticsError

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
          Failed to load dashboard data. Please try again.
        </Alert>
      </Container>
    )
  }

  const stats = [
    {
      name: 'Lessons Completed',
      value: progressData?.completed_lessons || 0,
      icon: FaPlayCircle,
      color: 'blue',
      change: analytics?.weekly_lessons_completed ? `+${analytics.weekly_lessons_completed} this week` : 'No progress this week'
    },
    {
      name: 'Study Time',
      value: `${Math.round((analytics?.total_time_spent || 0) / 60)}h`,
      icon: FaClock,
      color: 'purple',
      change: analytics?.weekly_time_spent ? `+${Math.round(analytics.weekly_time_spent / 60)}h this week` : 'No study time this week'
    },
    {
      name: 'Progress',
      value: `${Math.round(progressData?.completion_percentage || 0)}%`,
      icon: FaChartLine,
      color: 'green',
      change: analytics?.weekly_progress_increase ? `+${analytics.weekly_progress_increase}% this week` : 'No progress this week'
    },
    {
      name: 'Certificates',
      value: userData?.certificates_count || 0,
      icon: FaTrophy,
      color: 'orange',
      change: progressData?.is_completed ? 'Certificate available' : 'Complete course to earn'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: 'Started your massage learning journey',
      time: 'Today',
      icon: FaPlayCircle,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Enrolled in Professional Massage Course',
      time: 'Today',
      icon: FaBookOpen,
      color: 'green'
    }
  ]

  const handleContinueLearning = () => {
    if (modules.length > 0) {
      const firstModule = modules[0]
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        const nextLesson = firstModule.lessons.find(lesson => !lesson.progress?.is_completed) || firstModule.lessons[0]
        navigate(`/app/video/${nextLesson.id}`)
      } else {
        navigate('/app/courses')
      }
    } else {
      navigate('/app/courses')
    }
  }

  return (
    <Container maxW="7xl">
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card bg="linear-gradient(135deg, #0ea5e9, #a855f7)" color="white">
            <CardBody p={8}>
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <Heading size="lg">
                    Welcome back, {user?.name}! 👋
                  </Heading>
                  <Text color="blue.100">
                    Ready to continue your massage therapy journey?
                  </Text>
                </VStack>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Icon as={FaFire} w={16} h={16} color="orange.300" display={{ base: "none", md: "block" }} />
                </motion.div>
              </Flex>

              <Box mt={6}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">Overall Progress</Text>
                  <Text fontSize="sm" fontWeight="medium">{completionPercentage}%</Text>
                </Flex>
                <Progress value={completionPercentage} colorScheme="whiteAlpha" bg="blue.600" />
              </Box>
            </CardBody>
          </Card>
        </motion.div>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }} transition="all 0.3s">
                <CardBody p={6}>
                  <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        {stat.name}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                        {stat.value}
                      </Text>
                      <Text fontSize="xs" color="green.600">
                        {stat.change}
                      </Text>
                    </VStack>
                    <Box
                      w={12}
                      h={12}
                      bg={`${stat.color}.100`}
                      color={`${stat.color}.600`}
                      borderRadius="xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={stat.icon} w={6} h={6} />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <Card>
            <CardBody p={6}>
              <Heading size="md" color="gray.900" mb={6}>
                Recent Activity
              </Heading>
              <VStack spacing={4} align="stretch">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HStack spacing={4} p={4} borderRadius="lg" _hover={{ bg: "gray.50" }} transition="colors">
                      <Box
                        w={10}
                        h={10}
                        borderRadius="full"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={`${activity.color}.500`}
                      >
                        <Icon as={activity.icon} w={5} h={5} />
                      </Box>
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {activity.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {activity.time}
                        </Text>
                      </VStack>
                    </HStack>
                  </motion.div>
                ))}
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody p={6}>
              <Heading size="md" color="gray.900" mb={6}>
                Quick Actions
              </Heading>
              <VStack spacing={3} align="stretch">
                <Button
                  leftIcon={<FaPlay />}
                  bg="blue.50"
                  color="blue.700"
                  _hover={{ bg: "blue.100" }}
                  justifyContent="flex-start"
                  p={3}
                  onClick={handleContinueLearning}
                >
                  Continue Learning
                </Button>
                <Button
                  leftIcon={<FaBookOpen />}
                  bg="purple.50"
                  color="purple.700"
                  _hover={{ bg: "purple.100" }}
                  justifyContent="flex-start"
                  p={3}
                  onClick={() => navigate('/app/courses')}
                >
                  View All Courses
                </Button>
                <Button
                  leftIcon={<FaTrophy />}
                  bg="green.50"
                  color="green.700"
                  _hover={{ bg: "green.100" }}
                  justifyContent="flex-start"
                  p={3}
                  onClick={() => navigate('/app/certificates')}
                >
                  View Certificates
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Container>
  )
}

export default Dashboard