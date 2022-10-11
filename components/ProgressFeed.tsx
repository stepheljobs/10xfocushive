
import {
    List,
    ListItem,
    ListIcon,
    Flex,
    Box,
    Text,
    Heading,
    Badge
  } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import supabase from '../util/supabase'


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
              <ListIcon as={CheckCircleIcon} color='green.500' />
              {(logs.type === 'create')
                ? `${logs.created_by} created a task ${logs.message} `
                : `${logs.created_by} finished the task ${logs.message} `
              }
              {(logs.type === 'create') ? <Badge colorScheme='purple'>new</Badge> : <Badge colorScheme='green'>success</Badge>}
            </ListItem>
          })}
        </List>
      </Box>
    </Flex>
  }

  export default ProgressFeed;