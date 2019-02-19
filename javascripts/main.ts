//계획 class
class Plan{
    color = ['blue','yellow','purple','red','gray','black'];
    planGroup:Array<any> = [];
    constructor(){
        this.load();
    }

    //local storage에서 데이터를 가지고 온다
    load(){
        let list = JSON.parse(localStorage.getItem('planGroup'));
        if(list != null){
            for(let i = 0 ; i<list.length;i++){
                this.planGroup.push({
                    groupNo:list[i].groupNo,
                    title:list[i].title,
                    color:list[i].color,
                    startDate:new Date(list[i].startDate),
                    endDate:new Date(list[i].endDate),
                    memo:list[i].memo,
                })
            }
        }

        let today = new Date();
        (<HTMLInputElement>document.getElementById('startDate')).value =today.getFullYear()+"-"+((today.getMonth()+1)>9?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+(today.getDate());
        (<HTMLInputElement>document.getElementById('endDate')).value =today.getFullYear()+"-"+((today.getMonth()+1)>9?(today.getMonth()+1):"0"+(today.getMonth()+1))+"-"+(today.getDate()+1);

        (<HTMLInputElement>document.getElementById('starttime')).value = today.getHours()+"";
        (<HTMLInputElement>document.getElementById('endtime')).value = today.getHours()+"";
    }

    //local storage에 현재 있는 plan들을 저장한다
    saveLocal(){
        localStorage.setItem('planGroup',JSON.stringify(this.planGroup));
    }

    //기간 동안 있는 plan들을 가져온다
    planSearch(s:any,e:any,year:any,month:any,day:any,cb:any){
        let list:any = [];
        // s = timeset(s);
        // e = timeset(e);
        this.groupToitem(s,e, (plans:any)=> {
            if(plans.length == 0){
                cb(list);
            }
            else {
                for(let i = 0; i<plans.length;i++){
                    if(plans[i].year == year && plans[i].month == month && plans[i].day ==day){
                        list.push(plans[i]);
                    }
                    if(i == plans.length-1){
                        cb(list);
                    }
                }
            }
        });
    }
    dateDiff(date1:any, date2:any) {
        let d1 = new Date(date1.getFullYear(),date1.getMonth(),date1.getDate());
        let d2 = new Date(date2.getFullYear(),date2.getMonth(),date2.getDate());
        d1.setHours(4);
        d2.setHours(3);
        let diff = Math.abs(d2.getTime() - d1.getTime());
        diff = Math.ceil(diff / (1000 * 3600 * 24));

        return diff+1;
    }

    //plan 추가 함수
    addPlan(){
        if((<HTMLInputElement>document.getElementById('title')).value==""){
            alert('제목을 입력해주세요')
        } else if(Number((<HTMLInputElement>document.getElementById('starttime')).value)>24 ||Number((<HTMLInputElement>document.getElementById('starttime')).value) <0 ||Number((<HTMLInputElement>document.getElementById('endtime')).value)>24 ||Number((<HTMLInputElement>document.getElementById('endtime')).value)<0)
            alert('시간은 0~24사이로 입력해 주세요')        
        else {
            let sd = new Date((<HTMLInputElement>document.getElementById('startDate')).value);
            sd = timeset(sd);
            sd.setHours(sd.getHours()+Number((<HTMLInputElement>document.getElementById('starttime')).value))

            let ed = new Date((<HTMLInputElement>document.getElementById('endDate')).value);
            ed = timeset(ed);
            ed.setHours(ed.getHours()+Number((<HTMLInputElement>document.getElementById('endtime')).value))
            if(ed>=sd){
                let data = {
                    groupNo:Date.now(),
                    title:(<HTMLInputElement>document.getElementById('title')).value,
                    color:(<HTMLInputElement>document.getElementById('color')).value,
                    startDate:sd,
                    endDate:ed,
                    memo:(<HTMLInputElement>document.getElementById('memo')).value,
                };
                this.planGroup.push(data);
                this.saveLocal();
                calendar.changeDate(0);
                endPop();
            } else {
                alert('종료날짜가 시작날짜보다 빠릅니다.')
            }
        }


    }
    getPlanGroup(no:number){
        let nothing=0;
        for(let i = 0; i<this.planGroup.length;i++){
            if(this.planGroup[i].groupNo == no){
                nothing = 1;
                return this.planGroup[i]
            }
            if( i == this.planGroup.length-1 && nothing == 0)
                return 0
        }
    }
    getPlans(startDate:any, endDate:any,cb:any){
        let list:any = [];
        if(this.planGroup.length==0)
            cb(list);
        for(let i = 0 ; i < this.planGroup.length ; i++){
            if(this.planGroup[i].endDate >=startDate && this.planGroup[i].startDate < endDate)
                list.push(this.planGroup[i]);
            if(i == this.planGroup.length-1){
                list.sort((a:any,b:any)=> a.startDate - b.startDate);
                cb(list);
            }
        }
    }

    //plan들을 화면에 보여주기 쉽게 영역별로 나누는 작업
    groupToitem(s:any,e:any,cb:any){
        plan.getPlans(s,e,(list:any)=>{
            if(list.length == 0)
                cb([]);
            let check:any =[];
            let plans:any = [];
            for(let i =0 ; i<this.dateDiff(e,s)-1 ;i++)
                check[i]=-1;
            for(let i = 0 ; i<list.length;i++){
                let diff:number = this.dateDiff(list[i].endDate,list[i].startDate)-1;
                for(let j=0; j<diff;j++) {
                    let saveDate = new Date(list[i].startDate);
                    saveDate.setDate(saveDate.getDate()+j);
                    if(s<saveDate){
                        if(j==0)
                            check[this.dateDiff(list[i].startDate, s) + j]++;
                        else {
                            check[this.dateDiff(list[i].startDate, s) + j] = check[this.dateDiff(list[i].startDate, s)];
                        }
                        plans.push({
                            year:saveDate.getFullYear(),
                            month:saveDate.getMonth(),
                            day:saveDate.getDate(),
                            start: j == 0 ? list[i].startDate.getHours() : -1,
                            end: j == diff - 1 ? list[i].endDate.getHours() : -1,
                            groupNo: list[i].groupNo,
                            title: list[i].title,
                            memo: list[i].memo,
                            color: list[i].color,
                            order: check[this.dateDiff(list[i].startDate, s)]
                        });
                    }
                    if (i == list.length - 1 && j == diff-1)
                        cb(plans);
                }
            }
        });

    }
    viewplan(){
        let todo = document.getElementById('todo');
        if(todo.style.display == "block"){
            todo.style.display = "none"
        } else {
            todo.style.display = "block"
        }
    }
    viewPlanEdn(){
        let todo = document.getElementById('todo');
        todo.style.display = "none";
    }
    showPlan(year:any,month:any,day:any){
        let todoTitle = document.getElementById('todoTitle');
        let sdate = new Date(year,month-1,day);
        let edate = new Date(year,month-1,day+1);
        todoTitle.innerHTML = "<div>"+year+"년"+ month+"월"+day+"일 할 일"+"</div>";
        plan.getPlans(sdate,edate,(list:any) =>{
            for(let i=0;i< list.length;i++){
                todoTitle.innerHTML +=
                    "<div>"
                        +"<div>"+(i+1)+"번</div>"
                        +"<div>제목: "+list[i].title+"</div>"
                        +"<div>메모: "+list[i].memo+"</div>"
                        +"<div>기간: "+list[i].startDate.getFullYear() +"-"+(list[i].startDate.getMonth()+1)+"-"+list[i].startDate.getDate()+" "+list[i].startDate.getHours()+"시 ~"+list[i].endDate.getFullYear() +"-"+(list[i].endDate.getMonth()+1)+"-"+list[i].endDate.getDate()+" "+list[i].endDate.getHours()+"시</div>"
                    "</div>"
            }

        });
    }

    //계획 선택시 팝업을 통해 보여주며 수정과 삭제가 가능하다
    planPop(groupNo:any){
        let planPop = document.getElementById('planPop');
        planPop.style.display="block";

        let plan = this.getPlanGroup(groupNo);
        let planControl = document.getElementById('planControl');

        let startTxt = plan.startDate.getFullYear()+"-"+(((plan.startDate.getMonth()+1)>9)?(plan.startDate.getMonth()+1):"0"+(plan.startDate.getMonth()+1))+"-"+(Number(plan.startDate.getDate())<10?"0"+plan.startDate.getDate():plan.startDate.getDate());
        let endTxt = plan.endDate.getFullYear()+"-"+(((plan.endDate.getMonth())+1>9)?(plan.endDate.getMonth()+1):"0"+(plan.endDate.getMonth()+1))+"-"+(Number(plan.endDate.getDate())<10?"0"+plan.endDate.getDate():plan.endDate.getDate());
                
        planControl.innerHTML = "<div>제목: <input id='editTitle' value='"+plan.title+"'></div>";
        planControl.innerHTML += "<div>시작일: <input id='editStartDate' type='date' value='"+startTxt+"'><input id='editstarttime' type='number' value='"+plan.startDate.getHours()+"'></div>";
        planControl.innerHTML += "<div>종료일: <input id='editEndDate' type='date' value='"+endTxt+"'><input id='editendtime' type='number' value='"+plan.endDate.getHours()+"'></div>";
        planControl.innerHTML += "<div>메모: <input id='editMemo' value='"+plan.memo+"'></div>";

        let select:any;
        for(let item of this.color){
            if(item == plan.color)
                select +="<option selected value="+item+">"+item+"</option>\n"
            else
                select +="<option value="+item+">"+item+"</option>\n"
        }
        planControl.innerHTML += "<div>색상 선택: <select id='editColor'>\n" +
            select+
            "</select></div>";

        let planBtn = document.getElementById('planBtn');

        planBtn.innerHTML = "<button onclick='plan.editPlan("+groupNo+");'>수정</button>"
        planBtn.innerHTML += "<button onclick='plan.deletePlan("+groupNo+");calendar.changeDate(0);plan.endPop();'>삭제</button>"
    }
    endPop(){
        let planPop = document.getElementById('planPop');
        planPop.style.display="none";

    }

    // plan 수정
    editPlan(groupNo:any){
        if((<HTMLInputElement>document.getElementById('editTitle')).value==""){
            alert('제목을 입력해주세요')
        } else {
            let sd = new Date((<HTMLInputElement>document.getElementById('editStartDate')).value);
            sd = timeset(sd);
            sd.setHours(sd.getHours()+Number((<HTMLInputElement>document.getElementById('editstarttime')).value))

            let ed = new Date((<HTMLInputElement>document.getElementById('editEndDate')).value);
            ed = timeset(ed);
            ed.setHours(ed.getHours()+Number((<HTMLInputElement>document.getElementById('editendtime')).value))

            if(ed>=sd){
                let plan = this.getPlanGroup(groupNo);
                plan.title = (<HTMLInputElement>document.getElementById('editTitle')).value;
                plan.color = (<HTMLInputElement>document.getElementById('editColor')).value;
                plan.startDate = sd;
                plan.endDate = ed;
                plan.memo = (<HTMLInputElement>document.getElementById('editMemo')).value;

                this.saveLocal();
                calendar.changeDate(0);
                endPop();
            } else {
                alert('종료날짜가 시작날짜보다 빠릅니다.')
            }
        }

    }
    deletePlan(groupNo:any){
        for(let i = 0 ; i< this.planGroup.length;i++){
            if(this.planGroup[i].groupNo==groupNo){
                this.planGroup.splice(i, 1);
            }
        }
        this.saveLocal();
    }
}

//달력 생성
class Calendar {
    plan: Plan;
    time: any;
    mode = 0; //달력이 일간, 월간, 주간을 저장한다. 0: 월간, 1: 주간, 0: 일간
    dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    constructor(){
        this.plan = new Plan;
        this.time = new Date();
        this.timeView();
        this.changeDate(0);
    }
    getMode(){
        return this.mode;
    }

