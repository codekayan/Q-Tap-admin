export function haveSameExtrasAndOptions(obj1, obj2) {
    const extras1 = (obj1.selectedExtras ?? []).map(e => e.id).sort();
    const extras2 = (obj2.selectedExtras ?? []).map(e => e.id).sort();

    const options1 = (obj1.selectedOptions ?? []).map(o => o.id).sort();
    const options2 = (obj2.selectedOptions ?? []).map(o => o.id).sort();

    const extrasEqual = JSON.stringify(extras1) === JSON.stringify(extras2);
    const optionsEqual = JSON.stringify(options1) === JSON.stringify(options2);
    return extrasEqual & optionsEqual
}
export const calculateTotalPrice = (cartItems) => { /// TODO: what if the user select multi size of same meal
    let calsubtotal = 0;
    let caltax = 0;
    let caldiscount = 0

    for (const meal of cartItems) {
        let { itemSubTotal, itemDiscount, itemTax } = itemCalculation({
            price_large: meal.price_large,
            price_medium: meal.price_medium,
            price_small: meal.price_small,
            selectedSize: meal.selectedSize,
            special:meal?.special,
            selectedExtra: meal.selectedExtras,
            selectedOptions: meal.selectedOptions,
            Tax: meal.Tax,
            discountPer: meal.discount
        })
        calsubtotal += itemSubTotal * meal.quantity
        caltax += itemTax * meal.quantity
        caldiscount += itemDiscount * meal.quantity
    }

    return (calsubtotal + caltax - caldiscount).toFixed(2);
}
export const calculateSingleItemTotalPrice = (item) => {

    let { itemSubTotal, itemDiscount, itemTax } = itemCalculation({
        price_large: item.price_large,
        price_medium: item.price_medium,
        price_small: item.price_small,
        selectedSize: item.selectedSize,
        special:item?.special,
        selectedExtra: item.selectedExtras,
        selectedOptions: item.selectedOptions,
        Tax: item.Tax,
        discountPer: item.discount
    })
    return (item.quantity * (itemSubTotal + itemTax - itemDiscount)).toFixed(2)
}
export const calculateCartDetails = (cartItems) => {
    let calsubtotal = 0;
    let caltax = 0;
    let caldiscount = 0

    for (const meal of cartItems) {
        let { itemSubTotal, itemDiscount, itemTax } = itemCalculation({
            price_large: meal.price_large,
            price_medium: meal.price_medium,
            price_small: meal.price_small,
            selectedSize: meal.selectedSize,
            special:meal.special,
            selectedExtra: meal.selectedExtras,
            selectedOptions: meal.selectedOptions,
            Tax: meal.Tax,
            discountPer: meal.discount
        })
        calsubtotal += itemSubTotal * meal.quantity
        caltax += itemTax * meal.quantity
        caldiscount += itemDiscount * meal.quantity
    }
    return { calsubtotal, caltax, caldiscount }
}
export const itemCalculation = ({
    price_large, price_medium, price_small, selectedSize,
    special, selectedExtra, selectedOptions,
    Tax, discountPer
}) => {
    console.log(price_large, price_medium, price_small,
        selectedSize,
        special,
        selectedExtra,
        selectedOptions,
        Tax,
        discountPer)
    /* item : { special , selectedSize , Tax, discount,selectedExtra,selectedOptions, 
    price_small,price_medium ,price_large}  */
    let subTotal = 0 // based on  spicial or normal => size / extra / option
    let discount = 0
    let tax = 0
    if (special) {
        subTotal = Number(special.after_discount)
    } else {
        if (selectedSize === 'L')
            subTotal = Number(price_large)
        if (selectedSize === 'M')
            subTotal = Number(price_medium)
        if (selectedSize === 'S')
            subTotal = Number(price_small)
    }
    


    if (Tax) tax += subTotal * Number(Tax) / 100

    if (discountPer) {
        if (!special) {
            discount += subTotal * (Number(discountPer) / 100);
        }
    }

    if (selectedExtra) selectedExtra.map(extra => subTotal += Number(extra.price))
    if (selectedOptions) selectedOptions.map(options => subTotal += Number(options.price))
    console.log("itemSubTotal:", subTotal, "itemDiscount:", discount, "itemTax:", tax)
    return { itemSubTotal: subTotal, itemDiscount: discount, itemTax: tax }

}