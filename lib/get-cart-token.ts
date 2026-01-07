import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

/**
 * Retrieves the current cart token from cookies or generates a new one.
 * The token is stored in the 'cartToken' cookie and identifies the visitor's session.
 */
export const getCartToken = (): string => {
    if (typeof window === 'undefined') {
        return '';
    }

    let token = Cookies.get('cartToken');

    if (!token) {
        token = uuidv4();
        Cookies.set('cartToken', token, { expires: 365 }); // Store for 1 year
    }

    return token;
};
