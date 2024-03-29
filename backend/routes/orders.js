const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL ORDERS.*/
router.get('/',(req,res) => {
  database.table('orders_details as od')
      .join([
        {
          table: 'orders as o',
          on: 'o.id = od.order_id'
        },
        {
          table: 'products as p',
          on: 'p.id = od.product_id'
        },
        {
          table: 'users as u',
          on: 'u.id = o.user_id'
        }
      ])
      .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
      .sort({id: 1})
      .getAll()
      .then(orders => {
        if (orders.length > 0) {
          res.status(200).json(orders);
        } else {
            res.json({message: 'No orders found'});
        }
      }).catch(err => console.log(err));
});

/* GET SINGLE ORDER.*/
router.get('/:id', async (req, res) => {
    const orderId = req.params.id;


    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({message: `No orders found with order Id ${orderId}`});
            }
        }).catch(err => console.log(err));
});

/* PLACE A NEW ORDER.*/
router.post('/new', (req, res) => {
    let {userId, products} = req.body;
    console.log(userId, products);

    if (userId !== null && userId > 0 && !isNaN(userId)) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {

            if (newOrderId > 0) {
                products.forEach(async (p) => {

                    let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();
                    let inCart = parseInt(p.incart);

                    // Deduct the number of pieces ordered from the quantity in database
                    if (data.quantity > 0) {
                        data.quantity = data.quantity - inCart;

                        if (data.quantity < 0) {
                            data.quantity = 0;
                        }

                    } else {
                        data.quantity = 0;
                    }

                    // Insert order details into the new generated id
                    database.table('orders_details')
                        .insert({
                            order_id: newOrderId,
                            product_id: p.id,
                            quantity: inCart
                        }).then(newId => {
                        database.table('products')
                            .filter({id: p.id})
                            .update({
                                quantity: data.quantity
                            }).then(successNum => {
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                });

            } else {
                res.json({message: 'Failed to add new order details', success: false});
            }
            res.json({
                message: `Order successfully placed with order id ${newOrderId}`,
                success: true,
                order_id: newOrderId,
                products: products
            })
        }).catch(err => res.json(err));
    } else {
        res.json({message: 'Failed to add new order', success: false});
    }
});

    /*DUMMY PAYMENT GATEWAY ENDPOINT*/
    router.post('/payment',(req,res) => {
        setTimeout(() => {
            res.status(200).json({success: true});
        }, 3000);
    });


module.exports = router;
