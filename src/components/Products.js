import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { generateCartItemsFrom } from "./Cart";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const {enqueueSnackbar} = useSnackbar();
  useEffect(() => {
    performAPICall();
    fetchCart(localStorage.getItem("token"));
  }, []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [productsInCart, setProductsInCart] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);

    await axios.get(config.endpoint + "/products").then((response) => {
      setLoading(false);
      setProducts(response.data);
    });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);

    await axios
      .get(config.endpoint + "/products/search?value=" + text)
      .then((response) => {
        setLoading(false);
        return setProducts(response.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setLoading(false);
          return setProducts(err.response.data);
        }
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const cartData = await axios
        .get(config.endpoint + "/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.data);

      setProductsInCart(cartData);
    } catch (e) {
      setProductsInCart([]);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.filter((item) => item.productId === productId).length > 0;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if (!token) return enqueueSnackbar("Login to add an item to the Cart", {
      variant: "error",
    });
  
    if(isItemInCart(items,productId)&&options.preventDuplicate===false) 
    return enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item",{variant:'warning'})

    if((!isItemInCart(items,productId)&&options.preventDuplicate===false)||(isItemInCart(items,productId)&&options.preventDuplicate===true))
    {  let url = config.endpoint + "/cart";
      let response=await axios.post(url,{
        productId:productId,
        qty:qty
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      setProductsInCart(response.data)
    }
     
    
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          // onChange={(e)=>{performSearch(e.target.value)}}
          onChange={(e) => {
            debounceSearch(e, debounceTimeout);
          }}
        />
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          performSearch(e.target.value);
        }}
      />

      <Grid container>
        <Grid
          item
          className="product-grid"
          md={localStorage.getItem("username") !== null ? 9 : 12}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {loading === true ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <CircularProgress />
              </Box>
              <Box>Loading Products...</Box>
            </Box>
          ) : products.length !== 0 ? (
            <Grid container spacing={2} py={4} px={2}>
              {products.map((item) => (
                <Grid item xs={6} md={3} key={item._id}>
                  <ProductCard
                    product={item}
                    handleAddToCart={()=>addToCart(localStorage.getItem('token'),productsInCart,products,item._id,1,{preventDuplicate:false})}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2} py={4} px={2}>
              <Box
                sx={{
                  display: "flex",
                  justifySelf: "center",
                  alignItemns: "center",
                  marginX: "auto",
                  marginY: "0",
                }}
              >
                <Box>No Products Found</Box>
                <Box>
                  <SentimentDissatisfied />
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
        {localStorage.getItem("username") !== null&&<Grid
          item
          sx={{ backgroundColor: "#E9F5E1" }}
          md={localStorage.getItem("username") !== null ? 3 : 12}
        >
          <Cart
            products={products}
            items={generateCartItemsFrom(productsInCart, products)}
            handleQuantity={addToCart}
          />
        </Grid>}
      </Grid>
      {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}

      <Footer />
    </div>
  );
};

export default Products;