    // 현 시각을 보여준다
    timeView(){
        let title = document.getElementById("timeTitle");
        title.innerHTML = "<div>"+this.time.getFullYear()+"년 "+(this.time.getMonth()+1)+"월 "+this.time.getDate()+"일 "+"</div>";
    }

    //날짜를 바꾸어 달력을 다시 생성
    changeDate(num:any){
        this.deleteCal();
        if(this.mode ==0){
            this.time.setMonth(this.time.getMonth()+num);
            this.makeMonthCal();
        } else if(this.mode ==1) {
            this.addDays(num*7);
            this.makeWeekCal();
        } else if (this.mode ==2){
            this.addDays(num);
            plan.showPlan(this.time.getFullYear(),this.time.getMonth()+1,this.time.getDate());
            this.makeDailyCal();
        }

        this.timeView();
    }
    addDays(days:any) {
        this.time.setDate(this.time.getDate() + days);
    }
    goToday(){
        this.time = new Date();
        this.changeDate(0);
    }
    changeMode(num:number){
        this.mode = num;
        this.changeDate(0);

    }
    daysInMonth (month:any, year:any) {
        return new Date(year, month+1, 0).getDate();
    }
    monthBuild(){
        let start = new Date(this.time.getFullYear(),this.time.getMonth(),1);
        return start.getDay();
    }
    timeEuqal(){
        let today = new Date();
        return today.getMonth() == this.time.getMonth() && today.getFullYear() == this.time.getFullYear()
    }

