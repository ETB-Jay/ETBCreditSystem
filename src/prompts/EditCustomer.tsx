import React from 'react';
import { useState } from 'react';
import { useCustomer, useDisplay, useCustomerNames } from '../context/useContext';
import { Prompt, PromptButton, PromptField, PromptInput } from '../components';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getCustomerDoc, getDocumentName, validateCustomerInfo } from './scripts';
import { Customer } from '../types';

/**
 * Displays a prompt for editing customer information.
 * @returns The EditCustomer component.
 */
function EditCustomer() {
    const { customer, setCustomer } = useCustomer();
    const { setDisplay } = useDisplay();
    const { setCustomers } = useCustomerNames();
    const [temp, setTemp] = useState<{ first_name: string; last_name: string; email: string; phone: string }>({
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        email: customer?.email || '',
        phone: customer?.phone || ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTemp(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return false;
        setIsSubmitting(true);
        setErrors({});

        console.log(temp);
        const errs = validateCustomerInfo(temp);
        if (typeof errs === 'string') {
            setErrors({ submit: errs });
            setIsSubmitting(false);
            return;
        }
        console.log(errs);
        if (Object.values(errs).some(v => v)) {
            setErrors(errs);
            setIsSubmitting(false);
            return;
        }
        console.log(errs);

        try {
            if (!customer) {
                throw new Error('Customer data is not properly loaded');
            }

            const arrayName = getDocumentName(customer.customer_id);
            const currentCustomers = await getCustomerDoc(arrayName);

            const updatedData = {
                first_name: temp.first_name.trim(),
                last_name: temp.last_name.trim(),
                email: temp.email?.trim() || '',
                phone: temp.phone?.trim() || ''
            };
            const updatedCustomers = currentCustomers.map((c: Customer) => {
                if (c.customer_id === customer.customer_id) {
                    return {
                        ...c,
                        ...updatedData
                    };
                }
                return c;
            });
            await updateDoc(doc(db, 'customers', arrayName), {
                customers: updatedCustomers
            });
            setCustomers((prevCustomers: Customer[]) =>
                prevCustomers.map((c: Customer) =>
                    c.customer_id === customer.customer_id
                        ? {
                            ...c,
                            first_name: temp.first_name,
                            last_name: temp.last_name,
                            email: temp.email,
                            phone: temp.phone
                        }
                        : c
                )
            );
            setCustomer(updatedCustomers.find((c: Customer) => c.customer_id === customer.customer_id) || null);

            setDisplay('default');
            return true;
        } catch (error) {
            setErrors({ submit: 'Failed to update customer. Please try again.' });
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setTemp({ first_name: customer?.first_name || '', last_name: customer?.last_name || '', email: customer?.email || '', phone: customer?.phone || '' });
        setErrors({});
        setDisplay('default');
    };

    return (
        <Prompt title="Edit Customer Information">
            <PromptField error={errors.first_name}>
                <PromptInput
                    label={'First Name'}
                    type="text"
                    name="first_name"
                    value={temp.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.last_name}>
                <PromptInput
                    label={'Last Name'}
                    type="text"
                    name="last_name"
                    value={temp.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.email}>
                <PromptInput
                    label={'Email'}
                    type="email"
                    name="email"
                    value={temp.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.phone}>
                <PromptInput
                    label={'Phone Number'}
                    type="tel"
                    name="phone"
                    value={temp.phone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-end space-x-3">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    label={isSubmitting ? 'Processing...' : 'Save Changes'}
                    icon={null}
                />
                <PromptButton
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    label="Cancel"
                    icon={null}
                />
            </div>
        </Prompt>
    );
}

export default EditCustomer; 
