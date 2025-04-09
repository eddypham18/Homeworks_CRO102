import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../configs/api";

export const addItemToCartTable = createAsyncThunk(
    "cart",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post("/cart", data);
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






