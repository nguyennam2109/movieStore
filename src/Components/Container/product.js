import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import fetchProductsAction from '../../Apis/apis';
import Loader from 'react-loader-spinner';
import { stringify } from 'querystring';
import { Card, CardDeck } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import ProductItem from './productItems';
import './product.css';
class ProductView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 1,
            data: []
        }
    }

    componentDidMount() {
        const { fetchProducts } = this.props;
        fetchProducts();

    }
    renderPaginatePage() {
        let items = [];
        const productLength = this.props.products.length;
        let totalPage = (productLength) % 10 === 0 ? (productLength) / 10 : ((productLength) / 10) + 1;
        for (let i = 1; i <= totalPage; i++) {
            items.push(i);
        }
        return (
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                {
                    items.map((item, idx) => { return (<Pagination.Item size="lg" key={idx}>{item}</Pagination.Item>) })
                }
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>);
    }
    render() {
        console.log(this.props)
        const { productDetail ,pending, products, error } = this.props;
        let groups_products;
        if (pending || products.length == 0) return <div className="loader"><Loader type="Bars" color="#00BFFF" height={80} width={80} /></div>
        if (error) return <span className='product-list-error'>{error}</span>
        if (products.length > 0) {
            let product_size = Math.floor(products.length / 7);
            groups_products = products.map(function (item, idx) {
                return idx % product_size === 0 ? products.slice(idx, idx + product_size) : null;
            }).filter((item) => item);
        }
        const sizeItems = !productDetail ? 2 :  products.length;
        return (
            <>
                <div className='product-list-wrapper' style={{backgroundColor:'#fff'}}>
                    {groups_products.map((items, idx) => idx < sizeItems && (
                        <div key={idx} className="col-lg-12 col-md-12 col-sm-12 ">
                            <CardDeck style={{margin:'5px'}}>
                                <ProductItem items={items} />
                            </CardDeck>

                        </div>
                    ))}
                </div>
                {/* {this.renderPaginatePage()} */}
            </>
        )
    }
}


const mapStateToProps = (state) => {
    const { pending, products, error } = state.products;
    return {
        pending: pending,
        products: products,
        error: error
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchProducts: fetchProductsAction
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductView);