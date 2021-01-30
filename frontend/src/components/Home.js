import React, {Fragment, useState, useEffect} from 'react';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import MetaData from './layout/MetaData';
import Products from './product/Product';
import Loader from './layout/Loader';

import {useDispatch, useSelector} from 'react-redux';
import {useAlert} from 'react-alert';
import {getProducts} from '../actions/productActions';

const {createSliderWidthTooltip} = Slider;
const Range = createSliderWidthTooltip(Slider.Range);

const Home = ({match}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)

  const alert = useAlert();
  const dispatch = useDispatch();

  const {loading, products, error, productsCount, resPerPage} = useSelector(
    state => state.products
  );

  const keyword = match.params.keyword;

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }

    dispatch(getProducts(keyword, currentPage, price, category , rating));
  }, [dispatch, alert, error, keyword, currentPage, price]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={'Buy Best Products Online'} />
          <h1 id='products_heading'>Latest Products</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              {keyword ? (
                <Fragment>
                  <div className='col-6 col-md-3 mt-5 mb-5'>
                    <div className='px-5'>
                      <Range
                        marks={{
                          1: `$1`,
                          1000: `$1000`,
                        }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatters={value => `$${value}`}
                        tipProps={{
                          placeholder: 'top',
                          visible: true,
                        }}
                        value={price}
                        onChange={price => setPrice(price)}
                      />
                    </div>
                  </div>

                  <col-6 className="col-md-9">
                    <div className="row">
                    products.map(product => (
                  <Products key={product.id} product={product} />
                ))
                    </div>
                  </col-6>
                </Fragment>
              ) : (
              
              )}
            </div>
          </section>

          {resPerPage <= productsCount && (
            <div className='d-flex justify-content-center mt-5'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText={'Next'}
                prevPageText={'Prev'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
