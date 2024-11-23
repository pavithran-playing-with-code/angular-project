import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  posttask(data : any){
    return this.http.post<any>("http://localhost:3000/tasks/", data);
  }
  gettask(){ 
    return this.http.get<any>("http://localhost:3000/tasks/");
  } 
  puttask(data : any, id: any){
    return this.http.put<any>("http://localhost:3000/tasks/"+id, data);
  }
  deletetask(id: any  ){
    debugger
    return this.http.delete<any>("http://localhost:3000/tasks/"+id);
  }
}
