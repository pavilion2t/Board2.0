const setDelay = (delay = 0) => (...args) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(...args), delay);
});

/**
 * Get all data from API, even it has paginagion
 *
 * @param {function} apiCall The function to call API
 * @param {number}   [delay] Each API call delay time
 * @return {PaginateMeta}
 *
 * type PaginateData = any;
 * interface PaginateMeta {
 *   totalPages: number;
 *   data: PaginateData[];
 * }
 * type apiCall = (page: number) => Promise<PaginateMeta>
 */
export const drainAllPages = (apiCall, delay) => {
  return apiCall(1).then(res => {
    const { totalPages = 1 } = res;
    let promise = Promise.resolve(res);
    for (let i = 2; i <= totalPages; i++){
      promise = ((j) => promise.then(setDelay(delay)).then(meta => {
        return apiCall(j)
          .then(r => {
            const data = meta.data.concat(r.data);
            const count = data.length;
            return { ...r, data, count };
          });
      }))(i);
    }
    return promise;
  });
};
