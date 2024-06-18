import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'

})
export class MyserviceService {
  dept="Kongu Engineering College";
  constructor() { }
  getdepartment()
  {
    return this.dept;
  }
}
