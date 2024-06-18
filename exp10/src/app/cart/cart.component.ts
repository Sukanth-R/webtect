import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: Product[] = [];
  orderPlaced = false; // New state to track if order is placed

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.items = [];
  }

  placeOrder(): void {
    this.orderPlaced = true; // Set order placed to true
    this.cartService.clearCart(); // Clear the cart
    this.items = []; // Update local items array
  }
}
