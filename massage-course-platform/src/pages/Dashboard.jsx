import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useCourse } from '../hooks/useCourse'
import { useLanguage } from '../hooks/useLanguage'
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
  Flex
} from '@chakra-ui/react'
import { 
  FaPlayCircle,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaFire,
  FaBookOpen
} from 'react-icons/fa'

const Dashboard = () => {
  const { user } = useAuth()
  const { lessons, getProgress } = useCourse()
  const { t } = useLanguage()

  const completedLessons = lessons.filter(lesson => lesson.completed).length
  const totalStudyTime = completedLessons * 20
  const progress = getProgress()

  const stats = [
    {
      name: 'Lessons Completed',
      value: completedLessons,
      icon: FaPlayCircle,
      color: 'blue',
      change: '+2 this week'
    },
    {
      name: 'Study Time',
      value: `${totalStudyTime}m`,
      icon: FaClock,
      color: 'purple',
      change: '+45m this week'
    },
    {
      name: 'Progress',
      value: `${progress}%`,
      icon: FaChartLine,
      color: 'green',
      change: '+15% this week'
    },
    {
      name: 'Achievements',
      value: '3',
      icon: FaTrophy,
      color: 'orange',
      change: '+1 this week'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: 'Completed "Deep Tissue Massage Fundamentals"',
      time: '2 hours ago',
      icon: FaPlayCircle,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Earned "Swedish Massage Specialist" badge',
      time: '1 day ago',
      icon: FaTrophy,
      color: 'yellow'
    },
    {
      id: 3,
      title: 'Started "Sports Massage Applications"',
      time: '3 days ago',
      icon: FaBookOpen,
      color: 'green'
    }
  ]

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
                    {t('course.welcome')}, {user?.name}! 👋
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
                  <Text fontSize="sm" fontWeight="medium">{progress}%</Text>
                </Flex>
                <Progress value={progress} colorScheme="whiteAlpha" bg="blue.600" />
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
                  bg="blue.50"
                  color="blue.700"
                  _hover={{ bg: "blue.100" }}
                  justifyContent="flex-start"
                  p={3}
                >
                  Continue Current Lesson
                </Button>
                <Button
                  bg="purple.50"
                  color="purple.700"
                  _hover={{ bg: "purple.100" }}
                  justifyContent="flex-start"
                  p={3}
                >
                  View All Courses
                </Button>
                <Button
                  bg="green.50"
                  color="green.700"
                  _hover={{ bg: "green.100" }}
                  justifyContent="flex-start"
                  p={3}
                >
                  Download Certificate
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