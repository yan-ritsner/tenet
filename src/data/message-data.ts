export class MessageData {

    constructor(message: string, date: Date, out: boolean) {
      this.message = message;
      this.date = date;
      this.out = out;
      this.day = this.getDay();
      this.main = this.getMin();
    }
  
    public message: string;
    public date: Date;
    public day: number;
    public min: number;
    public out: boolean;

    getDay()
    {
      var d = new Date(this.date);
      d.setHours(0, 0, 0, 0);
      return d.valueOf();
    }

    getMin()
    {
      var d = new Date(this.date);
      d.setSeconds(0,0);
      return d.valueOf();
    }
  }
  