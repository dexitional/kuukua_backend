const Log = require('../model/log');
const OrderLog = require('../model/orderlog');
const Product = require('../model/product');
const StockLog = require('../model/stocklog');
var moment = require('moment');
const { POS } = require('../model/model');



module.exports.logwriter = async function (action,user,meta) {
  const data = { action, user, meta, timestamp : moment().format('LLL'), created_at: new Date()}
    if(action && user){
      try{
        //const ins = await Log.create(data);
        data.meta = JSON.stringify(data.meta);
        const ins = await POS.logWriter(data);
      }catch(err){
        console.log(err);
      }
  }
}

module.exports.logorder = async function (oid,type,mode,cart,client,user,amount,siteid) {
  var meta = [];
  if(cart){
    for( v of cart){
      const pt = await POS.fetchProduct(v.id);
      if(pt) meta.push({ product_name: pt.title, product_id: v.id, amount: ( v.quantity * v.price), quantity: parseInt(v.quantity),siteid })
    }
  }
  const data = { oid, type, mode, meta, user, client, amount, created_at:new Date(),siteid }
  if(meta.length > 0){
    try{
      data.meta = JSON.stringify(data.meta)
      var ins = await POS.logOrder(data);
    }catch(err){ console.log(err); }
  }
}

module.exports.logstock = async function () {
  var meta = [];
  const pt = await POS.fetchProducts();
  if(pt){
    for( v of pt){
      meta.push({ product_name: v.title, product_id: v.id, product_price: v.price, quantity: parseInt(v.quantity) })
    }
  }
  const data = { meta, user:'logger', created_at:new Date() }
  if(meta.length > 0){
    try{
      data.meta = JSON.stringify(data.meta)
      var ins = await POS.logStock(data);
    }catch(err){ console.log(err); }
  }
}