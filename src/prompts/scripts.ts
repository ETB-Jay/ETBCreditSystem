import { Customer } from "../types";

type ErrorProp = Record<string, string>;

const validateCustomerInfo = (customer: Partial<Customer>) => {
    const errs: ErrorProp = {
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    };

    console.log(customer);

    if (!customer) return 'Customer data is not properly loaded';

    if (!customer.first_name) errs.first_name = 'First name is required';
    if (!customer.last_name) errs.last_name = 'Last name is required';

    const emailTrimmed = customer.email?.trim() || '';
    const phoneTrimmed = customer.phone?.trim() || '';
    const phoneDigits = phoneTrimmed.replace(/\D/g, '');
    if (emailTrimmed && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailTrimmed)) {
        errs.email = 'Please enter a valid email address';
    }
    if (phoneTrimmed && phoneDigits.length !== 10) {
        errs.phone = 'Phone number must be 10 digits';
    }
    return errs;
};

const getDocumentName = (id: number) => {
    const min = Math.floor((id - 1) / 100) * 100 + 1;
    const max = min + 99;
    return `${min}_min_${max}_max`;
};



export { validateCustomerInfo, getDocumentName };
