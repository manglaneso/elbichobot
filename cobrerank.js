function cobreRank(msg) {
  var ss_ople = getOpleChatSpreadsheet(msg.chat.id);
  var ss_fial = getFialChatSpreadsheet(msg.chat.id);
  var ss_cobre = getChatSpreadsheet(msg.chat.id);
  
  var is_ople = false;
  var is_fial = false;
  var is_cobre = false;
  
  var ople_message = '<strong>OPLERANK</strong> \n ----------- \n';
  var fial_message = '<strong>RANKING DE FIALS</strong> \n ----------- \n';
  var cobre_message = '<strong>COBRERANK JDR</strong> \n ----------- \n';
  
  var sheet_ople;
  var data_ople;
  var ople_rank = 1;
  
  if(ss_ople !== null) {
    sheet_ople = ss_ople.getSheets()[0];
    data_ople = sheet_ople.getRange('A1:B').getValues();
    is_ople = true;
  } else {
    ople_message += 'Nadie opleó aún \n';
  }
  
  var sheet_fial;
  var data_fial;
  var fial_rank = 1;
  
  if(ss_fial !== null) {
    sheet_fial = ss_fial.getSheets()[0];
    data_fial = sheet_fial.getRange('A1:B').getValues();
    is_fial = true;
  } else {
    fial_message += 'En este grupo la gente es decente \n';
  }
  
  var sheet_cobre;
  var data_cobre;
  var cobre_rank = 1;
  
  if(ss_cobre !== null) {
    sheet_cobre = ss_cobre.getSheets()[0];
    data_cobre = sheet_cobre.getRange('A1:B').getValues();
    is_cobre = true;
  } else {
    cobre_message += 'El cobre sigue en su sitio por ahora \n';
  }
  
  if(is_ople || is_fial || is_cobre) {
    var aggregate_object = {};
  
    if(is_ople) {
      data_ople.sort(compare);    
      data_ople.forEach(function(item) {
        if(aggregate_object[item[0]]) {
          aggregate_object[item[0]] += item[1];
        } else {
          aggregate_object[item[0]] = item[1];
        }
        ople_message += ople_rank + '- ' + item[0] + ' => ' + item[1] + '\n';
        ople_rank++;
      });
    }
    
    if(is_fial) {
      data_fial.sort(compare);
      data_fial.forEach(function(item) {
        if(aggregate_object[item[0]]) {
          aggregate_object[item[0]] += item[1];
        } else {
          aggregate_object[item[0]] = item[1];
        }
        fial_message += fial_rank + '- ' + item[0] + ' => ' + item[1] + '\n';
        fial_rank++;
      });
    }
    
    if(is_cobre) {
      data_cobre.sort(compare);
      data_cobre.forEach(function(item) {
        if(aggregate_object[item[0]]) {
          aggregate_object[item[0]] += item[1];
        } else {
          aggregate_object[item[0]] = item[1];
        }
        cobre_message += cobre_rank + '- ' + item[0] + ' => ' + item[1] + '\n';
        cobre_rank++;
      });
    }
    
    var aggregate = [];
    
    for(var i in aggregate_object)
      aggregate.push([i,aggregate_object[i]]);
        
    var global_message = '<strong>RANKING GLOBAL</strong> \n ----------- \n'
    var global_rank = 1;
    
    aggregate.sort(compare);
    
    aggregate.forEach(function(item) {
      global_message += global_rank + '- ' + item[0] + ' => ' + item[1] + '\n';
      global_rank++;
    });
    
    var message = global_message + '\n' + cobre_message + '\n' + ople_message + '\n' + fial_message;
    
    sendMessage(msg, message);
  } else {
    sendMessage(msg, "Aquí no usa el bot ni cristo.");
  }
}
