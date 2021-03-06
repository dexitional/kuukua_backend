var db = require('../config/database');
var Order = require('../model/order');
var Cart = require('../model/cart');
var Vat = require('../model/vat');
var User = require('../model/user');
var Product = require('../model/product');
var Transaction = require('../model/transaction');
var Category = require('../model/category');
var Customer = require('../model/customer');
var Restock = require('../model/restock');
var Request = require('../model/request');
var bcrypt = require('bcrypt');
var moment = require('moment');
var async = require('async');
var util = require('../util/logutil');
const StockLog = require('../model/stocklog');
const { POS } = require('../model/model');


module.exports = {

    // STOCKLOGS
    fetchStockLogs : async (req,res) => {
        try{
            var logs = await POS.fetchStocklogs();
            if(logs.length > 0){
              logs = logs.map((row) => {
                row.created_at = moment(row.created_at).format('LLL');
                return row;
              })
              res.status(200).json({success:true, data: logs});
            }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
    },

    makeStockLog : async (req,res) => {
        const id = req.params.id;
        try{
            var user = await POS.fetchUser(id);
            if(user.length > 0){
              util.logstock(user.name)
              res.status(200).json({success:true, data: logs});
            }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
    },

    // LOGS

    fetchLogs : async (req,res) => {
        var id = req.params.productId;
        try{
            var logs = POS.fetchLogs();
            if(logs.length > 0){
                logs = logs.map((row) => {
                    row.created_at = moment(row.created_at).format('LLL');
                    return row;
                })
                res.status(200).json({success:true, data: logs});
            }else{
                res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
    },

    fetchProductHistory : async (req,res) => {
        var pid = req.params.productId;
        try{
            var history = await POS.fetchCartByProduct(pid)
            if(history){
                history = history.map((row) => {
                    row.created_at = moment(row.order.created_at).format('LLL');
                    return row;
                })
                res.status(200).json({success:true, data: history});
            }else{
                res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
    },

    // ORDERS

    fetchOrders : async (req,res) => {
        try{
            var orders = await POS.fetchOrders();
            if(orders){
                orders = orders.map((order) => {
                    order.created_at = moment(order.created_at).format('LLL');
                    return order;
                })
                console.log(orders);
                res.status(200).json({success:true, data: orders});
            }else{
                res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
    },

    fetchOrder : async (req,res) => {
        var id = req.params.id;
        try{
            var order = await POS.fetchOrder(id);
            if(user){
                order.created_at = moment(order.created_at).format('LLL');
                res.status(200).json({success:true, data: order});
            }else{
                res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
    },

    saveOrder : async (req,res) => {
        try{
           var data = req.body.cart;
           delete req.body.cart;
           // Insert Order
           var ins = POS.saveOrder(req.body);
           if(ins){
             var carts = [];
             if(data && data.length > 0){
               for(var cart of data){
                 // Insert Cart Items
                 cart.order = ins.insertId;
                 await POS.saveCart(cart);
               }
             }
             util.logwriter('SALE_CREATED',req.session.user.username,ins) //LOG WRITER
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e.toSring()});
        }
    },

    updateOrder : async (req,res) => {
        var id = req.params.id;
        try{
            var data = req.body.cart; 
            delete req.body.cart;
            var carts = [];
            if(data && data.length > 0){
              for(var cart of data){
                // Insert Cart Items
                cart.order = req.body._id;
                await Cart.create(cart);
              }
            }
            var ins = await POS.updateOrder(id,req.body);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(200).json({success:false, data: null, msg: e.toSring()});
         }
    },

    deleteOrder : async(req,res) => {
        var id = req.params.id;
        try{
           var inx = await POS.deleteCartByOrder(id);
           var ins = await POS.deleteOrder(id);
           if(ins && inx){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(200).json({success:false, data: null, msg: e});
        }
    },

    deleteOrderOid : async(req,res) => {
        var id = req.params.id;
        try{
           var order = await POS.fetchOrderByOid(id)
           var ins = await POS.deleteOrderByOid(id)
           if(ins){
             var inx = await POS.deleteCartByOrder(order.id);
           } 
           if(ins && inx){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(200).json({success:false, data: null, msg: e});
        }
    },

    setupOrder : async(req,res) => {
        try{
            data = [
              { name:"Software Developer", phone: "0277675089", email: "ebenezerkb.ackah@gmail.com", username: "dexitional", password:bcrypt.hashSync('gloria007',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1},
            ]
           var ins = await Order.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(200).json({success:false, data: null, msg: e});
        }
    },

    
    updateOrderDate : async (req,res) => {
        var id = req.query.id;
        var created_at = moment(req.query.date);//,'YYYY-MM-DD HH:MM'
        try{
            var ins = await POS.updateOrder(id,{created_at});
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(200).json({success:false, data: null, msg: e});
         }
    },

    fetchHelpers : async (req,res) => {
      try{
          const {siteid} = req.query
          // Helpers - Categories, Vat, Products, orders, transactions, customers
          var vats = await POS.fetchVats(siteid);
          var categories = await POS.fetchCategories(siteid);
          var products = await POS.fetchProducts(siteid);
          var transactions = await fetchTransactions(siteid);
          var customers = await POS.fetchCustomers(siteid);
          var orders = await POS.fetchOrders(siteid);
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
          }
          res.status(200).json({success:true, data: {vats,customers,categories,transactions,orders,products}});

      }catch(e){
          res.status(200).json({success:false, data: null, msg: e});
      }
  },

  
  rejectedOrders : async (req,res) => {
      try{
          var orders = await POS.fetchRejectedOrders()
          if(orders){
            orders = orders.map((order) => {
                order.created_at = moment(order.created_at).format('LLL');
                return order;
            })
              res.status(200).json({success:true, data: orders});
          }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(200).json({success:false, data: null, msg: e});
      }
  },


  creditSales : async (req,res) => {
        try{
            var orders = await POS.fetchCreditSales();
            if(orders){
                orders = await Promise.all(orders.map(async (order) => {
                
                    order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                    order.cart = await POS.fetchCart(order.id);
                    return order;
                }))
                res.status(200).json({success:true, data: orders});
                console.log(orders);
            }else{
                res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            console.log(e)
            res.status(200).json({success:false, data: null, msg: e});
        }
  },

  CompleteOrders : async (req,res) => {
      try{
          var orders = POS.fetchCompletedOrders();
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
              console.log(orders);
              res.status(200).json({success:true, data: orders});
          }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(200).json({success:false, data: null, msg: e});
      }
  },

  Payments : async (req,res) => {
      try{
          var orders = await POS.fetchTransactions();
          if(orders){
              orders = orders.map((order) => {
                  order.created_at = moment(order.created_at).format('LLL');
                  return order;
              })
              console.log(orders);
              res.status(200).json({success:true, data: orders});
          }else{
              res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(200).json({success:false, data: null, msg: e});
      }
  },

  cashSales : async (req,res) => {
    try{  
        var orders = await POS.fetchCashSales()
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await POS.fetchCart(order.id);
                return order;
                setTimeout(() => console.log('sleep 300ms'),300)
            }))
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
  },

  completeSales : async (req,res) => {
    try{  
        const { siteid,sess,page,keyword } = req.query
        
        var orders = await POS.fetchCompletedSales(siteid,sess,page,keyword)
        var newOrders = []
        if(orders){
            if(orders.data && orders.data.length > 0){
                newOrders = await Promise.all(orders.data.map(async (order) => {
                    order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                    order.cart = await POS.fetchCart(order.id);
                    return order;
                }))
                res.status(200).json({success:true, data: {...orders, data:newOrders } });
            }else{
                res.status(200).json({success:true, data: {totalPages: 0, totalData: 0, data: [],} });
            }
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        console.log(e)
        res.status(200).json({success:false, data: null, msg: e});
    }
  },

  dailySales : async (req,res) => {
    const { siteid,sess,page,keyword } = req.query
    console.log(sess);
    try{  
        var orders = await POS.fetchDailySales(siteid,sess,page,keyword)
        console.log(orders)
        var newOrders = []
        if(orders){
            if(orders.data && orders.data.length > 0){
                newOrders = await Promise.all(orders.tdata.map(async (order) => {
                    order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                    order.cart = await POS.fetchCart(order.id);
                    return order;
                }))
                res.status(200).json({success:true, data: {...orders, data:newOrders } });
            }else{
                res.status(200).json({success:true, data: {totalPages: 0, totalData: 0, data: [],} });
            }
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }

    }catch(e){
        console.log(e)
        res.status(200).json({success:false, data: null, msg: e});
    }
  },

  rejectSales : async (req,res) => {
    try{  //{completed: 1, approval: 2}
        var orders = await POS.fetchRejectedSales();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await POS.fetchCart(order.id);
                return order;
            }))
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
  },

  paidSales : async (req,res) => {
    try{  
        var orders = await POS.fetchTransactions();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                return order;
            }))
            console.log(orders);
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
  },

  receipt : async (req,res) => {
    var id = req.params.id;
    try{ 
        var order = await POS.fetchOrderByOid(id);
        if(order){
            order.created_at = moment(order.created_at).format('LLL').toUpperCase();
            order.cart = await POS.fetchCart(order.id);
            res.status(200).json({success:true, data: order});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
  },


  draftOrders : async (req,res) => {
    try{ 
        var orders = await POS.fetchDraftOrders();
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await POS.fetchCart(order.id);
                return order;
            }))
            res.status(200).json({success:true, data: orders});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
  },


  updateDraftOrder : async (req,res) => {
      var id = req.params.id;
      try{
          var data;
          if(req.body.action == 'approve'){
             data = { approval : 1, completed: 1 }
          }else{
             data = { approval : 2, completed: 1 }
          }
          var ins = await POS.updateOrder(id,data);
          if(ins){
            var cart = await fetchCart(id);
            if(cart && cart.length > 0){
                for(var ct of cart){
                  var reduce_result = await POS.updateProduct(ct.product._id,{quantity:ct.product.quantity-ct.quantity})
                }
            }
            res.status(200).json({success:true, data: ins});
          }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
          }
        }catch(e){
            res.status(200).json({success:false, data: null, msg: e});
        }
  },

  /* POS  */
  cashOrder : async (req,res) => {
        try{
            // Order 
            var orderdata = {
                user:req.body.user,
                oid : moment().unix(),
                amount : req.body.amount,
                refname : req.body.refname,
                discount: 0,
                tax: 0,
                ordertype: 'normal',
                approval: 1,
                completed : 1,
                created_at: new Date(),
                siteid:req.body.siteid,
            };

            var order_result = await POS.saveOrder(orderdata);
            if(order_result){
                // Cart
                var cart = req.body.cart;
                var cartArray = []
                var productArray = []
                var errorCount = 0

                if(cart && cart.length > 0){
                    for(var ct of cart){
                        // Insert Cart Items
                        let cartdata = { product_id: ct.id, order_id: order_result.insertId, price: ct.price, amount: ct.price*ct.quantity, discount: 0.0, tax: 0.0, quantity: ct.quantity, siteid:req.body.siteid }
                        var cart_result = await POS.saveCart(cartdata);
                        // Reduce Stock
                        var product = await POS.fetchProduct(ct.id);
                        if(product){
                            let qty = product.quantity - ct.quantity;
                            if(qty >= 0) {
                              await POS.updateProduct(ct.id,{quantity:qty})
                            } else {
                               errorCount += 1;
                            }
                        }else{ 
                            errorCount += 1;
                        }
                    }
                }
                if(errorCount <= 0){
                    // Transaction & Payment
                    var paydata = {
                        user:req.body.user,
                        order_id : order_result.insertId,
                        tid : moment(new Date()).unix(),
                        amount_charge : req.body.amount,
                        paymode: 'cash',
                        created_at: new Date(),
                        siteid:req.body.siteid,
                    };  await POS.saveTransaction(paydata);
                    
                    // Log Order
                    util.logorder(order_result.insertId,'normal','new',req.body.cart,req.body.refname,req.body.user,req.body.amount,req.body.siteid,)
                    // Return Response
                    res.status(200).json({success:true, data: {...order_result,...orderdata} });

                }else{
                    // Errors - Revoke Order
                    await POS.deleteOrder(order_result.insertId);
                    res.status(200).json({success:false, data: null, msg:"Some products are out of Stock!"});
                }
            }else{
                res.status(200).json({success:false, data: null, msg: "Sales order failed!" });
            }
        }catch(e){
            console.log(e);
            res.status(200).json({success:false, data: null, msg: "System error occurred!" });
        }
  },

  updateSale : async (req,res) => {
     var id = req.params.id;
     try{
        var productData = [];
        var errorCount = 0;
        // OLD CART
        var kart = await POS.fetchCart(id)
        if(kart && kart.length > 0){
            for(var ct of kart){
              var product = await POS.fetchProduct(ct.product_id);
              if(product){
                var isRec = productData.findIndex(pr => pr.id == ct.product_id);
                if(isRec > -1){
                  productData[isRec]['quantity'] = parseFloat(productData[isRec]['quantity']) + parseFloat(ct.quantity);
                }else{
                  productData.push({
                    id: product.id,
                    quantity : parseFloat(product.quantity) + parseFloat(ct.quantity),
                  })
                }
              }   
            }
        }
        
        // NEW CART
        var cart = req.body.cart;
        if(cart && cart.length > 0){
            
            await POS.deleteCartByOrder(id)
            for(var ct of cart){
                var product = await POS.fetchProduct(ct.id);
                var isRec = productData.findIndex(pr => pr.id == ct.id);
                var cartdata = { product_id:ct.id, order_id:id, price:ct.price, amount: parseFloat(ct.price*ct.quantity), discount: 0.0, tax: 0.0, quantity: ct.quantity, siteid:req.body.siteid }
                await POS.saveCart(cartdata)
                if(isRec != -1){
                   productData[isRec]['quantity'] = parseFloat(productData[isRec]['quantity']) - parseFloat(ct.quantity);
                }else{
                   productData.push({
                      id: product.id,
                      quantity : parseFloat(product.quantity) - parseFloat(ct.quantity)
                   })
                }
            }
        }

        if(productData.length > 0){
            for(var p of productData){
               if(parseFloat(p.quantity) > 0){
                  await POS.updateProduct(p.id,{ quantity: parseFloat(p.quantity) })
               }else{
                  errorCount += 1;
               }
            }
        }

        if(errorCount <= 0){
            var order = await POS.fetchOrder(id);
            var order_result = await POS.updateOrder(id,{ amount:req.body.amount });
            // Log Order
            util.logorder(id,order.ordertype,'update',req.body.cart,req.body.refname,req.body.user,req.body.amount,req.body.siteid)
            // Return Response       
            res.status(200).json({success:true, data: order_result});
        }else{
            res.status(200).json({success:false, data: null, msg:"Some products are out of Stock!"});
        }
     }catch(e){
         console.log(e);
         res.status(200).json({success:false, data: null, msg:"System error occurred!"});
     }
  },


  returnSales : async (req,res) => {
      var id = req.params.id;
      try{
        
        var kart = await POS.fetchCart(id)
        if(kart && kart.length > 0){
            var productData = [];
            var crt = []
            for(var ct of kart){
                var product = await POS.fetchProduct(ct.product_id);
                if(product){
                  const qty = parseFloat(product.quantity) + parseFloat(ct.quantity);
                  await POS.updateProduct(ct.product_id,{ quantity: qty })
                } 
                crt.push({product_id:ct.product_id, quantity: ct.quantity, price: product.price})
            }
        }
       
         var order = await POS.fetchOrder(id);
         // Delete Order 
         var order_result = await POS.deleteOrder(id);
         if(order_result){
            // Log Order
            util.logorder(order.id,order_result.ordertype,'return',crt,order.refname,order.user,order.amount,order.siteid)
            // Return Response       
            res.status(200).json({success:true, data: order_result});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
         }
      }catch(e){
         res.status(200).json({success:false, data: null, msg: e});
      }
  },
  

  creditOrder : async (req,res) => {
    try{
        // Order 
        var orderdata = {
            user:req.body.user,
            oid : moment().unix(),
            amount : req.body.amount,
            refname : req.body.refname,
            discount: 0,
            tax: 0,
            ordertype: 'credit',
            approval: 0,
            completed : 0,
            created_at: new Date(),
            siteid : req.body.siteid
        };
        var order_result = await POS.saveOrder(orderdata);
        if(order_result){
            // Cart
            var cart = req.body.cart;
            if(cart && cart.length > 0){
              for(var ct of cart){
                // Insert Cart Items
                let cartdata = { product_id: ct.id, order_id: order_result.insertId, price: ct.price, amount: ct.price*ct.quantity, discount: 0.0, tax: 0.0, quantity: ct.quantity, siteid: req.body.siteid }
                var cart_result = await POS.saveCart(cartdata);
              }
            }
            // Log Order
            util.logorder(order_result.insertId,orderdata.ordertype,'new',cart,orderdata.refname,orderdata.user,orderdata.amount,req.body.siteid)
            // Return Response       
            res.status(200).json({success:true, data: {...order_result,...orderdata} });
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        console.log(e);
        res.status(200).json({success:false, data: null, msg: e});
    }
  },



  overview : async (req,res) => {
    try{
        const { siteid,sess,page,keyword } = req.query
        var products = await POS.countProducts(siteid)
        var approvals = await POS.countPendedApprovals(siteid)
        var requests = await POS.fetchRequestsToday(siteid)
        var daily = await POS.fetchDailySales(siteid,sess,page,keyword)
        var newDaily = []
        if(daily){
            if(daily.data && daily.data.length > 0){
                newDaily = await Promise.all(daily.data.map(async (order) => {
                    order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                    order.cart = await POS.fetchCart(order.id);
                    return order;
                }))
                res.status(200).json({success:true, data: { approvals,products,requests,daily:{...daily, data:newDaily } }});
            }else{
                res.status(200).json({success:true, data: { approvals,products,requests,daily:{totalPages: 0, totalData: 0, data:[], tdata:[] } }});
            }
        }
    }catch(e){
        console.log(e)
        res.status(200).json({success:false, data: null, msg: e});
    }
  },


  report : async (req,res) => {
    
    var from = req.query.from != '' ? moment(req.query.from).startOf('day').toDate() : moment().startOf('day').toDate();
    var to = req.query.to != '' ? moment(req.query.to).endOf('day').toDate() : moment().endOf('day').toDate();
    const title = (moment(to).diff(moment(from),'days') == 0 ) ? ` ${moment(from).format('MMM DD, YYYY').toUpperCase()}` : `[ FROM : ${moment(from).format('MMM DD, YYYY').toUpperCase()} - TO : ${moment(to).format('MMM DD, YYYY').toUpperCase()} ]`
    
    try{
        // Clients visits
        var clients = (await Order.find({
            $and: [
                { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                    ] 
                },
                { created_at: {
                    $gte: from,
                    $lte: to
                  }
                }
            ] 
        }).exec()).length;
 
        // Requisitions
        var requests = await Request.find({ 
            $and: [
                { status: 1},
                { created_at: {
                        $gte: from,
                        $lte: to
                    }
                }
            ]
        }).sort({rid:-1}).populate('product').lean();
        
        // Amount Sold
        var sales = (await Order.find({
            $and: [
                { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                    ] 
                },
                { created_at: {
                        $gte: from,
                        $lte: to
                    }
                }
            ] 
        }).sort().lean()).reduce((acc,s) => acc+s.amount,0);

        // Orders Made / Completed Sales
        var orders = await Order
            .find({
                $and: [
                    { $or:[
                            { $and: [{completed: 1}, {ordertype: 'normal'}] },
                            { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                        ] 
                    },
                    { created_at: {
                            $gte: from,
                            $lte: to
                        }
                    }
                ] 
            })
            .sort({oid:-1})
            .lean();

        
        if(orders){
            orders = await Promise.all(orders.map(async (order) => {
                order.created_at = moment(order.created_at).format('LLL').toUpperCase();
                order.cart = await Cart.find({order:order._id}).populate('product').lean();
                order.quantity = order.cart.reduce((acc,ct) => acc+ct.quantity,0);
                return order;
            }))
        }

        // Product Sold
        var products = orders.reduce((acc,order) => acc+order.quantity,0);
        
        

        // Year-long Sales
        var start = moment(new Date(new Date().getFullYear(),0,1)).startOf('day').toDate()
        var end = moment(new Date(new Date().getFullYear(),11,31)).endOf('day').toDate()
        var chartyear = {'JAN':0,'FEB':0, 'MAR':0, 'APR':0, 'MAY':0, 'JUN':0, 'JUL':0, 'AUG':0, 'SEP':0, 'OCT':0,'NOV':0,'DEC':0};
        var yeartitle = `SALES THIS YEAR -- [ ${moment(start).format('MMM DD, YYYY').toUpperCase()} - ${moment(end).format('MMM DD, YYYY').toUpperCase()} ]`;
        var yearorders = await Order
            .find({
                $and: [
                    { $or:[
                        { $and: [{completed: 1}, {ordertype: 'normal'}] },
                        { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                      ] 
                    },
                    { created_at: {
                        $gte: start,
                        $lte: end
                      }
                    }
                ] 
            })
            .sort({oid:-1})
            .lean();
            
        if(yearorders){
             for(var order of yearorders){
                 if(moment(order.created_at).format('MMM').toUpperCase().includes('JAN')){
                    chartyear['JAN'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('FEB')){
                    chartyear['FEB'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('MAR')){
                    chartyear['MAR'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('APR')){
                    chartyear['APR'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('MAY')){
                    chartyear['MAY'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('JUN')){
                    chartyear['JUN'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('JUL')){
                    chartyear['JUL'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('AUG')){
                    chartyear['AUG'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('SEP')){
                    chartyear['SEP'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('OCT')){
                    chartyear['OCT'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('NOV')){
                    chartyear['NOV'] += order.amount;
                 }else if(moment(order.created_at).format('MMM').toUpperCase().includes('DEC')){
                    chartyear['DEC'] += order.amount;
                 }
            }
        }


        // Week-long Sales
        const week = moment().format('w'); // Week in Year
        //const day = moment().format('e'); // Week day ( 0-6 | Sun-Sat )
        var start = moment(`${week} 0 ${new Date().getFullYear()}`,'w e YYYY').startOf('day').toDate()
        var end = moment(`${week} 6 ${new Date().getFullYear()}`,'w e YYYY').endOf('day').toDate()
        var chartweek = {'MONDAY':0,'TUESDAY':0, 'WEDNESDAY':0, 'THURSDAY':0, 'FRIDAY':0, 'SATURDAY':0, 'SUNDAY':0 };
        var weektitle = `SALES THIS WEEK -- [ ${moment(start).format('ddd MMM DD, YYYY').toUpperCase()}  - ${moment(end).format('ddd MMM DD, YYYY').toUpperCase()} ]`;
        var weekorders = await Order
            .find({
                $and: [
                    { $or:[
                            { $and: [{completed: 1}, {ordertype: 'normal'}] },
                            { $and: [{completed: 1}, {ordertype: 'credit'},{approval: 1}] },
                        ] 
                    },
                    { created_at: {
                            $gte: start,
                            $lte: end
                        }
                    }
                ] 
            })
            .sort({oid:-1})
            .lean();
        if(weekorders){
             for(var order of weekorders){
                 if(moment(order.created_at).format('e') == 1 && moment(order.created_at).format('w') == week){
                    chartweek['MONDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 2 && moment(order.created_at).format('w') == week){
                    chartweek['TUESDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 3 && moment(order.created_at).format('w') == week){
                    chartweek['WEDNESDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 4 && moment(order.created_at).format('w') == week){
                    chartweek['THURSDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 5 && moment(order.created_at).format('w') == week){
                    chartweek['FRIDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 6 && moment(order.created_at).format('w') == week){
                    chartweek['SATURDAY'] += order.amount;
                 }else if(moment(order.created_at).format('e') == 0 && moment(order.created_at).format('w') == week){
                    chartweek['SUNDAY'] += order.amount;
                 }
            }
        }
         
        res.status(200).json({success:true, data: {orders,clients,products,sales,title,chartyear,chartweek,weektitle,yeartitle}});

    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
  },


  request : async (req,res) => {
     try{
        // Request 
        var cart = [];
        for(var ct of req.body.cart){
            var d = { user:req.body.user, receiver:req.body.user, oid:req.body.oid, product_id: ct.id, quantity: ct.quantity, rid: moment().unix(), timestamp: moment(new Date()).format('LLL'), created_at: new Date() }
            cart.push(d);
        }
        var result = await POS.saveRequest(cart);
        if(result){
           res.status(200).json({success:true, data: result});
        }else{
           res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
     }catch(e){
        console.log(e);
        res.status(200).json({success:false, data: null, msg: e});
     }
  },

  fetchRequest : async (req,res) => {
    try{  
        var requests = await POS.fetchRequests();
        console.log(requests)
        if(requests){
            res.status(200).json({success:true, data: requests});
        }else{
            res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
        }
    }catch(e){
        console.log(e)
        res.status(200).json({success:false, data: null, msg: e});
    }
  },

  deleteRequest : async(req,res) => {
    var id = req.params.id;
    try{
       var ins = await POS.deleteRequest(id);
       if(ins){
         res.status(200).json({success:true, data: ins});
       }else{
         res.status(200).json({success:false, data: null, msg:"Something wrong happend!"});
       }
    } catch(e){
      res.status(200).json({success:false, data: null, msg: e});
    }
  },



  resetall : async (req,res) => {
    try{
        //await Order.deleteMany({}).exec();
        //await Cart.deleteMany({}).exec();
        //await Transaction.deleteMany({}).exec();
        //await Restock.deleteMany({}).exec();
        //await Request.deleteMany({}).exec();
        //res.status(200).json({success:true, data: "Reset success"});
    
    }catch(e){
        res.status(200).json({success:false, data: null, msg: e});
    }
},









}