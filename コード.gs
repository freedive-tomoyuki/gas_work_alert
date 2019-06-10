function myFunction() {//選択する関数
  //本日の日付取得
    //var mySheet = SpreadsheetApp.getActiveSheet();
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
  
    var mySheet = SpreadsheetApp.getActive().getSheetByName('回答のシート1');
    var mySheetName = SpreadsheetApp.getActive().getName();
  
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

  //月から金の場合　ｘ　その日の出勤と退勤打刻
 
}
function chatBot(status,mySheetName) {
  var client = ChatWorkClient.factory({token: "[チャットワークAPIトークン]"}); // Chatwork API
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
