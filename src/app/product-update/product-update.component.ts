import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../products.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../category.service";
import { Category } from "../model/Category";

@Component({
  selector: "app-product-update",
  templateUrl: "./product-update.component.html",
  styleUrls: ["./product-update.component.css"],
})
export class ProductUpdateComponent implements OnInit {
  product: any;
  categories: [];
  active:string;
  kind_product: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService
      .getCategories()
      .subscribe((data) => {
        this.categories = data;
        
      });

      this.productService
      .getProduct(this.route.snapshot.params["id"])
      .subscribe((data) => {
        this.product = data;
        
        if (!this.product.kind_product){
          this.product.kind_product = new Category();
        }
        console.log(this.product.kind_product);
  });

}
  updateProduct() {
    this.productService.updateProduct(this.product);
    this.navigateDetail();
  }

  cancelUpdate() {
    this.navigateDetail();
  }

  navigateDetail() {
    this.router.navigate(["/product", this.route.snapshot.params["id"]]);
  }
}
