import moment from "moment"
import supabase from "./supabase"

const createLogs = async (user: any, taskMessage: any, type: any) => {

    const prepData = taskMessage.map((msg: string) => {
        return { 
            created_by: user?.firstName,
            message: msg,
            type: type,
            date: moment().format("YYYY-MM-DD")
        }
    })

    const { data, error } = await supabase
      .from('PublicLogs')
      .insert(prepData)

      if(data) {
        console.log('created a new task logs')
      }

      if(error) {
        console.log('failed to create a new task logs')
      }

    // refresh the logs.
}

export {createLogs};