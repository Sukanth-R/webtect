import { Injectable } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];

  constructor() { }

  getItems(): Product[] {
    return this.cart;
  }

  addToCart(product: Product): void {
    this.cart.push(product);
  }

  clearCart(): void {
    this.cart = [];
  }

  removeFromCart(product: Product): void {
    this.cart = this.cart.filter(item => item.id !== product.id);
  }
}
