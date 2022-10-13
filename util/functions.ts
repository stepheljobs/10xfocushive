import moment from "moment"
import supabase from "./supabase"

const dateToday = moment().format("YYYY-MM-DD");

const createLogs = async (user: any, taskMessage: any, type: any) => {

    const prepData = { 
      created_by: user?.firstName,
      message: taskMessage,
      type: type,
      date: moment().format("YYYY-MM-DD")
    }

    const { data, error } = await supabase
      .from('PublicLogs')
      .insert(prepData)

      if(data) {
        console.log('created a new task logs')
      }

      if(error) {
        console.log('failed to create a new task logs')
      }
}

const createTask = async (user: any, params: any) => {
  const { data, error } = await supabase.from("Tasks").insert(params);

  if(error) {
    console.log('failed creating a task...', error)
  }

  return { data, error }
}

const getTaskList = async (user: any): Promise<any> => {
  const { data, error } = await supabase
        .from("Tasks")
        .select("*")
        .eq("date", dateToday)
        .eq("status", 'new')
        .eq("created_by", user?.id);

  if(error) {
    console.log('failed fetching task list...')
  }
  return { data, error }
}

export {
  createLogs,
  createTask,
  getTaskList
};