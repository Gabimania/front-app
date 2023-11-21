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
  productsStockPrice = [];
  productsDate = [];
  constructor(
    private contactsService: ContactsService,
    private productsService: ProductsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.contactsService.getContacts().subscribe((data) => {
      this.initialLetter = this.calculateInitialLettersData(data);
      this.contactsByFullName = this.calculateContactsByFullNameData(data);
      this.emailExtensions = this.calculateEmailExtensionsData(data);
      this.phonePrefixData = this.generatePhoneProfixData(data);
    });
    this.productsService.getProducts().subscribe((data) => {
      this.categoryService.getCategories().subscribe((data2) => {
        this.productsStock = this.countProductsStock(data);
        this.productsList = this.productsPrices(data);
        this.productsStockPrice = this.ShowStockandPrice(data, data2);
        this.productsDate = this.productsByDate(data);
      });
    });
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
        stockMap.set(pName, stockMap.get(pName) + pStock);
      } else {
        stockMap.set(pName, pStock);
      }
    });
    let productsStock = [];
    stockMap.forEach((value, key) => {
      productsStock.push({ name: key, value: value });
    });

    return productsStock;
  }

  productsPrices(products: any[]): any {
    let productMap = new Map<string, number>();

    products.forEach((product) => {
      let productName = product.name;
      let productPrice = product.price;
      productMap.set(productName, productPrice);
    });
    let productsList = [];
    productMap.forEach((value, key) => {
      productsList.push({ name: key, value: value });
    });
    return productsList;
  }

  ShowStockandPrice(products: any[], categories: any[]): any {
    const total = [];
    const total2 = [];
    var categoryData = []; //array de objetos
    var newCategory = {};

    for (let i = 0; i < categories.length; i++) {
      total[i] = 0;
      total2[i] = 0;
      for (let j = 0; j < products.length; j++) {
        if (products[j].kind_product.name == categories[i].name) {
          total[i] += products[j].stock * products[j].price;
          total2[i] += products[j].stock;
        }
      }
      addCategory(categories[i].name, "price", total[i], "stock", total2[i]);
    }

    function addCategory(name, price, value, stock, value2) {
      newCategory = {
        name: name,
        series: [
          {
            name: price,
            value: value,
          },
          {
            name: stock,
            value: value2,
          },
        ],
      };
      categoryData.push(newCategory);
    }
    return categoryData;
  }

  productsByDate(products: any[]): any {
    products.sort((a, b) => b.price - a.price);
    var expensivestProducts = [];
    var newProduct = {};

    let x = 10;
    for (let i = 0; i < x; i++) {
      var expresionRegular = /\d{4}/;

      addProduct(
        products[i].name,
        products[i].price,
        products[i].date_added.match(expresionRegular)[0]
      );
    }

    function addProduct(name, price, date) {
      newProduct = {
        name: name,
        series: [
          {
            name: date,
            value: price,
          },
        ],
      };
      expensivestProducts.push(newProduct);
    }
    return expensivestProducts;
  }
}
