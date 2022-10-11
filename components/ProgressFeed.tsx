import {
  List,
  ListItem,
  Flex,
  Box,
  Heading,
  Badge,
  Code,
  Text,
  Center
} from "@chakra-ui/react";
import { SignedIn } from "@clerk/nextjs";
import moment from "moment";

const ProgressFeed = (props: any) => {
  const { publicLogs } = props;

  return (
    <Flex flexDirection={"column"} color="white">
      <Box p={4}>
        <Heading color={"black"} fontWeight="bold">
          What is happening lately?
        </Heading>
      </Box>
      <Box p={4} flex="1">
        <List spacing={3}>
          {publicLogs.map((logs: any) => {
            return (
              <ListItem key={logs.id} color={"black"}>
                {logs.type === "create" ? (
                  <Badge colorScheme="purple">new</Badge>
                ) : (
                  <Badge colorScheme="green">success</Badge>
                )}
                {logs.type === "create"
                  ? ` ${logs.created_by} created a task ${logs.message} | `
                  : ` ${logs.created_by} finished the task ${logs.message} | `}
                <Code>{moment(logs.created_at).fromNow()}</Code>
              </ListItem>
            );
          })}
        </List>
        {publicLogs.length === 0 && 
        <Center><Text color={"black"}>No activities from the group yet</Text></Center>
        }
      </Box>
    </Flex>
  );
};

export default ProgressFeed;
