import { QueryEngine } from '@comunica/query-sparql';
import type { Term } from '@rdfjs/types';
import { DataFactory } from 'rdf-data-factory';
import { DateTime, type DateTimeUnit } from 'luxon';

const engine = new QueryEngine();
const DF = new DataFactory();

self.onmessage = async (event) => {
    const { sources, query } = event.data;
    await runQuery(sources, query);
};

async function runQuery(sources: string, query: string) {
    const bindingsStream = await engine.queryBindings(query, {
        sources: [sources],
        lenient: true,
        extensionFunctions: {
            async 'https://w3id.org/time-fn#bindDefaultTimezone'(args: Term[]) {
                if (args.length !== 2) {
                    throw new Error('Invalid number of arguments for https://w3id.org/time-fn#bindDefaultTimezone');
                }
                return bindDefaultTimezone(args[0], args[1]);
            },
            async 'https://w3id.org/time-fn#periodMinInclusive'(args: Term[]) {
                if (args.length !== 1) {
                    throw new Error('Invalid number of arguments for https://w3id.org/time-fn#periodMinInclusive');
                }
                return periodToDateTime(args[0], true, true);
            },
            async 'https://w3id.org/time-fn#periodMinExclusive'(args: Term[]) {
                if (args.length !== 1) {
                    throw new Error('Invalid number of arguments for https://w3id.org/time-fn#periodMinExclusive');
                }
                return periodToDateTime(args[0], true, false);
            },
            async 'https://w3id.org/time-fn#periodMaxInclusive'(args: Term[]) {
                if (args.length !== 1) {
                    throw new Error('Invalid number of arguments for https://w3id.org/time-fn#periodMaxInclusive');
                }
                return periodToDateTime(args[0], false, true);
            },
            async 'https://w3id.org/time-fn#periodMaxExclusive'(args: Term[]) {
                if (args.length !== 1) {
                    throw new Error('Invalid number of arguments for https://w3id.org/time-fn#periodMaxExclusive');
                }
                return periodToDateTime(args[0], false, false);
            },
        },
    });

    bindingsStream.on('data', (binding) => {
        postMessage(binding.toString());
    });
    bindingsStream.on('end', () => {
        console.log('done in worker');
        postMessage('done');
    });
}

const XSD_TYPE_TO_FORMAT: Record<string, string> = {
    'http://www.w3.org/2001/XMLSchema#dateTime': 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZZ',
    'http://www.w3.org/2001/XMLSchema#date': 'yyyy-MM-ddZZ',
    'http://www.w3.org/2001/XMLSchema#gYearMonth': 'yyyy-MMZZ',
    'http://www.w3.org/2001/XMLSchema#gYear': 'yyyyZZ',
}

export function bindDefaultTimezone(dateTimeTerm: Term, timezone: Term) {
    // DateTime needs to be a Literal and a (partial) dateTime.
    if (
        dateTimeTerm.termType !== 'Literal' ||
        (dateTimeTerm.datatype.value !== 'http://www.w3.org/2001/XMLSchema#dateTime' &&
            dateTimeTerm.datatype.value !== 'http://www.w3.org/2001/XMLSchema#date' &&
            dateTimeTerm.datatype.value !== 'http://www.w3.org/2001/XMLSchema#gYearMonth' &&
            dateTimeTerm.datatype.value !== 'http://www.w3.org/2001/XMLSchema#gYear')
    ) {
        console.error(`Invalid dateTime Term: ${dateTimeTerm.value}`);
        return dateTimeTerm;
    }

    // Timezone needs to be a Literal and a timezone.
    if (!(timezone.termType === 'Literal' && timezone.datatype.value === 'http://www.w3.org/2001/XMLSchema#string')) {
        console.error(`Invalid timezone Term: ${timezone.value}`);
        return dateTimeTerm;
    }

    // Try to parse the input date while preserving zone info
    let parsedDate = DateTime.fromISO(dateTimeTerm.value, { setZone: true });

    // If the date is invalid, return it as-is
    if (!parsedDate.isValid) {
        return dateTimeTerm;
    }

    // If the date string includes a timezone (e.g., "Z", "+02:00"), return as-is
    if (/(Z|[+-]\d{2}:\d{2})$/.test(dateTimeTerm.value)) {
        return dateTimeTerm;
    }

    // Otherwise, assign the default timezone
    parsedDate = DateTime.fromISO(dateTimeTerm.value, { zone: timezone.value });

    if (!parsedDate.isValid) {
        console.error(`Invalid timezone: ${timezone.value}`);
        return dateTimeTerm;
    }

    return DF.literal(parsedDate.toFormat(XSD_TYPE_TO_FORMAT[dateTimeTerm.datatype.value]), dateTimeTerm.datatype);
}

