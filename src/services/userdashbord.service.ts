import { UserStatistics } from "src/models/Dtos/userStatistics";
import { settings } from "src/settings";

export class UserDashBoardService{
    headerText:string;
    userStatistics: UserStatistics;
    constructor(){
    }

    // getUserStatistics(){
    //     if(this.userStatistics){return};
    //     return this.http.get(`${settings.currentApiUrl}/users/statistics/${this.authService.currentUser.id}`).subscribe(
    //       (response:UserStatistics)=>{
    //           console.log(response);
    //           this.userStatistics = response;
    //       },
    //       error=>{
    //         console.log(error);
    //       }
    //     )
    
    // }
}