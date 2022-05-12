export const ADD_PRODUCT = 'ADD_PRODUCT';

export const addProduct = (product) => {
  return {
    type: ADD_PRODUCT,
    payload: product,
  };
};
