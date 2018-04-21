export class MessageData {

    constructor(message: string, date: Date, out: boolean) {
      this.message = message;
      this.date = date;
      this.out = out;
    }
  
    public message: string;
    public date: Date;
    public out: boolean;

    day()
    {
      var d = new Date(this.date);
      d.setHours(0, 0, 0, 0);
      return d;
    }

  }
  