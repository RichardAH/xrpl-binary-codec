import { BytesList } from '../serdes/binary-serializer'
import { BinaryParser } from '../serdes/binary-parser'
import * as bigInt from 'big-integer'
import { Buffer } from 'buffer/'

type JSON = string | number | boolean | null | undefined | JSON[] | JsonObject

type JsonObject = { [key: string]: JSON }

/**
 * The base class for all binary-codec types
 */
class SerializedType {
  protected readonly bytes: Buffer = Buffer.alloc(0)

  constructor(bytes: Buffer) {
    this.bytes = bytes ?? Buffer.alloc(0)
  }

  static fromParser(parser: BinaryParser, hint?: number): SerializedType {
    throw new Error('fromParser not implemented')
    return this.fromParser(parser, hint)
  }

  static from(
    value: SerializedType | JSON | bigInt.BigInteger,
  ): SerializedType {
    throw new Error('from not implemented')
    return this.from(value)
  }

  /**
   * Write the bytes representation of a SerializedType to a BytesList
   *
   * @param list The BytesList to write SerializedType bytes to
   */
  toBytesSink(list: BytesList): void {
    list.put(this.bytes)
  }

  /**
   * Get the hex representation of a SerializedType's bytes
   *
   * @returns hex String of this.bytes
   */
  toHex(): string {
    return this.toBytes().toString('hex').toUpperCase()
  }

  /**
   * Get the bytes representation of a SerializedType
   *
   * @returns A buffer of the bytes
   */
  toBytes(): Buffer {
    if (this.bytes) {
      return this.bytes
    }
    const bytes = new BytesList()
    this.toBytesSink(bytes)
    return bytes.toBytes()
  }

  /**
   * Return the JSON representation of a SerializedType
   *
   * @returns any type, if not overloaded returns hexString representation of bytes
   */
  toJSON(): JSON {
    return this.toHex()
  }

  /**
   * @returns hexString representation of this.bytes
   */
  toString(): string {
    return this.toHex()
  }
}

/**
 * Base class for SerializedTypes that are comparable
 */
class Comparable extends SerializedType {
  lt(other: Comparable): boolean {
    return this.compareTo(other) < 0
  }

  eq(other: Comparable): boolean {
    return this.compareTo(other) === 0
  }

  gt(other: Comparable): boolean {
    return this.compareTo(other) > 0
  }

  gte(other: Comparable): boolean {
    return this.compareTo(other) > -1
  }

  lte(other: Comparable): boolean {
    return this.compareTo(other) < 1
  }

  /**
   * Overload this method to define how two Comparable SerializedTypes are compared
   *
   * @param other The comparable object to compare this to
   * @returns A number denoting the relationship of this and other
   */
  compareTo(other: Comparable): number {
    throw new Error(`cannot compare ${this.toString()} and ${other.toString()}`)
  }
}

export { SerializedType, Comparable, JSON, JsonObject }
