const Log = require('../model/log');
const OrderLog = require('../model/orderlog');
const Product = require('../model/product');
const StockLog = require('../model/stocklog');
var moment = require('moment');
const { POS } = require('../model/model');


module.exports.filterAlgo = (data) => {
  const dr = [];
  const dv = {};
  const limit = [0.3,0.4,0.36,0.25]
  for(let dm of data){
      const skey = moment(dm.created_at,'LLL').format('MMDDYY')
      if(dv[skey]) dv[skey].push(dm) 
      if(!dv[skey]) dv[skey] = [{...dm}]
  }
  const lkeys = Object.keys(dv);
  if(lkeys.length > 0){
     for(let j = 0;j < lkeys.length; j++){
        let key = lkeys[j]
        const datax = dv[key]
        //const num = Math.min(Math.random() * Math.ceil(dv[key].length/2.5), Math.ceil(dv[key].length/2.5))
        const num = Math.min(Math.ceil(limit[j%limit.length] * dv[key].length), Math.ceil(dv[key].length/0.5))
        for(var i = 0; i < num;i++){
          dr.push(datax[i])
        }
     }
  }  return dr;
}



module.exports.filterCondition = (data) => {
  const dx = [];
  const dr = [];
  for(let dm of data){
      if(moment(dm.created_at).week() == moment().week()){
          dx.push(dm)
      }
  }
  const num = Math.min(Math.random()*dx.length,dx.length)
  for(var i = 0; i < num;i++){
      dr.push(dx[i])
  }

  return dr;
}


