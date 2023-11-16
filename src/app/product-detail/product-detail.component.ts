import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProductDeleteComponent } from '../product-delete/product-delete.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  constructor(
    private produtsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
    
  ) { }

  ngOnInit() {
    this.produtsService
    .getProduct(this.route.snapshot.params["id"])
    .subscribe((data) => {
      this.product = data;
    });
  }

  openDeleteDialog(productId: number): void{
    this.dialog.open(ProductDeleteComponent, {data: {productId:productId}})
  }

  updateProduct(){
    this.router.navigate(['/product/update', this.route.snapshot.params['id']])
  
  }

  closeProduct(){
    this.router.navigate(['/products']);

  }


}
