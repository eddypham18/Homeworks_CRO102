import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../configs/api"

//createAsyncThunk liên quan đến bộ redux nên các api có giá trị dùng chung như user sẽ viết ở đây
export const login = createAsyncThunk(
    "users",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post("/users", data);
            if (response.status == true) {
                return response.data;
            }
            else {
                return rejectWithValue(error);
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);

export const register = createAsyncThunk(
    "users",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post("/users", data);
            if (response.status == true) {
                return response.data;
            }
            else {
                return rejectWithValue(error);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateAccount = createAsyncThunk(
    "users",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/${data.id}`, data);
            if (response.status == true) {
                return response.data;
            }
            else {
                return rejectWithValue(error);
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);

//lấy thông tin user
export const getUser = createAsyncThunk(
    "users",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get("/users", data);
            if (response.status == true) {
                return response.data;
            }
            else {
                return rejectWithValue(error);
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);





