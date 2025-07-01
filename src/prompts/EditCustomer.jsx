import { useState } from 'react';
import { useCustomer, useDisplay, useCustomerNames } from '../context/useContext';
import { Prompt, PromptButton, PromptField, PromptInput } from '../components';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getDocumentName, validateCustomerInfo } from './scripts';

/**
 * A prompt containing a form that allows the user to edit the customer in question.
 * 
 * @component
 * @returns {JSX.Element} The EditCustomer prompt component.
 */
function EditCustomer() {
    const { customer, setCustomer } = useCustomer();
    const { setDisplay } = useDisplay();
    const { setCustomers } = useCustomerNames();
    const [temp, setTemp] = useState({
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        email: customer?.email || '',
        phone: customer?.phone || ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTemp(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        console.log('handleSubmit');
        if (isSubmitting) return false;
        setIsSubmitting(true);
        setErrors({});

        console.log(temp);
        const errs = validateCustomerInfo(temp);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setIsSubmitting(false);
            return false;
        }

        try {
            if (!customer) {
                throw new Error('Customer data is not properly loaded');
            }

            const arrayName = getDocumentName(customer.customer_id);
            const customerDoc = await getDoc(doc(db, 'customers', arrayName));
            const currentCustomers = customerDoc.data()?.customers || [];

            const updatedData = {
                first_name: temp.first_name.trim(),
                last_name: temp.last_name.trim(),
                email: temp.email?.trim() || '',
                phone: temp.phone?.trim() || ''
            };
            const updatedCustomers = currentCustomers.map(c => {
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
            setCustomers(prevCustomers => 
                prevCustomers.map(c => 
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
            setCustomer(updatedCustomers.find(c => c.customer_id === customer.customer_id));
            
            setDisplay('default');
            return true;
        } catch (error) {
            setErrors({ submit: 'Failed to update customer. Please try again.' });
            console.error(error.message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setTemp({});
        setErrors('');
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    label={isSubmitting ? 'Processing...' : 'Save Changes'}
                />
                <PromptButton
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    label="Cancel"
                />
            </div>
        </Prompt>
    );
}

export default EditCustomer; 
