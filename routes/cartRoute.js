const Cart = require("../models/CartModel");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../utils/verify");

const router = require("express").Router();
// CREATE A CART
router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.body);
  // console.log(req.body);
  if (!req.body.userId) {
    return res.status(400).send("Please include all fields");
  }
  try {
    // console.log(req.body);
    const oldCart = await Cart.findOne({ userId: req.body.userId });
    console.log(oldCart);
    // console.log(oldCart);
    if (oldCart) {
      let cart1 = [];
      // console.log(oldCart);
      let isUpdated = false;
      for (let i = 0; i < oldCart.products.length; i++) {
        const elem = oldCart.products[i];
        // console.log(elm);
        // console.log(elem.productId, req.body.products[0].productId);
        if (elem.productId == req.body.products[0].productId) {
          console.log(elem.quantity);
          if (req.body.products[0].quantity) {
            elem.quantity = req.body.products[0].quantity;
          }
          if (req.body.products[0].img) {
            elem.img = req.body.products[0].img;
          }
          if (req.body.products[0].price) {
            elem.price = req.body.products[0].price;
          }
          if (req.body.products[0].name) {
            elem.name = req.body.products[0].name;
          }
          // console.log(elem.quantity);
          isUpdated = true;
          // console.log(elem.productId);
        }
      }
      if (!isUpdated) {
        await Cart.updateOne(
          { userId: req.body.userId },
          { $push: { products: req.body.products[0] } },
          {
            new: true,
          }
        );
      }
      // oldCart[0].products.forEach((p, i) => {
      //   if (p.productId == req.body.products[0].productId) {
      //     console.log(p.productId);
      //     p.quantity = req.body.products[0].quantity;
      //     // console.log(p.productId);
      //   }
      //   // console.log(product);
      // });

      // // oldCart.products.push(req.body.
      // const savedOldCart = await Cart.findOneAndUpdate(
      //   { _id: oldCart._id },
      //   req.body,
      //   {
      //     new: true,
      //   }
      // );
      // for (let i = 0; i < oldCart.products.length; i++) {
      //   const elem = oldCart.products[i];
      //   if(elem)
      // }
      // oldCart.products=[...oldCart.products,req.body.products];
      const savedCart = await oldCart.save();
      console.log(savedCart);

      return res.status(200).json({
        success: true,
        savedCart,
        cartLength: savedCart.products.length,
      });
    }
    const newCart = await Cart.create(req.body);
    const savedCart = await newCart.save();

    return res.status(200).json(savedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// UPDATE A CART
router.put("/:cartId", verifyToken, async (req, res, next) => {
  try {
    const oldItem = await Cart.findById(req.params.cartId);
    if (!oldItem) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(req.body);
    // const cart = await Cart.findByIdAndUpdate(
    //   req.params.cartId,
    //   { $push: { products: req.body.products[0] } },
    //   {
    //     new: true,
    //   }
    // );
    oldItem.products.forEach((elem, i) => {
      // if(item.productId==req.body.products[0].productId){
      if (elem.productId == req.body.products[0].productId) {
        // console.log(elem.quantity);
        if (req.body.products[0].quantity) {
          elem.quantity = req.body.products[0].quantity;
        }
        if (req.body.products[0].img) {
          elem.img = req.body.products[0].img;
        }
        if (req.body.products[0].price) {
          elem.price = req.body.products[0].price;
        }
        if (req.body.products[0].name) {
          elem.name = req.body.products[0].name;
        }
      }
    });
    const savedItem = await oldItem.save();
    return res.status(200).json(savedItem);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// DELETE A CART
router.delete("/:cartId", verifyToken, async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.cartId);
    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
});
// DELETE A PRODUCT FROM CART
router.delete("/:cartId/:pid", verifyToken, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    let items = [];
    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].productId === req.params.pid) {
      } else {
        items.push(cart.products[i]);
      }
    }
    cart.products = items;
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// GET USER'S CART
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  // console.log(req.params);
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    return res.status(500).json(err);
  }
});
// GET ALL CART
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const getAllCarts = await Cart.find();
    return res.status(200).json(getAllCarts);
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
