import { Injectable } from '@angular/core';
import { UtilityServiceService } from './utility-service.service';
import { CompilerRequest } from '../entity/compiler-request';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CodePlayGroundService {

  BASE_URL = this.utilityService.getBaseUrl();
  COMPILER_URL = this.BASE_URL + '/compiler';
  constructor(private utilityService:UtilityServiceService,private http:HttpClient) { }

  public compileCode(compilerReq:CompilerRequest){
    return this.http.post(`${this.COMPILER_URL}/compile`, compilerReq);
  }
}
