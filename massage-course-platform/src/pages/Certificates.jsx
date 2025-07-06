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
  Button,
  Icon,
  Center
} from '@chakra-ui/react'
import { 
  FaAward,
  FaTrophy,
  FaStar,
  FaDownload,
  FaLock
} from 'react-icons/fa'

const Certificates = () => {
  const { lessons, getProgress } = useCourse()
  const { t } = useLanguage()
  
  const progress = getProgress()
  const completedLessons = lessons.filter(lesson => lesson.completed).length

  const certificates = [
    {
      id: 1,
      title: 'Swedish Massage Specialist',
      description: 'Completed basic Swedish massage techniques',
      requirement: 'Complete first 2 lessons',
      unlocked: completedLessons >= 2,
      icon: FaAward,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Deep Tissue Expert',
      description: 'Mastered advanced deep tissue techniques',
      requirement: 'Complete first 4 lessons',
      unlocked: completedLessons >= 4,
      icon: FaTrophy,
      color: 'purple'
    },
    {
      id: 3,
      title: 'Master Therapist',
      description: 'Completed the entire professional course',
      requirement: 'Complete all lessons',
      unlocked: progress === 100,
      icon: FaStar,
      color: 'yellow'
    }
  ]

  return (
    <Container maxW="6xl">
      <VStack spacing={8} align="stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Center textAlign="center">
            <VStack spacing={4}>
              <Heading size="2xl" color="gray.900">
                Your Certificates
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Showcase your achievements and professional credentials
              </Text>
            </VStack>
          </Center>
        </motion.div>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8}>
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                textAlign="center"
                h="full"
                opacity={!certificate.unlocked ? 0.6 : 1}
                _hover={certificate.unlocked ? { transform: 'translateY(-4px)', shadow: '2xl' } : {}}
                transition="all 0.3s"
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.100"
                p={6}
              >
                <VStack spacing={6}>
                  <Box
                    w={20}
                    h={20}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={certificate.unlocked ? `${certificate.color}.100` : 'gray.100'}
                    color={certificate.unlocked ? `${certificate.color}.600` : 'gray.400'}
                  >
                    <Icon 
                      as={certificate.unlocked ? certificate.icon : FaLock} 
                      w={10} 
                      h={10} 
                    />
                  </Box>
                  
                  <VStack spacing={3}>
                    <Heading size="md" color="gray.900">
                      {certificate.title}
                    </Heading>
                    
                    <Text color="gray.600" fontSize="sm">
                      {certificate.description}
                    </Text>
                    
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      <strong>Requirement:</strong> {certificate.requirement}
                    </Text>
                  </VStack>
                  
                  {certificate.unlocked ? (
                    <Button 
                      leftIcon={<FaDownload />}
                      colorScheme={certificate.color}
                      size="sm"
                      w="full"
                    >
                      Download Certificate
                    </Button>
                  ) : (
                    <Button 
                      leftIcon={<FaLock />}
                      variant="outline"
                      size="sm"
                      w="full"
                      isDisabled
                    >
                      Locked
                    </Button>
                  )}
                </VStack>
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
          p={8}
        >
          <Heading size="lg" color="gray.900" mb={6} textAlign="center">
            Achievement Progress
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
            <Center textAlign="center">
              <VStack spacing={2}>
                <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                  {certificates.filter(c => c.unlocked).length}
                </Text>
                <Text color="gray.600">Certificates Earned</Text>
              </VStack>
            </Center>
            
            <Center textAlign="center">
              <VStack spacing={2}>
                <Text fontSize="4xl" fontWeight="bold" color="purple.600">
                  {completedLessons}
                </Text>
                <Text color="gray.600">Lessons Completed</Text>
              </VStack>
            </Center>
            
            <Center textAlign="center">
              <VStack spacing={2}>
                <Text fontSize="4xl" fontWeight="bold" color="green.600">
                  {progress}%
                </Text>
                <Text color="gray.600">Course Progress</Text>
              </VStack>
            </Center>
          </Grid>
        </Box>
      </VStack>
    </Container>
  )
}

export default Certificates