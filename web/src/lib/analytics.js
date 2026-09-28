/**
 * Google Tag Manager & GA4 E-Commerce Analytics Helper
 */
export const trackEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
};

export const trackViewItem = (product) => {
  if (!product) return;
  trackEvent('view_item', {
    ecommerce: {
      currency: 'BDT',
      value: Number(product.discountPrice || product.price || 0),
      items: [{
        item_id: product.id || product._id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price: Number(product.discountPrice || product.price || 0),
        quantity: 1
      }]
    }
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  trackEvent('add_to_cart', {
    ecommerce: {
      currency: 'BDT',
      value: Number(product.discountPrice || product.price || 0) * quantity,
      items: [{
        item_id: product.id || product._id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price: Number(product.discountPrice || product.price || 0),
        quantity
      }]
    }
  });
};

export const trackBeginCheckout = (cartItems, totalValue) => {
  trackEvent('begin_checkout', {
    ecommerce: {
      currency: 'BDT',
      value: totalValue,
      items: (cartItems || []).map(item => ({
        item_id: item.id || item._id,
        item_name: item.name,
        price: Number(item.price || 0),
        quantity: item.quantity
      }))
    }
  });
};

export const trackPurchase = (order) => {
  if (!order) return;
  trackEvent('purchase', {
    ecommerce: {
      transaction_id: order.id || order.invoiceNo || `INV-${Date.now()}`,
      value: Number(order.grandTotal || order.payableTotal || 0),
      currency: 'BDT',
      items: (order.items || []).map(item => ({
        item_id: item.productId || item.id,
        item_name: item.name,
        price: Number(item.price || 0),
        quantity: item.quantity
      }))
    }
  });
};
