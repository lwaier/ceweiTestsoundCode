//传入时间戳 得到2020年7月17日格式的时间
export function timeToString (time){
	let timeDate = new Date(time); //获取时间对象
	let year = timeDate.getFullYear(); //获取年份
	let month = timeDate.getMonth() * 1 + 1;
	month = month >= 10 ? month : 0 + String(month); //获取月份
	let datenew = timeDate.getDate();
	datenew = datenew >= 10 ? datenew : 0 + String(datenew) //获取月份
	let hour = timeDate.getHours();
	hour = hour >= 10 ? hour : 0 + String(hour) //获取小时
	let minutes = timeDate.getMinutes();
	minutes = minutes >= 10 ? minutes : 0 + String(minutes) //获取分钟
	return year + '年' + month + '月' + datenew + '日'
};