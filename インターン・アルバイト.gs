
function isBusinessDay(date){
 if (date.getDay() == 0 || date.getDay() == 6) {
    return false;
  }
  var calJa = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
  if(calJa.getEventsForDay(date).length > 0){
    return false;
  }
  return true;
}
function isMyBusinessDay(date){
 //var date = new Date();
 var myCals = CalendarApp.getCalendarById('sp@freedive.co.jp');//特定のIDのカレンダーを取得
  var myEvents = myCals.getEventsForDay(date);//カレンダーの本日のイベントを取得
  var arrTitles =[];

  /* イベントの数だけ繰り返し */
  for(var i=0;i<myEvents.length;i++){
    eventTitle = myEvents[i].getTitle();
    if(eventTitle.indexOf('出勤') != -1){
      arrTitles.push(eventTitle.replace('出勤','').trim()); //イベントのタイトルを配列に追加
      //console.log(eventTitle.replace('出勤','').trim());
    }
    
  }
  
  /* 出勤の判定 */
  arrTitles.forEach(function(arrTitle){
    console.log(arrTitle);
    var name = SpreadsheetApp.getActive().getName();
    if(name.indexOf(arrTitle) != -1){
      return true;
    }else{
      return false;
    }    
    
  });
}
function onOpen(){
 
  //メニュー配列
  var myMenu=[
    {name: "本日の勤怠チェック", functionName: "myFunction"}
  ];
 
  SpreadsheetApp.getActiveSpreadsheet().addMenu("チェック",myMenu); //メニューを追加
 
}
function myFunction() {//選択する関数
  //本日の日付取得
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
  
  if(isMyBusinessDay(date)){//アルバイト・インターン用
    //console.log(m);
  
    var mySheet = SpreadsheetApp.getActive().getSheetByName('回答のシート1');
    var mySheetName = SpreadsheetApp.getActive().getName();
  
   //Browser.msgBox(d);
  //A列での該当の日付取得と朝礼
  var lastRow = mySheet.getLastRow();
  var flag = 0;
  for (var i = 1; i <= lastRow; i++) {
   //対象の日付のとき
    searchdate = mySheet.getRange(i, 1).getValue();
    searchdate = Utilities.formatDate(new Date(searchdate), 'Asia/Tokyo','yyyy/MM/dd');
    today = Utilities.formatDate(new Date(), 'Asia/Tokyo','yyyy/MM/dd');

   if(　searchdate == today ){
     console.log(searchdate);
     console.log(today);
     
     //0 = 出勤・退社なし
     //1 = 出勤あり／退社なし
     //2 = 出勤なし／退社あり
     //3 = 出勤あり／退社あり
     
     if(mySheet.getRange(i, 2).getValue() =='出勤'){
       flag =flag + 1;
       //chatBot('出勤',mySheetName); return ;
     }
     if(mySheet.getRange(i, 2).getValue() =='退社'){
       flag =flag + 2;
       //chatBot('退社',mySheetName); return false;
     }
          
   }
  }
  switch( flag ) {
    case 3:
        console.log('勤怠漏れなし');
        break;
    case 2:
        chatBot('出勤',mySheetName);
        break;
    case 1:
        chatBot('退社',mySheetName);
        break;
    case 0:
        chatBot('出勤/退社',mySheetName);
        break;
  }
 }
  //月から金の場合　ｘ　その日の出勤と退勤打刻
 
}
function chatBot(status,mySheetName) {
  var client = ChatWorkClient.factory({token: "ea0d4141cc6da4503c7cf96c6e13fca1"}); // Chatwork API
  client.sendMessage({
    room_id: 152551972, // room ID
    body: "[info][title]通知[/title]"+ mySheetName +status+"打刻が漏れています。[/info]"}); // message
}

function sendMessage(room_id,body){
  var params = {
    headers : {"X-ChatWorkToken" : CW_TOKEN},
    method : "post",
    payload : {
      body : body
    }
  };
  var url = "https://api.chatwork.com/v2/rooms/" + room_id + "/messages";
  UrlFetchApp.fetch(url, params); 
}