    //월간 달력 생성
    makeMonthCal(){
        let thead = document.getElementById("calHeader");
        let tbody = document.getElementById("calBody");
        let hrow = (<HTMLTableElement>thead).insertRow((<HTMLTableElement>thead).rows.length);
        let row = (<HTMLTableElement>tbody).insertRow((<HTMLTableElement>tbody).rows.length);
        let totalDay = this.monthBuild();


        for(let i = 0 ; i<7;i++){
            let cell = hrow.insertCell();
            if(i==0){
                cell.className="sun";
            } else if(i==6){
                cell.className="sat";
            }
            cell.innerHTML=this.dayNames[i];
        }


        for(let i = 0 ; i<totalDay;i++){
            row.insertCell(0);
        }
        let days = this.daysInMonth(this.time.getMonth(),this.time.getFullYear());
        let today = new Date();
        for(let i = 0 ; i<days;i++){
            let cell = row.insertCell();

            if(((i+1)==today.getDate())&& this.timeEuqal()){
                cell.className="today month";
            } else if((i+totalDay)%7==0){
                cell.className="sun month";
            } else if((i+totalDay+1)%7==0){
                cell.className="sat month";
            } else {
                cell.className="month";
            }
            cell.setAttribute('id',String(i)+1);
            this.plan.planSearch(new Date(this.time.getFullYear(),this.time.getMonth(),0),new Date(this.time.getFullYear(),this.time.getMonth()+1,0),
                    this.time.getFullYear(),this.time.getMonth(),i+1,
                    (planList:any) =>{
                let inner =  "<div onclick='plan.showPlan("+this.time.getFullYear()+","+(this.time.getMonth()+1)+","+(i+1)+")'>"+(i+1)+"</div>";
                let over=0;
                for(let j = 0 ; j<planList.length;j++){
                    if(planList[j].order<3){
                        if(planList[j].start!=-1 && planList[j].end!=-1){//시작 끝 동시
                            inner+="<div onclick='plan.planPop("+planList[j].groupNo+")' class='orderBoth order"+planList[j].order+" "+planList[j].color+"'>&nbsp;"+planList[j].title+"</div>"

                        } else if(planList[j].start!=-1 ){ //시작
                            inner+="<div onclick='plan.planPop("+planList[j].groupNo+")' class='orderStart order"+planList[j].order+" "+planList[j].color+"'> &nbsp;"+planList[j].title+"</div>"

                        } else if(planList[j].end!=-1){//끝
                            inner+="<div onclick='plan.planPop("+planList[j].groupNo+")' class='orderEnd order"+planList[j].order+" "+planList[j].color+"'>&nbsp;"+"</div>"

                        } else { //가운데
                            inner+="<div onclick='plan.planPop("+planList[j].groupNo+")' class='order order"+planList[j].order+" "+planList[j].color+"'>&nbsp; </div>"
                        }
                    } else {
                        over++;
                    }
                    if( j == planList.length-1 && over>0)
                        inner+="<div class='order over' onclick='plan.showPlan("+this.time.getFullYear()+","+(this.time.getMonth()+1)+","+(i+1)+")'>외 "+over+"개</div>"
                }



                        cell.innerHTML=inner;


                if((i+totalDay+1)%7==0){
                    row = (<HTMLTableElement>tbody).insertRow((<HTMLTableElement>tbody).rows.length);
                }
            });

        }
    }

