var db = require('../config/database');
var Product = require('../model/product');
var Category = require('../model/category');
var Restock = require('../model/restock');
var Vat = require('../model/vat');
var bcrypt = require('bcrypt');

var moment = require('moment');
const restock = require('../model/restock');
const { POS } = require('../model/model');
module.exports = {

    fetchProducts : async (req,res) => {
        try{
            const { siteid } = req.query
            var products = await POS.fetchProducts(siteid);
            if(products){
                res.status(200).json({success:true, data: products});
            }else{
                res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchSearchProducts : async (req,res) => {
      try{
          const { siteid,page,keyword } = req.query
          var products = await POS.fetchSearchProducts(siteid,page,keyword);
          console.log(req.query)
          //console.log(products)
          if(products){
              res.status(200).json({success:true, data: products});
          }else{
              res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
        console.log(e)
          res.status(403).json({success:false, data: null, msg: e});
      }
    },

    fetchProduct : async (req,res) => {
        var id = req.params.id;
        try{
            var product = await POS.fetchProduct(id);
            if(product){
                product.created_at = moment(product.created_at).format('LLL');
                res.status(200).json({success:true, data: product});
            }else{
                res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveProduct : async (req,res) => {
        console.log(req.body);
        try{
           var ins = await POS.saveProduct(req.body);
           if(ins){
             res.json({success:true, data: ins});
           }else{
             res.json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.json({success:false, data: null, msg: e});
        }
    },

    updateProduct : async (req,res) => {
        var id = req.params.id;
        try{
            var ins = await POS.updateProduct(id,req.body);
            if(ins){
              res.json({success:true, data: ins});
            }else{
              res.json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.json({success:false, data: null, msg: e});
         }
    },

    deleteProduct : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await POS.deleteProduct(id);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupProduct : async(req,res) => {
        try{
            data = [
                {name:"Software Developer", phone: "0277675089", email: "ebenezerkb.ackah@gmail.com", username: "dexitional", password:bcrypt.hashSync('gloria007',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1},
                {name:"Software Developer", phone: "0244087163", email: "skoku@gmail.com", username: "skoku", password:bcrypt.hashSync('p@ssw0rd1234',10), location: "Akotokyir", address: "MIS-UCC", allow_access: 1}
            ]
           var ins = await Product.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchAsyncProducts : async (req,res) => {
      try{
          const { siteid } = req.query
          console.log(req.query)
          var products = await POS.fetchProducts(siteid);
          if(products){
              products = products.map((row) => {
                row.max = row.quantity;
                return row;
              })
              res.status(200).json({success:true, data: products })
          }else{
             res.status(200).json({success:false, data: null, msg:"Something wrong happend!"})
          }
      }catch(e){
        console.log(e)
        //res.status(200).json({success:false, data: null, msg: e })
      }
  },

    /* CATEGORIES */

    fetchCats : async (req,res) => {
        try{
            const { siteid } = req.query
            var cats = await POS.fetchCategories();
            if(cats){
               res.status(200).json({success:true, data: cats});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchCat : async (req,res) => {
        var id = req.params.id;
        try{
            var cat = await POS.fetchCategory(id);
            if(cat){
                res.status(200).json({success:true, data: cat});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveCat : async (req,res) => {
        try{
           var ins = await POS.saveCategory(req.body);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e.toSring()});
        }
    },

    updateCat : async (req,res) => {
        var id = req.params.id;
        try{
            var ins = await POS.updateCategory(id,req.body);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e});
         }
    },

    deleteCat : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await POS.deleteCategory(id);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupCat : async(req,res) => {
        try{
           data = [
              {title:"WC", description: "Water Closets", status: 1},
              {title:"Curtains", description: "Bath room curtains", status: 1},
           ]
           var ins = await Category.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },


    /* VAT */

    fetchVats : async (req,res) => {
        try{
            const { siteid } = req.query
            var vats = await POS.fetchVats(siteid);
            if(vats){
               res.status(200).json({success:true, data: vats});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    fetchVat : async (req,res) => {
        var id = req.params.id;
        try{
            var vat = await POS.fetchVat(id);
            if(vat){
                res.status(200).json({success:true, data: vat});
            }else{
                res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    saveVat : async (req,res) => {
        try{
           var ins = await POS.saveVat(req.body);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        }catch(e){
            res.status(403).json({success:false, data: null, msg: e});
        }
    },

    updateVat : async (req,res) => {
        var id = req.params.id;
        try{
            var ins = await POS.updateVat(id,req.body);
            if(ins){
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
            }
         }catch(e){
             res.status(403).json({success:false, data: null, msg: e});
         }
    },

    deleteVat : async(req,res) => {
        var id = req.params.id;
        try{
           var ins = await POS.deleteVat(id);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e});
        }
    },

    setupVat : async(req,res) => {
        try{
           data = [
              {rate:23, description: "VAT Rate", status:1},
              {rate:12, description: "VAT Rate", status:1},
           ]
           var ins = await Vat.insertMany(data);
           if(ins){
             res.status(200).json({success:true, data: ins});
           }else{
             res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
           }
        } catch(e){
          res.status(403).json({success:false, data: null, msg: e });
        }
    },


    /* RESTOCK  */
    fetchRestocks : async (req,res) => {
      try{
          const { siteid } = req.query
          var stocks = await POS.fetchRestocks(siteid);
          if(stocks){
             stocks = stocks.map((stock) => {
                  stock.created_at = moment(stock.created_at).format('LLL');
                  return stock;
              })
              res.status(200).json({success:true, data: stocks});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },


  /* RESTOCK  */

  fetchRestock : async (req,res) => {
      var id = req.params.id;
      try{
          var product = await POS.fetchRestock(id);
          if(product){
              product.created_at = moment(product.created_at).format('LLL');
              res.status(200).json({success:true, data: product});
          }else{
              res.status(202).json({success:false, data: null, msg:"Something wrong happend!"});
          }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  saveRestock : async (req,res) => {
      try{
         req.body.created_at = moment(new Date())
         var ins = await POS.saveRestock(req.body);
         if(ins){
           res.status(200).json({success:true, data: ins});
         }else{
           res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
         }
      }catch(e){
          res.status(403).json({success:false, data: null, msg: e});
      }
  },

  updateRestock : async (req,res) => {
      var id = req.params.id;
      console.log(req.body);
      try{
          var ins = await POS.updateRestock(id,req.body);
          if(ins){
            res.status(200).json({success:true, data: ins});
          }else{
            res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
          }
       }catch(e){
           res.status(403).json({success:false, data: null, msg: e});
       }
  },

  deleteRestock : async(req,res) => {
      var id = req.params.id;
      try{
         var ins = await POS.deleteRestock(id)
         if(ins){
           res.status(200).json({success:true, data: ins});
         }else{
           res.status(403).json({success:false, data: null, msg:"Something wrong happend!"});
         }
      } catch(e){
        res.status(403).json({success:false, data: null, msg: e});
      }
  },


  loadRestock : async(req,res) => {
      var id = req.params.id;
      try{
        var stock = await POS.fetchRestock(id);
        if(stock){
            var product = await POS.fetchProduct(stock.product_id);
            var qty = product.quantity + stock.quantity;
            /*var data = {quantity:qty, price:stock.price, cprice: stock.cprice}*/
            var data = {quantity:qty}
            var ins = await POS.updateProduct(product.id,data);
            if(ins){
              var ins = await POS.updateRestock(stock._id,{action:1});
              res.status(200).json({success:true, data: ins});
            }else{
              res.status(202).json({success:true, data: null, msg:"Something wrong happend!"});
            }
          }else{
              res.status(202).json({success:true, data: null, msg:"Something wrong happend!"});
          }
      } catch(e){
        res.status(403).json({success:false, data: null, msg: e});
      }
  },




}