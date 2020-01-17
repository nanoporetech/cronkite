import * as CronkDataStream from '../../interfaces';

const normaliseBarcode = (barcode: string): string => {
  return barcode
    .toLowerCase()
    .replace('bc', 'bc')
    .replace('na', 'no barcode');
};

export const transformAndEmitQCData = (node: HTMLElement): CronkDataStream.IDatastreamResponseHandler => async (
  { type, data, version, key },
  { channels, dispatch, filters },
) => {
  let flattenedData = data.map((datum: CronkDataStream.IMetadataObj) => {
    return Object.assign(
      datum,
      ...datum.key.map((datumKey: string, i: number) => {
        const mapKey = key[i];
        return {
          [mapKey]: mapKey === 'barcode' ? normaliseBarcode(datumKey) : datumKey,
        };
      }),
    );
  });

  if (filters.length) {
    flattenedData = flattenedData.filter((datum: CronkDataStream.IMetadataObj) =>
      filters.map(filter => filter(datum)).every(i => i),
    );
  }

  let barcodes = flattenedData.reduce(
    (groupedBarcodes: CronkDataStream.IMetadataObj, datum: CronkDataStream.IMetadataObj) => {
      const { barcode } = datum;
      return {
        ...groupedBarcodes,
        [barcode]: groupedBarcodes[barcode] ? [...groupedBarcodes[barcode], datum] : [datum],
      };
    },
    {},
  );

  dispatch(`${channels}:${type}:${version}`, node, {
    data: flattenedData,
  });

  dispatch(`${channels}:${type}:${version}:barcodes`, node, {
    barcodeIds: Object.keys(barcodes),
    barcodes: Object.entries(barcodes).map(([label, payload]) => ({
      label,
      payload,
    })),
  });

  flattenedData = null;
  barcodes = null;
};

export const transformAndEmitSimpleAlignerData = (
  node: HTMLElement,
): CronkDataStream.IDatastreamResponseHandler => async (
  { type, data, version, key },
  { channels, dispatch, filters },
) => {
  let flattenedData = data.map((datum: CronkDataStream.IMetadataObj) => {
    return Object.assign(datum, ...datum.key.map((datumKey: string, i: number) => ({ [key[i]]: datumKey })));
  });

  if (filters.length) {
    flattenedData = flattenedData.filter((datum: CronkDataStream.IMetadataObj) =>
      filters.map(filter => filter(datum)).every(i => i),
    );
  }

  let barcodes = flattenedData.reduce(
    (groupedBarcodes: CronkDataStream.IMetadataObj, datum: CronkDataStream.IMetadataObj) => {
      const { barcode } = datum;
      return {
        ...groupedBarcodes,
        [barcode]: groupedBarcodes[barcode] ? [...groupedBarcodes[barcode], datum] : [datum],
      };
    },
    {},
  );

  dispatch(`${channels}:${type}:${version}`, node, {
    data: flattenedData,
  });

  dispatch(`${channels}:${type}:${version}:barcodes`, node, {
    barcodeIds: Object.keys(barcodes),
    barcodes: Object.entries(barcodes).map(([label, payload]) => ({
      label,
      payload,
    })),
  });

  flattenedData = null;
  barcodes = null;
};

export const transformFlatten = (node: HTMLElement): CronkDataStream.IDatastreamResponseHandler => async (
  { type, data, version, key },
  { channels, dispatch, filters },
) => {
  let flattenedData = data.map((datum: CronkDataStream.IMetadataObj) => {
    return Object.assign(datum, ...datum.key.map((datumKey: string, i: number) => ({ [key[i]]: datumKey })));
  });

  if (filters.length) {
    flattenedData = flattenedData.filter((datum: CronkDataStream.IMetadataObj) =>
      filters.map(filter => filter(datum)).every(i => i),
    );
  }

  dispatch(`${channels}:${type}:${version}`, node, {
    data: flattenedData,
  });

  flattenedData = null;
};

export default {
  default: {
    transformFlatten,
  },
  status: {},
  telemetry: {
    transformAndEmitQCData,
    transformAndEmitSimpleAlignerData,
  },
};
