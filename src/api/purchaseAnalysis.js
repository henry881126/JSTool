import request from '@/utils/axios'

let purchasePrice = '/api/distribution-service/v2/PurchasePriceController'
let base = '/api/distribution-service/v2/baseController'

export default {
  getPurchaseGraphData: (params) =>
    request.post(`${purchasePrice}/getPurchaseGraphData`, params),
  endType: (params) =>
    request.get(`${base}/endType`, {
      params,
    }),
  getPurchaseTableData: (params) =>
    request.post(`${purchasePrice}/getPurchaseTableData`, params),
  exportTableData: (params) => request.post(`${purchasePrice}/export`, params),
}
