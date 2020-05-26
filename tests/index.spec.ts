import {JDate} from '../index';

describe('mbDate!', function() {
    it('mbDate works', function() {
        const GREGORIAN_DATE = new Date('1990/10/05');
        const JALALI_DATE = new JDate(GREGORIAN_DATE.getTime()).format('YYYY/MM/DD');
        expect(JALALI_DATE).toBe('1369/07/13');
    });
});