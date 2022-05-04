import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import * as Firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db:AngularFirestore){}

  /**
   * Fetching all clients from Firestore database (SECTION 4)
   * @param doSomething - the function that should be executed after getting a response from API.
   */
  getClients(doSomething:Function){
    this.db.collection<Client>(CLIENT_URL).get().subscribe({
      next: (res:QuerySnapshot<Client>) => doSomething(res.docs.map((doc) => {
        return doc.data() as Client 
      })),
      error: (err) => console.log(err),
    })
  }

  /**
   * Submitting contact form, and saving it into Firestore database (SECTION 5)
   * @param contact - Form input
   * @param doSomething - The function that should be executed after getting a response from API.
   * @var createdAt - Firebase timestamp
   */
  sendContact(contact:Contact, doSomething:Function){
    contact.createdAt = Firebase.default.firestore.FieldValue.serverTimestamp();
    this.db.collection(CONTACT_URL).add({...contact})
    .then( success => {
      doSomething();
    })
  }

}

export const CLIENT_URL = "/clients"
export const CONTACT_URL = "/contact"

export class Client{
  name:string;
  link:string;
}

export class Contact{
  name:string;
  email:string;
  message:string;
  createdAt:any;
}
