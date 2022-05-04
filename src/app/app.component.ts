import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { options, fullpage_api, fullpageRef } from 'fullpage.js/dist/fullpage.extensions.min';
import { Client, Contact, FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Image paths
  logoPath = 'assets/img/logo.png'
  img1Path = 'assets/img/img1.png';

  angularPath = 'assets/img/angular.png';
  javaPath = 'assets/img/java.png';
  reactPath = 'assets/img/react.png';
  firebasePath = 'assets/img/firebase.png';
  
  // Configuration of fullpage.js api
  fullpage_api: fullpage_api;
  config: options = {

    licenseKey: 'LICENSE_KEY',
    anchors: ['home', 'team', 'technologies', 'clients', 'contact'],
    paddingTop:'100px',
    fixedElements: '#menu',
    verticalCentered: false,
    lazyLoading:false,
    recordHistory:false,
    menu: '#menu',
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Home', 'Team', 'Technologies', 'Clients', 'Contact'],
    slidesNavigation: true, 

    /**
     * Function, that triggers every time user loads a slide
     * @param section Section, where the slides are located.
     * @param origin Origin slide
     * @param destination Destination slide
     * @param direction Direction of movement
     */
    afterSlideLoad: (section:any, origin:any, destination:any, direction:any) => {
      this.slideIndex = String(Number(destination.index) + 1);
    }
  };

  /**
   * Boolean to disable submit button in SECTION 5 while the form is submitting
   */
  isSubmitting:boolean = false;

  /**
   * Array that containes all the clients that were fetched from the database
   */
  clients: Client[] = []

  /**
   * Modal that opens up after submitting a form in SECTION 5
   */
  @ViewChild('successModal')successModal:TemplateRef<any>;

  contactForm: FormGroup;

  /**
   * Index used in SECTION 3 for tracking the current slide index
   */
  slideIndex = "1";

  constructor(private firebase:FirebaseService, private modalService: NgbModal) {}
  
  /**
   * Method for fullpage.js to handle api events
   */
  getRef(fullPageRef : fullpageRef) {
    this.fullpage_api = fullPageRef;
  }
 
  ngOnInit(){
    this.initContactForm();
    this.firebase.getClients( (res:Client[]) => {
      this.clients = res;
    })
  }

  /**
   * Initializing contact form with Validators
   */
  initContactForm(){
    this.contactForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
      message: new FormControl(null, Validators.required),
    })
  }

  /**
   * Section CONTACT
   * 
   * Submits a new contact form to database and opens success modal.
   */
  sendMessage(){
    this.isSubmitting = true;

    let contact = new Contact();
    contact.name = this.contactForm.get('name').value;
    contact.email = this.contactForm.get('email').value;
    contact.message = this.contactForm.get('message').value;

    this.firebase.sendContact(contact, () => {
      this.isSubmitting = false;
      this.modalService.open(this.successModal);
      this.initContactForm();
    });
  }

}

