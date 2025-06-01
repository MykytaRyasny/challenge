import { Logger } from 'winston'

/**
 * Method decorator to log execution time using winston logger.
 * Usage: @LogExecutionTime() on any async method.
 */
export function LogExecutionTime<T = unknown>(): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<T>
    descriptor.value = async function (this: { logger: Logger }, ...args: unknown[]): Promise<T> {
      const logger: Logger = this.logger
      const method = propertyKey.toString()
      const start = Date.now()
      logger.info(`[${method}] started`)
      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - start
        logger.info(`[${method}] finished in ${duration}ms`)
        return result as T
      } catch (err) {
        const duration = Date.now() - start
        logger.error(`[${method}] failed after ${duration}ms: ${err}`)
        throw err
      }
    }
    return descriptor
  }
}