export function XSD_T(property: string) {
    return DF.namedNode(XSD(property));
}

export function XSD(property: string) {
    return `http://www.w3.org/2001/XMLSchema#${property}`;
}

export function periodToDateTime(term: Term, min: boolean, inclusive: boolean) {
    if (term.termType !== 'Literal') {
        console.error(`Invalid term: ${term.value}. Must be Literal.`);
        return term;
    }

    let value;
    let offset;
    let unit: DateTimeUnit;
    let duration;
    if (term.datatype.value === XSD('gYear')) {
        // Regex from https://www.w3.org/TR/xmlschema11-2/#gYear
        const match = term.value.match(
            /^(-?([1-9][0-9]{3,}|0[0-9]{3}))(Z|([+\-])((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/,
        );
        if (!match) {
            console.error(`Invalid xsd:gYear: ${term.value}`);
            return term;
        }
        value = match[1];
        offset = match[3];
        unit = 'year';
        duration = { year: 1 };
    } else if (term.datatype.value === XSD('gYearMonth')) {
        // Regex from https://www.w3.org/TR/xmlschema11-2/#gYearMonth
        const match = term.value.match(
            /^(-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2]))(Z|([+\-])((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/,
        );
        if (!match) {
            console.error(`Invalid xsd:gYearMonth: ${term.value}`);
            return term;
        }
        value = match[1];
        offset = match[4];
        unit = 'month';
        duration = { month: 1 };
    } else if (term.datatype.value === XSD('date')) {
        // Regex from https://www.w3.org/TR/xmlschema11-2/#date
        const match = term.value.match(
            /^(-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))(Z|([+\-])((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/,
        );
        if (!match) {
            console.error(`Invalid xsd:date: ${term.value}`);
            return term;
        }
        value = match[1];
        offset = match[5];
        unit = 'day';
        duration = { day: 1 };
    } else if (term.datatype.value === XSD('dateTime')) {
        // Regex from https://www.w3.org/TR/xmlschema11-2/#dateTime
        const match = term.value.match(
            /^(-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?)))(Z|([+\-])((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/,
        );
        if (!match) {
            console.error(`Invalid xsd:dateTime: ${term.value}`);
            return term;
        }
        value = match[1];
        offset = match[10];
        unit = 'millisecond';
        duration = { millisecond: 1 };
    } else {
        return term;
    }
    offset ||= min ? '+14:00' : '-14:00';
    if (offset === 'Z') {
        offset = '+00:00';
    }

    let dateTime;
    if (min) {
        dateTime = inclusive
            ? DateTime.fromISO(value, { zone: offset }).startOf(unit).setZone(offset).toISO()
            : DateTime.fromISO(value, { zone: offset }).minus(duration).endOf(unit).setZone(offset).toISO();
    } else {
        dateTime = inclusive
            ? DateTime.fromISO(value, { zone: offset }).endOf(unit).setZone(offset).toISO()
            : DateTime.fromISO(value, { zone: offset }).plus(duration).startOf(unit).setZone(offset).toISO();
    }

    if (!dateTime) {
        console.error(`Invalid value for dateTime: ${term.value}`);
        return term;
    }
    return DF.literal(dateTime, XSD_T('dateTime'));
}
