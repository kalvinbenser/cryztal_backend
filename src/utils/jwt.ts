import * as jwt from 'jsonwebtoken';

/**
 *
 * @param {number} id -- To secure the JWT token
 * @param {string} name  -- To secure the JWT token
 * @returns {string} -- Generated token
 */
export const getToken = (id: number, name: string): string => {
    // ?* JWT token was signed using this method and expires in 2 Days
    const token = jwt.sign({ _id: id, name: name }, 'ABCD', {
        expiresIn: '2 days',
    });
    return token;
};
