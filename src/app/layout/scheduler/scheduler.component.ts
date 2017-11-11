import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../shared/service/auth.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs/Subject';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-scheduler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./scheduler.component.scss'],
  templateUrl: './scheduler.component.html',
  animations: [routerTransition()]
})
export class SchedulerComponent implements OnInit {

    private schedulerData: any[] = [];
    private nowDate: any = null;

  view: string = 'month';

  viewDate: Date = new Date();

    constructor(private afAuth: AuthService, private router: Router) {
    }

    ngOnInit() {
	    if(!this.afAuth.getLoginAuth()) {
            alert("Authentication Failed.\nPlease Check Administrator for your Authentication.");
            this.afAuth.valueClear();
	        this.router.navigate(['/login']);
	    }
            else {
                this.nowDate = "" + (new Date().getUTCFullYear()) + "-" + (new Date().getUTCMonth() + 1) + "-";
                let dayTmp = new Date().getUTCDate();
                if(dayTmp < 10) this.nowDate += "0" + dayTmp;
                else this.nowDate += dayTmp;
                this.schedulerData = this.afAuth.getSchedulerDatas();
                this.events = [];
                for(let i = 0; i < this.schedulerData.length; i++) {
                    this.events.push({
                        title: this.schedulerData[i]['content'],
                        start: startOfDay(this.schedulerData[i]['date']),
                        color: colors.blue,
                        actions: this.actions
                    })
                }
            }
    }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        alert("If you want edit it, you can see below table");
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      title: 'There is no schedule.',
      start: startOfDay(this.nowDate),
      color: colors.blue,
      actions: this.actions
    }
  ];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    this.refresh.next();
  }

  addEvent(): void {
    this.events.push({
      title: 'New content',
      start: startOfDay(this.nowDate),
      color: colors.red,
    });
    this.refresh.next();
  }

  addScheduler() {
    for(let i = 0; i < this.events.length; i++) {
        this.afAuth.updateSchedulerData(this.events[i]['title'], this.events[i]['start']);
        console.log(this.events[i]);
    }
  }

  deleteScheduler(index) {
    this.afAuth.removeSchedulerData(this.events[index]['start']);
    this.events.splice(index, 1);
    this.refresh.next();
  }
}
