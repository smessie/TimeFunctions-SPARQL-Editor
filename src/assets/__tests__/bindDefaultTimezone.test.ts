import { describe, expect, it } from 'vitest';
import { bindDefaultTimezone, XSD_T } from '../queryWorker';
import { DataFactory } from 'rdf-data-factory';

const DF = new DataFactory();

describe('bindDefaultTimezone', () => {
    it('should not overwrite the timezone when the dateTime has offset Z specified', () => {
        const date = '2025-04-01T10:00:00Z';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('dateTime')), DF.literal(timezone));

        expect(resultingDate.value).toBe(date);
    });

    it('should not overwrite the timezone when the dateTime has offset +00:00 specified', () => {
        const date = '2025-04-01T10:00:00+00:00';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('dateTime')), DF.literal(timezone));

        expect(resultingDate.value).toBe(date);
    });

    it('should not overwrite the timezone when the dateTime has offset -03:00 specified', () => {
        const date = '2025-04-01T10:00:00-03:00';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('dateTime')), DF.literal(timezone));

        expect(resultingDate.value).toBe(date);
    });

    it('should set the default timezone when the dateTime has no offset specified', () => {
        const date = '2025-04-01T10:00:00';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('dateTime')), DF.literal(timezone));

        expect(resultingDate.value).toBe(`${date}.000+02:00`);
    });

    it('should not overwrite the timezone when the date has offset Z specified', () => {
        const date = '2025-04-01Z';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('date')), DF.literal(timezone));

        expect(resultingDate.value).toBe(date);
    });

    it('should not overwrite the timezone when the date has offset +00:00 specified', () => {
        const date = '2025-04-01+00:00';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('date')), DF.literal(timezone));

        expect(resultingDate.value).toBe(date);
    });

    it('should not overwrite the timezone when the date has offset -03:00 specified', () => {
        const date = '2025-04-01-03:00';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('date')), DF.literal(timezone));

        expect(resultingDate.value).toBe(date);
    });

    it('should set the default timezone when the date has no offset specified', () => {
        const date = '2025-04-01';
        const timezone = 'Europe/Brussels';

        const resultingDate = bindDefaultTimezone(DF.literal(date, XSD_T('date')), DF.literal(timezone));

        expect(resultingDate.value).toBe(`${date}+02:00`);
    });
});
