import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SignedIn, SignedOut, SignIn, useUser, useSession } from '@clerk/nextjs'
import { useToast } from '@chakra-ui/react'
import Confetti from 'react-confetti'
import moment from 'moment';

import {
  Flex,
  Box,
  Text,
  Heading,
  Checkbox,
  Stack,
  Divider,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Center,
  Container,
} from '@chakra-ui/react'

import ProgressFeed from '../components/ProgressFeed'
import RenderJitsi from '../components/VideoConference'
import { useAuth } from '@clerk/clerk-react';
import supabase from '../util/supabase'
import { createLogs } from '../util/functions'

const dateToday = moment().format("YYYY-MM-DD");

const Home: NextPage = () => {
  const { getToken } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useUser();
  const toast = useToast()
  const [task1, setTask1] = useState<String>('');
  const [task2, setTask2] = useState<String>('');
  const [task3, setTask3] = useState<String>('');
  const [showConfetti, setShowConfetti] = useState(false)
  const [myTaskToday, setMyTaskToday] = useState<any>([])
  const [publicLogs, setPublicLogs] = useState<any>([])

  useEffect(() => {
    // this useEffect only set the auth JWT
    const setupSupabase = async () => {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        supabase.auth.setAuth(token);
      }
    }
    setupSupabase();
  }, [])

  useEffect(() => {
    // fetch your task today.
    const fetchPublicLogsToday = async () => {
      const { data, error } = await supabase
        .from('PublicLogs')
        .select('*')
        .eq('date', dateToday)

      if (data) {
        setPublicLogs(data);
      }
    }
    fetchPublicLogsToday();
  }, [])

  useEffect(() => {
    // fetch your task today.
    const fetchMyTaskToday = async () => {
      const { data, error } = await supabase
        .from('Tasks')
        .select('*')
        .eq('date', dateToday)
        .eq('created_by', user?.id)

      if (data) {
        setMyTaskToday(data);
      }
    }
    fetchMyTaskToday();
  }, [user])

  const generateToast = (title: string, description: string, status: any) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      position: 'top',
      isClosable: true,
    })
  }

  const submitCreateTask = async () => {
    const { data, error } = await supabase
      .from('Tasks')
      .insert([
        { description: task1, status: 'new', created_by: user?.id, first_name: user?.firstName, date: dateToday },
        { description: task2, status: 'new', created_by: user?.id, first_name: user?.firstName, date: dateToday },
        { description: task3, status: 'new', created_by: user?.id, first_name: user?.firstName, date: dateToday }
      ])

    if (data) {
      generateToast('Task Created!', 'Yay! Task Created!', 'success');
      createLogs(user, [task1, task2, task3], 'create')
    }

    if (error) {
      generateToast('Ooops something is wrong...', 'We are checking this error.', 'error');
    }
  }

  const handleChangeTask1 = (event: any) => setTask1(event.target.value);
  const handleChangeTask2 = (event: any) => setTask2(event.target.value);
  const handleChangeTask3 = (event: any) => setTask3(event.target.value);

  const handleTaskStatus = async (taskId: any) => {
    const tempTaskList = [...myTaskToday]
    const task = tempTaskList.find(item => {
      if(item.id === taskId) {
        if(item.status === 'new') {
          item.status = 'done'
          setShowConfetti(true);
        } else {
          item.status = 'new'
        }
      }
      return item;
    })

    const { data, error } = await supabase
      .from('Tasks')
      .update({ status: 'done' })
      .eq('id', taskId)

    if (data) {
      console.log('task: ', task)
      createLogs(user, [task.description], 'update')
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000)
    }
  }

  const RenderMyTaskToday = () => {
    if (myTaskToday.length === 0) {
      return <Text>No Task</Text>
    }

    return myTaskToday.map((item: any) => {
      return <Checkbox key={item.id} onChange={() => { handleTaskStatus(item.id) }} isChecked={item.status === 'done'}>{item.description}</Checkbox>
    });
  }

  return (
    <Flex flexDirection={'column'} paddingTop={8}>

      {showConfetti &&
        <Confetti
          width={1000}
          height={700}
        />
      }

      <Head>
        <title>10xFocusHive</title>
        <meta name="description" content="Increase Productivity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Center>
          <SignedOut>
            <SignIn />
          </SignedOut>
        </Center>
      </Container>

      <SignedIn>
        <Flex color='white'>
          <Box flex='1' bg='black' overflow={'hidden'}>
            <RenderJitsi user={user} />
          </Box>
          <Box w='400px' border={'2px'} borderColor={'black'}>
            <Box p={5} backgroundColor={'white'} shadow='md' borderWidth='1px'>
              <Flex justifyContent={'space-between'} >
                <Heading color={'black'} fontSize='xl' pr={4}>My Task Today</Heading>
                <Button colorScheme='blue' size='xs' onClick={onOpen}>Create Task</Button>
              </Flex>

              <Divider />
              <Stack spacing={5} direction='column' color={'black'}>
                <RenderMyTaskToday />
              </Stack>
            </Box>
          </Box>
        </Flex>
      </SignedIn>

      <Flex marginTop={16} justifyContent="center">
        <ProgressFeed publicLogs={publicLogs} />
        {/* <Box>
          <Text fontWeight={'bold'}>Who is doing co-working today?</Text>
          <Box p={4} m={4} backgroundColor={'white'} shadow='md' borderWidth='1px'>
            <Heading fontSize='xl'>Stephel Maca</Heading>
            <Stack spacing={5} direction='column'>
              <Checkbox>Checkbox</Checkbox>
              <Checkbox>Checkbox</Checkbox>
              <Checkbox>Checkbox</Checkbox>
            </Stack>
          </Box>
          <Box p={4} m={4} backgroundColor={'white'} shadow='md' borderWidth='1px'>
            <Heading fontSize='xl'>Stephel Maca</Heading>
            <Stack spacing={5} direction='column'>
              <Checkbox>Checkbox</Checkbox>
              <Checkbox>
                Checkbox
              </Checkbox>
            </Stack>
          </Box>
        </Box> */}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your task today</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input onChange={handleChangeTask1} mb={4} placeholder='Today I will finish...' />
            <Input onChange={handleChangeTask2} mb={4} placeholder='Today I will complete...' />
            <Input onChange={handleChangeTask3} placeholder='Today I will be productive...' />
          </ModalBody>

          <ModalFooter>
            <Button onClick={submitCreateTask} colorScheme='blue' >Save and Share</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/stepheljobs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by StephelJobs
        </a>
      </footer>
    </Flex>
  )
}

export default Home
