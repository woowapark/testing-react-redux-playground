import { ADD_PRODUCT } from '../actions/cartAction';

const cartReducer = (state = [], action) => {
  if (action.type === ADD_PRODUCT) {
    return [
      ...state,
      {
        ...action.payload,
        quantity: 1,
      },
    ];
  }

  return state;
};

export default cartReducer;
