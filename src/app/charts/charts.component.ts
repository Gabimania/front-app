import { Component, OnInit } from "@angular/core";
import { ContactsService } from "../contacts.service";
import { ProductsService } from "../products.service";
import { CategoryService } from "../category.service";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.css"],
})
export class ChartsComponent implements OnInit {
  initialLetter = [];
  contactsByFullName = [];
  emailExtensions = [];
  phonePrefixData = [];
  productsStock = [];
  productsList = [];
  constructor(
    private contactsService: ContactsService,
    private productsService: ProductsService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.contactsService.getContacts().subscribe((data) => {
      this.initialLetter = this.calculateInitialLettersData(data);
      this.contactsByFullName = this.calculateContactsByFullNameData(data);
      this.emailExtensions = this.calculateEmailExtensionsData(data);
      this.phonePrefixData = this.generatePhoneProfixData(data);
      
    });
    this.productsService.getProducts().subscribe((data)=>{
      this.categoryService.getCategories().subscribe(data2=>{
        this.productsStock = this.countProductsStock(data);
        this.productsList = this.productsPrices(data);

      })
      
    })
  }
  calculateInitialLettersData(contacts: any[]): any {
    return contacts.reduce((result, contact) => {
      const initial = contact.username.charAt(0).toUpperCase();
      if (result.find((item) => item.name === initial)) {
        result.find((item) => item.name === initial).value++;
      } else {
        result.push({ name: initial, value: 1 });
      }

      return result;
    }, []);
  }
  calculateContactsByFullNameData(contacts: any[]): any {
    let tempContactsByFullName = [
      {
        name: "Contacts",
        series: [],
      },
    ];
    contacts.forEach((contact) => {
      let fullName = contact.name + contact.username + contact.secondusername;
      const size = fullName.length;
      const range = `${size - (size % 5)} - ${size - (size % 5) + 4} ch.`;
      let existingRange = tempContactsByFullName[0].series.find(
        (item) => item.name === range
      );
      if (existingRange) {
        existingRange.value++;
      } else {
        tempContactsByFullName[0].series.push({ name: range, value: 1 });
      }
    });

    return tempContactsByFullName.map((entry) => {
      return {
        ...entry,
        series: entry.series.sort(
          (a, b) => Number(a.name.split("-")[0]) - Number(b.name.split("-")[0])
        ),
      };
    });
  }

  calculateEmailExtensionsData(contacts: any[]): any {
    let emailExtensionsMap = new Map<string, number>();
    contacts.forEach((contact) => {
      let emailParts = contact.email.split("@");
      if (emailParts.length == 2) {
        const domain = emailParts[1];
        const firstDotIndex = domain.indexOf(".");
        if (firstDotIndex != -1) {
          const extension = domain.substring(firstDotIndex);
          if (emailExtensionsMap.has(extension)) {
            emailExtensionsMap.set(
              extension,
              emailExtensionsMap.get(extension) + 1
            );
          } else {
            emailExtensionsMap.set(extension, 1);
          }
        }
      }
    });

    let emailExtensions = [];
    emailExtensionsMap.forEach((value, key) => {
      emailExtensions.push({ name: key, value: value });
    });
    return emailExtensions;
  }

  generatePhoneProfixData(contacts: any[]): any {
    let phoneProfixdata = [];
    let prefixCounts = {};
    contacts.forEach((contact) => {
      const phonePrefix = String(contact.phone).substring(0, 1);
      if (prefixCounts[phonePrefix]) {
        prefixCounts[phonePrefix]++;
      } else {
        prefixCounts[phonePrefix] = 1;
      }
    });
    for (let prefix in prefixCounts) {
      if (prefixCounts.hasOwnProperty(prefix)) {
        phoneProfixdata.push({ name: prefix, value: prefixCounts[prefix] });
      }
    }
    return phoneProfixdata;
  }

  countProductsStock(products: any[]): any {
    let stockMap = new Map<string, number>();
    products.forEach((product) => {
      let pName = product.name;
      let pStock = product.stock;
      if (stockMap.has(pName)) {
        stockMap.set(pName, stockMap.get(pName)+ pStock);
      } else {
        stockMap.set(pName, pStock);
      }
    });
    let productsStock = [];
    stockMap.forEach((value, key)=>{
      productsStock.push({name:key, value:value});
    });

    return productsStock;
  }

  productsPrices(products: any[]):any{
    let productMap = new Map<string, number>();
    
    products.forEach((product)=>{
      let productName = product.name;
      let productPrice = product.price;
      productMap.set(productName, productPrice);
      
    })
    let productsList = [];
    productMap.forEach((value,key)=>{
      productsList.push({name:key, value:value});
      console.log(productsList);
    })
    return productsList;
  }
}


