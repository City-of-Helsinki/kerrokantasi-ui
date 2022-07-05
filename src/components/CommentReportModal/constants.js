export const FILE_FORMATS = {
  EXCEL: {
    id: 'excel',
    name: 'Excel',
    contentyType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    downloadEndpoint: '/report',
    fileExtension: 'xlsx',
  },
  POWERPOINT: {
    id: 'powerpoint',
    name: 'PowerPoint',
    contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    downloadEndpoint: '/report_pptx',
    fileExtension: 'pptx',
  }
};

export default {FILE_FORMATS};
