import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
} from "@clerk/nextjs";
import { useToast } from "@chakra-ui/react";
import Confetti from "react-confetti";
import moment from "moment";

import {
  Flex,
  Box,
  Text,
  Stack,
  Center,
  Container,
} from "@chakra-ui/react";

import ProgressFeed from "../components/ProgressFeed";
import RenderJitsi from "../components/VideoConference";
import TodoList from "../components/TodoList";
import { useAuth } from "@clerk/clerk-react";
import supabase from "../util/supabase";
import { createLogs } from "../util/functions";

const dateToday = moment().format("YYYY-MM-DD");

const Home: NextPage = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const toast = useToast();
  const [taskList, setTaskList] = useState<any>([])
  const [showConfetti, setShowConfetti] = useState(false);
  const [publicLogs, setPublicLogs] = useState<any>([]);

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
            <TodoList supabase={supabase} setShowConfetti={setShowConfetti} createLogs={createLogs} user={user} generateToast={generateToast} />
          </Box>
        </Flex>
      </SignedIn>

      <Flex marginTop={16} justifyContent="center">
        <ProgressFeed publicLogs={publicLogs} />
        {/* PRESENCE WIDGET HERE */}
      </Flex>

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
