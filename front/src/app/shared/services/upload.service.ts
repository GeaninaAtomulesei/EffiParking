/**
 * Created by gatomulesei on 3/16/2018.
 */
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {HttpRequest} from "@angular/common/http";

@Injectable()
export class UploadService {

  constructor(private http : HttpClient) {}

  pushFileToStorage(file : File, userId: number) : Observable<HttpEvent<{}>> {
    let formData : FormData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest('POST', '/api/users/uploadPhoto?userId= ' + userId, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(request);
  }

  getPhoto(userId: string) : Observable<any> {
    return this.http.get('/api/users/getPhoto/' + userId)
  }

}
