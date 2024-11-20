const setBasePrice = (order, unitPrice, bulkPrice) => {
  const verifyBulkPrice = bulkPrice || unitPrice;
  if (!order || typeof unitPrice !== 'number') {
    throw new Error('Invalid input parameters');
  }
  let basePrice = order.quantity.type === "Sample Selection" ? unitPrice : verifyBulkPrice
  if (order.material && order.material.name) {
    switch (order.material.name) {
      case 'Polyester':
        basePrice += 0.50;
        break;
      case 'Linen':
        basePrice += 1.00;
        break;
      default:
        basePrice += 0;
        break;
    }
  }

  if (order.dyeStyle) {
    switch (order.dyeStyle) {
      case 'reactive':
        basePrice += 1.00;
        break;
      case 'pigment':
        basePrice += 1.50;
        break;
      default:
        basePrice += 0;
        break;
    }
  }

  if (order.stitching && order.stitching.type) {
    switch (order.stitching.type) {
      case 'Flatlock':
        basePrice += 1.50;
        break;
      default:
        basePrice += 1.00;
        break;
    }
  }

  if (order.fading && order.fading.type) {
    switch (order.fading.type) {
      case 'All-over fade':
      case 'Circular fade':
      case 'Shoulder fade':
        basePrice += 1.00;
        break;
      default:
        basePrice += 0;
        break;
    }
  }

  if (order.neck && order.neck.additional && order.neck.additional.material) {
    switch (order.neck.additional.material) {
      case 'Cotton':
      case 'Polyester':
        basePrice += 1.00;
        break;
      default:
        break;
    }
  }


  if (Array.isArray(order.labelUploads) && order.labelUploads.length > 0) {
    basePrice += 1.00;
  }

  if (order.quantity && Array.isArray(order.quantity.list)) {

    const totalQuantity = order.quantity.list.reduce((sum, item) => {
      return sum + (item.value || 0);
    }, 0);

    const totalPrice = basePrice * totalQuantity;

    return totalPrice;
  }
};

export default setBasePrice;