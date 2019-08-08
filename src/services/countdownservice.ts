import { Subject } from 'rxjs';

export class CountDownService {
    DailyHoursTime: Subject<number>;
    DailyMinutesTime: Subject<number>;
    DailySecondsTime: Subject<number>;

    MonthlyDaysTime:Subject<number>;
    MonthlyHoursTime:Subject<number>;
    MonthlyMinutesTime:Subject<number>;
    MonthlySecondsTime:Subject<number>;

    quaterlyMonths = [3,6,9,12]
    QuaterlyDaysTime:Subject<number>;
    QuaterlyHoursTime:Subject<number>;
    QuaterlyMinutesTime:Subject<number>;
    QuaterlySecondsTime:Subject<number>;
    /**
     *
     */
    constructor() {
        this.DailyHoursTime = new Subject();
        this.DailyMinutesTime = new Subject();
        this.DailySecondsTime = new Subject();

        this.MonthlyDaysTime  = new Subject();
        this.MonthlyHoursTime  = new Subject();
        this.MonthlyMinutesTime  = new Subject();
        this.MonthlySecondsTime  = new Subject();

        this.QuaterlyDaysTime  = new Subject();
        this.QuaterlyHoursTime  = new Subject();
        this.QuaterlyMinutesTime  = new Subject();
        this.QuaterlySecondsTime  = new Subject();

        this.countDown();
    }
    countDown() {
        //get the current date
        var d = new Date();
        //construct and arbitrary date from current date with specified time
        //getMonth returns months starting with 0
        let currentYear = d.getFullYear();
        var currentMonth = d.getMonth() + 1;
        var dailyCtDate = new Date(currentMonth + " " + d.getDate() + "," + currentYear + " 18:00:00");
        var dailyCountDownDate = dailyCtDate.getTime();

        //Variables for DailyCalculations
        var yearForMonthly = currentYear;
        var monthForMonthly:number = currentMonth
        var daysInMonthlyMonth:number = this.daysInMonth(monthForMonthly,yearForMonthly);
        var monthlyCtDate = new Date(monthForMonthly + " " + daysInMonthlyMonth + "," + yearForMonthly + " 18:00:00");
        var monthlyCountDownDate = monthlyCtDate.getTime();
        
        //Variables for QuaterlyCalculations
        var yearForQuaterly = currentYear == 12 ? currentYear + 1 : currentYear;
        var monthForQuaterly:number = this.getQuaterlyMonth(currentMonth);
        var daysInQuaterlyMonth:number = this.daysInMonth(monthForQuaterly,yearForQuaterly);
        var QuaterlyCtDate = new Date(monthForQuaterly + " " + daysInQuaterlyMonth + "," + yearForQuaterly + " 18:00:00");
        var quaterlyCountDownDate = QuaterlyCtDate.getTime();

        setInterval(function () {
            //NB: BECAUSE ALL DRAWS ARE MADE AT 18:00:00 THE TIME FROM THE DAILY CT CAN BE USED FOR THE QUATERLY

            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var dailyDistance = dailyCountDownDate - now;
            var monthlyDistance = monthlyCountDownDate - now;
            var quaterlyDistance = quaterlyCountDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var monthlyDays = Math.floor(monthlyDistance / (1000 * 60 * 60 * 24));
            var quaterlyDays = Math.floor(quaterlyDistance / (1000 * 60 * 60 * 24));
            this.MonthlyDaysTime.next(monthlyDays);
            this.QuaterlyDaysTime.next(quaterlyDays);

            var hours = Math.floor((dailyDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            //var quaterlyHours = Math.floor((quaterlyDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            //var MonthlyHours = Math.floor((monthlyDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.DailyHoursTime.next(hours);
            this.MonthlyHoursTime.next(hours);
            this.QuaterlyHoursTime.next(hours);
            

            var minutes = Math.floor((dailyDistance % (1000 * 60 * 60)) / (1000 * 60));
            //var monthlyMinutes = Math.floor((monthlyDistance % (1000 * 60 * 60)) / (1000 * 60));
            //var quaterlyMinutes = Math.floor((quaterlyDistance % (1000 * 60 * 60)) / (1000 * 60));
            this.DailyMinutesTime.next(minutes);
            this.MonthlyMinutesTime.next(minutes);
            this.QuaterlyMinutesTime.next(minutes);

            var seconds = Math.floor((dailyDistance % (1000 * 60)) / 1000);
            //var quaterlyseconds = Math.floor((quaterlyDistance  % (1000 * 60)) / 1000);
            this.DailySecondsTime.next(seconds);
            this.MonthlySecondsTime.next(seconds);
            this.QuaterlySecondsTime.next(seconds);
            

        }.bind(this), 1000);
    }

    getQuaterlyMonth(currentMonth){
        for(let month of this.quaterlyMonths){
            if(month > currentMonth){
                //set the quaterly months
                return month
            }
            continue;
        }
    }

    daysInMonth (month, year) { 
        return new Date(year, month, 0).getDate(); 
    }
}