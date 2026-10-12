import { configureStore } from "@reduxjs/toolkit";
import TaskSlicer from "../slicers/task-slicer"

export const store = configureStore({
    reducer: TaskSlicer
})