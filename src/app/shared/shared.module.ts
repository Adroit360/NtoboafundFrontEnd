import { NgModule } from '@angular/core';
import { SlidePanelComponent } from './slide-panel/slide-panel.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations:[
        
        SlidePanelComponent
    ],
    imports:[
        CommonModule
    ],
    exports:[
        SlidePanelComponent
    ]
})
export class SharedModule{

}