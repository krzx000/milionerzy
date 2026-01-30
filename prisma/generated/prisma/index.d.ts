
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>
/**
 * Model GameSession
 * 
 */
export type GameSession = $Result.DefaultSelection<Prisma.$GameSessionPayload>
/**
 * Model GameSessionQuestion
 * 
 */
export type GameSessionQuestion = $Result.DefaultSelection<Prisma.$GameSessionQuestionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Questions
 * const questions = await prisma.question.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Questions
   * const questions = await prisma.question.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameSession`: Exposes CRUD operations for the **GameSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameSessions
    * const gameSessions = await prisma.gameSession.findMany()
    * ```
    */
  get gameSession(): Prisma.GameSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameSessionQuestion`: Exposes CRUD operations for the **GameSessionQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameSessionQuestions
    * const gameSessionQuestions = await prisma.gameSessionQuestion.findMany()
    * ```
    */
  get gameSessionQuestion(): Prisma.GameSessionQuestionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Question: 'Question',
    GameSession: 'GameSession',
    GameSessionQuestion: 'GameSessionQuestion'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "question" | "gameSession" | "gameSessionQuestion"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Question: {
        payload: Prisma.$QuestionPayload<ExtArgs>
        fields: Prisma.QuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findFirst: {
            args: Prisma.QuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findMany: {
            args: Prisma.QuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          create: {
            args: Prisma.QuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          createMany: {
            args: Prisma.QuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          delete: {
            args: Prisma.QuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          update: {
            args: Prisma.QuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          aggregate: {
            args: Prisma.QuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion>
          }
          groupBy: {
            args: Prisma.QuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionCountAggregateOutputType> | number
          }
        }
      }
      GameSession: {
        payload: Prisma.$GameSessionPayload<ExtArgs>
        fields: Prisma.GameSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findFirst: {
            args: Prisma.GameSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findMany: {
            args: Prisma.GameSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          create: {
            args: Prisma.GameSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          createMany: {
            args: Prisma.GameSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          delete: {
            args: Prisma.GameSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          update: {
            args: Prisma.GameSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          deleteMany: {
            args: Prisma.GameSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          upsert: {
            args: Prisma.GameSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          aggregate: {
            args: Prisma.GameSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameSession>
          }
          groupBy: {
            args: Prisma.GameSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameSessionCountArgs<ExtArgs>
            result: $Utils.Optional<GameSessionCountAggregateOutputType> | number
          }
        }
      }
      GameSessionQuestion: {
        payload: Prisma.$GameSessionQuestionPayload<ExtArgs>
        fields: Prisma.GameSessionQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameSessionQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameSessionQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>
          }
          findFirst: {
            args: Prisma.GameSessionQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameSessionQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>
          }
          findMany: {
            args: Prisma.GameSessionQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>[]
          }
          create: {
            args: Prisma.GameSessionQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>
          }
          createMany: {
            args: Prisma.GameSessionQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameSessionQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>[]
          }
          delete: {
            args: Prisma.GameSessionQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>
          }
          update: {
            args: Prisma.GameSessionQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>
          }
          deleteMany: {
            args: Prisma.GameSessionQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameSessionQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameSessionQuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>[]
          }
          upsert: {
            args: Prisma.GameSessionQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionQuestionPayload>
          }
          aggregate: {
            args: Prisma.GameSessionQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameSessionQuestion>
          }
          groupBy: {
            args: Prisma.GameSessionQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameSessionQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameSessionQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<GameSessionQuestionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    question?: QuestionOmit
    gameSession?: GameSessionOmit
    gameSessionQuestion?: GameSessionQuestionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type QuestionCountOutputType
   */

  export type QuestionCountOutputType = {
    gameSessionQuestions: number
  }

  export type QuestionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSessionQuestions?: boolean | QuestionCountOutputTypeCountGameSessionQuestionsArgs
  }

  // Custom InputTypes
  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionCountOutputType
     */
    select?: QuestionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeCountGameSessionQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionQuestionWhereInput
  }


  /**
   * Count Type GameSessionCountOutputType
   */

  export type GameSessionCountOutputType = {
    questions: number
  }

  export type GameSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | GameSessionCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * GameSessionCountOutputType without action
   */
  export type GameSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionCountOutputType
     */
    select?: GameSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameSessionCountOutputType without action
   */
  export type GameSessionCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionQuestionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Question
   */

  export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  export type QuestionMinAggregateOutputType = {
    id: string | null
    content: string | null
    answerA: string | null
    answerB: string | null
    answerC: string | null
    answerD: string | null
    correctAnswer: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionMaxAggregateOutputType = {
    id: string | null
    content: string | null
    answerA: string | null
    answerB: string | null
    answerC: string | null
    answerD: string | null
    correctAnswer: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionCountAggregateOutputType = {
    id: number
    content: number
    answerA: number
    answerB: number
    answerC: number
    answerD: number
    correctAnswer: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuestionMinAggregateInputType = {
    id?: true
    content?: true
    answerA?: true
    answerB?: true
    answerC?: true
    answerD?: true
    correctAnswer?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionMaxAggregateInputType = {
    id?: true
    content?: true
    answerA?: true
    answerB?: true
    answerC?: true
    answerD?: true
    correctAnswer?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionCountAggregateInputType = {
    id?: true
    content?: true
    answerA?: true
    answerB?: true
    answerC?: true
    answerD?: true
    correctAnswer?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Question to aggregate.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionMaxAggregateInputType
  }

  export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion[P]>
      : GetScalarType<T[P], AggregateQuestion[P]>
  }




  export type QuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithAggregationInput | QuestionOrderByWithAggregationInput[]
    by: QuestionScalarFieldEnum[] | QuestionScalarFieldEnum
    having?: QuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionCountAggregateInputType | true
    _min?: QuestionMinAggregateInputType
    _max?: QuestionMaxAggregateInputType
  }

  export type QuestionGroupByOutputType = {
    id: string
    content: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correctAnswer: string
    createdAt: Date
    updatedAt: Date
    _count: QuestionCountAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    answerA?: boolean
    answerB?: boolean
    answerC?: boolean
    answerD?: boolean
    correctAnswer?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gameSessionQuestions?: boolean | Question$gameSessionQuestionsArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    answerA?: boolean
    answerB?: boolean
    answerC?: boolean
    answerD?: boolean
    correctAnswer?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    answerA?: boolean
    answerB?: boolean
    answerC?: boolean
    answerD?: boolean
    correctAnswer?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
    id?: boolean
    content?: boolean
    answerA?: boolean
    answerB?: boolean
    answerC?: boolean
    answerD?: boolean
    correctAnswer?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "answerA" | "answerB" | "answerC" | "answerD" | "correctAnswer" | "createdAt" | "updatedAt", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSessionQuestions?: boolean | Question$gameSessionQuestionsArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      gameSessionQuestions: Prisma.$GameSessionQuestionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      answerA: string
      answerB: string
      answerC: string
      answerD: string
      correctAnswer: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["question"]>
    composites: {}
  }

  type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = $Result.GetResult<Prisma.$QuestionPayload, S>

  type QuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionCountAggregateInputType | true
    }

  export interface QuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Question'], meta: { name: 'Question' } }
    /**
     * Find zero or one Question that matches the filter.
     * @param {QuestionFindUniqueArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionFindUniqueArgs>(args: SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionFindUniqueOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionFindFirstArgs>(args?: SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.question.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.question.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionWithIdOnly = await prisma.question.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionFindManyArgs>(args?: SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question.
     * @param {QuestionCreateArgs} args - Arguments to create a Question.
     * @example
     * // Create one Question
     * const Question = await prisma.question.create({
     *   data: {
     *     // ... data to create a Question
     *   }
     * })
     * 
     */
    create<T extends QuestionCreateArgs>(args: SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionCreateManyArgs>(args?: SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question.
     * @param {QuestionDeleteArgs} args - Arguments to delete one Question.
     * @example
     * // Delete one Question
     * const Question = await prisma.question.delete({
     *   where: {
     *     // ... filter to delete one Question
     *   }
     * })
     * 
     */
    delete<T extends QuestionDeleteArgs>(args: SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question.
     * @param {QuestionUpdateArgs} args - Arguments to update one Question.
     * @example
     * // Update one Question
     * const question = await prisma.question.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionUpdateArgs>(args: SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.question.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionDeleteManyArgs>(args?: SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionUpdateManyArgs>(args: SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question.
     * @param {QuestionUpsertArgs} args - Arguments to update or create a Question.
     * @example
     * // Update or create a Question
     * const question = await prisma.question.upsert({
     *   create: {
     *     // ... data to create a Question
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question we want to update
     *   }
     * })
     */
    upsert<T extends QuestionUpsertArgs>(args: SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.question.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionCountArgs>(
      args?: Subset<T, QuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionAggregateArgs>(args: Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>

    /**
     * Group by Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Question model
   */
  readonly fields: QuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Question.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gameSessionQuestions<T extends Question$gameSessionQuestionsArgs<ExtArgs> = {}>(args?: Subset<T, Question$gameSessionQuestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Question model
   */
  interface QuestionFieldRefs {
    readonly id: FieldRef<"Question", 'String'>
    readonly content: FieldRef<"Question", 'String'>
    readonly answerA: FieldRef<"Question", 'String'>
    readonly answerB: FieldRef<"Question", 'String'>
    readonly answerC: FieldRef<"Question", 'String'>
    readonly answerD: FieldRef<"Question", 'String'>
    readonly correctAnswer: FieldRef<"Question", 'String'>
    readonly createdAt: FieldRef<"Question", 'DateTime'>
    readonly updatedAt: FieldRef<"Question", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Question findUnique
   */
  export type QuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findUniqueOrThrow
   */
  export type QuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findFirst
   */
  export type QuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findFirstOrThrow
   */
  export type QuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findMany
   */
  export type QuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question create
   */
  export type QuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Question.
     */
    data: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
  }

  /**
   * Question createMany
   */
  export type QuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question createManyAndReturn
   */
  export type QuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question update
   */
  export type QuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Question.
     */
    data: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
    /**
     * Choose, which Question to update.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question updateMany
   */
  export type QuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question updateManyAndReturn
   */
  export type QuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question upsert
   */
  export type QuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Question to update in case it exists.
     */
    where: QuestionWhereUniqueInput
    /**
     * In case the Question found by the `where` argument doesn't exist, create a new Question with this data.
     */
    create: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
    /**
     * In case the Question was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
  }

  /**
   * Question delete
   */
  export type QuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter which Question to delete.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question deleteMany
   */
  export type QuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Question.gameSessionQuestions
   */
  export type Question$gameSessionQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    where?: GameSessionQuestionWhereInput
    orderBy?: GameSessionQuestionOrderByWithRelationInput | GameSessionQuestionOrderByWithRelationInput[]
    cursor?: GameSessionQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameSessionQuestionScalarFieldEnum | GameSessionQuestionScalarFieldEnum[]
  }

  /**
   * Question without action
   */
  export type QuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
  }


  /**
   * Model GameSession
   */

  export type AggregateGameSession = {
    _count: GameSessionCountAggregateOutputType | null
    _avg: GameSessionAvgAggregateOutputType | null
    _sum: GameSessionSumAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  export type GameSessionAvgAggregateOutputType = {
    currentQuestionIndex: number | null
    gameTime: number | null
    totalQuestions: number | null
  }

  export type GameSessionSumAggregateOutputType = {
    currentQuestionIndex: number | null
    gameTime: number | null
    totalQuestions: number | null
  }

  export type GameSessionMinAggregateOutputType = {
    id: string | null
    status: string | null
    currentQuestionIndex: number | null
    startTime: Date | null
    endTime: Date | null
    gameTime: number | null
    usedFiftyFifty: boolean | null
    usedPhoneAFriend: boolean | null
    usedAskAudience: boolean | null
    hiddenAnswers: string | null
    audienceVoteQuestions: string | null
    totalQuestions: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GameSessionMaxAggregateOutputType = {
    id: string | null
    status: string | null
    currentQuestionIndex: number | null
    startTime: Date | null
    endTime: Date | null
    gameTime: number | null
    usedFiftyFifty: boolean | null
    usedPhoneAFriend: boolean | null
    usedAskAudience: boolean | null
    hiddenAnswers: string | null
    audienceVoteQuestions: string | null
    totalQuestions: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GameSessionCountAggregateOutputType = {
    id: number
    status: number
    currentQuestionIndex: number
    startTime: number
    endTime: number
    gameTime: number
    usedFiftyFifty: number
    usedPhoneAFriend: number
    usedAskAudience: number
    hiddenAnswers: number
    audienceVoteQuestions: number
    totalQuestions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GameSessionAvgAggregateInputType = {
    currentQuestionIndex?: true
    gameTime?: true
    totalQuestions?: true
  }

  export type GameSessionSumAggregateInputType = {
    currentQuestionIndex?: true
    gameTime?: true
    totalQuestions?: true
  }

  export type GameSessionMinAggregateInputType = {
    id?: true
    status?: true
    currentQuestionIndex?: true
    startTime?: true
    endTime?: true
    gameTime?: true
    usedFiftyFifty?: true
    usedPhoneAFriend?: true
    usedAskAudience?: true
    hiddenAnswers?: true
    audienceVoteQuestions?: true
    totalQuestions?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GameSessionMaxAggregateInputType = {
    id?: true
    status?: true
    currentQuestionIndex?: true
    startTime?: true
    endTime?: true
    gameTime?: true
    usedFiftyFifty?: true
    usedPhoneAFriend?: true
    usedAskAudience?: true
    hiddenAnswers?: true
    audienceVoteQuestions?: true
    totalQuestions?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GameSessionCountAggregateInputType = {
    id?: true
    status?: true
    currentQuestionIndex?: true
    startTime?: true
    endTime?: true
    gameTime?: true
    usedFiftyFifty?: true
    usedPhoneAFriend?: true
    usedAskAudience?: true
    hiddenAnswers?: true
    audienceVoteQuestions?: true
    totalQuestions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GameSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSession to aggregate.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameSessions
    **/
    _count?: true | GameSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameSessionMaxAggregateInputType
  }

  export type GetGameSessionAggregateType<T extends GameSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateGameSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameSession[P]>
      : GetScalarType<T[P], AggregateGameSession[P]>
  }




  export type GameSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionWhereInput
    orderBy?: GameSessionOrderByWithAggregationInput | GameSessionOrderByWithAggregationInput[]
    by: GameSessionScalarFieldEnum[] | GameSessionScalarFieldEnum
    having?: GameSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameSessionCountAggregateInputType | true
    _avg?: GameSessionAvgAggregateInputType
    _sum?: GameSessionSumAggregateInputType
    _min?: GameSessionMinAggregateInputType
    _max?: GameSessionMaxAggregateInputType
  }

  export type GameSessionGroupByOutputType = {
    id: string
    status: string
    currentQuestionIndex: number
    startTime: Date | null
    endTime: Date | null
    gameTime: number
    usedFiftyFifty: boolean
    usedPhoneAFriend: boolean
    usedAskAudience: boolean
    hiddenAnswers: string
    audienceVoteQuestions: string
    totalQuestions: number
    createdAt: Date
    updatedAt: Date
    _count: GameSessionCountAggregateOutputType | null
    _avg: GameSessionAvgAggregateOutputType | null
    _sum: GameSessionSumAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  type GetGameSessionGroupByPayload<T extends GameSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
            : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
        }
      >
    >


  export type GameSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    currentQuestionIndex?: boolean
    startTime?: boolean
    endTime?: boolean
    gameTime?: boolean
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: boolean
    audienceVoteQuestions?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    questions?: boolean | GameSession$questionsArgs<ExtArgs>
    _count?: boolean | GameSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    currentQuestionIndex?: boolean
    startTime?: boolean
    endTime?: boolean
    gameTime?: boolean
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: boolean
    audienceVoteQuestions?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    currentQuestionIndex?: boolean
    startTime?: boolean
    endTime?: boolean
    gameTime?: boolean
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: boolean
    audienceVoteQuestions?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectScalar = {
    id?: boolean
    status?: boolean
    currentQuestionIndex?: boolean
    startTime?: boolean
    endTime?: boolean
    gameTime?: boolean
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: boolean
    audienceVoteQuestions?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GameSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "status" | "currentQuestionIndex" | "startTime" | "endTime" | "gameTime" | "usedFiftyFifty" | "usedPhoneAFriend" | "usedAskAudience" | "hiddenAnswers" | "audienceVoteQuestions" | "totalQuestions" | "createdAt" | "updatedAt", ExtArgs["result"]["gameSession"]>
  export type GameSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | GameSession$questionsArgs<ExtArgs>
    _count?: boolean | GameSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GameSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GameSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameSession"
    objects: {
      questions: Prisma.$GameSessionQuestionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: string
      currentQuestionIndex: number
      startTime: Date | null
      endTime: Date | null
      gameTime: number
      usedFiftyFifty: boolean
      usedPhoneAFriend: boolean
      usedAskAudience: boolean
      hiddenAnswers: string
      audienceVoteQuestions: string
      totalQuestions: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gameSession"]>
    composites: {}
  }

  type GameSessionGetPayload<S extends boolean | null | undefined | GameSessionDefaultArgs> = $Result.GetResult<Prisma.$GameSessionPayload, S>

  type GameSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameSessionCountAggregateInputType | true
    }

  export interface GameSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameSession'], meta: { name: 'GameSession' } }
    /**
     * Find zero or one GameSession that matches the filter.
     * @param {GameSessionFindUniqueArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameSessionFindUniqueArgs>(args: SelectSubset<T, GameSessionFindUniqueArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameSessionFindUniqueOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, GameSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameSessionFindFirstArgs>(args?: SelectSubset<T, GameSessionFindFirstArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, GameSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameSessions
     * const gameSessions = await prisma.gameSession.findMany()
     * 
     * // Get first 10 GameSessions
     * const gameSessions = await prisma.gameSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameSessionFindManyArgs>(args?: SelectSubset<T, GameSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameSession.
     * @param {GameSessionCreateArgs} args - Arguments to create a GameSession.
     * @example
     * // Create one GameSession
     * const GameSession = await prisma.gameSession.create({
     *   data: {
     *     // ... data to create a GameSession
     *   }
     * })
     * 
     */
    create<T extends GameSessionCreateArgs>(args: SelectSubset<T, GameSessionCreateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameSessions.
     * @param {GameSessionCreateManyArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameSessionCreateManyArgs>(args?: SelectSubset<T, GameSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameSessions and returns the data saved in the database.
     * @param {GameSessionCreateManyAndReturnArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameSessions and only return the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, GameSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameSession.
     * @param {GameSessionDeleteArgs} args - Arguments to delete one GameSession.
     * @example
     * // Delete one GameSession
     * const GameSession = await prisma.gameSession.delete({
     *   where: {
     *     // ... filter to delete one GameSession
     *   }
     * })
     * 
     */
    delete<T extends GameSessionDeleteArgs>(args: SelectSubset<T, GameSessionDeleteArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameSession.
     * @param {GameSessionUpdateArgs} args - Arguments to update one GameSession.
     * @example
     * // Update one GameSession
     * const gameSession = await prisma.gameSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameSessionUpdateArgs>(args: SelectSubset<T, GameSessionUpdateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameSessions.
     * @param {GameSessionDeleteManyArgs} args - Arguments to filter GameSessions to delete.
     * @example
     * // Delete a few GameSessions
     * const { count } = await prisma.gameSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameSessionDeleteManyArgs>(args?: SelectSubset<T, GameSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameSessionUpdateManyArgs>(args: SelectSubset<T, GameSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions and returns the data updated in the database.
     * @param {GameSessionUpdateManyAndReturnArgs} args - Arguments to update many GameSessions.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameSessions and only return the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, GameSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameSession.
     * @param {GameSessionUpsertArgs} args - Arguments to update or create a GameSession.
     * @example
     * // Update or create a GameSession
     * const gameSession = await prisma.gameSession.upsert({
     *   create: {
     *     // ... data to create a GameSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameSession we want to update
     *   }
     * })
     */
    upsert<T extends GameSessionUpsertArgs>(args: SelectSubset<T, GameSessionUpsertArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionCountArgs} args - Arguments to filter GameSessions to count.
     * @example
     * // Count the number of GameSessions
     * const count = await prisma.gameSession.count({
     *   where: {
     *     // ... the filter for the GameSessions we want to count
     *   }
     * })
    **/
    count<T extends GameSessionCountArgs>(
      args?: Subset<T, GameSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameSessionAggregateArgs>(args: Subset<T, GameSessionAggregateArgs>): Prisma.PrismaPromise<GetGameSessionAggregateType<T>>

    /**
     * Group by GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameSessionGroupByArgs['orderBy'] }
        : { orderBy?: GameSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameSession model
   */
  readonly fields: GameSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends GameSession$questionsArgs<ExtArgs> = {}>(args?: Subset<T, GameSession$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameSession model
   */
  interface GameSessionFieldRefs {
    readonly id: FieldRef<"GameSession", 'String'>
    readonly status: FieldRef<"GameSession", 'String'>
    readonly currentQuestionIndex: FieldRef<"GameSession", 'Int'>
    readonly startTime: FieldRef<"GameSession", 'DateTime'>
    readonly endTime: FieldRef<"GameSession", 'DateTime'>
    readonly gameTime: FieldRef<"GameSession", 'Int'>
    readonly usedFiftyFifty: FieldRef<"GameSession", 'Boolean'>
    readonly usedPhoneAFriend: FieldRef<"GameSession", 'Boolean'>
    readonly usedAskAudience: FieldRef<"GameSession", 'Boolean'>
    readonly hiddenAnswers: FieldRef<"GameSession", 'String'>
    readonly audienceVoteQuestions: FieldRef<"GameSession", 'String'>
    readonly totalQuestions: FieldRef<"GameSession", 'Int'>
    readonly createdAt: FieldRef<"GameSession", 'DateTime'>
    readonly updatedAt: FieldRef<"GameSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameSession findUnique
   */
  export type GameSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findUniqueOrThrow
   */
  export type GameSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findFirst
   */
  export type GameSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findFirstOrThrow
   */
  export type GameSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findMany
   */
  export type GameSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessions to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession create
   */
  export type GameSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a GameSession.
     */
    data: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
  }

  /**
   * GameSession createMany
   */
  export type GameSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession createManyAndReturn
   */
  export type GameSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession update
   */
  export type GameSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a GameSession.
     */
    data: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
    /**
     * Choose, which GameSession to update.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession updateMany
   */
  export type GameSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession updateManyAndReturn
   */
  export type GameSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession upsert
   */
  export type GameSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the GameSession to update in case it exists.
     */
    where: GameSessionWhereUniqueInput
    /**
     * In case the GameSession found by the `where` argument doesn't exist, create a new GameSession with this data.
     */
    create: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
    /**
     * In case the GameSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
  }

  /**
   * GameSession delete
   */
  export type GameSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter which GameSession to delete.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession deleteMany
   */
  export type GameSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSessions to delete
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to delete.
     */
    limit?: number
  }

  /**
   * GameSession.questions
   */
  export type GameSession$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    where?: GameSessionQuestionWhereInput
    orderBy?: GameSessionQuestionOrderByWithRelationInput | GameSessionQuestionOrderByWithRelationInput[]
    cursor?: GameSessionQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameSessionQuestionScalarFieldEnum | GameSessionQuestionScalarFieldEnum[]
  }

  /**
   * GameSession without action
   */
  export type GameSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
  }


  /**
   * Model GameSessionQuestion
   */

  export type AggregateGameSessionQuestion = {
    _count: GameSessionQuestionCountAggregateOutputType | null
    _avg: GameSessionQuestionAvgAggregateOutputType | null
    _sum: GameSessionQuestionSumAggregateOutputType | null
    _min: GameSessionQuestionMinAggregateOutputType | null
    _max: GameSessionQuestionMaxAggregateOutputType | null
  }

  export type GameSessionQuestionAvgAggregateOutputType = {
    order: number | null
  }

  export type GameSessionQuestionSumAggregateOutputType = {
    order: number | null
  }

  export type GameSessionQuestionMinAggregateOutputType = {
    id: string | null
    gameSessionId: string | null
    questionId: string | null
    order: number | null
  }

  export type GameSessionQuestionMaxAggregateOutputType = {
    id: string | null
    gameSessionId: string | null
    questionId: string | null
    order: number | null
  }

  export type GameSessionQuestionCountAggregateOutputType = {
    id: number
    gameSessionId: number
    questionId: number
    order: number
    _all: number
  }


  export type GameSessionQuestionAvgAggregateInputType = {
    order?: true
  }

  export type GameSessionQuestionSumAggregateInputType = {
    order?: true
  }

  export type GameSessionQuestionMinAggregateInputType = {
    id?: true
    gameSessionId?: true
    questionId?: true
    order?: true
  }

  export type GameSessionQuestionMaxAggregateInputType = {
    id?: true
    gameSessionId?: true
    questionId?: true
    order?: true
  }

  export type GameSessionQuestionCountAggregateInputType = {
    id?: true
    gameSessionId?: true
    questionId?: true
    order?: true
    _all?: true
  }

  export type GameSessionQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSessionQuestion to aggregate.
     */
    where?: GameSessionQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessionQuestions to fetch.
     */
    orderBy?: GameSessionQuestionOrderByWithRelationInput | GameSessionQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameSessionQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessionQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessionQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameSessionQuestions
    **/
    _count?: true | GameSessionQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameSessionQuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSessionQuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameSessionQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameSessionQuestionMaxAggregateInputType
  }

  export type GetGameSessionQuestionAggregateType<T extends GameSessionQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateGameSessionQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameSessionQuestion[P]>
      : GetScalarType<T[P], AggregateGameSessionQuestion[P]>
  }




  export type GameSessionQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionQuestionWhereInput
    orderBy?: GameSessionQuestionOrderByWithAggregationInput | GameSessionQuestionOrderByWithAggregationInput[]
    by: GameSessionQuestionScalarFieldEnum[] | GameSessionQuestionScalarFieldEnum
    having?: GameSessionQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameSessionQuestionCountAggregateInputType | true
    _avg?: GameSessionQuestionAvgAggregateInputType
    _sum?: GameSessionQuestionSumAggregateInputType
    _min?: GameSessionQuestionMinAggregateInputType
    _max?: GameSessionQuestionMaxAggregateInputType
  }

  export type GameSessionQuestionGroupByOutputType = {
    id: string
    gameSessionId: string
    questionId: string
    order: number
    _count: GameSessionQuestionCountAggregateOutputType | null
    _avg: GameSessionQuestionAvgAggregateOutputType | null
    _sum: GameSessionQuestionSumAggregateOutputType | null
    _min: GameSessionQuestionMinAggregateOutputType | null
    _max: GameSessionQuestionMaxAggregateOutputType | null
  }

  type GetGameSessionQuestionGroupByPayload<T extends GameSessionQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameSessionQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameSessionQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameSessionQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], GameSessionQuestionGroupByOutputType[P]>
        }
      >
    >


  export type GameSessionQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    questionId?: boolean
    order?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameSessionQuestion"]>

  export type GameSessionQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    questionId?: boolean
    order?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameSessionQuestion"]>

  export type GameSessionQuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    questionId?: boolean
    order?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameSessionQuestion"]>

  export type GameSessionQuestionSelectScalar = {
    id?: boolean
    gameSessionId?: boolean
    questionId?: boolean
    order?: boolean
  }

  export type GameSessionQuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gameSessionId" | "questionId" | "order", ExtArgs["result"]["gameSessionQuestion"]>
  export type GameSessionQuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type GameSessionQuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type GameSessionQuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }

  export type $GameSessionQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameSessionQuestion"
    objects: {
      gameSession: Prisma.$GameSessionPayload<ExtArgs>
      question: Prisma.$QuestionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gameSessionId: string
      questionId: string
      order: number
    }, ExtArgs["result"]["gameSessionQuestion"]>
    composites: {}
  }

  type GameSessionQuestionGetPayload<S extends boolean | null | undefined | GameSessionQuestionDefaultArgs> = $Result.GetResult<Prisma.$GameSessionQuestionPayload, S>

  type GameSessionQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameSessionQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameSessionQuestionCountAggregateInputType | true
    }

  export interface GameSessionQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameSessionQuestion'], meta: { name: 'GameSessionQuestion' } }
    /**
     * Find zero or one GameSessionQuestion that matches the filter.
     * @param {GameSessionQuestionFindUniqueArgs} args - Arguments to find a GameSessionQuestion
     * @example
     * // Get one GameSessionQuestion
     * const gameSessionQuestion = await prisma.gameSessionQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameSessionQuestionFindUniqueArgs>(args: SelectSubset<T, GameSessionQuestionFindUniqueArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameSessionQuestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameSessionQuestionFindUniqueOrThrowArgs} args - Arguments to find a GameSessionQuestion
     * @example
     * // Get one GameSessionQuestion
     * const gameSessionQuestion = await prisma.gameSessionQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameSessionQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, GameSessionQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSessionQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionFindFirstArgs} args - Arguments to find a GameSessionQuestion
     * @example
     * // Get one GameSessionQuestion
     * const gameSessionQuestion = await prisma.gameSessionQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameSessionQuestionFindFirstArgs>(args?: SelectSubset<T, GameSessionQuestionFindFirstArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSessionQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionFindFirstOrThrowArgs} args - Arguments to find a GameSessionQuestion
     * @example
     * // Get one GameSessionQuestion
     * const gameSessionQuestion = await prisma.gameSessionQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameSessionQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, GameSessionQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameSessionQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameSessionQuestions
     * const gameSessionQuestions = await prisma.gameSessionQuestion.findMany()
     * 
     * // Get first 10 GameSessionQuestions
     * const gameSessionQuestions = await prisma.gameSessionQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameSessionQuestionWithIdOnly = await prisma.gameSessionQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameSessionQuestionFindManyArgs>(args?: SelectSubset<T, GameSessionQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameSessionQuestion.
     * @param {GameSessionQuestionCreateArgs} args - Arguments to create a GameSessionQuestion.
     * @example
     * // Create one GameSessionQuestion
     * const GameSessionQuestion = await prisma.gameSessionQuestion.create({
     *   data: {
     *     // ... data to create a GameSessionQuestion
     *   }
     * })
     * 
     */
    create<T extends GameSessionQuestionCreateArgs>(args: SelectSubset<T, GameSessionQuestionCreateArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameSessionQuestions.
     * @param {GameSessionQuestionCreateManyArgs} args - Arguments to create many GameSessionQuestions.
     * @example
     * // Create many GameSessionQuestions
     * const gameSessionQuestion = await prisma.gameSessionQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameSessionQuestionCreateManyArgs>(args?: SelectSubset<T, GameSessionQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameSessionQuestions and returns the data saved in the database.
     * @param {GameSessionQuestionCreateManyAndReturnArgs} args - Arguments to create many GameSessionQuestions.
     * @example
     * // Create many GameSessionQuestions
     * const gameSessionQuestion = await prisma.gameSessionQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameSessionQuestions and only return the `id`
     * const gameSessionQuestionWithIdOnly = await prisma.gameSessionQuestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameSessionQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, GameSessionQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameSessionQuestion.
     * @param {GameSessionQuestionDeleteArgs} args - Arguments to delete one GameSessionQuestion.
     * @example
     * // Delete one GameSessionQuestion
     * const GameSessionQuestion = await prisma.gameSessionQuestion.delete({
     *   where: {
     *     // ... filter to delete one GameSessionQuestion
     *   }
     * })
     * 
     */
    delete<T extends GameSessionQuestionDeleteArgs>(args: SelectSubset<T, GameSessionQuestionDeleteArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameSessionQuestion.
     * @param {GameSessionQuestionUpdateArgs} args - Arguments to update one GameSessionQuestion.
     * @example
     * // Update one GameSessionQuestion
     * const gameSessionQuestion = await prisma.gameSessionQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameSessionQuestionUpdateArgs>(args: SelectSubset<T, GameSessionQuestionUpdateArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameSessionQuestions.
     * @param {GameSessionQuestionDeleteManyArgs} args - Arguments to filter GameSessionQuestions to delete.
     * @example
     * // Delete a few GameSessionQuestions
     * const { count } = await prisma.gameSessionQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameSessionQuestionDeleteManyArgs>(args?: SelectSubset<T, GameSessionQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessionQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameSessionQuestions
     * const gameSessionQuestion = await prisma.gameSessionQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameSessionQuestionUpdateManyArgs>(args: SelectSubset<T, GameSessionQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessionQuestions and returns the data updated in the database.
     * @param {GameSessionQuestionUpdateManyAndReturnArgs} args - Arguments to update many GameSessionQuestions.
     * @example
     * // Update many GameSessionQuestions
     * const gameSessionQuestion = await prisma.gameSessionQuestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameSessionQuestions and only return the `id`
     * const gameSessionQuestionWithIdOnly = await prisma.gameSessionQuestion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameSessionQuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, GameSessionQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameSessionQuestion.
     * @param {GameSessionQuestionUpsertArgs} args - Arguments to update or create a GameSessionQuestion.
     * @example
     * // Update or create a GameSessionQuestion
     * const gameSessionQuestion = await prisma.gameSessionQuestion.upsert({
     *   create: {
     *     // ... data to create a GameSessionQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameSessionQuestion we want to update
     *   }
     * })
     */
    upsert<T extends GameSessionQuestionUpsertArgs>(args: SelectSubset<T, GameSessionQuestionUpsertArgs<ExtArgs>>): Prisma__GameSessionQuestionClient<$Result.GetResult<Prisma.$GameSessionQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameSessionQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionCountArgs} args - Arguments to filter GameSessionQuestions to count.
     * @example
     * // Count the number of GameSessionQuestions
     * const count = await prisma.gameSessionQuestion.count({
     *   where: {
     *     // ... the filter for the GameSessionQuestions we want to count
     *   }
     * })
    **/
    count<T extends GameSessionQuestionCountArgs>(
      args?: Subset<T, GameSessionQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameSessionQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameSessionQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameSessionQuestionAggregateArgs>(args: Subset<T, GameSessionQuestionAggregateArgs>): Prisma.PrismaPromise<GetGameSessionQuestionAggregateType<T>>

    /**
     * Group by GameSessionQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionQuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameSessionQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameSessionQuestionGroupByArgs['orderBy'] }
        : { orderBy?: GameSessionQuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameSessionQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameSessionQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameSessionQuestion model
   */
  readonly fields: GameSessionQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameSessionQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameSessionQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gameSession<T extends GameSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameSessionDefaultArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    question<T extends QuestionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionDefaultArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameSessionQuestion model
   */
  interface GameSessionQuestionFieldRefs {
    readonly id: FieldRef<"GameSessionQuestion", 'String'>
    readonly gameSessionId: FieldRef<"GameSessionQuestion", 'String'>
    readonly questionId: FieldRef<"GameSessionQuestion", 'String'>
    readonly order: FieldRef<"GameSessionQuestion", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * GameSessionQuestion findUnique
   */
  export type GameSessionQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessionQuestion to fetch.
     */
    where: GameSessionQuestionWhereUniqueInput
  }

  /**
   * GameSessionQuestion findUniqueOrThrow
   */
  export type GameSessionQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessionQuestion to fetch.
     */
    where: GameSessionQuestionWhereUniqueInput
  }

  /**
   * GameSessionQuestion findFirst
   */
  export type GameSessionQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessionQuestion to fetch.
     */
    where?: GameSessionQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessionQuestions to fetch.
     */
    orderBy?: GameSessionQuestionOrderByWithRelationInput | GameSessionQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessionQuestions.
     */
    cursor?: GameSessionQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessionQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessionQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessionQuestions.
     */
    distinct?: GameSessionQuestionScalarFieldEnum | GameSessionQuestionScalarFieldEnum[]
  }

  /**
   * GameSessionQuestion findFirstOrThrow
   */
  export type GameSessionQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessionQuestion to fetch.
     */
    where?: GameSessionQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessionQuestions to fetch.
     */
    orderBy?: GameSessionQuestionOrderByWithRelationInput | GameSessionQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessionQuestions.
     */
    cursor?: GameSessionQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessionQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessionQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessionQuestions.
     */
    distinct?: GameSessionQuestionScalarFieldEnum | GameSessionQuestionScalarFieldEnum[]
  }

  /**
   * GameSessionQuestion findMany
   */
  export type GameSessionQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessionQuestions to fetch.
     */
    where?: GameSessionQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessionQuestions to fetch.
     */
    orderBy?: GameSessionQuestionOrderByWithRelationInput | GameSessionQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameSessionQuestions.
     */
    cursor?: GameSessionQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessionQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessionQuestions.
     */
    skip?: number
    distinct?: GameSessionQuestionScalarFieldEnum | GameSessionQuestionScalarFieldEnum[]
  }

  /**
   * GameSessionQuestion create
   */
  export type GameSessionQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a GameSessionQuestion.
     */
    data: XOR<GameSessionQuestionCreateInput, GameSessionQuestionUncheckedCreateInput>
  }

  /**
   * GameSessionQuestion createMany
   */
  export type GameSessionQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameSessionQuestions.
     */
    data: GameSessionQuestionCreateManyInput | GameSessionQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSessionQuestion createManyAndReturn
   */
  export type GameSessionQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * The data used to create many GameSessionQuestions.
     */
    data: GameSessionQuestionCreateManyInput | GameSessionQuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameSessionQuestion update
   */
  export type GameSessionQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a GameSessionQuestion.
     */
    data: XOR<GameSessionQuestionUpdateInput, GameSessionQuestionUncheckedUpdateInput>
    /**
     * Choose, which GameSessionQuestion to update.
     */
    where: GameSessionQuestionWhereUniqueInput
  }

  /**
   * GameSessionQuestion updateMany
   */
  export type GameSessionQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameSessionQuestions.
     */
    data: XOR<GameSessionQuestionUpdateManyMutationInput, GameSessionQuestionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessionQuestions to update
     */
    where?: GameSessionQuestionWhereInput
    /**
     * Limit how many GameSessionQuestions to update.
     */
    limit?: number
  }

  /**
   * GameSessionQuestion updateManyAndReturn
   */
  export type GameSessionQuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * The data used to update GameSessionQuestions.
     */
    data: XOR<GameSessionQuestionUpdateManyMutationInput, GameSessionQuestionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessionQuestions to update
     */
    where?: GameSessionQuestionWhereInput
    /**
     * Limit how many GameSessionQuestions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameSessionQuestion upsert
   */
  export type GameSessionQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the GameSessionQuestion to update in case it exists.
     */
    where: GameSessionQuestionWhereUniqueInput
    /**
     * In case the GameSessionQuestion found by the `where` argument doesn't exist, create a new GameSessionQuestion with this data.
     */
    create: XOR<GameSessionQuestionCreateInput, GameSessionQuestionUncheckedCreateInput>
    /**
     * In case the GameSessionQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameSessionQuestionUpdateInput, GameSessionQuestionUncheckedUpdateInput>
  }

  /**
   * GameSessionQuestion delete
   */
  export type GameSessionQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
    /**
     * Filter which GameSessionQuestion to delete.
     */
    where: GameSessionQuestionWhereUniqueInput
  }

  /**
   * GameSessionQuestion deleteMany
   */
  export type GameSessionQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSessionQuestions to delete
     */
    where?: GameSessionQuestionWhereInput
    /**
     * Limit how many GameSessionQuestions to delete.
     */
    limit?: number
  }

  /**
   * GameSessionQuestion without action
   */
  export type GameSessionQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionQuestion
     */
    select?: GameSessionQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSessionQuestion
     */
    omit?: GameSessionQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionQuestionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const QuestionScalarFieldEnum: {
    id: 'id',
    content: 'content',
    answerA: 'answerA',
    answerB: 'answerB',
    answerC: 'answerC',
    answerD: 'answerD',
    correctAnswer: 'correctAnswer',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


  export const GameSessionScalarFieldEnum: {
    id: 'id',
    status: 'status',
    currentQuestionIndex: 'currentQuestionIndex',
    startTime: 'startTime',
    endTime: 'endTime',
    gameTime: 'gameTime',
    usedFiftyFifty: 'usedFiftyFifty',
    usedPhoneAFriend: 'usedPhoneAFriend',
    usedAskAudience: 'usedAskAudience',
    hiddenAnswers: 'hiddenAnswers',
    audienceVoteQuestions: 'audienceVoteQuestions',
    totalQuestions: 'totalQuestions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GameSessionScalarFieldEnum = (typeof GameSessionScalarFieldEnum)[keyof typeof GameSessionScalarFieldEnum]


  export const GameSessionQuestionScalarFieldEnum: {
    id: 'id',
    gameSessionId: 'gameSessionId',
    questionId: 'questionId',
    order: 'order'
  };

  export type GameSessionQuestionScalarFieldEnum = (typeof GameSessionQuestionScalarFieldEnum)[keyof typeof GameSessionQuestionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: StringFilter<"Question"> | string
    content?: StringFilter<"Question"> | string
    answerA?: StringFilter<"Question"> | string
    answerB?: StringFilter<"Question"> | string
    answerC?: StringFilter<"Question"> | string
    answerD?: StringFilter<"Question"> | string
    correctAnswer?: StringFilter<"Question"> | string
    createdAt?: DateTimeFilter<"Question"> | Date | string
    updatedAt?: DateTimeFilter<"Question"> | Date | string
    gameSessionQuestions?: GameSessionQuestionListRelationFilter
  }

  export type QuestionOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    answerA?: SortOrder
    answerB?: SortOrder
    answerC?: SortOrder
    answerD?: SortOrder
    correctAnswer?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gameSessionQuestions?: GameSessionQuestionOrderByRelationAggregateInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    content?: StringFilter<"Question"> | string
    answerA?: StringFilter<"Question"> | string
    answerB?: StringFilter<"Question"> | string
    answerC?: StringFilter<"Question"> | string
    answerD?: StringFilter<"Question"> | string
    correctAnswer?: StringFilter<"Question"> | string
    createdAt?: DateTimeFilter<"Question"> | Date | string
    updatedAt?: DateTimeFilter<"Question"> | Date | string
    gameSessionQuestions?: GameSessionQuestionListRelationFilter
  }, "id">

  export type QuestionOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    answerA?: SortOrder
    answerB?: SortOrder
    answerC?: SortOrder
    answerD?: SortOrder
    correctAnswer?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuestionCountOrderByAggregateInput
    _max?: QuestionMaxOrderByAggregateInput
    _min?: QuestionMinOrderByAggregateInput
  }

  export type QuestionScalarWhereWithAggregatesInput = {
    AND?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    OR?: QuestionScalarWhereWithAggregatesInput[]
    NOT?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Question"> | string
    content?: StringWithAggregatesFilter<"Question"> | string
    answerA?: StringWithAggregatesFilter<"Question"> | string
    answerB?: StringWithAggregatesFilter<"Question"> | string
    answerC?: StringWithAggregatesFilter<"Question"> | string
    answerD?: StringWithAggregatesFilter<"Question"> | string
    correctAnswer?: StringWithAggregatesFilter<"Question"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Question"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Question"> | Date | string
  }

  export type GameSessionWhereInput = {
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    id?: StringFilter<"GameSession"> | string
    status?: StringFilter<"GameSession"> | string
    currentQuestionIndex?: IntFilter<"GameSession"> | number
    startTime?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    endTime?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    gameTime?: IntFilter<"GameSession"> | number
    usedFiftyFifty?: BoolFilter<"GameSession"> | boolean
    usedPhoneAFriend?: BoolFilter<"GameSession"> | boolean
    usedAskAudience?: BoolFilter<"GameSession"> | boolean
    hiddenAnswers?: StringFilter<"GameSession"> | string
    audienceVoteQuestions?: StringFilter<"GameSession"> | string
    totalQuestions?: IntFilter<"GameSession"> | number
    createdAt?: DateTimeFilter<"GameSession"> | Date | string
    updatedAt?: DateTimeFilter<"GameSession"> | Date | string
    questions?: GameSessionQuestionListRelationFilter
  }

  export type GameSessionOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    currentQuestionIndex?: SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    gameTime?: SortOrder
    usedFiftyFifty?: SortOrder
    usedPhoneAFriend?: SortOrder
    usedAskAudience?: SortOrder
    hiddenAnswers?: SortOrder
    audienceVoteQuestions?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    questions?: GameSessionQuestionOrderByRelationAggregateInput
  }

  export type GameSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    status?: StringFilter<"GameSession"> | string
    currentQuestionIndex?: IntFilter<"GameSession"> | number
    startTime?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    endTime?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    gameTime?: IntFilter<"GameSession"> | number
    usedFiftyFifty?: BoolFilter<"GameSession"> | boolean
    usedPhoneAFriend?: BoolFilter<"GameSession"> | boolean
    usedAskAudience?: BoolFilter<"GameSession"> | boolean
    hiddenAnswers?: StringFilter<"GameSession"> | string
    audienceVoteQuestions?: StringFilter<"GameSession"> | string
    totalQuestions?: IntFilter<"GameSession"> | number
    createdAt?: DateTimeFilter<"GameSession"> | Date | string
    updatedAt?: DateTimeFilter<"GameSession"> | Date | string
    questions?: GameSessionQuestionListRelationFilter
  }, "id">

  export type GameSessionOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    currentQuestionIndex?: SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    gameTime?: SortOrder
    usedFiftyFifty?: SortOrder
    usedPhoneAFriend?: SortOrder
    usedAskAudience?: SortOrder
    hiddenAnswers?: SortOrder
    audienceVoteQuestions?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GameSessionCountOrderByAggregateInput
    _avg?: GameSessionAvgOrderByAggregateInput
    _max?: GameSessionMaxOrderByAggregateInput
    _min?: GameSessionMinOrderByAggregateInput
    _sum?: GameSessionSumOrderByAggregateInput
  }

  export type GameSessionScalarWhereWithAggregatesInput = {
    AND?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    OR?: GameSessionScalarWhereWithAggregatesInput[]
    NOT?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameSession"> | string
    status?: StringWithAggregatesFilter<"GameSession"> | string
    currentQuestionIndex?: IntWithAggregatesFilter<"GameSession"> | number
    startTime?: DateTimeNullableWithAggregatesFilter<"GameSession"> | Date | string | null
    endTime?: DateTimeNullableWithAggregatesFilter<"GameSession"> | Date | string | null
    gameTime?: IntWithAggregatesFilter<"GameSession"> | number
    usedFiftyFifty?: BoolWithAggregatesFilter<"GameSession"> | boolean
    usedPhoneAFriend?: BoolWithAggregatesFilter<"GameSession"> | boolean
    usedAskAudience?: BoolWithAggregatesFilter<"GameSession"> | boolean
    hiddenAnswers?: StringWithAggregatesFilter<"GameSession"> | string
    audienceVoteQuestions?: StringWithAggregatesFilter<"GameSession"> | string
    totalQuestions?: IntWithAggregatesFilter<"GameSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
  }

  export type GameSessionQuestionWhereInput = {
    AND?: GameSessionQuestionWhereInput | GameSessionQuestionWhereInput[]
    OR?: GameSessionQuestionWhereInput[]
    NOT?: GameSessionQuestionWhereInput | GameSessionQuestionWhereInput[]
    id?: StringFilter<"GameSessionQuestion"> | string
    gameSessionId?: StringFilter<"GameSessionQuestion"> | string
    questionId?: StringFilter<"GameSessionQuestion"> | string
    order?: IntFilter<"GameSessionQuestion"> | number
    gameSession?: XOR<GameSessionScalarRelationFilter, GameSessionWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }

  export type GameSessionQuestionOrderByWithRelationInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    questionId?: SortOrder
    order?: SortOrder
    gameSession?: GameSessionOrderByWithRelationInput
    question?: QuestionOrderByWithRelationInput
  }

  export type GameSessionQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameSessionQuestionWhereInput | GameSessionQuestionWhereInput[]
    OR?: GameSessionQuestionWhereInput[]
    NOT?: GameSessionQuestionWhereInput | GameSessionQuestionWhereInput[]
    gameSessionId?: StringFilter<"GameSessionQuestion"> | string
    questionId?: StringFilter<"GameSessionQuestion"> | string
    order?: IntFilter<"GameSessionQuestion"> | number
    gameSession?: XOR<GameSessionScalarRelationFilter, GameSessionWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }, "id">

  export type GameSessionQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    questionId?: SortOrder
    order?: SortOrder
    _count?: GameSessionQuestionCountOrderByAggregateInput
    _avg?: GameSessionQuestionAvgOrderByAggregateInput
    _max?: GameSessionQuestionMaxOrderByAggregateInput
    _min?: GameSessionQuestionMinOrderByAggregateInput
    _sum?: GameSessionQuestionSumOrderByAggregateInput
  }

  export type GameSessionQuestionScalarWhereWithAggregatesInput = {
    AND?: GameSessionQuestionScalarWhereWithAggregatesInput | GameSessionQuestionScalarWhereWithAggregatesInput[]
    OR?: GameSessionQuestionScalarWhereWithAggregatesInput[]
    NOT?: GameSessionQuestionScalarWhereWithAggregatesInput | GameSessionQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameSessionQuestion"> | string
    gameSessionId?: StringWithAggregatesFilter<"GameSessionQuestion"> | string
    questionId?: StringWithAggregatesFilter<"GameSessionQuestion"> | string
    order?: IntWithAggregatesFilter<"GameSessionQuestion"> | number
  }

  export type QuestionCreateInput = {
    id?: string
    content: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correctAnswer: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gameSessionQuestions?: GameSessionQuestionCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateInput = {
    id?: string
    content: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correctAnswer: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gameSessionQuestions?: GameSessionQuestionUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    answerA?: StringFieldUpdateOperationsInput | string
    answerB?: StringFieldUpdateOperationsInput | string
    answerC?: StringFieldUpdateOperationsInput | string
    answerD?: StringFieldUpdateOperationsInput | string
    correctAnswer?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gameSessionQuestions?: GameSessionQuestionUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    answerA?: StringFieldUpdateOperationsInput | string
    answerB?: StringFieldUpdateOperationsInput | string
    answerC?: StringFieldUpdateOperationsInput | string
    answerD?: StringFieldUpdateOperationsInput | string
    correctAnswer?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gameSessionQuestions?: GameSessionQuestionUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionCreateManyInput = {
    id?: string
    content: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correctAnswer: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    answerA?: StringFieldUpdateOperationsInput | string
    answerB?: StringFieldUpdateOperationsInput | string
    answerC?: StringFieldUpdateOperationsInput | string
    answerD?: StringFieldUpdateOperationsInput | string
    correctAnswer?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    answerA?: StringFieldUpdateOperationsInput | string
    answerB?: StringFieldUpdateOperationsInput | string
    answerC?: StringFieldUpdateOperationsInput | string
    answerD?: StringFieldUpdateOperationsInput | string
    correctAnswer?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionCreateInput = {
    id?: string
    status?: string
    currentQuestionIndex?: number
    startTime?: Date | string | null
    endTime?: Date | string | null
    gameTime?: number
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: string
    audienceVoteQuestions?: string
    totalQuestions?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: GameSessionQuestionCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionUncheckedCreateInput = {
    id?: string
    status?: string
    currentQuestionIndex?: number
    startTime?: Date | string | null
    endTime?: Date | string | null
    gameTime?: number
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: string
    audienceVoteQuestions?: string
    totalQuestions?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: GameSessionQuestionUncheckedCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentQuestionIndex?: IntFieldUpdateOperationsInput | number
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameTime?: IntFieldUpdateOperationsInput | number
    usedFiftyFifty?: BoolFieldUpdateOperationsInput | boolean
    usedPhoneAFriend?: BoolFieldUpdateOperationsInput | boolean
    usedAskAudience?: BoolFieldUpdateOperationsInput | boolean
    hiddenAnswers?: StringFieldUpdateOperationsInput | string
    audienceVoteQuestions?: StringFieldUpdateOperationsInput | string
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: GameSessionQuestionUpdateManyWithoutGameSessionNestedInput
  }

  export type GameSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentQuestionIndex?: IntFieldUpdateOperationsInput | number
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameTime?: IntFieldUpdateOperationsInput | number
    usedFiftyFifty?: BoolFieldUpdateOperationsInput | boolean
    usedPhoneAFriend?: BoolFieldUpdateOperationsInput | boolean
    usedAskAudience?: BoolFieldUpdateOperationsInput | boolean
    hiddenAnswers?: StringFieldUpdateOperationsInput | string
    audienceVoteQuestions?: StringFieldUpdateOperationsInput | string
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: GameSessionQuestionUncheckedUpdateManyWithoutGameSessionNestedInput
  }

  export type GameSessionCreateManyInput = {
    id?: string
    status?: string
    currentQuestionIndex?: number
    startTime?: Date | string | null
    endTime?: Date | string | null
    gameTime?: number
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: string
    audienceVoteQuestions?: string
    totalQuestions?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentQuestionIndex?: IntFieldUpdateOperationsInput | number
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameTime?: IntFieldUpdateOperationsInput | number
    usedFiftyFifty?: BoolFieldUpdateOperationsInput | boolean
    usedPhoneAFriend?: BoolFieldUpdateOperationsInput | boolean
    usedAskAudience?: BoolFieldUpdateOperationsInput | boolean
    hiddenAnswers?: StringFieldUpdateOperationsInput | string
    audienceVoteQuestions?: StringFieldUpdateOperationsInput | string
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentQuestionIndex?: IntFieldUpdateOperationsInput | number
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameTime?: IntFieldUpdateOperationsInput | number
    usedFiftyFifty?: BoolFieldUpdateOperationsInput | boolean
    usedPhoneAFriend?: BoolFieldUpdateOperationsInput | boolean
    usedAskAudience?: BoolFieldUpdateOperationsInput | boolean
    hiddenAnswers?: StringFieldUpdateOperationsInput | string
    audienceVoteQuestions?: StringFieldUpdateOperationsInput | string
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionQuestionCreateInput = {
    id?: string
    order: number
    gameSession: GameSessionCreateNestedOneWithoutQuestionsInput
    question: QuestionCreateNestedOneWithoutGameSessionQuestionsInput
  }

  export type GameSessionQuestionUncheckedCreateInput = {
    id?: string
    gameSessionId: string
    questionId: string
    order: number
  }

  export type GameSessionQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    gameSession?: GameSessionUpdateOneRequiredWithoutQuestionsNestedInput
    question?: QuestionUpdateOneRequiredWithoutGameSessionQuestionsNestedInput
  }

  export type GameSessionQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GameSessionQuestionCreateManyInput = {
    id?: string
    gameSessionId: string
    questionId: string
    order: number
  }

  export type GameSessionQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GameSessionQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type GameSessionQuestionListRelationFilter = {
    every?: GameSessionQuestionWhereInput
    some?: GameSessionQuestionWhereInput
    none?: GameSessionQuestionWhereInput
  }

  export type GameSessionQuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    answerA?: SortOrder
    answerB?: SortOrder
    answerC?: SortOrder
    answerD?: SortOrder
    correctAnswer?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    answerA?: SortOrder
    answerB?: SortOrder
    answerC?: SortOrder
    answerD?: SortOrder
    correctAnswer?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    answerA?: SortOrder
    answerB?: SortOrder
    answerC?: SortOrder
    answerD?: SortOrder
    correctAnswer?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GameSessionCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    currentQuestionIndex?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    gameTime?: SortOrder
    usedFiftyFifty?: SortOrder
    usedPhoneAFriend?: SortOrder
    usedAskAudience?: SortOrder
    hiddenAnswers?: SortOrder
    audienceVoteQuestions?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionAvgOrderByAggregateInput = {
    currentQuestionIndex?: SortOrder
    gameTime?: SortOrder
    totalQuestions?: SortOrder
  }

  export type GameSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    currentQuestionIndex?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    gameTime?: SortOrder
    usedFiftyFifty?: SortOrder
    usedPhoneAFriend?: SortOrder
    usedAskAudience?: SortOrder
    hiddenAnswers?: SortOrder
    audienceVoteQuestions?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    currentQuestionIndex?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    gameTime?: SortOrder
    usedFiftyFifty?: SortOrder
    usedPhoneAFriend?: SortOrder
    usedAskAudience?: SortOrder
    hiddenAnswers?: SortOrder
    audienceVoteQuestions?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionSumOrderByAggregateInput = {
    currentQuestionIndex?: SortOrder
    gameTime?: SortOrder
    totalQuestions?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type GameSessionScalarRelationFilter = {
    is?: GameSessionWhereInput
    isNot?: GameSessionWhereInput
  }

  export type QuestionScalarRelationFilter = {
    is?: QuestionWhereInput
    isNot?: QuestionWhereInput
  }

  export type GameSessionQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    questionId?: SortOrder
    order?: SortOrder
  }

  export type GameSessionQuestionAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type GameSessionQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    questionId?: SortOrder
    order?: SortOrder
  }

  export type GameSessionQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    questionId?: SortOrder
    order?: SortOrder
  }

  export type GameSessionQuestionSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type GameSessionQuestionCreateNestedManyWithoutQuestionInput = {
    create?: XOR<GameSessionQuestionCreateWithoutQuestionInput, GameSessionQuestionUncheckedCreateWithoutQuestionInput> | GameSessionQuestionCreateWithoutQuestionInput[] | GameSessionQuestionUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutQuestionInput | GameSessionQuestionCreateOrConnectWithoutQuestionInput[]
    createMany?: GameSessionQuestionCreateManyQuestionInputEnvelope
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
  }

  export type GameSessionQuestionUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<GameSessionQuestionCreateWithoutQuestionInput, GameSessionQuestionUncheckedCreateWithoutQuestionInput> | GameSessionQuestionCreateWithoutQuestionInput[] | GameSessionQuestionUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutQuestionInput | GameSessionQuestionCreateOrConnectWithoutQuestionInput[]
    createMany?: GameSessionQuestionCreateManyQuestionInputEnvelope
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type GameSessionQuestionUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<GameSessionQuestionCreateWithoutQuestionInput, GameSessionQuestionUncheckedCreateWithoutQuestionInput> | GameSessionQuestionCreateWithoutQuestionInput[] | GameSessionQuestionUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutQuestionInput | GameSessionQuestionCreateOrConnectWithoutQuestionInput[]
    upsert?: GameSessionQuestionUpsertWithWhereUniqueWithoutQuestionInput | GameSessionQuestionUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: GameSessionQuestionCreateManyQuestionInputEnvelope
    set?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    disconnect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    delete?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    update?: GameSessionQuestionUpdateWithWhereUniqueWithoutQuestionInput | GameSessionQuestionUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: GameSessionQuestionUpdateManyWithWhereWithoutQuestionInput | GameSessionQuestionUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: GameSessionQuestionScalarWhereInput | GameSessionQuestionScalarWhereInput[]
  }

  export type GameSessionQuestionUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<GameSessionQuestionCreateWithoutQuestionInput, GameSessionQuestionUncheckedCreateWithoutQuestionInput> | GameSessionQuestionCreateWithoutQuestionInput[] | GameSessionQuestionUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutQuestionInput | GameSessionQuestionCreateOrConnectWithoutQuestionInput[]
    upsert?: GameSessionQuestionUpsertWithWhereUniqueWithoutQuestionInput | GameSessionQuestionUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: GameSessionQuestionCreateManyQuestionInputEnvelope
    set?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    disconnect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    delete?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    update?: GameSessionQuestionUpdateWithWhereUniqueWithoutQuestionInput | GameSessionQuestionUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: GameSessionQuestionUpdateManyWithWhereWithoutQuestionInput | GameSessionQuestionUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: GameSessionQuestionScalarWhereInput | GameSessionQuestionScalarWhereInput[]
  }

  export type GameSessionQuestionCreateNestedManyWithoutGameSessionInput = {
    create?: XOR<GameSessionQuestionCreateWithoutGameSessionInput, GameSessionQuestionUncheckedCreateWithoutGameSessionInput> | GameSessionQuestionCreateWithoutGameSessionInput[] | GameSessionQuestionUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutGameSessionInput | GameSessionQuestionCreateOrConnectWithoutGameSessionInput[]
    createMany?: GameSessionQuestionCreateManyGameSessionInputEnvelope
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
  }

  export type GameSessionQuestionUncheckedCreateNestedManyWithoutGameSessionInput = {
    create?: XOR<GameSessionQuestionCreateWithoutGameSessionInput, GameSessionQuestionUncheckedCreateWithoutGameSessionInput> | GameSessionQuestionCreateWithoutGameSessionInput[] | GameSessionQuestionUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutGameSessionInput | GameSessionQuestionCreateOrConnectWithoutGameSessionInput[]
    createMany?: GameSessionQuestionCreateManyGameSessionInputEnvelope
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type GameSessionQuestionUpdateManyWithoutGameSessionNestedInput = {
    create?: XOR<GameSessionQuestionCreateWithoutGameSessionInput, GameSessionQuestionUncheckedCreateWithoutGameSessionInput> | GameSessionQuestionCreateWithoutGameSessionInput[] | GameSessionQuestionUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutGameSessionInput | GameSessionQuestionCreateOrConnectWithoutGameSessionInput[]
    upsert?: GameSessionQuestionUpsertWithWhereUniqueWithoutGameSessionInput | GameSessionQuestionUpsertWithWhereUniqueWithoutGameSessionInput[]
    createMany?: GameSessionQuestionCreateManyGameSessionInputEnvelope
    set?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    disconnect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    delete?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    update?: GameSessionQuestionUpdateWithWhereUniqueWithoutGameSessionInput | GameSessionQuestionUpdateWithWhereUniqueWithoutGameSessionInput[]
    updateMany?: GameSessionQuestionUpdateManyWithWhereWithoutGameSessionInput | GameSessionQuestionUpdateManyWithWhereWithoutGameSessionInput[]
    deleteMany?: GameSessionQuestionScalarWhereInput | GameSessionQuestionScalarWhereInput[]
  }

  export type GameSessionQuestionUncheckedUpdateManyWithoutGameSessionNestedInput = {
    create?: XOR<GameSessionQuestionCreateWithoutGameSessionInput, GameSessionQuestionUncheckedCreateWithoutGameSessionInput> | GameSessionQuestionCreateWithoutGameSessionInput[] | GameSessionQuestionUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameSessionQuestionCreateOrConnectWithoutGameSessionInput | GameSessionQuestionCreateOrConnectWithoutGameSessionInput[]
    upsert?: GameSessionQuestionUpsertWithWhereUniqueWithoutGameSessionInput | GameSessionQuestionUpsertWithWhereUniqueWithoutGameSessionInput[]
    createMany?: GameSessionQuestionCreateManyGameSessionInputEnvelope
    set?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    disconnect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    delete?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    connect?: GameSessionQuestionWhereUniqueInput | GameSessionQuestionWhereUniqueInput[]
    update?: GameSessionQuestionUpdateWithWhereUniqueWithoutGameSessionInput | GameSessionQuestionUpdateWithWhereUniqueWithoutGameSessionInput[]
    updateMany?: GameSessionQuestionUpdateManyWithWhereWithoutGameSessionInput | GameSessionQuestionUpdateManyWithWhereWithoutGameSessionInput[]
    deleteMany?: GameSessionQuestionScalarWhereInput | GameSessionQuestionScalarWhereInput[]
  }

  export type GameSessionCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<GameSessionCreateWithoutQuestionsInput, GameSessionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: GameSessionCreateOrConnectWithoutQuestionsInput
    connect?: GameSessionWhereUniqueInput
  }

  export type QuestionCreateNestedOneWithoutGameSessionQuestionsInput = {
    create?: XOR<QuestionCreateWithoutGameSessionQuestionsInput, QuestionUncheckedCreateWithoutGameSessionQuestionsInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutGameSessionQuestionsInput
    connect?: QuestionWhereUniqueInput
  }

  export type GameSessionUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<GameSessionCreateWithoutQuestionsInput, GameSessionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: GameSessionCreateOrConnectWithoutQuestionsInput
    upsert?: GameSessionUpsertWithoutQuestionsInput
    connect?: GameSessionWhereUniqueInput
    update?: XOR<XOR<GameSessionUpdateToOneWithWhereWithoutQuestionsInput, GameSessionUpdateWithoutQuestionsInput>, GameSessionUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuestionUpdateOneRequiredWithoutGameSessionQuestionsNestedInput = {
    create?: XOR<QuestionCreateWithoutGameSessionQuestionsInput, QuestionUncheckedCreateWithoutGameSessionQuestionsInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutGameSessionQuestionsInput
    upsert?: QuestionUpsertWithoutGameSessionQuestionsInput
    connect?: QuestionWhereUniqueInput
    update?: XOR<XOR<QuestionUpdateToOneWithWhereWithoutGameSessionQuestionsInput, QuestionUpdateWithoutGameSessionQuestionsInput>, QuestionUncheckedUpdateWithoutGameSessionQuestionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type GameSessionQuestionCreateWithoutQuestionInput = {
    id?: string
    order: number
    gameSession: GameSessionCreateNestedOneWithoutQuestionsInput
  }

  export type GameSessionQuestionUncheckedCreateWithoutQuestionInput = {
    id?: string
    gameSessionId: string
    order: number
  }

  export type GameSessionQuestionCreateOrConnectWithoutQuestionInput = {
    where: GameSessionQuestionWhereUniqueInput
    create: XOR<GameSessionQuestionCreateWithoutQuestionInput, GameSessionQuestionUncheckedCreateWithoutQuestionInput>
  }

  export type GameSessionQuestionCreateManyQuestionInputEnvelope = {
    data: GameSessionQuestionCreateManyQuestionInput | GameSessionQuestionCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type GameSessionQuestionUpsertWithWhereUniqueWithoutQuestionInput = {
    where: GameSessionQuestionWhereUniqueInput
    update: XOR<GameSessionQuestionUpdateWithoutQuestionInput, GameSessionQuestionUncheckedUpdateWithoutQuestionInput>
    create: XOR<GameSessionQuestionCreateWithoutQuestionInput, GameSessionQuestionUncheckedCreateWithoutQuestionInput>
  }

  export type GameSessionQuestionUpdateWithWhereUniqueWithoutQuestionInput = {
    where: GameSessionQuestionWhereUniqueInput
    data: XOR<GameSessionQuestionUpdateWithoutQuestionInput, GameSessionQuestionUncheckedUpdateWithoutQuestionInput>
  }

  export type GameSessionQuestionUpdateManyWithWhereWithoutQuestionInput = {
    where: GameSessionQuestionScalarWhereInput
    data: XOR<GameSessionQuestionUpdateManyMutationInput, GameSessionQuestionUncheckedUpdateManyWithoutQuestionInput>
  }

  export type GameSessionQuestionScalarWhereInput = {
    AND?: GameSessionQuestionScalarWhereInput | GameSessionQuestionScalarWhereInput[]
    OR?: GameSessionQuestionScalarWhereInput[]
    NOT?: GameSessionQuestionScalarWhereInput | GameSessionQuestionScalarWhereInput[]
    id?: StringFilter<"GameSessionQuestion"> | string
    gameSessionId?: StringFilter<"GameSessionQuestion"> | string
    questionId?: StringFilter<"GameSessionQuestion"> | string
    order?: IntFilter<"GameSessionQuestion"> | number
  }

  export type GameSessionQuestionCreateWithoutGameSessionInput = {
    id?: string
    order: number
    question: QuestionCreateNestedOneWithoutGameSessionQuestionsInput
  }

  export type GameSessionQuestionUncheckedCreateWithoutGameSessionInput = {
    id?: string
    questionId: string
    order: number
  }

  export type GameSessionQuestionCreateOrConnectWithoutGameSessionInput = {
    where: GameSessionQuestionWhereUniqueInput
    create: XOR<GameSessionQuestionCreateWithoutGameSessionInput, GameSessionQuestionUncheckedCreateWithoutGameSessionInput>
  }

  export type GameSessionQuestionCreateManyGameSessionInputEnvelope = {
    data: GameSessionQuestionCreateManyGameSessionInput | GameSessionQuestionCreateManyGameSessionInput[]
    skipDuplicates?: boolean
  }

  export type GameSessionQuestionUpsertWithWhereUniqueWithoutGameSessionInput = {
    where: GameSessionQuestionWhereUniqueInput
    update: XOR<GameSessionQuestionUpdateWithoutGameSessionInput, GameSessionQuestionUncheckedUpdateWithoutGameSessionInput>
    create: XOR<GameSessionQuestionCreateWithoutGameSessionInput, GameSessionQuestionUncheckedCreateWithoutGameSessionInput>
  }

  export type GameSessionQuestionUpdateWithWhereUniqueWithoutGameSessionInput = {
    where: GameSessionQuestionWhereUniqueInput
    data: XOR<GameSessionQuestionUpdateWithoutGameSessionInput, GameSessionQuestionUncheckedUpdateWithoutGameSessionInput>
  }

  export type GameSessionQuestionUpdateManyWithWhereWithoutGameSessionInput = {
    where: GameSessionQuestionScalarWhereInput
    data: XOR<GameSessionQuestionUpdateManyMutationInput, GameSessionQuestionUncheckedUpdateManyWithoutGameSessionInput>
  }

  export type GameSessionCreateWithoutQuestionsInput = {
    id?: string
    status?: string
    currentQuestionIndex?: number
    startTime?: Date | string | null
    endTime?: Date | string | null
    gameTime?: number
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: string
    audienceVoteQuestions?: string
    totalQuestions?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameSessionUncheckedCreateWithoutQuestionsInput = {
    id?: string
    status?: string
    currentQuestionIndex?: number
    startTime?: Date | string | null
    endTime?: Date | string | null
    gameTime?: number
    usedFiftyFifty?: boolean
    usedPhoneAFriend?: boolean
    usedAskAudience?: boolean
    hiddenAnswers?: string
    audienceVoteQuestions?: string
    totalQuestions?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameSessionCreateOrConnectWithoutQuestionsInput = {
    where: GameSessionWhereUniqueInput
    create: XOR<GameSessionCreateWithoutQuestionsInput, GameSessionUncheckedCreateWithoutQuestionsInput>
  }

  export type QuestionCreateWithoutGameSessionQuestionsInput = {
    id?: string
    content: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correctAnswer: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionUncheckedCreateWithoutGameSessionQuestionsInput = {
    id?: string
    content: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correctAnswer: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionCreateOrConnectWithoutGameSessionQuestionsInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutGameSessionQuestionsInput, QuestionUncheckedCreateWithoutGameSessionQuestionsInput>
  }

  export type GameSessionUpsertWithoutQuestionsInput = {
    update: XOR<GameSessionUpdateWithoutQuestionsInput, GameSessionUncheckedUpdateWithoutQuestionsInput>
    create: XOR<GameSessionCreateWithoutQuestionsInput, GameSessionUncheckedCreateWithoutQuestionsInput>
    where?: GameSessionWhereInput
  }

  export type GameSessionUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: GameSessionWhereInput
    data: XOR<GameSessionUpdateWithoutQuestionsInput, GameSessionUncheckedUpdateWithoutQuestionsInput>
  }

  export type GameSessionUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentQuestionIndex?: IntFieldUpdateOperationsInput | number
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameTime?: IntFieldUpdateOperationsInput | number
    usedFiftyFifty?: BoolFieldUpdateOperationsInput | boolean
    usedPhoneAFriend?: BoolFieldUpdateOperationsInput | boolean
    usedAskAudience?: BoolFieldUpdateOperationsInput | boolean
    hiddenAnswers?: StringFieldUpdateOperationsInput | string
    audienceVoteQuestions?: StringFieldUpdateOperationsInput | string
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentQuestionIndex?: IntFieldUpdateOperationsInput | number
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameTime?: IntFieldUpdateOperationsInput | number
    usedFiftyFifty?: BoolFieldUpdateOperationsInput | boolean
    usedPhoneAFriend?: BoolFieldUpdateOperationsInput | boolean
    usedAskAudience?: BoolFieldUpdateOperationsInput | boolean
    hiddenAnswers?: StringFieldUpdateOperationsInput | string
    audienceVoteQuestions?: StringFieldUpdateOperationsInput | string
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionUpsertWithoutGameSessionQuestionsInput = {
    update: XOR<QuestionUpdateWithoutGameSessionQuestionsInput, QuestionUncheckedUpdateWithoutGameSessionQuestionsInput>
    create: XOR<QuestionCreateWithoutGameSessionQuestionsInput, QuestionUncheckedCreateWithoutGameSessionQuestionsInput>
    where?: QuestionWhereInput
  }

  export type QuestionUpdateToOneWithWhereWithoutGameSessionQuestionsInput = {
    where?: QuestionWhereInput
    data: XOR<QuestionUpdateWithoutGameSessionQuestionsInput, QuestionUncheckedUpdateWithoutGameSessionQuestionsInput>
  }

  export type QuestionUpdateWithoutGameSessionQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    answerA?: StringFieldUpdateOperationsInput | string
    answerB?: StringFieldUpdateOperationsInput | string
    answerC?: StringFieldUpdateOperationsInput | string
    answerD?: StringFieldUpdateOperationsInput | string
    correctAnswer?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionUncheckedUpdateWithoutGameSessionQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    answerA?: StringFieldUpdateOperationsInput | string
    answerB?: StringFieldUpdateOperationsInput | string
    answerC?: StringFieldUpdateOperationsInput | string
    answerD?: StringFieldUpdateOperationsInput | string
    correctAnswer?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionQuestionCreateManyQuestionInput = {
    id?: string
    gameSessionId: string
    order: number
  }

  export type GameSessionQuestionUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    gameSession?: GameSessionUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type GameSessionQuestionUncheckedUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GameSessionQuestionUncheckedUpdateManyWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GameSessionQuestionCreateManyGameSessionInput = {
    id?: string
    questionId: string
    order: number
  }

  export type GameSessionQuestionUpdateWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    question?: QuestionUpdateOneRequiredWithoutGameSessionQuestionsNestedInput
  }

  export type GameSessionQuestionUncheckedUpdateWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type GameSessionQuestionUncheckedUpdateManyWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}