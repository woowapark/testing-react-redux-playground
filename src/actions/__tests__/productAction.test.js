import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MOCK_PRODUCT } from '../../fixture';
import { API_ENDPOINT } from '../../const/api';
import { fetchProduct } from '../productAction';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

// @see {@link https://mswjs.io/docs/api/setup-server#examples}
const server = setupServer(
  rest.get(API_ENDPOINT.GET_PRODUCT, (req, res, ctx) => {
    return res(ctx.json(MOCK_PRODUCT));
  })
);

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
