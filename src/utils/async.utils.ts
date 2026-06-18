// Проверяет thenable ли значение, делая вывод, что это Promise
export function isPromise(value: unknown): value is Promise<unknown> {
  return Boolean(value && typeof value === 'object' && 'then' in value && typeof value.then === 'function');
}
