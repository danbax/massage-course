import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { useCurrentUser, useProgressOverview, useProgressAnalytics } from '../hooks/useApi'
import {
  Box,
  Container,
  Grid,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Button,
  Flex,
  Spinner,
  Alert,
  Icon
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
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  
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
    const errorObj = userError || progressError || analyticsError || {};
    const errorMsg = errorObj.message || '';
    const errorStatus = errorObj.status || errorObj.code || errorObj.statusCode;
    const isAuthError = errorMsg.toLowerCase().includes('unauth') || errorMsg.includes('401') || errorStatus === 401;
    if (!isAuthError || isAuthenticated) {
      return (
        <Container maxW="7xl" py={8}>
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>Failed to load dashboard data. Please try again.</Alert.Title>
          </Alert.Root>
        </Container>
      )
    }
    return null;
  }

  const stats = [
    {
      name: t('dashboard.stats.lessonsCompleted'),
      value: progressData?.completed_lessons || 0,
      icon: FaPlayCircle,
      color: 'blue',
      change: analytics?.weekly_lessons_completed ? t('dashboard.stats.weeklyProgress', { count: analytics.weekly_lessons_completed }) : t('dashboard.stats.noProgressWeek')
    },
    {
      name: t('dashboard.stats.studyTime'),
      value: `${Math.round((analytics?.total_time_spent || 0) / 60)}h`,
      icon: FaClock,
      color: 'purple',
      change: analytics?.weekly_time_spent ? t('dashboard.stats.weeklyProgress', { count: `${Math.round(analytics.weekly_time_spent / 60)}h` }) : t('dashboard.stats.noProgressWeek')
    },
    {
      name: t('dashboard.stats.progress'),
      value: `${Math.round(progressData?.completion_percentage || 0)}%`,
      icon: FaChartLine,
      color: 'green',
      change: analytics?.weekly_progress_increase ? t('dashboard.stats.weeklyProgress', { count: `${analytics.weekly_progress_increase}%` }) : t('dashboard.stats.noProgressWeek')
    },
    {
      name: t('dashboard.stats.certificates'),
      value: userData?.certificates_count || 0,
      icon: FaTrophy,
      color: 'orange',
      change: progressData?.is_completed ? t('dashboard.stats.certificateAvailable') : t('dashboard.stats.completeForCertificate')
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: t('dashboard.recentActivity.startedJourney'),
      time: t('dashboard.recentActivity.today'),
      icon: FaPlayCircle,
      color: 'blue'
    },
    {
      id: 2,
      title: t('dashboard.recentActivity.enrolledInCourse'),
      time: t('dashboard.recentActivity.today'),
      icon: FaBookOpen,
      color: 'green'
    }
  ]

  const handleContinueLearning = () => {
    if (modules && modules.length > 0) {
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

  const completionPercentage = Math.round(progressData?.completion_percentage || 0)

  return (
    <Container maxW="7xl">
      <VStack gap={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card.Root bg="linear-gradient(135deg, #0ea5e9, #a855f7)" color="white">
            <Card.Body p={8}>
              <Flex justify="space-between" align="center">
                <VStack align="start" gap={2}>
                  <Heading size="lg">
                    {t('dashboard.welcomeBack')}, {user?.name}! 👋
                  </Heading>
                  <Text color="blue.100">
                    {t('dashboard.subtitle')}
                  </Text>
                </VStack>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Icon color="orange.300" display={{ base: "none", md: "block" }}>
                    <FaFire size="64px" />
                  </Icon>
                </motion.div>
              </Flex>

              <Box mt={6}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">{t('dashboard.overallProgress')}</Text>
                  <Text fontSize="sm" fontWeight="medium">{completionPercentage}%</Text>
                </Flex>
                <Progress.Root value={completionPercentage} colorPalette="whiteAlpha">
                  <Progress.Track bg="blue.600">
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Box>
            </Card.Body>
          </Card.Root>
        </motion.div>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card.Root _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }} transition="all 0.3s">
                <Card.Body p={6}>
                  <Flex justify="space-between" align="center">
                    <VStack align="start" gap={1}>
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
                      <Icon>
                        <stat.icon size="24px" />
                      </Icon>
                    </Box>
                  </Flex>
                </Card.Body>
              </Card.Root>
            </motion.div>
          ))}
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <Card.Root>
            <Card.Body p={6}>
              <Heading size="md" color="gray.900" mb={6}>
                {t('dashboard.recentActivity.title')}
              </Heading>
              <VStack gap={4} align="stretch">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HStack gap={4} p={4} borderRadius="lg" _hover={{ bg: "gray.50" }} transition="colors">
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
                        <Icon>
                          <activity.icon size="20px" />
                        </Icon>
                      </Box>
                      <VStack align="start" gap={0} flex={1}>
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
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body p={6}>
              <Heading size="md" color="gray.900" mb={6}>
                {t('dashboard.quickActions.title')}
              </Heading>
              <VStack gap={3} align="stretch">
                <Button
                  bg="blue.50"
                  color="blue.700"
                  _hover={{ bg: "blue.100" }}
                  justifyContent="flex-start"
                  p={3}
                  onClick={handleContinueLearning}
                >
                  <Icon mr={2}>
                    <FaPlay />
                  </Icon>
                  {t('dashboard.quickActions.continueLearning')}
                </Button>
                <Button
                  bg="purple.50"
                  color="purple.700"
                  _hover={{ bg: "purple.100" }}
                  justifyContent="flex-start"
                  p={3}
                  onClick={() => navigate('/app/courses')}
                >
                  <Icon mr={2}>
                    <FaBookOpen />
                  </Icon>
                  {t('dashboard.quickActions.viewAllCourses')}
                </Button>
                <Button
                  bg="green.50"
                  color="green.700"
                  _hover={{ bg: "green.100" }}
                  justifyContent="flex-start"
                  p={3}
                  onClick={() => navigate('/app/certificates')}
                >
                  <Icon mr={2}>
                    <FaTrophy />
                  </Icon>
                  {t('dashboard.quickActions.viewCertificates')}
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Grid>
      </VStack>
    </Container>
  )
}

export default Dashboard