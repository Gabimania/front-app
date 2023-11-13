import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../products.service";
import { Router } from "@angular/router";
import { Product } from "../model/Product";
import { CategoryService } from "../category.service";
import { Category } from "../model/Category";

@Component({
  selector: "app-product-new",
  templateUrl: "./product-new.component.html",
  styleUrls: ["./product-new.component.css"],

})
export class ProductNewComponent implements OnInit {
  product: Product = new Product();
  active:string;
  kind_product: Category = new Category();
  categories: [];

  
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  newProduct() {
    if (this.active=='true'){
      this.product.active= true;
    }else{
      this.product.active= false;
    }
    const product = {
      name: this.product.name,
      stock: this.product.stock,
      price: this.product.price,
      active: this.product.active,
      date_added: this.product.date_added,
      kind_product: this.kind_product,
    };
    this.productsService.newProduct(product);
    this.navigateToHome();
  }

  calcelInsert() {
    this.navigateToHome();
  }

  navigateToHome() {
    this.router.navigate(["/products"]);
  }
}
