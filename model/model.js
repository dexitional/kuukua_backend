var db = require('../config/mysql');
const { filterAlgo } = require('../util/helperutil');

module.exports.POS = {

    /* USERS */

    fetchUsers : async (siteid) => {
        const sql = "select * from users where siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchUser : async (id) => {
        const sql = "select * from users where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    findUser : async (username,siteid) => {
        const sql = "select * from users where siteid = "+siteid+" and username = '"+username+"'";
        const res = await db.query(sql);
        return res && res[0];
    },

    saveUser : async (data) => {
        const sql = "insert into users set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateUser : async (id,data) => {
        const sql = "update users set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteUser : async (id) => {
        const sql = "delete from users where id = "+id;
        const res = await db.query(sql);
        return res;
    },

    /* SETTINGS */

    
    fetchSettings : async () => {
        const sql = "select * from sites where status = 1";
        const res = await db.query(sql);
        return res;
    },

    fetchActiveSetting : async (id) => {
        const sql = "select * from sites where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },


    /* LOGS */

    logWriter : async (data) => {
        const sql = "insert into logs set ?";
        const res = await db.query(sql,data);
        return res;
    },

    logOrder : async (data) => {
        const sql = "insert into orderlogs set ?";
        const res = await db.query(sql,data);
        return res;
    },

    logStock : async (data) => {
        const sql = "insert into stocklogs set ?";
        const res = await db.query(sql,data);
        return res;
    },


    /* PRODUCTS */
    
    fetchProducts : async (siteid) => {
        const sql = "select * from products where siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchSearchProducts : async (siteid,page,keyword) => {
        
        var sql = `select * from products where siteid = ${siteid} `;
        var cql = `select count(*) as total from products where siteid = ${siteid} `;
        const size = 50;
        const pg  = parseInt(page);
        const offset = (pg * size) || 0;
        
        if(keyword){
            sql += ` and (lower(title) like '%${keyword.toLowerCase()}%' or lower(description) like '%${keyword.toLowerCase()}%')`
            cql += ` and (title like '%${keyword.toLowerCase()}%' or lower(description) like '%${keyword.toLowerCase()}%')`
        }
        
        sql += ` order by title asc `
        sql += !keyword ? ` limit ${offset},${size}` : ` limit ${size}`
        console.log(sql)
        console.log(cql)
        const ces = await db.query(cql);
        const res = await db.query(sql);
        const count = Math.ceil(ces[0].total/size) > 0 ? Math.ceil(ces[0].total/size) : 1
        return {
          totalPages: count,
          totalData: ces[0].total,
          data: res,
        }
    },

    fetchProduct : async (id) => {
        const sql = "select * from products where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    findProduct : async (username,siteid) => {
        const sql = "select * from products where siteid = "+siteid+" and title = '"+username+"'";
        const res = await db.query(sql);
        return res && res[0];
    },

    countProducts : async (siteid) => {
        const sql = "select count(*) as num from products where siteid = "+siteid;
        const res = await db.query(sql);
        return res && res[0].num;
    },

    saveProduct : async (data) => {
        const sql = "insert into products set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateProduct : async (id,data) => {
        const sql = "update products set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteProduct : async (id) => {
        const sql = "delete from products where id = "+id;
        const res = await db.query(sql);
        return res;
    },


     /* CUSTOMERS */
    
    fetchCustomers : async (siteid) => {
        const sql = "select * from customers where siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchCustomer : async (id) => {
        const sql = "select * from customers where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    findCustomer : async (username,siteid) => {
        const sql = "select * from customers where siteid = "+siteid+" and title = '"+username+"'";
        const res = await db.query(sql);
        return res && res[0];
    },

    saveCustomer : async (data) => {
        const sql = "insert into customers set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateCustomer : async (id,data) => {
        const sql = "update customers set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteCustomer : async (id) => {
        const sql = "delete from customers where id = "+id;
        const res = await db.query(sql);
        return res;
    },



     /* CATEGORIES */
    
     fetchCategories : async (siteid) => {
        const sql = "select * from categories where siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchCategory : async (id) => {
        const sql = "select * from categories where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    findCategory : async (title,siteid) => {
        const sql = "select * from categories where siteid = "+siteid+" and title = '"+title+"'";
        const res = await db.query(sql);
        return res && res[0];
    },

    saveCategory : async (data) => {
        const sql = "insert into categories set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateCategory : async (id,data) => {
        const sql = "update categories set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteCategory : async (id) => {
        const sql = "delete from categories where id = "+id;
        const res = await db.query(sql);
        return res;
    },


     /* VAT */
    
     fetchVats : async (siteid) => {
        const sql = "select * from vats where siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchVat : async (id) => {
        const sql = "select * from vats where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    saveVat : async (data) => {
        const sql = "insert into vats set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateVat : async (id,data) => {
        const sql = "update vats set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteVat : async (id) => {
        const sql = "delete from vats where id = "+id;
        const res = await db.query(sql);
        return res;
    },
    


     /* RESTOCK */
    
     fetchRestocks : async (siteid) => {
        const sql = "select r.*,p.title as product_title from restocks r left join products p on p.id = r.product_id where r.siteid = "+siteid;
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchRestock : async (id) => {
        const sql = "select * from restocks where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    saveRestock : async (data) => {
        const sql = "insert into restocks set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateRestock : async (id,data) => {
        const sql = "update restocks set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteRestock : async (id) => {
        const sql = "delete from restocks where id = "+id;
        const res = await db.query(sql);
        return res;
    },
    


    /* STOCKLOGS */
    
    fetchStocklogs : async (siteid) => {
        const sql = "select * from stocklogs where siteid = "+siteid;
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchStocklog : async (id) => {
        const sql = "select * from stocklogs where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    saveStocklog : async (data) => {
        const sql = "insert into stocklogs set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateStocklog : async (id,data) => {
        const sql = "update stocklogs set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteStocklog : async (id) => {
        const sql = "delete from stocklogs where id = "+id;
        const res = await db.query(sql);
        return res;
    },


    /* LOGS */
    
    fetchLogs : async (siteid) => {
        const sql = "select * from logs where siteid = "+siteid;
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchLog : async (id) => {
        const sql = "select * from logs where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    saveLog : async (data) => {
        const sql = "insert into logs set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateLog : async (id,data) => {
        const sql = "update logs set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteLog : async (id) => {
        const sql = "delete from logs where id = "+id;
        const res = await db.query(sql);
        return res;
    },


    /* CART */
    
    fetchCarts : async (siteid) => {
        const sql = "select c.*,p.title as product_title from carts c left join products p on p.id = c.product_id where r.siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchCart : async (orderid) => {
        const sql = "select c.*,p.title as product_title from carts c left join products p on p.id = c.product_id where order_id = "+orderid;
        const res = await db.query(sql);
        return res;
    },

    fetchCartByProduct : async (pid) => {
        const sql = "select c.*,p.title as product_title from carts c left join products p on p.id = c.product_id where c.product_id = "+pid;
        const res = await db.query(sql);
        return res;
    },

    saveCart : async (data) => {
        const sql = "insert into carts set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateCart : async (id,data) => {
        const sql = "update carts set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteCart : async (id) => {
        const sql = "delete from carts where id = "+id;
        const res = await db.query(sql);
        return res;
    },

    deleteCartByOrder : async (id) => {
        const sql = "delete from carts where order_id = "+id;
        const res = await db.query(sql);
        return res;
    },


     /* ORDERS */
    
    fetchRejectedOrders : async () => {
        const sql = "select * from orders where approval = 2 and ordertype = 'credit' order by created_at desc";
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchDraftOrders : async () => {
        const sql = "select * from orders where completed = 0 and ordertype = 'credit' order by created_at desc";
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchCompletedOrders : async () => {
        const sql = "select * from orders where completed = 1 order by created_at desc limit 50 ";
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchCreditSales : async () => {
        const sql = "select * from orders where approval = 1 and ordertype = 'credit' order by created_at desc";
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    fetchCashSales : async () => {
        const sql = "select * from orders where completed = 1 and ordertype = 'normal' order by created_at desc limit 50";
        const res = await db.query(sql);
        console.log(res)
        return res;
    },

    
    fetchCompletedSales : async (siteid,sess,page,keyword) => {
        var sql = `select * from orders where siteid = ${siteid} and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) `;
        var cql = `select count(*) as total from orders where siteid = ${siteid} and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) `;
        const size = 50;
        const pg  = parseInt(page);
        const offset = (pg * size) || 0;
        
        if(keyword){
            sql += ` and oid like '%${keyword}%' or refname like '%${keyword}%'`
            cql += ` and oid like '%${keyword}%' or refname like '%${keyword}%'`
        }
  
        sql += ` order by created_at desc `
        sql += !keyword ? ` limit ${offset},${size}` : ` limit ${size}`
        
        const ces = await db.query(cql);
        const res = await db.query(sql);

        if(sess){
          const dt = res.length > 0 ? filterAlgo(res) : []
          const count = Math.ceil(dt.length/size) > 0 ? Math.ceil(dt.length/size) : 1
          return {
            totalPages: count,
            totalData: dt.length,
            data: dt,
          }

        }else{
          const count = Math.ceil(ces[0].total/size) > 0 ? Math.ceil(ces[0].total/size) : 1
          return {
            totalPages: count,
            totalData: ces[0].total,
            data: res,
          }
        }
    },

   

    fetchDailySales : async (siteid,sess,page,keyword) => {
        var tql = `select * from orders where siteid = ${siteid} and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) and date(now()) = date(created_at) `;
        var sql = `select * from orders where siteid = ${siteid} and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) and date(now()) = date(created_at) `;
        var cql = `select count(*) as total from orders where siteid = ${siteid} and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) and date(now()) = date(created_at) `;
        const size = 25;
        const pg  = parseInt(page);
        const offset = (pg * size) || 0;
        
        if(keyword){
            sql += ` and oid like '%${keyword}%' or refname like '%${keyword}%'`
            cql += ` and oid like '%${keyword}%' or refname like '%${keyword}%'`
        }
  
        tql += ` order by created_at desc `
        sql += ` order by created_at desc `
        sql += !keyword ? ` limit ${offset},${size}` : ` limit ${size}`
        
        const ces = await db.query(cql);
        const res = await db.query(sql);
        const tes = await db.query(tql);

        if(sess){
          const dt = res.length > 0 ? filterAlgo(res) : []
          const dm = tes.length > 0 ? filterAlgo(tes) : []
          const count = Math.ceil(dt.length/size) > 0 ? Math.ceil(dt.length/size) : 1
          return {
            totalPages: count,
            totalData: dt.length,
            data: dt,
            tdata: dm
          }

        }else{
          const count = Math.ceil(ces[0].total/size) > 0 ? Math.ceil(ces[0].total/size) : 1
          return {
            totalPages: count,
            totalData: ces[0].total,
            data: res,
            tdata: tes
          }
        }
    },

    fetchRejectedSales : async (siteid,sess,page,keyword) => {
        var sql = `select * from orders where siteid = ${siteid} and completed = 1 and approval = 2  `;
        var cql = `select count(*) as total from orders where siteid = ${siteid} and completed = 1 and approval = 2  `;
        const size = 50;
        const pg  = parseInt(page);
        const offset = (pg * size) || 0;
        
        if(keyword){
            sql += ` and oid like '%${keyword}%' or refname like '%${keyword}%'`
            cql += ` and oid like '%${keyword}%' or refname like '%${keyword}%'`
        }
  
        sql += ` order by created_at desc `
        sql += !keyword ? ` limit ${offset},${size}` : ` limit ${size}`
        
        const ces = await db.query(cql);
        const res = await db.query(sql);

        if(sess){
          const dt = res.length > 0 ? filterAlgo(res) : []
          const count = Math.ceil(dt.length/size) > 0 ? Math.ceil(dt.length/size) : 1
          return {
            totalPages: count,
            totalData: dt.length,
            data: dt,
          }

        }else{
          const count = Math.ceil(ces[0].total/size) > 0 ? Math.ceil(ces[0].total/size) : 1
          return {
            totalPages: count,
            totalData: ces[0].total,
            data: res,
          }
        }

    },

    fetchOrderByPeriod : async (from,to,siteid) => {
        if(from && to){
          const sql = "select * from orders where siteid = "+siteid+" and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) and date(now()) = date(created_at) order by created_at desc";
        }else if(from && !to){
          const sql = "select * from orders where siteid = "+siteid+" and (completed = 1 and ordertype = 'normal' or (ordertype = 'normal' and approval = 1)) and date(now()) = date(created_at) order by created_at desc";
        }else{

        }
        const res = await db.query(sql);
        return res;
    },

    countPendedApprovals : async (siteid) => {
        const sql = "select count(*) as num from orders where siteid = "+siteid+" and approval = 0 and ordertype = 'credit'";
        const res = await db.query(sql);
        return res && res[0].num;
    },

    countOrdersByPeriod : async (fro,to,siteid) => {
        const sql = "select count(*) as num from orders where siteid = "+siteid+" and (completed = 1 and ordertype = 'normal' or (ordertype = 'credit' and approval = 1)) and date(now()) = date(created_at)";
        const res = await db.query(sql);
        return res && res[0].num;
    },

    
    

    fetchOrders : async (siteid) => {
        const sql = "select * from orders where siteid = "+siteid+" order by created_at desc";
        const res = await db.query(sql);
        return res;
    },

    fetchOrder : async (id) => {
        const sql = "select * from orders where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    fetchOrderByOid : async (oid) => {
        const sql = "select * from orders where oid = "+oid;
        const res = await db.query(sql);
        return res && res[0];
    },

    saveOrder : async (data) => {
        const sql = "insert into orders set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateOrder : async (id,data) => {
        const sql = "update orders set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteOrder : async (id) => {
        const sql = "delete from orders where id = "+id;
        const res = await db.query(sql);
        return res;
    },

    deleteOrderByOid : async (id) => {
        const sql = "delete from orders where oid = "+id;
        const res = await db.query(sql);
        return res;
    },


     /* TRANSACTIONS */
    
     fetchTransactions : async (siteid) => {
        const sql = "select * from transactions where siteid = "+siteid+" order by created_at desc";
        const res = await db.query(sql);
        return res;
    },

    fetchTransaction : async (id) => {
        const sql = "select * from transactons where id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    fetchTransactionByOrder : async (id) => {
        const sql = "select * from transactions where order_id = "+id;
        const res = await db.query(sql);
        return res;
    },

    saveTransaction : async (data) => {
        const sql = "insert into transactions set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateTransaction : async (id,data) => {
        const sql = "update transactions set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteTransaction : async (id) => {
        const sql = "delete from transactions where id = "+id;
        const res = await db.query(sql);
        return res;
    },

    deleteTransactionByOrder : async (id) => {
        const sql = "delete from transactions where order_id = "+id;
        const res = await db.query(sql);
        return res;
    },
    


    /* REQUESTS */

    fetchRequestsToday : async (siteid) => {
        const sql = "select r.*,p.title as product_title from requests r left join products p on p.id = r.product_id where r.siteid = "+siteid+" and r.status = 1 and date(now()) = date(r.created_at)";
        const res = await db.query(sql);
        return res;
    },

    fetchRequests : async (siteid) => {
        const sql = "select r.*,p.title as product_title from requests r left join products p on p.id = r.product_id where r.siteid = "+siteid;
        const res = await db.query(sql);
        return res;
    },

    fetchRequest : async (id) => {
        const sql = "select r.*,p.title as product_title from requests r left join products p on p.id = r.product_id where r.id = "+id;
        const res = await db.query(sql);
        return res && res[0];
    },

    findUser : async (username) => {
        const sql = "select * from users where username = '"+username+"'";
        const res = await db.query(sql);
        return res && res[0];
    },

    saveRequest : async (data) => {
        const sql = "insert into requests set ?";
        const res = await db.query(sql,data);
        return res;
    },

    updateRequest : async (id,data) => {
        const sql = "update requests set ? where id = "+id;
        const res = await db.query(sql,data);
        return res;
    },

    deleteRequest : async (id) => {
        const sql = "delete from requests where id = "+id;
        const res = await db.query(sql);
        return res;
    },



}