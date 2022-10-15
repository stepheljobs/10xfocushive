import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/nextjs";
import {
  Avatar,
  AvatarGroup,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import Confetti from "react-confetti";
import moment from "moment";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Flex, Box, Text, Stack, Center, Container } from "@chakra-ui/react";

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
  const [taskList, setTaskList] = useState<any>([]);
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

      <SignedOut>
        <Flex justifyContent={"space-around"}>
          <Box>
            <Heading color={"black"}>How does it work?</Heading>
            <List mb={8}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Enter the room quietly, as others are working. Treat it like a
                library.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Respect everyone.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                To create accountability, share your top 3 goals before your
                session.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Boost each other by checking and sharing your finished work
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Please say bye to your friends in the room before leaving
                discreetly.
              </ListItem>
            </List>

            <Text fontSize="lg" fontWeight={"bold"}>
              Join other 10xFHer who get things done! one task at a time.
            </Text>
            <Divider />

            <Box mt={8}>
              <Text fontSize="lg" fontWeight={"bold"}>
                Morning Schedule
              </Text>
              <Text>8:00AM-10:00AM - Manila Time</Text>
              <AvatarGroup size="md" max={2}>
                <Avatar name="Chris Deuda" src="https://scontent.fmnl24-1.fna.fbcdn.net/v/t39.30808-6/279898767_5415342678484757_4653749986383567224_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHVRQsGZAEgmkpgWpr4hQs0zwOpt0ZkkmHPA6m3RmSSYby2WKK6dFdupOcdnENBOws&_nc_ohc=z1rhQnU68Y0AX-zd0QW&tn=vifebocYUUtAyb_l&_nc_ht=scontent.fmnl24-1.fna&oh=00_AT8ox9dLPQNTghCv2S6-I-loSYTtJLddkGZ7RMKpyyN-jw&oe=634DF800" />
                <Avatar name="Lonlon Jaurige" src="https://scontent.fmnl24-1.fna.fbcdn.net/v/t39.30808-6/297824644_10225752096161857_4128302288906478983_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGagmMCE-rArOLzyj-0UgDOslH1YNmHsjmyUfVg2YeyOZ9xvpZuBQ05ohg1FrwhJm4&_nc_ohc=mBnJh9gr8vYAX_N7fCk&_nc_ht=scontent.fmnl24-1.fna&oh=00_AT8xU3Re7Tn5ZbDWJwjL_uewzICqfm7yqJBmSIOyW98zqQ&oe=634EA926" />
                <Avatar
                  name="Nikki Ferrer"
                  src="https://scontent.fmnl24-1.fna.fbcdn.net/v/t1.6435-9/105567610_10220629512601654_9018378856758235668_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHnK_bALKnvbNfW8c9EcCcyGcelx2daZUkZx6XHZ1plSerATGPCly5boMkaw69Zt-4&_nc_ohc=Pd6ZvQwpf3EAX9_GI1Q&_nc_ht=scontent.fmnl24-1.fna&oh=00_AT9_-mbp_WynBWdx_VaZRY3tAHDxJJwpUkdSBgdUIA13Uw&oe=63701AD1"
                />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
              </AvatarGroup>
            </Box>

            <Box mt={8}>
              <Text fontSize="lg" fontWeight={"bold"}>
                Afternoon Schedule
              </Text>
              <Text>2:00PM-4:00PM - Manila Time</Text>
              <AvatarGroup size="md" max={2}>
                <Avatar
                  name="Sherwyne"
                  src="https://scontent.fmnl24-1.fna.fbcdn.net/v/t31.18172-8/19025160_1710917439210610_6467618243340734736_o.jpg?_nc_cat=109&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHFtFLmoVSHYKMMmVAN4qe6-0rqw98ZCof7SurD3xkKhxJYv2XzIIfKWv8_wd5UT0A&_nc_ohc=Os13RQbhE-IAX90DdEL&_nc_ht=scontent.fmnl24-1.fna&oh=00_AT_kXVQ7c4Uq7hvZs2vxtIQF2XHjDVkNzxhcufC0oATjxA&oe=636F911F"
                />
                <Avatar name="Angel Cea" src="https://scontent.fmnl24-1.fna.fbcdn.net/v/t39.30808-1/272081707_106694105247248_685695356282718415_n.jpg?stp=c0.88.480.480a_dst-jpg_p480x480&_nc_cat=100&ccb=1-7&_nc_sid=7206a8&_nc_eui2=AeGdnEjeOl6WbhBHc3mjOiXEMB5WcygOfp8wHlZzKA5-n_Iao0IRfS5t5qQEux2cxBE&_nc_ohc=wHvDeVtXU-kAX-7DT8G&_nc_ht=scontent.fmnl24-1.fna&oh=00_AT9MNK9fcbRnUIaxE_m5-_rwSuTWghSQI_c9ilBQrj89xw&oe=634EC753" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
                <Avatar name="Chris Deuda" src="https://bit.ly/ryan-florence" />
              </AvatarGroup>
            </Box>

            <Box mt={8}>
              <Text fontSize="lg" fontWeight={"bold"}>
                Not your schedule?
              </Text>
              <Text>Relax. Just walk in—some of our members work alone, especially at night.</Text>
            </Box>
          </Box>
          <Box>
            <SignIn />
          </Box>
        </Flex>
      </SignedOut>

      <SignedIn>
        <Flex color="white">
          <Box flex="1" bg="black" overflow={"hidden"}>
            <RenderJitsi user={user} />
          </Box>
          <Box w="400px" border={"2px"} borderColor={"black"}>
            <TodoList
              supabase={supabase}
              setShowConfetti={setShowConfetti}
              createLogs={createLogs}
              user={user}
              generateToast={generateToast}
            />
          </Box>
        </Flex>
      </SignedIn>

      <Flex marginTop={16} justifyContent="center">
        <ProgressFeed publicLogs={publicLogs} />
        {/* PRESENCE WIDGET HERE */}
      </Flex>

      <Container as="footer" role="contentinfo">
        <Stack pt="8" pb="12" justify="space-between" align="center">
          <Text fontSize="sm" color="subtle">
            &copy; {new Date().getFullYear()} 10xFocusHive
          </Text>
        </Stack>
      </Container>
    </Flex>
  );
};

export default Home;
