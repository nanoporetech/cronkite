import * as EpiReportDataStream from '../../interfaces';

const normaliseBarcode = (barcode: string): string => {
  return barcode
    .toLowerCase()
    .replace('bc', 'bc')
    .replace('na', 'no barcode');
};

export const transformAndEmitQCData = (node: HTMLElement): EpiReportDataStream.IDatastreamResponseHandler => async (
  { type, data, version, key },
  { channel, dispatch, filters },
) => {
  let flattenedData = data.map((datum: EpiReportDataStream.IMetadataObj) => {
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
    flattenedData = flattenedData.filter((datum: EpiReportDataStream.IMetadataObj) =>
      filters.map(filter => filter(datum)).every(i => i),
    );
  }

  let barcodes = flattenedData.reduce(
    (groupedBarcodes: EpiReportDataStream.IMetadataObj, datum: EpiReportDataStream.IMetadataObj) => {
      const { barcode } = datum;
      return {
        ...groupedBarcodes,
        [barcode]: groupedBarcodes[barcode] ? [...groupedBarcodes[barcode], datum] : [datum],
      };
    },
    {},
  );

  dispatch(`${channel}:${type}:${version}`, node, {
    data: flattenedData,
  });

  dispatch(`${channel}:${type}:${version}:barcodes`, node, {
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
): EpiReportDataStream.IDatastreamResponseHandler => async (
  { type, data, version, key },
  { channel, dispatch, filters },
  ) => {
    let flattenedData = data.map((datum: EpiReportDataStream.IMetadataObj) => {
      return Object.assign(datum, ...datum.key.map((datumKey: string, i: number) => ({ [key[i]]: datumKey })));
    });

    if (filters.length) {
      flattenedData = flattenedData.filter((datum: EpiReportDataStream.IMetadataObj) =>
        filters.map(filter => filter(datum)).every(i => i),
      );
    }

    let barcodes = flattenedData.reduce(
      (groupedBarcodes: EpiReportDataStream.IMetadataObj, datum: EpiReportDataStream.IMetadataObj) => {
        const { barcode } = datum;
        return {
          ...groupedBarcodes,
          [barcode]: groupedBarcodes[barcode] ? [...groupedBarcodes[barcode], datum] : [datum],
        };
      },
      {},
    );

    dispatch(`${channel}:${type}:${version}`, node, {
      data: flattenedData,
    });

    dispatch(`${channel}:${type}:${version}:barcodes`, node, {
      barcodeIds: Object.keys(barcodes),
      barcodes: Object.entries(barcodes).map(([label, payload]) => ({
        label,
        payload,
      })),
    });

    flattenedData = null;
    barcodes = null;
  };

export const transformFlatten = (node: HTMLElement): EpiReportDataStream.IDatastreamResponseHandler => async (
  { type, data, version, key },
  { channel, dispatch, filters },
) => {
  let flattenedData = data.map((datum: EpiReportDataStream.IMetadataObj) => {
    return Object.assign(datum, ...datum.key.map((datumKey: string, i: number) => ({ [key[i]]: datumKey })));
  });

  if (filters.length) {
    flattenedData = flattenedData.filter((datum: EpiReportDataStream.IMetadataObj) =>
      filters.map(filter => filter(datum)).every(i => i),
    );
  }

  dispatch(`${channel}:${type}:${version}`, node, {
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
