import cartReducer from '../cartReducer';

describe('3 action에 맞춰서 상태를 의도한대로 잘 변경하는지', () => {
  test('상품 추가 요청이 들어오면 해당 상품을 정상적으로 장바구니 상태에 추가해야 한다.', () => {
    // given
    const initialCartItems = [];
    const product = {
      id: 1,
      thumbnailUrl: 'test-url',
      name: 'ditto',
      price: 1000,
    };
    const addProductAction = {
      type: 'ADD_PRODUCT',
      payload: {
        ...product,
      },
    };

    // when
    // then
    expect(cartReducer(initialCartItems, addProductAction)).toEqual([
      {
        ...product,
        quantity: 1,
      },
    ]);
  });
});
