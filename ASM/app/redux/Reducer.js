import { createSlice } from "@reduxjs/toolkit";
import { getProducts, getUser, login, register, updateAccount } from "./UserAPI";
import { ToastAndroid } from "react-native";
const initialState = {
    user: null,
    cart: [],
    welcomeState: true
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        logOut: (state, action) => {
            state.user = null;
        },
        setUserState: (state, action) => {
            state.user = null;
        },
        displayWelcome: (state, action) => {
            state.welcomeState = false;
        },

        //cập nhập avatar
        editAvatar: (state, action) => {
            state.user.avatar = action.payload;
        },
        //chọn item trong cart
        selectCart: (state, action) => {
            const productId = action.payload;
            const updatedCart = state.cart.map(item => {
                if (item._id === productId) {
                    return {
                        //tạo bản sao ví dụ {_id: 2, select: false}
                        ...item,
                        //ghi đè lại thành {_id: 2, select: true}
                        select: !item.select
                    };
                }
                //nếu id không khớp với productId trả về item cũ, 
                //nếu id khớp với productId thì trả về item mới là đoạn 33 - 38
                return item;
            });

            return {
                //tạo ra mảng mới giữ nguyên state cũ (user, welcome, cart) và ghi đè lại cart mới là updatedCart
                ...state,
                cart: updatedCart
            };
        },
        //xóa item đã mua ra khỏi cart
        purchasedItem: (state, action) => {
            state.cart = state.cart.filter((item) => item.select == false)
        },
        addItemToCart: (state, action) => {
            //kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            const index = state.cart.findIndex((item) => item._id.toString() == action.payload._id.toString())
            //Nếu sản phẩm đã tồn tại thì tăng số lượng lên
            if (index >= 0) {
                state.cart[index].quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
        },
        //xóa bằng id
        removeItem: (state, action) => {
            state.cart = state.cart.filter((item) => item._id.toString() != action.payload.toString())
        },
        //sửa truyền id và quantity
        editItem: (state, action) => {
            const index = state.cart.findIndex((item) => item._id.toString() == action.payload._id.toString())
            //Nếu tăng số lượng thì +1, giảm thì + -1, phụ thuộc vào payload truyền vào bên Screen
            state.cart[index].quantity += action.payload.quantity;
            //nếu giảm về 0 thì xóa
            if (state.cart[index].quantity <= 0) {
                state.cart = state.cart.filter((item) => item._id.toString() != action.payload._id.toString())
            }
        },
        //xóa toàn bộ cart
        removeAllCart: (state, action) => {
            state.cart = []
        },
    },
    extraReducers: (builder) => {
        //Đăng nhập
        builder.addCase(login.pending, (state, action) => {
            console.log('...Pending');
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            console.log('...Rejected');
        });
        //Đăng ký
        builder.addCase(register.pending, (state, action) => {
            console.log('...Pending');
        });
        builder.addCase(register.fulfilled, (state, action) => {
            console.log('...Đăng ký thành công');
            state.user = action.payload;
        });
        builder.addCase(register.rejected, (state, action) => {
            console.log('...Rejected');
            ToastAndroid.show('Email đã tồn tại!', ToastAndroid.SHORT);
        });
        //Cập nhập tài khoản
        builder.addCase(updateAccount.pending, (state, action) => {
            console.log('...Pending');
        });
        builder.addCase(updateAccount.fulfilled, (state, action) => {
            state.user = action.payload;
            ToastAndroid.show('Cập nhập thành công!', ToastAndroid.SHORT);
            console.log('...Cập nhập thành công');
        });
        builder.addCase(updateAccount.rejected, (state, action) => {
            console.log('...Rejected');
        });

        //lấy thông tin user
        builder.addCase(getUser.pending, (state, action) => {
            console.log('...Pending');
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.user = action.payload;
            console.log('...Lấy thông tin tài khoản thành công');
        });
        builder.addCase(getUser.rejected, (state, action) => {
            console.log('...Rejected');
        });
    }
});

export const { logOut, editItem, setUserState, removeItem, addItemToCart, displayWelcome, selectCart, editAvatar, purchasedItem, removeAllCart } = appSlice.actions;
export default appSlice.reducer;