    //주간 달력 생성
    makeWeekCal(){

        let thead = document.getElementById("calHeader");
        let tbody = document.getElementById("calBody");
        let hrow = (<HTMLTableElement>thead).insertRow((<HTMLTableElement>thead).rows.length);

        let now = this.time.getDay();

        hrow.insertCell();
        for(let i = 0 ; i<7;i++){
            let cell = hrow.insertCell();
            if(i==0){
                cell.className="sun";
            } else if(i==6){
                cell.className="sat";
            }
            cell.innerHTML=this.dayNames[i]+(this.time.getDate()+i-now);
            cell.setAttribute('onclick',"plan.showPlan("+this.time.getFullYear()+","+(this.time.getMonth()+1)+","+(this.time.getDate()-now+i)+")")
        }
        let today = new Date();
        for(let hour = 0;hour < 24; hour++){
            let row = (<HTMLTableElement>tbody).insertRow((<HTMLTableElement>tbody).rows.length);
            for(let i = 0 ; i<8;i++){
                let cell = row.insertCell();
                if(i==0){
                    cell.innerHTML=hour+"시";
                } else if(((this.time.getDate()+i-now-1)==today.getDate())&&this.timeEuqal()){
                    cell.className="today";
                } else if(i==1){
                    cell.className="sun";
                } else if(i==7) {
                    cell.className = "sat";
                }
                cell.className+=" week";
                cell.setAttribute('id',(this.time.getDate()+i-now-1)+"-"+hour);

            }
            if(hour == 23)
                this.makeWeekPlan();
        }
    }

