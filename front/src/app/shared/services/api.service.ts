import {Injectable} from "@angular/core";
import {HttpHeaders} from "@angular/common/http";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {serialize} from "../utilities/serialize";
import {HttpRequest} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export enum RequestMethod {
  Get = "GET",
  Head = "HEAD",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
  Options = "OPTIONS",
  Patch = "PATCH"
}

@Injectable()
export class ApiService {

  headers = new HttpHeaders({
    'Accept' : 'application/json',
    'Content-Type' : 'application/json',
    'Authorization' : 'Bearer ' + localStorage.getItem("access_token")
  });

  constructor(private http : HttpClient) {}

  get(path: string, args?: any) : Observable<any> {
    const options = {
      headers: this.headers,
      withCredentials: true
    };
    if(args) {
      options['params'] = serialize(args);
    }
    return this.http.get(path, options)
      .catch(this.checkError.bind(this));
  }

  post(path: string, body: any, customHeaders?: HttpHeaders) : Observable<any> {
    return this.request(path, body, RequestMethod.Post, customHeaders);
  }

  put(path: string, body?: any) : Observable<any> {
    return this.request(path, body, RequestMethod.Put);
  }

  delete(path: string, body?: any): Observable<any> {
    return this.request(path, body, RequestMethod.Delete);
  }

  private request(path: string, body: any, method = RequestMethod.Post, customHeaders?: HttpHeaders) : Observable<any> {
    const req = new HttpRequest(<string> method, path, body, {
      headers : customHeaders || this.headers,
      withCredentials: true
    });
    //noinspection TypeScriptUnresolvedFunction
    return this.http.request(req)
      .filter(response => response instanceof HttpResponse)
      .map((response: HttpResponse<any>) => response.body)
      .catch(error => this.checkError(error));
  }

  private checkError(error: any): any {
    console.log(error);
    throw error;
  }
}
