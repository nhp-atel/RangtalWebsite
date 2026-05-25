// Server-side source of truth for batches and prices.
// The client cannot be trusted to send the amount.
export const BATCHES = {
  july: { id: 'july', name: 'July Batch', price: 60 },
  august: { id: 'august', name: 'August Batch', price: 60 },
}

export const isValidBatch = (id) =>
  typeof id === 'string' && Object.prototype.hasOwnProperty.call(BATCHES, id)
