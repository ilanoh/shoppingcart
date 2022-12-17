import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const ProductList = () => {
    // Define State of the Cart and the list of products available
    const [productList, setProductList] = useState([])
    const [cart, setCart] = useState([])
    const prevCart = useRef(cart);


    // Fetch the list of products from the API
    useEffect(() => {
        axios.get('https://fakestoreapi.com/products')
            .then(response => {
                setProductList(response.data);
            })
    }, [])

    // Refresh methods

    // Restore the cart if a cart exists in localstorage
    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
            setCart(JSON.parse(storedCart))
        }
    }, [])

    //cart.map(product => document.getElementById(product.id).value = product.quantity)

    // Save the cart in localstorage everytime cart is modified
    useEffect(() => {
        if (prevCart.current !== cart) {
            window.localStorage.setItem('cart', JSON.stringify(cart))
            prevCart.current = cart
        }
    }, [cart])


    // Cart

    // Function that update the cart when input is modified
    const updateCart = (event) => {
        const id = Number(event.target.id)
        const quantity = Number(event.target.value)
        const foundProduct = productList.find(product => product.id === id)
        const itemAlreadyInCart = cart.find(product => product.id === id)

        // Define object to store in the cart
        const productToAdd = {
            id: foundProduct.id,
            price: foundProduct.price,
            title: foundProduct.title,
            quantity: quantity
        }

        // Add item to the cart (if), or modify quantity (else), or remove from 
        // the cart if quantity is 0 (filter)
        if (!itemAlreadyInCart) {
            setCart(cart => [...cart, productToAdd])
        } else {
            setCart(cart => cart.map(product => {
                if (product.id === id) {
                    return {
                        ...product,
                        quantity: quantity
                    }
                }
                return product
            }).filter(product => product.quantity !== 0))
        }
    }

    // Function that remove an element from the cart and reset the input to 0
    const removeFromCart = (id) => {
        setCart(cart.filter(product => product.id !== id))
        document.getElementById(id).value = 0
    }

    // Calculate the price of the products in the cart
    const price = cart.reduce((result, currentProduct) => result + currentProduct.price * currentProduct.quantity, 0)

    // Calculate the shipping value if shipping value is $20 for every multiple of 4 objects
    const shippingValue = 20 * (Math.trunc(cart.reduce((result, currentProduct) => result + currentProduct.quantity, 0) / 4) + 1)
    
    return ( 
        <div className="shopping-cart">
            <div className="products">
                {productList.map(product => (
                    <div key={product.id} className="card">
                        <img src={product.image} alt={product.name} />
                        <div className="container">
                            <h4>{product.title}</h4>
                            <div>${product.price}</div>
                            <input
                                id={product.id}
                                type="number"
                                min="0"
                                max="10"
                                value={cart.find(item => item.id === product.id)?.quantity || 0}
                                onChange={(event) => updateCart(event)}>
                            </input>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h2>Cart Summary</h2>
                {cart.map(product => (
                    <div key={product.id}>
                        {product.title} - {product.quantity}
                        <button onClick={() => removeFromCart(product.id)}>Remove</button>
                    </div>
                ))}
                Shipping: ${shippingValue}
                <br />
                Price: ${price}
            </div>
        </div>
    )
}

export default ProductList