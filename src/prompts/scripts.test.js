import { describe, it, expect, vi } from 'vitest';
import { validateCustomerInfo, getDocumentName } from './scripts';

// Mock Firestore and db dependencies
globalThis.db = {};
vi.mock('../firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})), // Return a dummy object for docRef
}));

describe('validateCustomerInfo', () => {

    it('returns no error if customer has all fields filled correctly', () => {
        const valid = validateCustomerInfo({
            customer: {
                first_name: 'Michael',
                last_name: 'Zhang',
                email: 'kale@gmail.com',
                phone: '9059059055'
            }
        });
        expect(Object.keys(valid).length === 0).toBe(true);
    });

    it('returns no error if customer has no email', () => {
        const valid = validateCustomerInfo({
            customer: {
                first_name: 'Michael',
                last_name: 'Zhang',
                email: '',
                phone: '9059059055'
            }
        });
        expect(Object.keys(valid).length === 0).toBe(true);
    });

    it('returns no error if customer has no phone', () => {
        const valid = validateCustomerInfo({
            customer: {
                first_name: 'Michael',
                last_name: 'Zhang',
                email: 'kale@gmail.com',
                phone: ''
            }
        });
        expect(Object.keys(valid).length === 0).toBe(true);
    });

    it('returns error if customer is missing', () => {
        expect(validateCustomerInfo({})).toBe('Customer data is not properly loaded');
    });

    it('returns error for missing first and last name', () => {
        const errs = validateCustomerInfo({ customer: { first_name: '', last_name: '', email: '', phone: '' } });
        expect(errs.first_name).toBe('First name is required');
        expect(errs.last_name).toBe('Last name is required');
    });

    it('returns error for invalid email', () => {
        const errs = validateCustomerInfo({ customer: { first_name: 'A', last_name: 'B', email: 'bad', phone: '' } });
        expect(errs.email).toBe('Please enter a valid email address');
    });

    it('returns error for invalid phone', () => {
        const errs = validateCustomerInfo({ customer: { first_name: 'A', last_name: 'B', email: '', phone: '123' } });
        expect(errs.phone).toBe('Phone number must be 10 digits');
    });

    it('returns no errors for valid customer', () => {
        const errs = validateCustomerInfo({ customer: { first_name: 'A', last_name: 'B', email: 'a@b.com', phone: '1234567890' } });
        expect(errs).toEqual({});
    });
});

describe('getDocumentName', () => {
    it('returns correct doc name for id in range', () => {
        expect(getDocumentName({ id: 101 })).toBe('101_min_200_max');
        expect(getDocumentName({ id: 200 })).toBe('101_min_200_max');
        expect(getDocumentName({ id: 250 })).toBe('201_min_300_max');
    });
});
