import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ContactsService } from "../contacts.service";

@Component({
  selector: "app-contact-new",
  templateUrl: "./contact-new.component.html",
  styleUrls: ["./contact-new.component.css"],
})
export class ContactNewComponent implements OnInit {
  name: string;
  username: string;
  secondusername: string;
  phone: number;
  email: string;
  constructor(
    private router: Router,
    private contactsService: ContactsService
  ) {}

  ngOnInit() {}

  newContact() {
    const contact = {
      name: this.name,
      username: this.username,
      secondusername: this.secondusername,
      phone: this.phone,
      email: this.email,
    }
    this.contactsService.newContact(contact);
    this.navigateToHome();
  }

  calcelInsert() {
    this.navigateToHome();
  }

  navigateToHome() {
    this.router.navigate(["/contacts"]);
  }
}
