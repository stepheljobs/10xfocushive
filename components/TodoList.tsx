import { useState } from "react";
import { useAsync } from "react-async-hook";

import { IGif } from "@giphy/js-types";
import { Gif } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

import {
  Flex,
  Box,
  Heading,
  Divider,
  Stack,
  Button,
  Text,
  Checkbox,
  Input,
  Progress,
} from "@chakra-ui/react";
import moment from "moment";
import { createTask, getTaskList } from "../util/functions";

const dateToday = moment().format("YYYY-MM-DD");
const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

const GifDemo = () => {
  const [gif, setGif] = useState<IGif | null>(null);

  useAsync(async () => {
    const { data } = await giphyFetch.random({ tag: "sad" });
    setGif(data);
  }, []);

  return gif && <Gif gif={gif} width={200} />;
};

const TaskInputForm = (props: any) => {
  const { handleCreateTask } = props;
  const [taskInput, setTaskInput] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleTaskInputChange = (event: any) => setTaskInput(event.target.value);

  return (
    <>
      <Input
        onChange={handleTaskInputChange}
        mb={4}
        mt={4}
        placeholder="Today I want to finish..."
        value={taskInput}
      />
      <Button isLoading={isCreatingTask} colorScheme="blue" onClick={() => {
        setIsCreatingTask(true);
        handleCreateTask(taskInput)
        setTimeout(() => {
            setIsCreatingTask(false);
            setTaskInput('');
        }, 2000)
      }}>
        Add Task
      </Button>
    </>
  );
};

const RenderEmptyTask = () => {
    return         <Box>
    <Text mb={4} color={"gray.500"}>
      You do not have any task for today
    </Text>
    <GifDemo />
  </Box>
}

const TodoList = (props: any) => {
  const {
    supabase,
    createLogs,
    setShowConfetti,
    user,
    generateToast
  } = props;

  const [myTaskToday, setMyTaskToday] = useState<any>([]);
  const [statusUpdating, setStatusUpdating] = useState(false);
  useAsync( async () => {
    const { data } = await getTaskList(user)

    if (data) {
      setMyTaskToday(data);
    }
  }, [user]);

  const handleTaskStatusUpdate = async (taskId: any) => {
    setStatusUpdating(true);
    // update from supabase
    const response = await supabase
      .from("Tasks")
      .update({ status: "done" })
      .eq("id", taskId);

    await createLogs(user, response.data[0].description, "update");
    setStatusUpdating(false);
    // update taskList
    const { data } = await getTaskList(user);
    if (data) { setMyTaskToday(data); }

    setShowConfetti(true);
    setTimeout(() => {
        setShowConfetti(false);
    }, 5000);
  };

  const handleCreateTask = async (task: string) => {
    const params = {
        description: task,
        status: "new",
        created_by: user?.id,
        first_name: user?.firstName,
        date: dateToday
      }
    const { data } = await createTask(user, params);
    await createLogs(user, task, 'create')

    if(data) {
        setMyTaskToday((oldTask: any) => [...oldTask, data[0]])
    }
}

  const RenderMyTaskToday = () => {
    return myTaskToday.map((item: any) => {
      return (
        <Checkbox
          isDisabled={statusUpdating}
          key={`${(Math.random() + 1).toString(36).substring(7)}-taskId`}
          onChange={() => {
            handleTaskStatusUpdate(item.id);
          }}
          isChecked={item.status === "done"}
        >
          {item.description}
        </Checkbox>
      );
    });
  };

  return (
    <Box p={5} backgroundColor={"white"} shadow="md" borderWidth="1px">
      <Flex justifyContent={"space-between"}>
        <Heading color={"black"} fontSize="xl" pr={4}>
          TODO LIST
        </Heading>
      </Flex>
      <Divider />
      <Stack mt={4} spacing={5} direction="column" color={"black"}>
        {statusUpdating && <Progress size='xs' isIndeterminate />}
        {(myTaskToday.length === 0) && <RenderEmptyTask />}
        {(myTaskToday.length > 0) && <RenderMyTaskToday />}
        {(myTaskToday.length >= 3) && <Text>Finish your top 3 before adding more to be more productive.</Text>}
        {(myTaskToday.length < 3) && <TaskInputForm handleCreateTask={handleCreateTask} />}
      </Stack>
    </Box>
  );
};

export default TodoList;