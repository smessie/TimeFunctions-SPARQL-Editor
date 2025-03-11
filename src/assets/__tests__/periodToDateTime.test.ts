import { DataFactory } from 'rdf-data-factory';
import { describe, expect, it } from 'vitest';
import { periodToDateTime, XSD_T } from '../queryWorker';

const DF = new DataFactory();

describe('periodToDateTime', () => {
    it('should return beginning of year with same offset Z for gYear minInclusive', () => {
        const date = '2025Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, true);
        expect(resultingDate.value).toBe('2025-01-01T00:00:00.000+00:00');
    });

    it('should return beginning of next year with same offset Z for gYear maxExclusive', () => {
        const date = '2025Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, false);
        expect(resultingDate.value).toBe('2026-01-01T00:00:00.000+00:00');
    });

    it('should return ending of year with same offset Z for gYear maxInclusive', () => {
        const date = '2025Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, true);
        expect(resultingDate.value).toBe('2025-12-31T23:59:59.999+00:00');
    });

    it('should return ending of previous year with same offset Z for gYear minExclusive', () => {
        const date = '2025Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, false);
        expect(resultingDate.value).toBe('2024-12-31T23:59:59.999+00:00');
    });

    it('should return beginning of year with same offset +00:00 for gYear minInclusive', () => {
        const date = '2025+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, true);
        expect(resultingDate.value).toBe('2025-01-01T00:00:00.000+00:00');
    });

    it('should return beginning of next year with same offset +00:00 for gYear maxExclusive', () => {
        const date = '2025+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, false);
        expect(resultingDate.value).toBe('2026-01-01T00:00:00.000+00:00');
    });

    it('should return ending of year with same offset +00:00 for gYear maxInclusive', () => {
        const date = '2025+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, true);
        expect(resultingDate.value).toBe('2025-12-31T23:59:59.999+00:00');
    });

    it('should return ending of previous year with same offset +00:00 for gYear minExclusive', () => {
        const date = '2025+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, false);
        expect(resultingDate.value).toBe('2024-12-31T23:59:59.999+00:00');
    });

    it('should return beginning of year with offset -14:00 for gYear minInclusive without offset', () => {
        const date = '2025';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, true);
        expect(resultingDate.value).toBe('2025-01-01T00:00:00.000-14:00');
    });

    it('should return beginning of next year with offset +14:00 for gYear maxExclusive without offset', () => {
        const date = '2025';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, false);
        expect(resultingDate.value).toBe('2026-01-01T00:00:00.000+14:00');
    });

    it('should return ending of year with offset +14:00 for gYear maxInclusive without offset', () => {
        const date = '2025';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, true);
        expect(resultingDate.value).toBe('2025-12-31T23:59:59.999+14:00');
    });

    it('should return ending of previous year with offset -14:00 for gYear minExclusive without offset', () => {
        const date = '2025';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, false);
        expect(resultingDate.value).toBe('2024-12-31T23:59:59.999-14:00');
    });

    it('should return beginning of year with same offset -03:00 for gYear minInclusive', () => {
        const date = '2025-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, true);
        expect(resultingDate.value).toBe('2025-01-01T00:00:00.000-03:00');
    });

    it('should return beginning of next year with same offset -03:00 for gYear maxExclusive', () => {
        const date = '2025-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, false);
        expect(resultingDate.value).toBe('2026-01-01T00:00:00.000-03:00');
    });

    it('should return ending of year with same offset -03:00 for gYear maxInclusive', () => {
        const date = '2025-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), false, true);
        expect(resultingDate.value).toBe('2025-12-31T23:59:59.999-03:00');
    });

    it('should return ending of previous year with same offset -03:00 for gYear minExclusive', () => {
        const date = '2025-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYear')), true, false);
        expect(resultingDate.value).toBe('2024-12-31T23:59:59.999-03:00');
    });

    it('should return beginning of month with same offset Z for gYearMonth minInclusive', () => {
        const date = '2025-04Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000+00:00');
    });

    it('should return beginning of next month with same offset Z for gYearMonth maxExclusive', () => {
        const date = '2025-04Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, false);
        expect(resultingDate.value).toBe('2025-05-01T00:00:00.000+00:00');
    });

    it('should return ending of month with same offset Z for gYearMonth maxInclusive', () => {
        const date = '2025-04Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, true);
        expect(resultingDate.value).toBe('2025-04-30T23:59:59.999+00:00');
    });

    it('should return ending of previous month with same offset Z for gYearMonth minExclusive', () => {
        const date = '2025-04Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999+00:00');
    });

    it('should return beginning of month with same offset +00:00 for gYearMonth minInclusive', () => {
        const date = '2025-04+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000+00:00');
    });

    it('should return beginning of next month with same offset +00:00 for gYearMonth maxExclusive', () => {
        const date = '2025-04+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, false);
        expect(resultingDate.value).toBe('2025-05-01T00:00:00.000+00:00');
    });

    it('should return ending of month with same offset +00:00 for gYearMonth maxInclusive', () => {
        const date = '2025-04+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, true);
        expect(resultingDate.value).toBe('2025-04-30T23:59:59.999+00:00');
    });

    it('should return ending of previous month with same offset +00:00 for gYearMonth minExclusive', () => {
        const date = '2025-04+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999+00:00');
    });

    it('should return beginning of month with offset -14:00 for gYearMonth minInclusive without offset', () => {
        const date = '2025-04';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000-14:00');
    });

    it('should return beginning of next month with offset +14:00 for gYearMonth maxExclusive without offset', () => {
        const date = '2025-04';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, false);
        expect(resultingDate.value).toBe('2025-05-01T00:00:00.000+14:00');
    });

    it('should return ending of month with offset +14:00 for gYearMonth maxInclusive without offset', () => {
        const date = '2025-04';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, true);
        expect(resultingDate.value).toBe('2025-04-30T23:59:59.999+14:00');
    });

    it('should return ending of previous month with offset -14:00 for gYearMonth minExclusive without offset', () => {
        const date = '2025-04';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999-14:00');
    });

    it('should return beginning of month with same offset -03:00 for gYearMonth minInclusive', () => {
        const date = '2025-04-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000-03:00');
    });

    it('should return beginning of next month with same offset -03:00 for gYearMonth maxExclusive', () => {
        const date = '2025-04-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, false);
        expect(resultingDate.value).toBe('2025-05-01T00:00:00.000-03:00');
    });

    it('should return ending of month with same offset -03:00 for gYearMonth maxInclusive', () => {
        const date = '2025-04-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), false, true);
        expect(resultingDate.value).toBe('2025-04-30T23:59:59.999-03:00');
    });

    it('should return ending of previous month with same offset -03:00 for gYearMonth minExclusive', () => {
        const date = '2025-04-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('gYearMonth')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999-03:00');
    });

    it('should return beginning of day with same offset Z for date minInclusive', () => {
        const date = '2025-04-01Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000+00:00');
    });

    it('should return beginning of next day with same offset Z for date maxExclusive', () => {
        const date = '2025-04-01Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, false);
        expect(resultingDate.value).toBe('2025-04-02T00:00:00.000+00:00');
    });

    it('should return ending of day with same offset Z for date maxInclusive', () => {
        const date = '2025-04-01Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T23:59:59.999+00:00');
    });

    it('should return ending of previous day with same offset Z for date minExclusive', () => {
        const date = '2025-04-01Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999+00:00');
    });

    it('should return beginning of day with same offset +00:00 for date minInclusive', () => {
        const date = '2025-04-01+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000+00:00');
    });

    it('should return beginning of next day with same offset +00:00 for date maxExclusive', () => {
        const date = '2025-04-01+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, false);
        expect(resultingDate.value).toBe('2025-04-02T00:00:00.000+00:00');
    });

    it('should return ending of day with same offset +00:00 for date maxInclusive', () => {
        const date = '2025-04-01+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T23:59:59.999+00:00');
    });

    it('should return ending of previous day with same offset +00:00 for date minExclusive', () => {
        const date = '2025-04-01+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999+00:00');
    });

    it('should return beginning of day with offset -14:00 for date minInclusive without offset', () => {
        const date = '2025-04-01';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000-14:00');
    });

    it('should return beginning of next day with offset +14:00 for date maxExclusive without offset', () => {
        const date = '2025-04-01';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, false);
        expect(resultingDate.value).toBe('2025-04-02T00:00:00.000+14:00');
    });

    it('should return ending of day with offset +14:00 for date maxInclusive without offset', () => {
        const date = '2025-04-01';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T23:59:59.999+14:00');
    });

    it('should return ending of previous day with offset -14:00 for date minExclusive without offset', () => {
        const date = '2025-04-01';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999-14:00');
    });

    it('should return beginning of day with same offset -03:00 for date minInclusive', () => {
        const date = '2025-04-01-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T00:00:00.000-03:00');
    });

    it('should return beginning of next day with same offset -03:00 for date maxExclusive', () => {
        const date = '2025-04-01-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, false);
        expect(resultingDate.value).toBe('2025-04-02T00:00:00.000-03:00');
    });

    it('should return ending of day with same offset -03:00 for date maxInclusive', () => {
        const date = '2025-04-01-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T23:59:59.999-03:00');
    });

    it('should return ending of previous day with same offset -03:00 for date minExclusive', () => {
        const date = '2025-04-01-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('date')), true, false);
        expect(resultingDate.value).toBe('2025-03-31T23:59:59.999-03:00');
    });

    it('should return beginning of millisecond with same offset Z for dateTime minInclusive', () => {
        const date = '2025-04-01T10:00:00Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000+00:00');
    });

    it('should return beginning of next millisecond with same offset Z for dateTime maxExclusive', () => {
        const date = '2025-04-01T10:00:00Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, false);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.001+00:00');
    });

    it('should return ending of millisecond with same offset Z for dateTime maxInclusive', () => {
        const date = '2025-04-01T10:00:00Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000+00:00');
    });

    it('should return ending of previous millisecond with same offset Z for dateTime minExclusive', () => {
        const date = '2025-04-01T10:00:00Z';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, false);
        expect(resultingDate.value).toBe('2025-04-01T09:59:59.999+00:00');
    });

    it('should return beginning of millisecond with same offset +00:00 for dateTime minInclusive', () => {
        const date = '2025-04-01T10:00:00+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000+00:00');
    });

    it('should return beginning of next millisecond with same offset +00:00 for dateTime maxExclusive', () => {
        const date = '2025-04-01T10:00:00+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, false);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.001+00:00');
    });

    it('should return ending of millisecond with same offset +00:00 for dateTime maxInclusive', () => {
        const date = '2025-04-01T10:00:00+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000+00:00');
    });

    it('should return ending of previous millisecond with same offset +00:00 for dateTime minExclusive', () => {
        const date = '2025-04-01T10:00:00+00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, false);
        expect(resultingDate.value).toBe('2025-04-01T09:59:59.999+00:00');
    });

    it('should return beginning of millisecond with offset -14:00 for dateTime minInclusive without offset', () => {
        const date = '2025-04-01T10:00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000-14:00');
    });

    it('should return beginning of next millisecond with offset +14:00 for dateTime maxExclusive without offset', () => {
        const date = '2025-04-01T10:00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, false);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.001+14:00');
    });

    it('should return ending of millisecond with offset +14:00 for dateTime maxInclusive without offset', () => {
        const date = '2025-04-01T10:00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000+14:00');
    });

    it('should return ending of previous millisecond with offset -14:00 for dateTime minExclusive without offset', () => {
        const date = '2025-04-01T10:00:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, false);
        expect(resultingDate.value).toBe('2025-04-01T09:59:59.999-14:00');
    });

    it('should return beginning of millisecond with same offset -03:00 for dateTime minInclusive', () => {
        const date = '2025-04-01T10:00:00-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000-03:00');
    });

    it('should return beginning of next millisecond with same offset -03:00 for dateTime maxExclusive', () => {
        const date = '2025-04-01T10:00:00-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, false);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.001-03:00');
    });

    it('should return ending of millisecond with same offset -03:00 for dateTime maxInclusive', () => {
        const date = '2025-04-01T10:00:00-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), false, true);
        expect(resultingDate.value).toBe('2025-04-01T10:00:00.000-03:00');
    });

    it('should return ending of previous millisecond with same offset -03:00 for dateTime minExclusive', () => {
        const date = '2025-04-01T10:00:00-03:00';
        const resultingDate = periodToDateTime(DF.literal(date, XSD_T('dateTime')), true, false);
        expect(resultingDate.value).toBe('2025-04-01T09:59:59.999-03:00');
    });
});
