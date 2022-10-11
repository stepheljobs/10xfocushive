
import {
    List,
    ListItem,
    ListIcon,
    Flex,
    Box,
    Text,
    Heading,
    Badge,
    Code
  } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import moment from 'moment';

const ProgressFeed = (props: any) => {
  const { publicLogs } = props;

    return <Flex flexDirection={'column'} color='white'>
      <Box p={4}>
        <Heading color={'black'} fontWeight="bold">Whats happening today?</Heading>
      </Box>
      <Box p={4} flex='1'>
        <List spacing={3}>
          {publicLogs.map((logs: any) => {
            return <ListItem key={logs.id} color={'black'}>
              {(logs.type === 'create') ? <Badge colorScheme='purple'>new</Badge> : <Badge colorScheme='green'>success</Badge>}
              {(logs.type === 'create')
                ? ` ${logs.created_by} created a task ${logs.message} | `
                : ` ${logs.created_by} finished the task ${logs.message} | `
              }
              <Code>{moment(logs.created_at).fromNow()}</Code>
            </ListItem>
          })}
        </List>
      </Box>
    </Flex>
  }

  export default ProgressFeed;