    //주간 달력에 그래프를 추가
    makeWeekPlan(){
        let now = this.time.getDay();
        let s = (new Date(this.time.getFullYear(),this.time.getMonth(),this.time.getDate()-now));
        let e = (new Date(this.time.getFullYear(),this.time.getMonth(),this.time.getDate()-now+7));
        let check:any = [];
        for(let i=0 ; i <7 ; i++){
            check[i] = [];
            for(let j =0; j<24;j++ ){
                check[i][j]=-1;
            }
        }
        for(let i = 0 ; i<7;i++){   //각 시간별로 일정의 수를 먼저 저장
            this.plan.planSearch(s,e,
                this.time.getFullYear(),this.time.getMonth(),this.time.getDate()-now+i,
                (planList:any) =>{
                    for(let item of planList){
                        item.end = item.end==-1?23:item.end;
                        item.start = item.start==-1?0:item.start;
                        let height = item.end - item.start+1;
                        for(let size = item.start ; size < item.start+height;size++){
                            check[i][size]++;
                        }
                    }
                })
        }
        for(let i = 0 ; i<7;i++){

            this.plan.planSearch(s,e,
                this.time.getFullYear(),this.time.getMonth(),this.time.getDate()-now+i,
                    (planList:any) =>{
                let position:any = [];
                for(let j = 0 ; j<24 ; j++)
                    position.push(-1)
                for(let j = 0;j< planList.length ; j++){
                    planList[j].end = planList[j].end==-1?23:planList[j].end;
                    planList[j].start = planList[j].start==-1?0:planList[j].start;
                    let height = planList[j].end - planList[j].start+1;

                    for(let cnt = planList[j].start; cnt<planList[j].end+1 ;cnt++ ){
                        position[cnt]++;
                    }

                    let bar = document.getElementById(planList[j].day+'-'+planList[j].start);

                    if(check[i][planList[j].start]>2){
                        if(position[planList[j].start]<3){
                            let leftMargin = 1+(90 / (4))*position[planList[j].start];
                            bar.innerHTML += "<div onclick='plan.planPop("+planList[j].groupNo+")' class='weekbar "+planList[j].color+"' style='left:"+leftMargin+"%;width: calc(90% / "+(4)+");height: calc(19px + 22px * "+(height-1)+");'>"+planList[j].title+"</div>";
                        } else if(position[planList[j].start] ==3){
                            bar.innerHTML += "<div class='weekETC' onclick='plan.showPlan("+this.time.getFullYear()+","+(this.time.getMonth()+1)+","+(this.time.getDate()-now+i)+")'>+"+(check[i][planList[j].start]-2)+"</div>"
                        }
                    } else {
                        let widthSize =check[i][planList[j].start];
                        for(let due = 0 ; due <planList[j].end -planList[j].start+1;due++){
                            widthSize = widthSize>=check[i][planList[j].start+due]?widthSize:check[i][planList[j].start+due];
                        }
                        let leftMargin = 1+(90 / (widthSize+1))*position[planList[j].start];
                        bar.innerHTML += "<div onclick='plan.planPop("+planList[j].groupNo+")' class='weekbar "+planList[j].color+"' style='left:"+leftMargin+"%;width: calc(90% / "+(widthSize+1)+");height: calc(19px + 22px * "+(height-1)+");'>"+planList[j].title+"</div>";

                    }
                }
            })
        }
    }
    //일간 달력 생성
    makeDailyCal(){

        let thead = document.getElementById("calHeader");
        let tbody = document.getElementById("calBody");


        let hrow = (<HTMLTableElement>thead).insertRow((<HTMLTableElement>thead).rows.length);

        let now = this.time.getDay();

        hrow.insertCell();
        let cell = hrow.insertCell();
        cell.innerHTML=this.dayNames[this.time.getDay()]+(this.time.getDate());

        let today = new Date();
        for(let hour = 0;hour < 24; hour++){
            let row = (<HTMLTableElement>tbody).insertRow((<HTMLTableElement>tbody).rows.length);
            let cell = row.insertCell();
            cell.innerHTML = hour+"시";


            cell = row.insertCell();
            cell.className = "daily";
            cell.setAttribute('id',"day-"+hour);

            if(this.timeEuqal()&&today.getDate()==this.time.getDate()){
                cell.className = "daily today";
            }
        }
        let s:Date = new Date(this.time.getFullYear(),this.time.getMonth(),this.time.getDate());
        let e:Date = new Date(this.time.getFullYear(),this.time.getMonth(),this.time.getDate());

        s.setHours(0);
        e.setHours(23);
        e.setMinutes(59);
        e.setMilliseconds(59);

        let check:Array<any> = [];
        for(let j =0; j<24;j++ ){
            check[j]=-1;
        }
        this.plan.planSearch(s,e, //각 시간별로 일정의 수를 먼저 저장
            this.time.getFullYear(),this.time.getMonth(),this.time.getDate(),
            (planList:any) =>{
                for(let item of planList){
                    item.end = item.end==-1?23:item.end;
                    item.start = item.start==-1?0:item.start;
                    let height = item.end - item.start+1;
                    for(let size = item.start ; size < item.start+height;size++){
                        check[size]++;
                    }
                }
        });

        this.plan.planSearch(s,e,
            this.time.getFullYear(),this.time.getMonth(),this.time.getDate(),
            (planList:any) =>{
                let position:any = [];
                for(let j = 0 ; j<24 ; j++)
                    position.push(-1)
                for(let j = 0;j< planList.length ; j++){
                    planList[j].end = planList[j].end==-1?23:planList[j].end;
                    planList[j].start = planList[j].start==-1?0:planList[j].start;
                    let height = planList[j].end - planList[j].start+1;


                    for(let cnt = planList[j].start; cnt<planList[j].end+1 ;cnt++ ){
                        position[cnt]++;
                    }

                    let bar = document.getElementById("day-"+planList[j].start);

                    if(check[planList[j].start]>2){
                        if(position[planList[j].start]<3){
                            let leftMargin = 1+(96 / (4))*position[planList[j].start];
                            bar.innerHTML += "<div onclick='plan.planPop("+planList[j].groupNo+")' class='weekbar "+planList[j].color+"' style='left:"+leftMargin+"%;width: calc(96% / "+(4)+");height: calc(19px + 22px * "+(height-1)+");'>"+planList[j].title+"</div>";
                        } else if(position[planList[j].start] ==3){
                            bar.innerHTML += "<div class='dailyETC'  onclick='plan.showPlan("+this.time.getFullYear()+","+(this.time.getMonth()+1)+","+(this.time.getDate())+")'>+"+(check[planList[j].start]-2)+"</div>"
                        }
                    } else {
                        let widthSize =check[planList[j].start];
                        for(let due = 0 ; due <planList[j].end -planList[j].start+1;due++){
                            widthSize = widthSize>=check[planList[j].start+due]?widthSize:check[planList[j].start+due];
                        }
                        let leftMargin = (96 / (widthSize+1))*position[planList[j].start];
                        bar.innerHTML += "<div onclick='plan.planPop("+planList[j].groupNo+")' class='weekbar "+planList[j].color+"' style='left:"+leftMargin+"%;width: calc(96% / "+(widthSize+1)+");height: calc(19px + 22px * "+(height-1)+");'>"+planList[j].title+"</div>";

                    }
                }
            });
    }
    deleteCal() {
        let caltable = document.getElementById("calendar");
        while ((<HTMLTableElement>caltable).rows.length > 0) {
            (<HTMLTableElement>caltable).deleteRow((<HTMLTableElement>caltable).rows.length-1);
        }
    }
}
function timeset(date:any){     //한국 시간을 맞추기 위해 사용되는 함수
    return new Date(date.setHours(date.getHours() - 9));
}
let plan = new Plan;
let calendar = new Calendar;
function pop(){ 
    let pop = document.getElementById('pop');
    let popback = document.getElementById('popback');
    plan.endPop();

    popback.style.display = "block";
    pop.style.display = "block";
}
function endPop(){
    let popback = document.getElementById('popback');
    let pop = document.getElementById('pop');

    plan.endPop();

    popback.style.display = "none";
    pop.style.display = "none";
}
