class Day {
    year:any;
    month:any;
    day:any;

    today = new Date();
    constructor(){
        this.year = this.today.getFullYear();
        this.month = this.today.getMonth();
        this.day = this.today.getDay();

        this.monthBuild(this.today)

    }

    daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    monthBuild(date){
        console.log(date)
        let start = Date.UTC(date.getFullYear(),date.getMonth());
        let last = Date.UTC(date.getFullYear(),date.getMonth()+1,0);
        console.log(start,last)
    }
}

// July
let today = new Day();
// document.write(this.today.year);
// document.write(this.today.month);
// document.write(this.today.daysInMonth(this.today.month,this.today.year)+"");

// let tbody = document.getElementById("calBody");
// let row = tbody.insertRow(tbody.rows.length);
// let cell1 = row.insertCell(0);
// let cell2 = row.insertCell(1);
// cell1.innerHTML = "NEW CELL1";
// cell2.innerHTML = "NEW CELL2";