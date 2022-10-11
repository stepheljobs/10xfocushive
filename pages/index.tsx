import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
  useSession,
} from "@clerk/nextjs";
import { useToast } from "@chakra-ui/react";
import Confetti from "react-confetti";
import moment from "moment";

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
} from "@chakra-ui/react";

import ProgressFeed from "../components/ProgressFeed";
import RenderJitsi from "../components/VideoConference";
import { useAuth } from "@clerk/clerk-react";
import supabase from "../util/supabase";
import { createLogs } from "../util/functions";

const dateToday = moment().format("YYYY-MM-DD");

const Home: NextPage = () => {
  const { getToken } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();
  const toast = useToast();
  const [task1, setTask1] = useState<String>("");
  const [task2, setTask2] = useState<String>("");
  const [task3, setTask3] = useState<String>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [myTaskToday, setMyTaskToday] = useState<any>([]);
  const [publicLogs, setPublicLogs] = useState<any>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    // this useEffect only set the auth JWT
    const setupSupabase = async () => {
      const token = await getToken({ template: "supabase" });
      if (token) {
        supabase.auth.setAuth(token);
      }
    };
    setupSupabase();
  }, []);

  useEffect(() => {
    const PublicLogs = supabase
      .from("PublicLogs")
      .on("*", (payload) => {
        setPublicLogs((items: any) => [payload.new, ...items]);
      })
      .subscribe();
  }, []);

  useEffect(() => {
    // fetch your task today.
    const fetchPublicLogsToday = async () => {
      const { data, error } = await supabase
        .from("PublicLogs")
        .select("*")
        .eq("date", dateToday)
        .order("created_at", { ascending: false });

      if (data) {
        setPublicLogs(data);
      }
    };
    fetchPublicLogsToday();
  }, []);

  useEffect(() => {
    // fetch your task today.
    const fetchMyTaskToday = async () => {
      const { data, error } = await supabase
        .from("Tasks")
        .select("*")
        .eq("date", dateToday)
        .eq("created_by", user?.id);

      if (data) {
        setMyTaskToday(data);
      }
    };
    fetchMyTaskToday();
  }, [user]);

  const generateToast = (title: string, description: string, status: any) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  };

  const submitCreateTask = async () => {
    setIsCreatingTask(true);
    const paramsTask = [
      {
        description: task1,
        status: "new",
        created_by: user?.id,
        first_name: user?.firstName,
        date: dateToday,
      },
      {
        description: task2,
        status: "new",
        created_by: user?.id,
        first_name: user?.firstName,
        date: dateToday,
      },
      {
        description: task3,
        status: "new",
        created_by: user?.id,
        first_name: user?.firstName,
        date: dateToday,
      },
    ];

    const { data, error } = await supabase.from("Tasks").insert(paramsTask);

    if (data) {
      generateToast("Task Created!", "Yay! Task Created!", "success");
      createLogs(user, [task1, task2, task3], "create");
    }

    if (error) {
      generateToast(
        "Ooops something is wrong...",
        "We are checking this error.",
        "error"
      );
    }

    setMyTaskToday(paramsTask);
    setIsCreatingTask(false);
    onClose();
  };

  const handleChangeTask1 = (event: any) => setTask1(event.target.value);
  const handleChangeTask2 = (event: any) => setTask2(event.target.value);
  const handleChangeTask3 = (event: any) => setTask3(event.target.value);

  const handleTaskStatus = async (taskId: any) => {
    const tempTaskList = [...myTaskToday];

    // find the task id
    const task = tempTaskList.find((item) => {
      if (item.id === taskId && item.status === "new") {
        return item;
      }
    });

    task.status = "done";

    setMyTaskToday(tempTaskList);

    // update from supabase
    const { data, error } = await supabase
      .from("Tasks")
      .update({ status: "done" })
      .eq("id", taskId);

    if (data) {
      createLogs(user, [task.description], "update");
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  const RenderMyTaskToday = () => {
    if (myTaskToday.length === 0) {
      return (
        <Box>
          <Text color={"gray.500"}>You do not have any task for today</Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Create Now
          </Button>
        </Box>
      );
    }

    return myTaskToday.map((item: any) => {
      return (
        <Checkbox
          isDisabled={item.status === "done"}
          key={item.id}
          onChange={() => {
            handleTaskStatus(item.id);
          }}
          isChecked={item.status === "done"}
        >
          {item.description}
        </Checkbox>
      );
    });
  };

  return (
    <Flex flexDirection={"column"} paddingTop={8}>
      {showConfetti && <Confetti width={1000} height={700} />}

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
        <Flex color="white">
          <Box flex="1" bg="black" overflow={"hidden"}>
            <RenderJitsi user={user} />
          </Box>
          <Box w="400px" border={"2px"} borderColor={"black"}>
            <Box p={5} backgroundColor={"white"} shadow="md" borderWidth="1px">
              <Flex justifyContent={"space-between"}>
                <Heading color={"black"} fontSize="xl" pr={4}>
                  To-do list
                </Heading>
              </Flex>

              <Divider />
              <Stack spacing={5} direction="column" color={"black"}>
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
          <ModalHeader>Start creating your task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              onChange={handleChangeTask1}
              mb={4}
              placeholder="I want to finish..."
            />
            <Input
              onChange={handleChangeTask2}
              mb={4}
              placeholder="I want to complete..."
            />
            <Input
              onChange={handleChangeTask3}
              placeholder="I want to finalize..."
            />
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isCreatingTask}
              onClick={submitCreateTask}
              loadingText="Creating Task"
              colorScheme="blue"
            >
              Save and Share
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container as="footer" role="contentinfo">
        <Stack
          pt="8"
          pb="12"
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color="subtle">
            &copy; {new Date().getFullYear()} 10xFocusHive
          </Text>
        </Stack>
      </Container>
    </Flex>
  );
};

export default Home;
