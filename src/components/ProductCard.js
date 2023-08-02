import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  
  return (
    <Card className="card" >
      <CardMedia
        component="img"
        image={product.image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom fontWeight="bold" variant="h5" component="div">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button size="large" fullWidth className="button" variant="contained" onClick={handleAddToCart}>
          <AddShoppingCartOutlined/>
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
