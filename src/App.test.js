import { fireEvent, render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MOCK_PRODUCT } from './fixture';
import Product from './components/Product';
import cartReducer from './reducers/cartReducer';
import { API_ENDPOINT } from './const/api';
import { fetchProduct } from './actions/productAction';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

// @see {@link https://mswjs.io/docs/api/setup-server#examples}
const server = setupServer(
  rest.get(API_ENDPOINT.GET_PRODUCT, (req, res, ctx) => {
    return res(ctx.json(MOCK_PRODUCT));
  })
);

describe('1 컴포넌트 렌더 테스트', () => {
  test('상품 컴포넌트는 썸네일, 상품 이름, 가격, 장바구니 담기 버튼을 렌더해야 한다.', () => {
    // given
    const product = {
      id: 1,
      thumbnailUrl: 'test-url',
      name: 'ditto',
      price: 1000,
    };

    // when
    render(<Product product={product} />);

    // then
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.price)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      product.thumbnailUrl
    );
    expect(screen.getByRole('button')).toHaveTextContent('장바구니 담기');
  });
});

describe('2 이벤트 → 의도한 action이 dispatch되는지 / 의도한 호출이 일어나는지', () => {
  const product = {
    id: 1,
    thumbnailUrl: 'test-url',
    name: 'ditto',
    price: 1000,
  };

  test('장바구니 담기 버튼을 클릭하면 장바구니 페이지로 이동해야 한다.', () => {
    // given

    // when
    render(<Product product={product} />);

    const addToCartButton = screen.getByRole('button');
    fireEvent.click(addToCartButton);

    // then
    expect(mockNavigate).toBeCalledWith('/cart');
  });

  test('장바구니 담기 버튼을 클릭하면 상품 추가 요청을 보내야 한다.', () => {
    // given

    // when
    render(<Product product={product} />);

    const addToCartButton = screen.getByRole('button');
    fireEvent.click(addToCartButton);

    // then
    expect(mockDispatch).toBeCalledWith({
      type: 'ADD_PRODUCT',
      payload: product,
    });
  });
});

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

describe('4 외부 API 연동에 대한 테스트 (feat.Thunk)', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  test('상품 정보를 불러오는 데 성공하면 상품 정보와 함께 FETCH_PRODUCT_SUCCESS 액션이 dispatch 되어야 한다.', async () => {
    // given
    const expectedProduct = {
      name: 'ditto',
      price: 1000,
      thumbnailUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png',
    };

    // when
    await fetchProduct()(mockDispatch);

    // then
    expect(mockDispatch).toBeCalledWith({
      type: 'FETCH_PRODUCT_SUCCESS',
      payload: expectedProduct,
    });
  });

  test('상품 정보를 불러오는 데 실패하면 FETCH_PRODUCT_ERROR 액션이 dispatch 되어야 한다.', async () => {
    // given
    // @see {@link https://mswjs.io/docs/api/setup-server/use}
    server.use(
      rest.get(API_ENDPOINT.GET_PRODUCT, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    // when
    await fetchProduct()(mockDispatch);

    // then
    expect(mockDispatch).toBeCalledWith({
      type: 'FETCH_PRODUCT_ERROR',
    });
  });
});
