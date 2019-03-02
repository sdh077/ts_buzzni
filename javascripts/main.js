//계획 class
var Plan = /** @class */ (function () {
    function Plan() {
        this.color = ['blue', 'yellow', 'purple', 'red', 'gray', 'black'];
        this.planGroup = [];
        this.load();
    }
    //local storage에서 데이터를 가지고 온다
    Plan.prototype.load = function () {
        var list = JSON.parse(localStorage.getItem('planGroup'));
        if (list != null) {
            for (var i = 0; i < list.length; i++) {
                this.planGroup.push({
                    groupNo: list[i].groupNo,
                    title: list[i].title,
                    color: list[i].color,
                    startDate: new Date(list[i].startDate),
                    endDate: new Date(list[i].endDate),
                    memo: list[i].memo
                });
            }
        }
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        var sd = document.createElement("input");
        sd.type = "date";
        sd.value = today.getFullYear() + "-" + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)) + "-" + (today.getDate() > 9 ? today.getDate() : "0" + today.getDate());
        sd.setAttribute('id', 'startDate');
        document.getElementById('sdInput').innerHTML = '';
        document.getElementById('sdInput').appendChild(sd);
        var ed = document.createElement("input");
        ed.type = "date";
        ed.value = tomorrow.getFullYear() + "-" + ((tomorrow.getMonth() + 1) > 9 ? (tomorrow.getMonth() + 1) : "0" + (tomorrow.getMonth() + 1)) + "-" + (tomorrow.getDate() > 9 ? tomorrow.getDate() : "0" + tomorrow.getDate());
        ed.setAttribute('id', 'endDate');
        document.getElementById('edInput').innerHTML = '';
        document.getElementById('edInput').appendChild(ed);
        document.getElementById('starttime').value = today.getHours() + "";
        document.getElementById('endtime').value = today.getHours() + "";
    };
    //local storage에 현재 있는 plan들을 저장한다
    Plan.prototype.saveLocal = function () {
        localStorage.setItem('planGroup', JSON.stringify(this.planGroup));
    };
    //기간 동안 있는 plan들을 가져온다
    Plan.prototype.planSearch = function (s, e, year, month, day, cb) {
        var list = [];
        // s = timeset(s);
        // e = timeset(e);
        this.groupToitem(s, e, function (plans) {
            if (plans.length == 0) {
                cb(list);
            }
            else {
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].year == year && plans[i].month == month && plans[i].day == day) {
                        list.push(plans[i]);
                    }
                    if (i == plans.length - 1) {
                        cb(list);
                    }
                }
            }
        });
    };
    Plan.prototype.dateDiff = function (date1, date2) {
        var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        var d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        d1.setHours(4);
        d2.setHours(3);
        var diff = Math.abs(d2.getTime() - d1.getTime());
        diff = Math.ceil(diff / (1000 * 3600 * 24));
        return Number(diff) + 1;
    };
    //plan 추가 함수
    Plan.prototype.addPlan = function () {
        if (document.getElementById('title').value == "") {
            alert('제목을 입력해주세요');
        }
        else if (Number(document.getElementById('starttime').value) > 24 || Number(document.getElementById('starttime').value) < 0 || Number(document.getElementById('endtime').value) > 24 || Number(document.getElementById('endtime').value) < 0)
            alert('시간은 0~24사이로 입력해 주세요');
        else {
            var sd = new Date(document.getElementById('startDate').value);
            sd = timeset(sd);
            sd.setHours(sd.getHours() + Number(document.getElementById('starttime').value));
            var ed = new Date(document.getElementById('endDate').value);
            ed = timeset(ed);
            ed.setHours(ed.getHours() + Number(document.getElementById('endtime').value));
            if (ed >= sd) {
                var data = {
                    groupNo: Date.now(),
                    title: document.getElementById('title').value,
                    color: document.getElementById('color').value,
                    startDate: sd,
                    endDate: ed,
                    memo: document.getElementById('memo').value
                };
                this.planGroup.push(data);
                this.saveLocal();
                calendar.changeDate(0);
                endPop();
            }
            else {
                alert('종료날짜가 시작날짜보다 빠릅니다.');
            }
        }
    };
    Plan.prototype.getPlanGroup = function (no) {
        var nothing = 0;
        for (var i = 0; i < this.planGroup.length; i++) {
            if (this.planGroup[i].groupNo == no) {
                nothing = 1;
                return this.planGroup[i];
            }
            if (i == this.planGroup.length - 1 && nothing == 0)
                return 0;
        }
    };
    Plan.prototype.getPlans = function (startDate, endDate, cb) {
        var list = [];
        if (this.planGroup.length == 0)
            cb(list);
        for (var i = 0; i < this.planGroup.length; i++) {
            if (this.planGroup[i].endDate >= startDate && this.planGroup[i].startDate < endDate)
                list.push(this.planGroup[i]);
            if (i == this.planGroup.length - 1) {
                list.sort(function (a, b) { return a.startDate - b.startDate; });
                cb(list);
            }
        }
    };
    //plan들을 화면에 보여주기 쉽게 영역별로 나누는 작업
    Plan.prototype.groupToitem = function (s, e, cb) {
        var _this = this;
        plan.getPlans(s, e, function (list) {
            if (list.length == 0)
                cb([]);
            var check = [];
            var plans = [];
            for (var i = 0; i < _this.dateDiff(e, s); i++)
                check[i] = -1;
            for (var i = 0; i < list.length; i++) {
                var diff = _this.dateDiff(list[i].endDate, list[i].startDate) - 1;
                for (var j = 0; j < diff; j++) {
                    var saveDate = new Date(list[i].startDate);
                    saveDate.setDate(saveDate.getDate() + j);
                    if (s < saveDate) {
                        if (j == 0)
                            check[_this.dateDiff(list[i].startDate, s) + j]++;
                        else {
                            check[_this.dateDiff(list[i].startDate, s) + j] = check[_this.dateDiff(list[i].startDate, s)];
                        }
                        plans.push({
                            year: saveDate.getFullYear(),
                            month: saveDate.getMonth(),
                            day: saveDate.getDate(),
                            start: j == 0 ? list[i].startDate.getHours() : -1,
                            end: j == diff - 1 ? list[i].endDate.getHours() : -1,
                            groupNo: list[i].groupNo,
                            title: list[i].title,
                            memo: list[i].memo,
                            color: list[i].color,
                            order: check[_this.dateDiff(list[i].startDate, s)]
                        });
                    }
                    if (i == list.length - 1 && j == diff - 1)
                        cb(plans);
                }
            }
        });
    };
    Plan.prototype.viewplan = function () {
        var todo = document.getElementById('todo');
        if (todo.style.display == "block") {
            todo.style.display = "none";
        }
        else {
            todo.style.display = "block";
        }
    };
    Plan.prototype.viewPlanEdn = function () {
        var todo = document.getElementById('todo');
        todo.style.display = "none";
    };
    Plan.prototype.showPlan = function (year, month, day) {
        var todoTitle = document.getElementById('todoTitle');
        var sdate = new Date(year, month - 1, day);
        var edate = new Date(year, month - 1, day + 1);
        todoTitle.innerHTML = "<div>" + year + "년" + month + "월" + day + "일 할 일" + "</div>";
        plan.getPlans(sdate, edate, function (list) {
            for (var i = 0; i < list.length; i++) {
                todoTitle.innerHTML +=
                    "<div>"
                        + "<div>" + (i + 1) + "번</div>"
                        + "<div>제목: " + list[i].title + "</div>"
                        + "<div>메모: " + list[i].memo + "</div>"
                        + "<div>기간: " + list[i].startDate.getFullYear() + "-" + (list[i].startDate.getMonth() + 1) + "-" + list[i].startDate.getDate() + " " + list[i].startDate.getHours() + "시 ~" + list[i].endDate.getFullYear() + "-" + (list[i].endDate.getMonth() + 1) + "-" + list[i].endDate.getDate() + " " + list[i].endDate.getHours() + "시</div>";
                "</div>";
            }
        });
    };
    //계획 선택시 팝업을 통해 보여주며 수정과 삭제가 가능하다
    Plan.prototype.planPop = function (groupNo) {
        var planPop = document.getElementById('planPop');
        planPop.style.display = "block";
        var plan = this.getPlanGroup(groupNo);
        var planControl = document.getElementById('planControl');
        var startTxt = plan.startDate.getFullYear() + "-" + (((plan.startDate.getMonth() + 1) > 9) ? (plan.startDate.getMonth() + 1) : "0" + (plan.startDate.getMonth() + 1)) + "-" + (Number(plan.startDate.getDate()) < 10 ? "0" + plan.startDate.getDate() : plan.startDate.getDate());
        var endTxt = plan.endDate.getFullYear() + "-" + (((plan.endDate.getMonth()) + 1 > 9) ? (plan.endDate.getMonth() + 1) : "0" + (plan.endDate.getMonth() + 1)) + "-" + (Number(plan.endDate.getDate()) < 10 ? "0" + plan.endDate.getDate() : plan.endDate.getDate());
        planControl.innerHTML = "<div>제목: <input id='editTitle' value='" + plan.title + "'></div>";
        planControl.innerHTML += "<div>시작일: <input id='editStartDate' type='date' value='" + startTxt + "'><input id='editstarttime' type='number' value='" + plan.startDate.getHours() + "'></div>";
        planControl.innerHTML += "<div>종료일: <input id='editEndDate' type='date' value='" + endTxt + "'><input id='editendtime' type='number' value='" + plan.endDate.getHours() + "'></div>";
        planControl.innerHTML += "<div>메모: <input id='editMemo' value='" + plan.memo + "'></div>";
        var select;
        for (var _i = 0, _a = this.color; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item == plan.color)
                select += "<option selected value=" + item + ">" + item + "</option>\n";
            else
                select += "<option value=" + item + ">" + item + "</option>\n";
        }
        planControl.innerHTML += "<div>색상 선택: <select id='editColor'>\n" +
            select +
            "</select></div>";
        var planBtn = document.getElementById('planBtn');
        planBtn.innerHTML = "<button onclick='plan.editPlan(" + groupNo + ");'>수정</button>";
        planBtn.innerHTML += "<button onclick='plan.deletePlan(" + groupNo + ");calendar.changeDate(0);plan.endPop();'>삭제</button>";
    };
    Plan.prototype.endPop = function () {
        var planPop = document.getElementById('planPop');
        planPop.style.display = "none";
    };
    // plan 수정
    Plan.prototype.editPlan = function (groupNo) {
        if (document.getElementById('editTitle').value == "") {
            alert('제목을 입력해주세요');
        }
        else {
            var sd = new Date(document.getElementById('editStartDate').value);
            sd = timeset(sd);
            sd.setHours(sd.getHours() + Number(document.getElementById('editstarttime').value));
            var ed = new Date(document.getElementById('editEndDate').value);
            ed = timeset(ed);
            ed.setHours(ed.getHours() + Number(document.getElementById('editendtime').value));
            if (ed >= sd) {
                var plan_1 = this.getPlanGroup(groupNo);
                plan_1.title = document.getElementById('editTitle').value;
                plan_1.color = document.getElementById('editColor').value;
                plan_1.startDate = sd;
                plan_1.endDate = ed;
                plan_1.memo = document.getElementById('editMemo').value;
                this.saveLocal();
                calendar.changeDate(0);
                endPop();
            }
            else {
                alert('종료날짜가 시작날짜보다 빠릅니다.');
            }
        }
    };
    Plan.prototype.deletePlan = function (groupNo) {
        for (var i = 0; i < this.planGroup.length; i++) {
            if (this.planGroup[i].groupNo == groupNo) {
                this.planGroup.splice(i, 1);
            }
        }
        this.saveLocal();
    };
    return Plan;
}());
//달력 생성
var Calendar = /** @class */ (function () {
    function Calendar() {
        this.mode = 0; //달력이 일간, 월간, 주간을 저장한다. 0: 월간, 1: 주간, 0: 일간
        this.dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        this.plan = new Plan;
        this.time = new Date();
        this.timeView();
        this.changeDate(0);
    }
    Calendar.prototype.getMode = function () {
        return this.mode;
    };
    // 현 시각을 보여준다
    Calendar.prototype.timeView = function () {
        var title = document.getElementById("timeTitle");
        title.innerHTML = "<div>" + this.time.getFullYear() + "년 " + (this.time.getMonth() + 1) + "월 " + this.time.getDate() + "일 " + "</div>";
    };
    //날짜를 바꾸어 달력을 다시 생성
    Calendar.prototype.changeDate = function (num) {
        this.deleteCal();
        if (this.mode == 0) {
            this.time.setMonth(this.time.getMonth() + num);
            this.makeMonthCal();
        }
        else if (this.mode == 1) {
            this.addDays(num * 7);
            this.makeWeekCal();
        }
        else if (this.mode == 2) {
            this.addDays(num);
            plan.showPlan(this.time.getFullYear(), this.time.getMonth() + 1, this.time.getDate());
            this.makeDailyCal();
        }
        this.timeView();
    };
    Calendar.prototype.addDays = function (days) {
        this.time.setDate(this.time.getDate() + days);
    };
    Calendar.prototype.goToday = function () {
        this.time = new Date();
        this.changeDate(0);
    };
    Calendar.prototype.changeMode = function (num) {
        this.mode = num;
        this.changeDate(0);
    };
    Calendar.prototype.daysInMonth = function (month, year) {
        return new Date(year, month + 1, 0).getDate();
    };
    Calendar.prototype.monthBuild = function () {
        var start = new Date(this.time.getFullYear(), this.time.getMonth(), 1);
        return start.getDay();
    };
    Calendar.prototype.timeEuqal = function () {
        var today = new Date();
        return today.getMonth() == this.time.getMonth() && today.getFullYear() == this.time.getFullYear();
    };
    //월간 달력 생성
    Calendar.prototype.makeMonthCal = function () {
        var _this = this;
        var thead = document.getElementById("calHeader");
        var tbody = document.getElementById("calBody");
        var hrow = thead.insertRow(thead.rows.length);
        var row = tbody.insertRow(tbody.rows.length);
        var totalDay = this.monthBuild();
        for (var i = 0; i < 7; i++) {
            var cell = hrow.insertCell();
            if (i == 0) {
                cell.className = "sun";
            }
            else if (i == 6) {
                cell.className = "sat";
            }
            cell.innerHTML = this.dayNames[i];
        }
        for (var i = 0; i < totalDay; i++) {
            row.insertCell(0);
        }
        var days = this.daysInMonth(this.time.getMonth(), this.time.getFullYear());
        var today = new Date();
        var _loop_1 = function (i) {
            var cell = row.insertCell();
            if (((i + 1) == today.getDate()) && this_1.timeEuqal()) {
                cell.className = "today month";
            }
            else if ((i + totalDay) % 7 == 0) {
                cell.className = "sun month";
            }
            else if ((i + totalDay + 1) % 7 == 0) {
                cell.className = "sat month";
            }
            else {
                cell.className = "month";
            }
            cell.setAttribute('id', String(i + 1));
            this_1.plan.planSearch(new Date(this_1.time.getFullYear(), this_1.time.getMonth(), 0), new Date(this_1.time.getFullYear(), this_1.time.getMonth() + 1, 0), this_1.time.getFullYear(), this_1.time.getMonth(), i + 1, function (planList) {
                var inner = "<div onclick='plan.showPlan(" + _this.time.getFullYear() + "," + (_this.time.getMonth() + 1) + "," + (i + 1) + ")'>" + (i + 1) + "</div>";
                var over = 0;
                for (var j = 0; j < planList.length; j++) {
                    if (planList[j].order < 3) {
                        if (planList[j].start != -1 && planList[j].end != -1) { //시작 끝 동시
                            inner += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='orderBoth order" + planList[j].order + " " + planList[j].color + "'>&nbsp;" + planList[j].title + "</div>";
                        }
                        else if (planList[j].start != -1) { //시작
                            inner += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='orderStart order" + planList[j].order + " " + planList[j].color + "'> &nbsp;" + planList[j].title + "</div>";
                        }
                        else if (planList[j].end != -1) { //끝
                            inner += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='orderEnd order" + planList[j].order + " " + planList[j].color + "'>&nbsp;" + "</div>";
                        }
                        else { //가운데
                            inner += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='order order" + planList[j].order + " " + planList[j].color + "'>&nbsp; </div>";
                        }
                    }
                    else {
                        over++;
                    }
                    if (j == planList.length - 1 && over > 0)
                        inner += "<div class='order over' onclick='plan.showPlan(" + _this.time.getFullYear() + "," + (_this.time.getMonth() + 1) + "," + (i + 1) + ")'>외 " + over + "개</div>";
                }
                cell.innerHTML = inner;
                if ((i + totalDay + 1) % 7 == 0) {
                    row = tbody.insertRow(tbody.rows.length);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < days; i++) {
            _loop_1(i);
        }
    };
    //주간 달력 생성
    Calendar.prototype.makeWeekCal = function () {
        var thead = document.getElementById("calHeader");
        var tbody = document.getElementById("calBody");
        var hrow = thead.insertRow(thead.rows.length);
        var now = this.time.getDay();
        hrow.insertCell();
        for (var i = 0; i < 7; i++) {
            var cell = hrow.insertCell();
            if (i == 0) {
                cell.className = "sun";
            }
            else if (i == 6) {
                cell.className = "sat";
            }
            var date = new Date(this.time);
            date.setDate(this.time.getDate() + i - now);
            cell.innerHTML = this.dayNames[i] + (date.getDate());
            cell.setAttribute('onclick', "plan.showPlan(" + this.time.getFullYear() + "," + (this.time.getMonth() + 1) + "," + (this.time.getDate() - now + i) + ")");
        }
        var today = new Date();
        for (var hour = 0; hour < 24; hour++) {
            var row = tbody.insertRow(tbody.rows.length);
            for (var i = 0; i < 8; i++) {
                var cell = row.insertCell();
                if (i == 0) {
                    cell.innerHTML = ((hour + 11) % 12 + 1) + "시";
                }
                else if (((this.time.getDate() + i - now - 1) == today.getDate()) && this.timeEuqal()) {
                    cell.className = "today";
                }
                else if (i == 1) {
                    cell.className = "sun";
                }
                else if (i == 7) {
                    cell.className = "sat";
                }
                cell.className += " week";
                cell.setAttribute('id', (this.time.getDate() + i - now - 1) + "-" + hour);
            }
            if (hour == 23)
                this.makeWeekPlan();
        }
    };
    //주간 달력에 그래프를 추가
    Calendar.prototype.makeWeekPlan = function () {
        var _this = this;
        var now = this.time.getDay();
        var s = (new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate() - now));
        var e = (new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate() - now + 7));
        var check = [];
        for (var i = 0; i < 7; i++) {
            check[i] = [];
            for (var j = 0; j < 24; j++) {
                check[i][j] = -1;
            }
        }
        var _loop_2 = function (i) {
            this_2.plan.planSearch(s, e, this_2.time.getFullYear(), this_2.time.getMonth(), this_2.time.getDate() - now + i, function (planList) {
                for (var _i = 0, planList_1 = planList; _i < planList_1.length; _i++) {
                    var item = planList_1[_i];
                    item.end = item.end == -1 ? 23 : item.end;
                    item.start = item.start == -1 ? 0 : item.start;
                    var height = item.end - item.start + 1;
                    for (var size = item.start; size < item.start + height; size++) {
                        check[i][size]++;
                    }
                }
            });
        };
        var this_2 = this;
        for (var i = 0; i < 7; i++) {
            _loop_2(i);
        }
        var _loop_3 = function (i) {
            this_3.plan.planSearch(s, e, this_3.time.getFullYear(), this_3.time.getMonth(), this_3.time.getDate() - now + i, function (planList) {
                var position = [];
                for (var j = 0; j < 24; j++)
                    position.push(-1);
                for (var j = 0; j < planList.length; j++) {
                    planList[j].end = planList[j].end == -1 ? 23 : planList[j].end;
                    planList[j].start = planList[j].start == -1 ? 0 : planList[j].start;
                    var height = planList[j].end - planList[j].start + 1;
                    for (var cnt = planList[j].start; cnt < planList[j].end + 1; cnt++) {
                        position[cnt]++;
                    }
                    var bar = document.getElementById(planList[j].day + '-' + planList[j].start);
                    if (check[i][planList[j].start] > 2) {
                        if (position[planList[j].start] < 3) {
                            var leftMargin = 1 + (90 / (4)) * position[planList[j].start];
                            bar.innerHTML += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='weekbar " + planList[j].color + "' style='left:" + leftMargin + "%;width: calc(90% / " + (4) + ");height: calc(19px + 22px * " + (height - 1) + ");'>" + planList[j].title + "</div>";
                        }
                        else if (position[planList[j].start] == 3) {
                            bar.innerHTML += "<div class='weekETC' onclick='plan.showPlan(" + _this.time.getFullYear() + "," + (_this.time.getMonth() + 1) + "," + (_this.time.getDate() - now + i) + ")'>+" + (check[i][planList[j].start] - 2) + "</div>";
                        }
                    }
                    else {
                        var widthSize = check[i][planList[j].start];
                        for (var due = 0; due < planList[j].end - planList[j].start + 1; due++) {
                            widthSize = widthSize >= check[i][planList[j].start + due] ? widthSize : check[i][planList[j].start + due];
                        }
                        var leftMargin = 1 + (90 / (widthSize + 1)) * position[planList[j].start];
                        bar.innerHTML += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='weekbar " + planList[j].color + "' style='left:" + leftMargin + "%;width: calc(90% / " + (widthSize + 1) + ");height: calc(19px + 22px * " + (height - 1) + ");'>" + planList[j].title + "</div>";
                    }
                }
            });
        };
        var this_3 = this;
        for (var i = 0; i < 7; i++) {
            _loop_3(i);
        }
    };
    //일간 달력 생성
    Calendar.prototype.makeDailyCal = function () {
        var _this = this;
        var thead = document.getElementById("calHeader");
        var tbody = document.getElementById("calBody");
        var hrow = thead.insertRow(thead.rows.length);
        var now = this.time.getDay();
        hrow.insertCell();
        var cell = hrow.insertCell();
        cell.innerHTML = this.dayNames[this.time.getDay()] + (this.time.getDate());
        var today = new Date();
        for (var hour = 0; hour < 24; hour++) {
            var row = tbody.insertRow(tbody.rows.length);
            var cell_1 = row.insertCell();
            cell_1.innerHTML = hour + "시";
            cell_1 = row.insertCell();
            cell_1.className = "daily";
            cell_1.setAttribute('id', "day-" + hour);
            if (this.timeEuqal() && today.getDate() == this.time.getDate()) {
                cell_1.className = "daily today";
            }
        }
        var s = new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate());
        var e = new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate());
        s.setHours(0);
        e.setHours(23);
        e.setMinutes(59);
        e.setMilliseconds(59);
        var check = [];
        for (var j = 0; j < 24; j++) {
            check[j] = -1;
        }
        this.plan.planSearch(s, e, //각 시간별로 일정의 수를 먼저 저장
        this.time.getFullYear(), this.time.getMonth(), this.time.getDate(), function (planList) {
            for (var _i = 0, planList_2 = planList; _i < planList_2.length; _i++) {
                var item = planList_2[_i];
                item.end = item.end == -1 ? 23 : item.end;
                item.start = item.start == -1 ? 0 : item.start;
                var height = item.end - item.start + 1;
                for (var size = item.start; size < item.start + height; size++) {
                    check[size]++;
                }
            }
        });
        this.plan.planSearch(s, e, this.time.getFullYear(), this.time.getMonth(), this.time.getDate(), function (planList) {
            var position = [];
            for (var j = 0; j < 24; j++)
                position.push(-1);
            for (var j = 0; j < planList.length; j++) {
                planList[j].end = planList[j].end == -1 ? 23 : planList[j].end;
                planList[j].start = planList[j].start == -1 ? 0 : planList[j].start;
                var height = planList[j].end - planList[j].start + 1;
                for (var cnt = planList[j].start; cnt < planList[j].end + 1; cnt++) {
                    position[cnt]++;
                }
                var bar = document.getElementById("day-" + planList[j].start);
                if (check[planList[j].start] > 2) {
                    if (position[planList[j].start] < 3) {
                        var leftMargin = 1 + (96 / (4)) * position[planList[j].start];
                        bar.innerHTML += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='weekbar " + planList[j].color + "' style='left:" + leftMargin + "%;width: calc(96% / " + (4) + ");height: calc(19px + 22px * " + (height - 1) + ");'>" + planList[j].title + "</div>";
                    }
                    else if (position[planList[j].start] == 3) {
                        bar.innerHTML += "<div class='dailyETC'  onclick='plan.showPlan(" + _this.time.getFullYear() + "," + (_this.time.getMonth() + 1) + "," + (_this.time.getDate()) + ")'>+" + (check[planList[j].start] - 2) + "</div>";
                    }
                }
                else {
                    var widthSize = check[planList[j].start];
                    for (var due = 0; due < planList[j].end - planList[j].start + 1; due++) {
                        widthSize = widthSize >= check[planList[j].start + due] ? widthSize : check[planList[j].start + due];
                    }
                    var leftMargin = (96 / (widthSize + 1)) * position[planList[j].start];
                    bar.innerHTML += "<div onclick='plan.planPop(" + planList[j].groupNo + ")' class='weekbar " + planList[j].color + "' style='left:" + leftMargin + "%;width: calc(96% / " + (widthSize + 1) + ");height: calc(19px + 22px * " + (height - 1) + ");'>" + planList[j].title + "</div>";
                }
            }
        });
    };
    Calendar.prototype.deleteCal = function () {
        var caltable = document.getElementById("calendar");
        while (caltable.rows.length > 0) {
            caltable.deleteRow(caltable.rows.length - 1);
        }
    };
    return Calendar;
}());
function timeset(date) {
    return new Date(date.setHours(date.getHours() - 9));
}
var plan = new Plan;
var calendar = new Calendar;
function pop() {
    var pop = document.getElementById('pop');
    var popback = document.getElementById('popback');
    plan.endPop();
    popback.style.display = "block";
    pop.style.display = "block";
}
function endPop() {
    var popback = document.getElementById('popback');
    var pop = document.getElementById('pop');
    plan.endPop();
    popback.style.display = "none";
    pop.style.display = "none";
}
