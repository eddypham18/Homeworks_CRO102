import counterSlice from './counterSlice'
import imagesSlice from './imageSlice'
import { combineReducers } from 'redux';

// Combine reducers
const rootReducer = combineReducers({
    counter: counterSlice.reducer,
    images: imagesSlice.reducer,
});

export default rootReducer;