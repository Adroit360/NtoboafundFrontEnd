import { Pipe, PipeTransform } from "@angular/core";
import { settings } from "src/settings";

@Pipe({
    name:"cookimage"
})
export class CookImagePipe implements PipeTransform{
    transform(imageUrl: string = "") {
        let isServerImage:boolean = imageUrl.startsWith('/images');
        if(isServerImage){
            return settings.currentApiUrl + imageUrl;
        }
        return imageUrl;
    }

}