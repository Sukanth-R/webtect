import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products = [
    { id: 1, name: 'Poco M2 Pro', price: 14999, description: 'Processor:snapdragon 720G', imageUrl: './assets/image/m2.webp' },
    { id: 2, name: 'Poco X6', price: 19999, description: 'Processor:snapdragon 7s Gen 2', imageUrl: './assets/image/x6.webp' },
    { id: 3, name: 'Poco X6 Pro', price:24999, description: 'Processor:snapdragon 8 gen 1', imageUrl: './assets/image/x6p.jpg' },
    { id: 4, name: 'Poco F5', price: 29999, description: 'Processor:snapdragon 8 gen 2', imageUrl: './assets/image/f5.webp' },
    { id: 5, name: 'Poco F6 Pro', price: 35000, description: 'Processor:snapdragon 8 gen 3', imageUrl: './assets/image/f6.jpg' }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
