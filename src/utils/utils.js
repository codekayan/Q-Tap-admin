export const printFormData = (formData) => {
    console.log("=======================FORM DATA ======================");
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }
    console.log("=======================================================");

    const plainObject = {};
    for (const [key, value] of formData.entries()) {
        // Skip files in the JSON representation
        if (!(value instanceof File)) {
            plainObject[key] = value;
        }
    }

    // Convert to JSON and print
    console.log(JSON.stringify(plainObject, null, 2));
}

export const BusinessTypes = Object.freeze({
    RESTAURANT: "restaurant",
    CAFE: "cafe",
    CLOUD: "cloud",
    FAST_FOOD: "fast",
    TRUCK: "truck",
    BAKERY: "Bakery",
    PASTRY: "Pastry",
    FRUITS: "Fruits",
    RETAIL: "Retail",
});
export const BusinessLang = Object.freeze({
    EN: 'en',
    AR: 'ar'
});

export const YEAR_SELECT_START_FROM = 1940