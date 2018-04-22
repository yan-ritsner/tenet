export class MessageData {

    constructor(message: string, date: Date, out: boolean) {
      this.message = message;
      this.date = date;
      this.out = out;
      this.day = this.getDay();
    }
  
    public message: string;
    public date: Date;
    public day: number;
    public out: boolean;

    getDay()
    {
      var d = new Date(this.date);
      d.setHours(0, 0, 0, 0);
      return d.valueOf();
    }

  }
  