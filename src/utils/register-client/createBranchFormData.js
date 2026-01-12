

export const appendBrunchData = (prefix, data, formData) => {

    try {

        formData.append(`${prefix}[pin]`, data.pin)

        // Contact info
        formData.append(`${prefix}[contact_info][business_phone][]`, data.contact_info.business_phone[0]);
        formData.append(`${prefix}[contact_info][business_email][]`, data.contact_info.business_email[0]);
        formData.append(`${prefix}[contact_info][facebook][]`, data.contact_info.facebook[0]);
        formData.append(`${prefix}[contact_info][twitter][]`, data.contact_info.twitter[0]);
        formData.append(`${prefix}[contact_info][instagram][]`, data.contact_info.instagram[0]);
        formData.append(`${prefix}[contact_info][address][]`, data.contact_info.address[0]);
        formData.append(`${prefix}[contact_info][website][]`, data.contact_info.website[0]);

        // Work schedules
        Object.entries(data.workschedules).forEach(([day, times]) => {
            times.forEach((time) => {
                formData.append(`${prefix}[workschedules][${day}][]`, time);
            });
        });

        // Serving ways
        data.serving_ways.forEach((value) => {
            formData.append(`${prefix}[serving_ways][]`, value);
        });

        // Payment services
        data.payment_services.forEach((value) => {
            formData.append(`${prefix}[payment_services][]`, value);
        });

        // Other fields
        formData.append(`${prefix}[tables_number]`, data.tables_number);
        formData.append(`${prefix}[currency_id]`, data.currency_id);
        formData.append(`${prefix}[business_name]`, data.business_name);
        formData.append(`${prefix}[business_country]`, data.business_country);
        formData.append(`${prefix}[business_city]`, data.business_city);
        formData.append(`${prefix}[latitude]`, data.latitude);
        formData.append(`${prefix}[longitude]`, data.longitude);
        formData.append(`${prefix}[business_format]`, data.business_format);
        formData.append(`${prefix}[menu_design]`, data.menu_design);
        formData.append(`${prefix}[default_mode]`, data.default_mode);
        formData.append(`${prefix}[payment_time]`, data.payment_time);
        formData.append(`${prefix}[call_waiter]`, data.call_waiter);
        if (data.pricing_id) formData.append(`${prefix}[pricing_id]`, data.pricing_id);
        if (data.payment_method) formData.append(`${prefix}[payment_method]`, data.payment_method);
        if (data.discount_id) formData.append(`${prefix}[discount_id]`, data.discount_id);
    } catch (error) {
        throw new Error(`${prefix} missing required fields: ${error.message}`);
    }
};


export const appendUserData = ({ personalData, formData }) => {
    formData.append('name', personalData.fullName?.trim() || '');
    formData.append('mobile', personalData.phone?.trim() || '');
    formData.append('email', personalData.email?.trim().toLowerCase() || '');
    formData.append('birth_date', personalData.year && personalData.month && personalData.day
        ? `${personalData.year}-${personalData.month}-${personalData.day}`
        : '');
    formData.append('country', personalData.country || '');
    formData.append('password', personalData.password || '1');
    formData.append('user_type', 'qtap_clients');
    formData.append('payment_method', personalData.payment_method || 'cash');
    formData.append('pricing_id', personalData.pricing_id || 1);
    formData.append('pricing_way', `${personalData.pricing_way}_price` || 'monthly_price');
    if (personalData.discount_id) formData.append('discount_id', personalData.discount_id);
    if (personalData.affiliate_code) formData.append('affiliate_code', personalData.affiliate_code);

    // Append image if it exists
    if (personalData.img instanceof File) {
        formData.append('img', personalData.img);
    }
    if (sessionStorage.getItem('affiliate_code')) {
        formData.append('affiliate_code', sessionStorage.getItem('affiliate_code'));
    }
}