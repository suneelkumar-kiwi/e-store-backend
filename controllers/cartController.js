const Cart = require('../models/Cart');

// Add Item to Cart
exports.addItemToCart = async (req, res) => {
  const { userId, productId, name, price, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity });
      }
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, name, price, quantity }],
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error adding item to cart', details: err.message });
  }
};

// Get Cart Items
exports.getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving cart', details: err.message });
  }
};

// Update Item Quantity
exports.updateCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error updating cart item', details: err.message });
  }
};

// Remove Item from Cart
exports.removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error removing item from cart', details: err.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing cart', details: err.message });
  }
};
