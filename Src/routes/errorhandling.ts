type AsyncFunction = (...args: any[]) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) =>
  function asyncHandlerWrap(...args: any[]) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };