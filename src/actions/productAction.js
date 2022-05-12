import { API_ENDPOINT } from '../const/api';

export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS';
export const FETCH_PRODUCT_ERROR = 'FETCH_PRODUCT_ERROR';

export const fetchProduct = () => async (dispath, getState) => {
  dispath({ type: FETCH_PRODUCT });

  try {
    const response = await fetch(API_ENDPOINT.GET_PRODUCT);
    const product = await response.json();

    dispath({
      type: FETCH_PRODUCT_SUCCESS,
      payload: {
        name: product.name,
        price: 1000, // 균일가로 가정
        thumbnailUrl: product.sprites.other['official-artwork'].front_default,
      },
    });
  } catch (error) {
    dispath({ type: FETCH_PRODUCT_ERROR });
  }
};
