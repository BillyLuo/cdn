let dateFormat = function(date,mask?:string) {        
    
 let d = date;  
 if (!date) {
    return '';
 }
 if (!d.toUTCString) {
    d = new Date(date);
 } 
 if (Object.prototype.toString.call(d) != '[object Date]') {
    return '';
 } 
 if (d.toString() == 'Invalid Date') {
    return '';
 }
 if (!mask) {
    mask = 'yyyy-MM-dd HH:mm:ss';
 }   
 var zeroize = function (value, length) {        
    
     if (!length) length = 2;        
    
     value = String(value);        
    
     for (var i = 0, zeros = ''; i < (length - value.length); i++) {        
    
         zeros += '0';        
    
     }        
    
     return zeros + value;        
    
 };          
    
 return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function($0) {        
    
     switch($0) {        
    
         case 'd':   return d.getDate();        
    
         case 'dd':  return zeroize(d.getDate(),2);        
    
         case 'ddd': return ['Sun','Mon','Tue','Wed','Thr','Fri','Sat'][d.getDay()];        
    
         case 'dddd':    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];        
    
         case 'M':   return d.getMonth() + 1;        
    
         case 'MM':  return zeroize(d.getMonth() + 1,2);        
    
         case 'MMM': return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];        
    
         case 'MMMM':    return ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];        
    
         case 'yy':  return String(d.getFullYear()).substr(2);        
    
         case 'yyyy':    return d.getFullYear();        
    
         case 'h':   return d.getHours() % 12 || 12;        
    
         case 'hh':  return zeroize(d.getHours() % 12 || 12,2);        
    
         case 'H':   return d.getHours();        
    
         case 'HH':  return zeroize(d.getHours(),2);        
    
         case 'm':   return d.getMinutes();        
    
         case 'mm':  return zeroize(d.getMinutes(),2);        
    
         case 's':   return d.getSeconds();        
    
         case 'ss':  return zeroize(d.getSeconds(),2);        
    
         case 'l':   return zeroize(d.getMilliseconds(), 3);        
    
         case 'L':   var m = d.getMilliseconds();        
    
                 if (m > 99) m = Math.round(m / 10);        
    
                 return zeroize(m,3);        
    
         case 'tt':  return d.getHours() < 12 ? 'am' : 'pm';        
    
         case 'TT':  return d.getHours() < 12 ? 'AM' : 'PM';        
    
         case 'Z':   return d.toUTCString().match(/[A-Z]+$/);        
    
         // Return quoted strings with the surrounding quotes removed
    
         default:    return $0.substr(1, $0.length - 2);      
    
     }        
    
 });        
    
};  
export default dateFormat;