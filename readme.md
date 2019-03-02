# 버즈니 검색 서비스팀 프론트엔드 개발 과제
## 지원자 신대호

## 방법
1. 터미널에서 git clone https://github.com/sdh077/ts_buzzni 입력
2. cd ts_buzzni 입력 후 tsc javascripts/main.ts 입력
3. index.html 실행하면 됩니다

## 과제 목표

1. 월별,주별,일별로 등록된 일정을 보고 등록 할 수 있는 아래와 같은 캘린더를 웹에서 구현한다.
2. 필수 구현 기능은 반드시 구현해야하며, 추가 기능은 가산점을 받을 수 있다.
3. .txt 파일 또는 .md 파일로 웹의 실행 방법이나 사용법등에 대한 간단한 문서를 작성해 주세요.


## 구현 내용

- 월간, 주간, 일간 달력 구현
- 날짜 변경 가능
- 계획 추가, 수정, 삭제 기능
- 시간 순서에 따른 막대 바 보여주기
- 중복된 계획이 많을 경우 + 숫자로 표현
- 일정별 색깔 지정 가능
- LocalStorage를 이용한 저장 기능
- 반응형을 위해 테이블 사이즈와 팝업 사이즈 조정

## 구현 순서
1. 월간 , 주간 달력 만들기
2. 일정 기능을 추가
3. 막대 바 기능 추가


### 1. 월간 , 주간 달력을 만들기
- 달력 생성
- 날짜 변경 
- 오늘로
- 모양 변경

```
    //오늘 날짜 생성
    this.time = new Date();

    mode = 0; //달력이 일간, 월간, 주간을 저장한다. 0: 월간, 1: 주간, 0: 일간
    getMode(){
        return this.mode;
    }

    
```

#### 월간,주가 달력을 그려주는 함수 생성
    makeMonthCal(), makeWeekCal()
    id calHeader를 가져와 상단을 추가
    id calBody를 가져와 날짜 부분을 추가

#### 오늘로 가는 함수 생성
```
    goToday(){
        this.time = new Date();
        this.changeDate(0);
    }
```
#### 날짜 변경 함수
- 이전 달력을 지우고 현재 mode에 따라 날짜를 변경 후 달력 생성 
```
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
```
#### 월간, 주간, 일간 모양 변경 함수
- changeMode() 함수 : mode를 바꾼 후 chageDate를 부른다

### 2. 일정 기능을 추가
- 팝업 창 제작
- 일정 보여주는 화면
- 일정 추가, 수정, 삭제
- 일정 LocalStorage에 set, get

#### 팝업 창 제작
1. 전체 화면을 반투명으로 가려주는 div 생성
2. 그 위에 팝업 창 생성
3. 닫는 버튼 또는 반투명 클릭시 팝업 종료

#### 일정 보여주는 화면
1. 날짜를 클릭시 해당 날짜에 plan을 보여준다
2. 반응형으로 화면을 줄일 경우 팝업 창이 뜨게 한다

#### 일정 추가, 수정, 삭제
일정의 형식
```
{
    groupNo:Number,
    title:String,
    startDate:Date, 
    endDate:Date, 
    color:String, 
    memo:String    
}
```


1. 추가 addPlan()
2. 수정 editPlan()
3. 삭제 deletePlan()

#### 일정 LocalStorage에 set, get

1. get
Plan 클래스가 생성될 때 constructor에서 load() 함수가 실행이 되며 이때 
```
let list = JSON.parse(localStorage.getItem('planGroup'));
```
이 실행되어 데이터를 가져온다

2. set

saveLocal() 함수를 만들어 planGroup이 변경될 때 함수를 call해준다.


### 막대바 제작
- 데이터 변환
- 월간 캘린더 막대바
- 주간 캘린더 막대바
- 일간 캘린더 막대바

막대바를 그리는 방법으로 아래와 2가지가 있다.
1. 테이블의 칸을 생성할 때 막대 바를 추가
2. 테이블을 다 그린 후 플랜을 position : absolute를 사용하여 위에 그리는 방법

월간 달력은 1번, 주간 달력은 2번을 사용

#### 데이터 변환

groupToItem() 함수: 
planGroup으로 되어있는 data set을
```
{
    year:String,
    month:String,
    day:String,
    start: Date,
    end: Date,
    groupNo: Number,
    title: String,
    memo: String,
    color: String,
    order: Number
}
```
형식으로 변환한다.

1. getPlans()을 사용하여 조회 기간에 해당하는 planGroup을 보두 가져온다.
2. 조회 기간 만큼의 배열을 만들어 해당 날짜의 plan 수를 저장한다. 
3. 기간의 날짜 만큼의 json 배열에 위의 data set을 추가한다.

#### 월간 캘린더 막대바

1. data set을 불러와 날짜 별로 막대 바를 그린다.
2. 3개를 넘어가는 경우 추가적으로 아래에 개수를 표시한다.

#### 주간 캘린더 막대바

1. 일자별 시간대에 일정의 수를 먼저 저장을 한다. 474번째 줄 참고
2. 일정에 해당하는 시간에 일정 수 중 가장 큰 값에 해당하는 곳에 막대바를 그린다.
3. 초과한 데이터는 시작 시간에 추가 몇개인지 입력한다.

#### 일간 캘린더 막대바

주간 캘린더에서 날짜를 줄인 것으로 방법은 같다



## 후기
1. 프레임워크와 라이브러리 없이 구현한다는게 생각보다 까다로웠다.
2. 달력을 만들 때 table 태그보다는 div 태그가 보다 자유도가 높으며 다루기도 쉽기에 다음 기회가 있다면 div로 해보자
3. 막대바를 먼저 그려보고 필요한 data set을 구성하는 식으로 하니 쉽게 만들어졌다.