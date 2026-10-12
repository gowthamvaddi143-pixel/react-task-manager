import { createSlice } from "@reduxjs/toolkit"

  

  let initialState = {
    sharedTask:[],
    sharedTaskCount:0
  }

  const TaskSlicer = createSlice({
    name :'task-slicer',
    initialState,
    reducers:{
        addToShare: (state, action)=>{
            state.sharedTask.push(action.payload);
            state.sharedTaskCount= state.sharedTask.length;
        }
    }
  })

  export const {addToShare} = TaskSlicer.actions;
  export default TaskSlicer.reducer