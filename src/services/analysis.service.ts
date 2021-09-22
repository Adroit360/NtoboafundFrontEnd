import { HttpClient } from '@angular/common/http';
import { AnalysisModel } from 'src/models/Dtos/analysisModel';
import { settings } from 'src/settings';
import { injectArgs } from '@angular/core/src/di/injector_compatibility';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class AnalysisService implements OnInit{

    defaultAnalysis:AnalysisModel
    /**
     *
     */
    constructor(private httpClient:HttpClient) {
        this.defaultAnalysis = new AnalysisModel();
        this.getDefaultAnalysis();
    }

    ngOnInit(){
       
    }

    getDefaultAnalysis(){
        this.httpClient.get(`${settings.currentApiUrl}/analysis`).subscribe(
            (response:AnalysisModel)=>{
                console.log(response);
                this.defaultAnalysis = response;
            },
            error=>{
                console.log("failed to get Analysis");
            }
        )
    }

}