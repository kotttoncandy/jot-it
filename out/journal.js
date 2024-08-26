(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/groq-sdk/version.mjs
  var VERSION = "0.5.0";

  // node_modules/groq-sdk/_shims/registry.mjs
  var auto = false;
  var kind = void 0;
  var fetch2 = void 0;
  var Request2 = void 0;
  var Response2 = void 0;
  var Headers2 = void 0;
  var FormData2 = void 0;
  var Blob2 = void 0;
  var File2 = void 0;
  var ReadableStream2 = void 0;
  var getMultipartRequestOptions = void 0;
  var getDefaultAgent = void 0;
  var fileFromPath = void 0;
  var isFsReadStream = void 0;
  function setShims(shims, options = { auto: false }) {
    if (auto) {
      throw new Error(`you must \`import 'groq-sdk/shims/${shims.kind}'\` before importing anything else from groq-sdk`);
    }
    if (kind) {
      throw new Error(`can't \`import 'groq-sdk/shims/${shims.kind}'\` after \`import 'groq-sdk/shims/${kind}'\``);
    }
    auto = options.auto;
    kind = shims.kind;
    fetch2 = shims.fetch;
    Request2 = shims.Request;
    Response2 = shims.Response;
    Headers2 = shims.Headers;
    FormData2 = shims.FormData;
    Blob2 = shims.Blob;
    File2 = shims.File;
    ReadableStream2 = shims.ReadableStream;
    getMultipartRequestOptions = shims.getMultipartRequestOptions;
    getDefaultAgent = shims.getDefaultAgent;
    fileFromPath = shims.fileFromPath;
    isFsReadStream = shims.isFsReadStream;
  }

  // node_modules/groq-sdk/_shims/MultipartBody.mjs
  var MultipartBody = class {
    constructor(body) {
      this.body = body;
    }
    get [Symbol.toStringTag]() {
      return "MultipartBody";
    }
  };

  // node_modules/groq-sdk/_shims/web-runtime.mjs
  function getRuntime({ manuallyImported } = {}) {
    const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import \u2026 from 'groq-sdk'\`:
- \`import 'groq-sdk/shims/node'\` (if you're running on Node)
- \`import 'groq-sdk/shims/web'\` (otherwise)
`;
    let _fetch, _Request, _Response, _Headers;
    try {
      _fetch = fetch;
      _Request = Request;
      _Response = Response;
      _Headers = Headers;
    } catch (error) {
      throw new Error(`this environment is missing the following Web Fetch API type: ${error.message}. ${recommendation}`);
    }
    return {
      kind: "web",
      fetch: _fetch,
      Request: _Request,
      Response: _Response,
      Headers: _Headers,
      FormData: (
        // @ts-ignore
        typeof FormData !== "undefined" ? FormData : class FormData {
          // @ts-ignore
          constructor() {
            throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
          }
        }
      ),
      Blob: typeof Blob !== "undefined" ? Blob : class Blob {
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
        }
      },
      File: (
        // @ts-ignore
        typeof File !== "undefined" ? File : class File {
          // @ts-ignore
          constructor() {
            throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
          }
        }
      ),
      ReadableStream: (
        // @ts-ignore
        typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
          // @ts-ignore
          constructor() {
            throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
          }
        }
      ),
      getMultipartRequestOptions: async (form, opts) => ({
        ...opts,
        body: new MultipartBody(form)
      }),
      getDefaultAgent: (url) => void 0,
      fileFromPath: () => {
        throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/groq/groq-typescript#file-uploads");
      },
      isFsReadStream: (value) => false
    };
  }

  // node_modules/groq-sdk/_shims/index.mjs
  if (!kind)
    setShims(getRuntime(), { auto: true });

  // node_modules/groq-sdk/error.mjs
  var error_exports = {};
  __export(error_exports, {
    APIConnectionError: () => APIConnectionError,
    APIConnectionTimeoutError: () => APIConnectionTimeoutError,
    APIError: () => APIError,
    APIUserAbortError: () => APIUserAbortError,
    AuthenticationError: () => AuthenticationError,
    BadRequestError: () => BadRequestError,
    ConflictError: () => ConflictError,
    GroqError: () => GroqError,
    InternalServerError: () => InternalServerError,
    NotFoundError: () => NotFoundError,
    PermissionDeniedError: () => PermissionDeniedError,
    RateLimitError: () => RateLimitError,
    UnprocessableEntityError: () => UnprocessableEntityError
  });
  var GroqError = class extends Error {
  };
  var APIError = class _APIError extends GroqError {
    constructor(status, error, message, headers) {
      super(`${_APIError.makeMessage(status, error, message)}`);
      this.status = status;
      this.headers = headers;
      this.error = error;
    }
    static makeMessage(status, error, message) {
      const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
      if (status && msg) {
        return `${status} ${msg}`;
      }
      if (status) {
        return `${status} status code (no body)`;
      }
      if (msg) {
        return msg;
      }
      return "(no status code or body)";
    }
    static generate(status, errorResponse, message, headers) {
      if (!status) {
        return new APIConnectionError({ cause: castToError(errorResponse) });
      }
      const error = errorResponse;
      if (status === 400) {
        return new BadRequestError(status, error, message, headers);
      }
      if (status === 401) {
        return new AuthenticationError(status, error, message, headers);
      }
      if (status === 403) {
        return new PermissionDeniedError(status, error, message, headers);
      }
      if (status === 404) {
        return new NotFoundError(status, error, message, headers);
      }
      if (status === 409) {
        return new ConflictError(status, error, message, headers);
      }
      if (status === 422) {
        return new UnprocessableEntityError(status, error, message, headers);
      }
      if (status === 429) {
        return new RateLimitError(status, error, message, headers);
      }
      if (status >= 500) {
        return new InternalServerError(status, error, message, headers);
      }
      return new _APIError(status, error, message, headers);
    }
  };
  var APIUserAbortError = class extends APIError {
    constructor({ message } = {}) {
      super(void 0, void 0, message || "Request was aborted.", void 0);
      this.status = void 0;
    }
  };
  var APIConnectionError = class extends APIError {
    constructor({ message, cause }) {
      super(void 0, void 0, message || "Connection error.", void 0);
      this.status = void 0;
      if (cause)
        this.cause = cause;
    }
  };
  var APIConnectionTimeoutError = class extends APIConnectionError {
    constructor({ message } = {}) {
      super({ message: message ?? "Request timed out." });
    }
  };
  var BadRequestError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 400;
    }
  };
  var AuthenticationError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 401;
    }
  };
  var PermissionDeniedError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 403;
    }
  };
  var NotFoundError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 404;
    }
  };
  var ConflictError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 409;
    }
  };
  var UnprocessableEntityError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 422;
    }
  };
  var RateLimitError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 429;
    }
  };
  var InternalServerError = class extends APIError {
  };

  // node_modules/groq-sdk/lib/streaming.mjs
  var Stream = class _Stream {
    constructor(iterator, controller) {
      this.iterator = iterator;
      this.controller = controller;
    }
    static fromSSEResponse(response, controller) {
      let consumed = false;
      const decoder = new SSEDecoder();
      async function* iterMessages() {
        if (!response.body) {
          controller.abort();
          throw new GroqError(`Attempted to iterate over a response with no body`);
        }
        const lineDecoder = new LineDecoder();
        const iter = readableStreamAsyncIterable(response.body);
        for await (const chunk of iter) {
          for (const line of lineDecoder.decode(chunk)) {
            const sse = decoder.decode(line);
            if (sse)
              yield sse;
          }
        }
        for (const line of lineDecoder.flush()) {
          const sse = decoder.decode(line);
          if (sse)
            yield sse;
        }
      }
      async function* iterator() {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          for await (const sse of iterMessages()) {
            if (done)
              continue;
            if (sse.data.startsWith("[DONE]")) {
              done = true;
              continue;
            }
            if (sse.event === null) {
              let data;
              try {
                data = JSON.parse(sse.data);
              } catch (e) {
                console.error(`Could not parse message into JSON:`, sse.data);
                console.error(`From chunk:`, sse.raw);
                throw e;
              }
              if (data && data.error) {
                throw new APIError(void 0, data.error, void 0, void 0);
              }
              yield data;
            }
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError")
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new _Stream(iterator, controller);
    }
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream(readableStream, controller) {
      let consumed = false;
      async function* iterLines() {
        const lineDecoder = new LineDecoder();
        const iter = readableStreamAsyncIterable(readableStream);
        for await (const chunk of iter) {
          for (const line of lineDecoder.decode(chunk)) {
            yield line;
          }
        }
        for (const line of lineDecoder.flush()) {
          yield line;
        }
      }
      async function* iterator() {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          for await (const line of iterLines()) {
            if (done)
              continue;
            if (line)
              yield JSON.parse(line);
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError")
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new _Stream(iterator, controller);
    }
    [Symbol.asyncIterator]() {
      return this.iterator();
    }
    /**
     * Splits the stream into two streams which can be
     * independently read from at different speeds.
     */
    tee() {
      const left = [];
      const right = [];
      const iterator = this.iterator();
      const teeIterator = (queue) => {
        return {
          next: () => {
            if (queue.length === 0) {
              const result = iterator.next();
              left.push(result);
              right.push(result);
            }
            return queue.shift();
          }
        };
      };
      return [
        new _Stream(() => teeIterator(left), this.controller),
        new _Stream(() => teeIterator(right), this.controller)
      ];
    }
    /**
     * Converts this stream to a newline-separated ReadableStream of
     * JSON stringified values in the stream
     * which can be turned back into a Stream with `Stream.fromReadableStream()`.
     */
    toReadableStream() {
      const self = this;
      let iter;
      const encoder = new TextEncoder();
      return new ReadableStream2({
        async start() {
          iter = self[Symbol.asyncIterator]();
        },
        async pull(ctrl) {
          try {
            const { value, done } = await iter.next();
            if (done)
              return ctrl.close();
            const bytes = encoder.encode(JSON.stringify(value) + "\n");
            ctrl.enqueue(bytes);
          } catch (err) {
            ctrl.error(err);
          }
        },
        async cancel() {
          await iter.return?.();
        }
      });
    }
  };
  var SSEDecoder = class {
    constructor() {
      this.event = null;
      this.data = [];
      this.chunks = [];
    }
    decode(line) {
      if (line.endsWith("\r")) {
        line = line.substring(0, line.length - 1);
      }
      if (!line) {
        if (!this.event && !this.data.length)
          return null;
        const sse = {
          event: this.event,
          data: this.data.join("\n"),
          raw: this.chunks
        };
        this.event = null;
        this.data = [];
        this.chunks = [];
        return sse;
      }
      this.chunks.push(line);
      if (line.startsWith(":")) {
        return null;
      }
      let [fieldname, _, value] = partition(line, ":");
      if (value.startsWith(" ")) {
        value = value.substring(1);
      }
      if (fieldname === "event") {
        this.event = value;
      } else if (fieldname === "data") {
        this.data.push(value);
      }
      return null;
    }
  };
  var LineDecoder = class _LineDecoder {
    constructor() {
      this.buffer = [];
      this.trailingCR = false;
    }
    decode(chunk) {
      let text = this.decodeText(chunk);
      if (this.trailingCR) {
        text = "\r" + text;
        this.trailingCR = false;
      }
      if (text.endsWith("\r")) {
        this.trailingCR = true;
        text = text.slice(0, -1);
      }
      if (!text) {
        return [];
      }
      const trailingNewline = _LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
      let lines = text.split(_LineDecoder.NEWLINE_REGEXP);
      if (lines.length === 1 && !trailingNewline) {
        this.buffer.push(lines[0]);
        return [];
      }
      if (this.buffer.length > 0) {
        lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
        this.buffer = [];
      }
      if (!trailingNewline) {
        this.buffer = [lines.pop() || ""];
      }
      return lines;
    }
    decodeText(bytes) {
      if (bytes == null)
        return "";
      if (typeof bytes === "string")
        return bytes;
      if (typeof Buffer !== "undefined") {
        if (bytes instanceof Buffer) {
          return bytes.toString();
        }
        if (bytes instanceof Uint8Array) {
          return Buffer.from(bytes).toString();
        }
        throw new GroqError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
      }
      if (typeof TextDecoder !== "undefined") {
        if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
          this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
          return this.textDecoder.decode(bytes);
        }
        throw new GroqError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
      }
      throw new GroqError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
    }
    flush() {
      if (!this.buffer.length && !this.trailingCR) {
        return [];
      }
      const lines = [this.buffer.join("")];
      this.buffer = [];
      this.trailingCR = false;
      return lines;
    }
  };
  LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r", "\v", "\f", "", "", "", "\x85", "\u2028", "\u2029"]);
  LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;
  function partition(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
      return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
    }
    return [str, "", ""];
  }
  function readableStreamAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator])
      return stream;
    const reader = stream.getReader();
    return {
      async next() {
        try {
          const result = await reader.read();
          if (result?.done)
            reader.releaseLock();
          return result;
        } catch (e) {
          reader.releaseLock();
          throw e;
        }
      },
      async return() {
        const cancelPromise = reader.cancel();
        reader.releaseLock();
        await cancelPromise;
        return { done: true, value: void 0 };
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }

  // node_modules/groq-sdk/uploads.mjs
  var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
  var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
  var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
  var isUploadable = (value) => {
    return isFileLike(value) || isResponseLike(value) || isFsReadStream(value);
  };
  async function toFile(value, name, options) {
    value = await value;
    options ?? (options = isFileLike(value) ? { lastModified: value.lastModified, type: value.type } : {});
    if (isResponseLike(value)) {
      const blob = await value.blob();
      name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
      return new File2([blob], name, options);
    }
    const bits = await getBytes(value);
    name || (name = getName(value) ?? "unknown_file");
    if (!options.type) {
      const type = bits[0]?.type;
      if (typeof type === "string") {
        options = { ...options, type };
      }
    }
    return new File2(bits, name, options);
  }
  async function getBytes(value) {
    let parts = [];
    if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
    value instanceof ArrayBuffer) {
      parts.push(value);
    } else if (isBlobLike(value)) {
      parts.push(await value.arrayBuffer());
    } else if (isAsyncIterableIterator(value)) {
      for await (const chunk of value) {
        parts.push(chunk);
      }
    } else {
      throw new Error(`Unexpected data type: ${typeof value}; constructor: ${value?.constructor?.name}; props: ${propsForError(value)}`);
    }
    return parts;
  }
  function propsForError(value) {
    const props = Object.getOwnPropertyNames(value);
    return `[${props.map((p) => `"${p}"`).join(", ")}]`;
  }
  function getName(value) {
    return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || // For fs.ReadStream
    getStringFromMaybeBuffer(value.path)?.split(/[\\/]/).pop();
  }
  var getStringFromMaybeBuffer = (x) => {
    if (typeof x === "string")
      return x;
    if (typeof Buffer !== "undefined" && x instanceof Buffer)
      return String(x);
    return void 0;
  };
  var isAsyncIterableIterator = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
  var isMultipartBody = (body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody";
  var multipartFormRequestOptions = async (opts) => {
    const form = await createForm(opts.body);
    return getMultipartRequestOptions(form, opts);
  };
  var createForm = async (body) => {
    const form = new FormData2();
    await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
    return form;
  };
  var addFormValue = async (form, key, value) => {
    if (value === void 0)
      return;
    if (value == null) {
      throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      form.append(key, String(value));
    } else if (isUploadable(value)) {
      const file = await toFile(value);
      form.append(key, file);
    } else if (Array.isArray(value)) {
      await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
    } else if (typeof value === "object") {
      await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
    } else {
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
    }
  };

  // node_modules/groq-sdk/core.mjs
  var __classPrivateFieldSet = function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _AbstractPage_client;
  async function defaultParseResponse(props) {
    const { response } = props;
    if (props.options.stream) {
      debug("response", response.status, response.url, response.headers, response.body);
      if (props.options.__streamClass) {
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      }
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const isJSON = contentType?.includes("application/json") || contentType?.includes("application/vnd.api+json");
    if (isJSON) {
      const json = await response.json();
      debug("response", response.status, response.url, response.headers, json);
      return json;
    }
    const text = await response.text();
    debug("response", response.status, response.url, response.headers, text);
    return text;
  }
  var APIPromise = class _APIPromise extends Promise {
    constructor(responsePromise, parseResponse = defaultParseResponse) {
      super((resolve) => {
        resolve(null);
      });
      this.responsePromise = responsePromise;
      this.parseResponse = parseResponse;
    }
    _thenUnwrap(transform) {
      return new _APIPromise(this.responsePromise, async (props) => transform(await this.parseResponse(props)));
    }
    /**
     * Gets the raw `Response` instance instead of parsing the response
     * data.
     *
     * If you want to parse the response body but still get the `Response`
     * instance, you can use {@link withResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` if you can,
     * or add one of these imports before your first `import … from 'groq-sdk'`:
     * - `import 'groq-sdk/shims/node'` (if you're running on Node)
     * - `import 'groq-sdk/shims/web'` (otherwise)
     */
    asResponse() {
      return this.responsePromise.then((p) => p.response);
    }
    /**
     * Gets the parsed response data and the raw `Response` instance.
     *
     * If you just want to get the raw `Response` instance without parsing it,
     * you can use {@link asResponse()}.
     *
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` if you can,
     * or add one of these imports before your first `import … from 'groq-sdk'`:
     * - `import 'groq-sdk/shims/node'` (if you're running on Node)
     * - `import 'groq-sdk/shims/web'` (otherwise)
     */
    async withResponse() {
      const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
      return { data, response };
    }
    parse() {
      if (!this.parsedPromise) {
        this.parsedPromise = this.responsePromise.then(this.parseResponse);
      }
      return this.parsedPromise;
    }
    then(onfulfilled, onrejected) {
      return this.parse().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.parse().catch(onrejected);
    }
    finally(onfinally) {
      return this.parse().finally(onfinally);
    }
  };
  var APIClient = class {
    constructor({
      baseURL,
      maxRetries = 2,
      timeout = 6e4,
      // 1 minute
      httpAgent,
      fetch: overridenFetch
    }) {
      this.baseURL = baseURL;
      this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
      this.timeout = validatePositiveInteger("timeout", timeout);
      this.httpAgent = httpAgent;
      this.fetch = overridenFetch ?? fetch2;
    }
    authHeaders(opts) {
      return {};
    }
    /**
     * Override this to add your own default headers, for example:
     *
     *  {
     *    ...super.defaultHeaders(),
     *    Authorization: 'Bearer 123',
     *  }
     */
    defaultHeaders(opts) {
      return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": this.getUserAgent(),
        ...getPlatformHeaders(),
        ...this.authHeaders(opts)
      };
    }
    /**
     * Override this to add your own headers validation:
     */
    validateHeaders(headers, customHeaders) {
    }
    defaultIdempotencyKey() {
      return `stainless-node-retry-${uuid4()}`;
    }
    get(path, opts) {
      return this.methodRequest("get", path, opts);
    }
    post(path, opts) {
      return this.methodRequest("post", path, opts);
    }
    patch(path, opts) {
      return this.methodRequest("patch", path, opts);
    }
    put(path, opts) {
      return this.methodRequest("put", path, opts);
    }
    delete(path, opts) {
      return this.methodRequest("delete", path, opts);
    }
    methodRequest(method, path, opts) {
      return this.request(Promise.resolve(opts).then(async (opts2) => {
        const body = opts2 && isBlobLike(opts2?.body) ? new DataView(await opts2.body.arrayBuffer()) : opts2?.body instanceof DataView ? opts2.body : opts2?.body instanceof ArrayBuffer ? new DataView(opts2.body) : opts2 && ArrayBuffer.isView(opts2?.body) ? new DataView(opts2.body.buffer) : opts2?.body;
        return { method, path, ...opts2, body };
      }));
    }
    getAPIList(path, Page, opts) {
      return this.requestAPIList(Page, { method: "get", path, ...opts });
    }
    calculateContentLength(body) {
      if (typeof body === "string") {
        if (typeof Buffer !== "undefined") {
          return Buffer.byteLength(body, "utf8").toString();
        }
        if (typeof TextEncoder !== "undefined") {
          const encoder = new TextEncoder();
          const encoded = encoder.encode(body);
          return encoded.length.toString();
        }
      } else if (ArrayBuffer.isView(body)) {
        return body.byteLength.toString();
      }
      return null;
    }
    buildRequest(options) {
      const { method, path, query, headers = {} } = options;
      const body = ArrayBuffer.isView(options.body) || options.__binaryRequest && typeof options.body === "string" ? options.body : isMultipartBody(options.body) ? options.body.body : options.body ? JSON.stringify(options.body, null, 2) : null;
      const contentLength = this.calculateContentLength(body);
      const url = this.buildURL(path, query);
      if ("timeout" in options)
        validatePositiveInteger("timeout", options.timeout);
      const timeout = options.timeout ?? this.timeout;
      const httpAgent = options.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
      const minAgentTimeout = timeout + 1e3;
      if (typeof httpAgent?.options?.timeout === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
        httpAgent.options.timeout = minAgentTimeout;
      }
      if (this.idempotencyHeader && method !== "get") {
        if (!options.idempotencyKey)
          options.idempotencyKey = this.defaultIdempotencyKey();
        headers[this.idempotencyHeader] = options.idempotencyKey;
      }
      const reqHeaders = this.buildHeaders({ options, headers, contentLength });
      const req = {
        method,
        ...body && { body },
        headers: reqHeaders,
        ...httpAgent && { agent: httpAgent },
        // @ts-ignore node-fetch uses a custom AbortSignal type that is
        // not compatible with standard web types
        signal: options.signal ?? null
      };
      return { req, url, timeout };
    }
    buildHeaders({ options, headers, contentLength }) {
      const reqHeaders = {};
      if (contentLength) {
        reqHeaders["content-length"] = contentLength;
      }
      const defaultHeaders = this.defaultHeaders(options);
      applyHeadersMut(reqHeaders, defaultHeaders);
      applyHeadersMut(reqHeaders, headers);
      if (isMultipartBody(options.body) && kind !== "node") {
        delete reqHeaders["content-type"];
      }
      this.validateHeaders(reqHeaders, headers);
      return reqHeaders;
    }
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
     */
    async prepareOptions(options) {
    }
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    async prepareRequest(request, { url, options }) {
    }
    parseHeaders(headers) {
      return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : { ...headers };
    }
    makeStatusError(status, error, message, headers) {
      return APIError.generate(status, error, message, headers);
    }
    request(options, remainingRetries = null) {
      return new APIPromise(this.makeRequest(options, remainingRetries));
    }
    async makeRequest(optionsInput, retriesRemaining) {
      const options = await optionsInput;
      if (retriesRemaining == null) {
        retriesRemaining = options.maxRetries ?? this.maxRetries;
      }
      await this.prepareOptions(options);
      const { req, url, timeout } = this.buildRequest(options);
      await this.prepareRequest(req, { url, options });
      debug("request", url, options, req.headers);
      if (options.signal?.aborted) {
        throw new APIUserAbortError();
      }
      const controller = new AbortController();
      const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
      if (response instanceof Error) {
        if (options.signal?.aborted) {
          throw new APIUserAbortError();
        }
        if (retriesRemaining) {
          return this.retryRequest(options, retriesRemaining);
        }
        if (response.name === "AbortError") {
          throw new APIConnectionTimeoutError();
        }
        throw new APIConnectionError({ cause: response });
      }
      const responseHeaders = createResponseHeaders(response.headers);
      if (!response.ok) {
        if (retriesRemaining && this.shouldRetry(response)) {
          const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
          debug(`response (error; ${retryMessage2})`, response.status, url, responseHeaders);
          return this.retryRequest(options, retriesRemaining, responseHeaders);
        }
        const errText = await response.text().catch((e) => castToError(e).message);
        const errJSON = safeJSON(errText);
        const errMessage = errJSON ? void 0 : errText;
        const retryMessage = retriesRemaining ? `(error; no more retries left)` : `(error; not retryable)`;
        debug(`response (error; ${retryMessage})`, response.status, url, responseHeaders, errMessage);
        const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
        throw err;
      }
      return { response, options, controller };
    }
    requestAPIList(Page, options) {
      const request = this.makeRequest(options, null);
      return new PagePromise(this, request, Page);
    }
    buildURL(path, query) {
      const url = isAbsoluteURL(path) ? new URL(path) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
      const defaultQuery = this.defaultQuery();
      if (!isEmptyObj(defaultQuery)) {
        query = { ...defaultQuery, ...query };
      }
      if (typeof query === "object" && query && !Array.isArray(query)) {
        url.search = this.stringifyQuery(query);
      }
      return url.toString();
    }
    stringifyQuery(query) {
      return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
          return `${encodeURIComponent(key)}=`;
        }
        throw new GroqError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
      }).join("&");
    }
    async fetchWithTimeout(url, init, ms, controller) {
      const { signal, ...options } = init || {};
      if (signal)
        signal.addEventListener("abort", () => controller.abort());
      const timeout = setTimeout(() => controller.abort(), ms);
      return this.getRequestClient().fetch.call(void 0, url, { signal: controller.signal, ...options }).finally(() => {
        clearTimeout(timeout);
      });
    }
    getRequestClient() {
      return { fetch: this.fetch };
    }
    shouldRetry(response) {
      const shouldRetryHeader = response.headers.get("x-should-retry");
      if (shouldRetryHeader === "true")
        return true;
      if (shouldRetryHeader === "false")
        return false;
      if (response.status === 408)
        return true;
      if (response.status === 409)
        return true;
      if (response.status === 429)
        return true;
      if (response.status >= 500)
        return true;
      return false;
    }
    async retryRequest(options, retriesRemaining, responseHeaders) {
      let timeoutMillis;
      const retryAfterMillisHeader = responseHeaders?.["retry-after-ms"];
      if (retryAfterMillisHeader) {
        const timeoutMs = parseFloat(retryAfterMillisHeader);
        if (!Number.isNaN(timeoutMs)) {
          timeoutMillis = timeoutMs;
        }
      }
      const retryAfterHeader = responseHeaders?.["retry-after"];
      if (retryAfterHeader && !timeoutMillis) {
        const timeoutSeconds = parseFloat(retryAfterHeader);
        if (!Number.isNaN(timeoutSeconds)) {
          timeoutMillis = timeoutSeconds * 1e3;
        } else {
          timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
        }
      }
      if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
        const maxRetries = options.maxRetries ?? this.maxRetries;
        timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
      }
      await sleep(timeoutMillis);
      return this.makeRequest(options, retriesRemaining - 1);
    }
    calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
      const initialRetryDelay = 0.5;
      const maxRetryDelay = 8;
      const numRetries = maxRetries - retriesRemaining;
      const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
      const jitter = 1 - Math.random() * 0.25;
      return sleepSeconds * jitter * 1e3;
    }
    getUserAgent() {
      return `${this.constructor.name}/JS ${VERSION}`;
    }
  };
  var AbstractPage = class {
    constructor(client, response, body, options) {
      _AbstractPage_client.set(this, void 0);
      __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
      this.options = options;
      this.response = response;
      this.body = body;
    }
    hasNextPage() {
      const items = this.getPaginatedItems();
      if (!items.length)
        return false;
      return this.nextPageInfo() != null;
    }
    async getNextPage() {
      const nextInfo = this.nextPageInfo();
      if (!nextInfo) {
        throw new GroqError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      }
      const nextOptions = { ...this.options };
      if ("params" in nextInfo && typeof nextOptions.query === "object") {
        nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
      } else if ("url" in nextInfo) {
        const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
        for (const [key, value] of params) {
          nextInfo.url.searchParams.set(key, value);
        }
        nextOptions.query = void 0;
        nextOptions.path = nextInfo.url.toString();
      }
      return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
    }
    async *iterPages() {
      let page = this;
      yield page;
      while (page.hasNextPage()) {
        page = await page.getNextPage();
        yield page;
      }
    }
    async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
      for await (const page of this.iterPages()) {
        for (const item of page.getPaginatedItems()) {
          yield item;
        }
      }
    }
  };
  var PagePromise = class extends APIPromise {
    constructor(client, request, Page) {
      super(request, async (props) => new Page(client, props.response, await defaultParseResponse(props), props.options));
    }
    /**
     * Allow auto-paginating iteration on an unawaited list call, eg:
     *
     *    for await (const item of client.items.list()) {
     *      console.log(item)
     *    }
     */
    async *[Symbol.asyncIterator]() {
      const page = await this;
      for await (const item of page) {
        yield item;
      }
    }
  };
  var createResponseHeaders = (headers) => {
    return new Proxy(Object.fromEntries(
      // @ts-ignore
      headers.entries()
    ), {
      get(target, name) {
        const key = name.toString();
        return target[key.toLowerCase()] || target[key];
      }
    });
  };
  var getPlatformProperties = () => {
    if (typeof Deno !== "undefined" && Deno.build != null) {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": normalizePlatform(Deno.build.os),
        "X-Stainless-Arch": normalizeArch(Deno.build.arch),
        "X-Stainless-Runtime": "deno",
        "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
      };
    }
    if (typeof EdgeRuntime !== "undefined") {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": `other:${EdgeRuntime}`,
        "X-Stainless-Runtime": "edge",
        "X-Stainless-Runtime-Version": process.version
      };
    }
    if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": normalizePlatform(process.platform),
        "X-Stainless-Arch": normalizeArch(process.arch),
        "X-Stainless-Runtime": "node",
        "X-Stainless-Runtime-Version": process.version
      };
    }
    const browserInfo = getBrowserInfo();
    if (browserInfo) {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
        "X-Stainless-Runtime-Version": browserInfo.version
      };
    }
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": "unknown",
      "X-Stainless-Runtime-Version": "unknown"
    };
  };
  function getBrowserInfo() {
    if (typeof navigator === "undefined" || !navigator) {
      return null;
    }
    const browserPatterns = [
      { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
    ];
    for (const { key, pattern } of browserPatterns) {
      const match = pattern.exec(navigator.userAgent);
      if (match) {
        const major = match[1] || 0;
        const minor = match[2] || 0;
        const patch = match[3] || 0;
        return { browser: key, version: `${major}.${minor}.${patch}` };
      }
    }
    return null;
  }
  var normalizeArch = (arch) => {
    if (arch === "x32")
      return "x32";
    if (arch === "x86_64" || arch === "x64")
      return "x64";
    if (arch === "arm")
      return "arm";
    if (arch === "aarch64" || arch === "arm64")
      return "arm64";
    if (arch)
      return `other:${arch}`;
    return "unknown";
  };
  var normalizePlatform = (platform) => {
    platform = platform.toLowerCase();
    if (platform.includes("ios"))
      return "iOS";
    if (platform === "android")
      return "Android";
    if (platform === "darwin")
      return "MacOS";
    if (platform === "win32")
      return "Windows";
    if (platform === "freebsd")
      return "FreeBSD";
    if (platform === "openbsd")
      return "OpenBSD";
    if (platform === "linux")
      return "Linux";
    if (platform)
      return `Other:${platform}`;
    return "Unknown";
  };
  var _platformHeaders;
  var getPlatformHeaders = () => {
    return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
  };
  var safeJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      return void 0;
    }
  };
  var startsWithSchemeRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
  var isAbsoluteURL = (url) => {
    return startsWithSchemeRegexp.test(url);
  };
  var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  var validatePositiveInteger = (name, n) => {
    if (typeof n !== "number" || !Number.isInteger(n)) {
      throw new GroqError(`${name} must be an integer`);
    }
    if (n < 0) {
      throw new GroqError(`${name} must be a positive integer`);
    }
    return n;
  };
  var castToError = (err) => {
    if (err instanceof Error)
      return err;
    return new Error(err);
  };
  var readEnv = (env) => {
    if (typeof process !== "undefined") {
      return process.env?.[env]?.trim() ?? void 0;
    }
    if (typeof Deno !== "undefined") {
      return Deno.env?.get?.(env)?.trim();
    }
    return void 0;
  };
  function isEmptyObj(obj) {
    if (!obj)
      return true;
    for (const _k in obj)
      return false;
    return true;
  }
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function applyHeadersMut(targetHeaders, newHeaders) {
    for (const k in newHeaders) {
      if (!hasOwn(newHeaders, k))
        continue;
      const lowerKey = k.toLowerCase();
      if (!lowerKey)
        continue;
      const val = newHeaders[k];
      if (val === null) {
        delete targetHeaders[lowerKey];
      } else if (val !== void 0) {
        targetHeaders[lowerKey] = val;
      }
    }
  }
  function debug(action, ...args) {
    if (typeof process !== "undefined" && process?.env?.["DEBUG"] === "true") {
      console.log(`Groq:DEBUG:${action}`, ...args);
    }
  }
  var uuid4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  };
  var isRunningInBrowser = () => {
    return (
      // @ts-ignore
      typeof window !== "undefined" && // @ts-ignore
      typeof window.document !== "undefined" && // @ts-ignore
      typeof navigator !== "undefined"
    );
  };

  // node_modules/groq-sdk/resource.mjs
  var APIResource = class {
    constructor(client) {
      this._client = client;
    }
  };

  // node_modules/groq-sdk/resources/audio/transcriptions.mjs
  var Transcriptions = class extends APIResource {
    /**
     * Transcribes audio into the input language.
     */
    create(body, options) {
      return this._client.post("/openai/v1/audio/transcriptions", multipartFormRequestOptions({ body, ...options }));
    }
  };
  /* @__PURE__ */ (function(Transcriptions2) {
  })(Transcriptions || (Transcriptions = {}));

  // node_modules/groq-sdk/resources/audio/translations.mjs
  var Translations = class extends APIResource {
    /**
     * Translates audio into English.
     */
    create(body, options) {
      return this._client.post("/openai/v1/audio/translations", multipartFormRequestOptions({ body, ...options }));
    }
  };
  /* @__PURE__ */ (function(Translations2) {
  })(Translations || (Translations = {}));

  // node_modules/groq-sdk/resources/audio/audio.mjs
  var Audio = class extends APIResource {
    constructor() {
      super(...arguments);
      this.transcriptions = new Transcriptions(this._client);
      this.translations = new Translations(this._client);
    }
  };
  (function(Audio2) {
    Audio2.Transcriptions = Transcriptions;
    Audio2.Translations = Translations;
  })(Audio || (Audio = {}));

  // node_modules/groq-sdk/resources/chat/completions.mjs
  var Completions = class extends APIResource {
    create(body, options) {
      return this._client.post("/openai/v1/chat/completions", {
        body,
        ...options,
        stream: body.stream ?? false
      });
    }
  };
  /* @__PURE__ */ (function(Completions3) {
  })(Completions || (Completions = {}));

  // node_modules/groq-sdk/resources/chat/chat.mjs
  var Chat = class extends APIResource {
    constructor() {
      super(...arguments);
      this.completions = new Completions(this._client);
    }
  };
  (function(Chat2) {
    Chat2.Completions = Completions;
  })(Chat || (Chat = {}));

  // node_modules/groq-sdk/resources/completions.mjs
  var Completions2 = class extends APIResource {
  };
  /* @__PURE__ */ (function(Completions3) {
  })(Completions2 || (Completions2 = {}));

  // node_modules/groq-sdk/resources/embeddings.mjs
  var Embeddings = class extends APIResource {
    /**
     * Creates an embedding vector representing the input text.
     */
    create(body, options) {
      return this._client.post("/openai/v1/embeddings", { body, ...options });
    }
  };
  /* @__PURE__ */ (function(Embeddings2) {
  })(Embeddings || (Embeddings = {}));

  // node_modules/groq-sdk/resources/models.mjs
  var Models = class extends APIResource {
    /**
     * Get a specific model
     */
    retrieve(model, options) {
      return this._client.get(`/openai/v1/models/${model}`, options);
    }
    /**
     * get all available models
     */
    list(options) {
      return this._client.get("/openai/v1/models", options);
    }
    /**
     * Delete a model
     */
    delete(model, options) {
      return this._client.delete(`/openai/v1/models/${model}`, options);
    }
  };
  /* @__PURE__ */ (function(Models2) {
  })(Models || (Models = {}));

  // node_modules/groq-sdk/index.mjs
  var _a;
  var Groq = class extends APIClient {
    /**
     * API Client for interfacing with the Groq API.
     *
     * @param {string | undefined} [opts.apiKey=process.env['GROQ_API_KEY'] ?? undefined]
     * @param {string} [opts.baseURL=process.env['GROQ_BASE_URL'] ?? https://api.groq.com] - Override the default base URL for the API.
     * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
     * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
     * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     */
    constructor({ baseURL = readEnv("GROQ_BASE_URL"), apiKey = readEnv("GROQ_API_KEY"), ...opts } = {}) {
      if (apiKey === void 0) {
        throw new GroqError("The GROQ_API_KEY environment variable is missing or empty; either provide it, or instantiate the Groq client with an apiKey option, like new Groq({ apiKey: 'My API Key' }).");
      }
      const options = {
        apiKey,
        ...opts,
        baseURL: baseURL || `https://api.groq.com`
      };
      if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
        throw new GroqError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Groq({ apiKey, dangerouslyAllowBrowser: true })");
      }
      super({
        baseURL: options.baseURL,
        timeout: options.timeout ?? 6e4,
        httpAgent: options.httpAgent,
        maxRetries: options.maxRetries,
        fetch: options.fetch
      });
      this.completions = new Completions2(this);
      this.chat = new Chat(this);
      this.embeddings = new Embeddings(this);
      this.audio = new Audio(this);
      this.models = new Models(this);
      this._options = options;
      this.apiKey = apiKey;
    }
    defaultQuery() {
      return this._options.defaultQuery;
    }
    defaultHeaders(opts) {
      return {
        ...super.defaultHeaders(opts),
        ...this._options.defaultHeaders
      };
    }
    authHeaders(opts) {
      return { Authorization: `Bearer ${this.apiKey}` };
    }
  };
  _a = Groq;
  Groq.Groq = _a;
  Groq.GroqError = GroqError;
  Groq.APIError = APIError;
  Groq.APIConnectionError = APIConnectionError;
  Groq.APIConnectionTimeoutError = APIConnectionTimeoutError;
  Groq.APIUserAbortError = APIUserAbortError;
  Groq.NotFoundError = NotFoundError;
  Groq.ConflictError = ConflictError;
  Groq.RateLimitError = RateLimitError;
  Groq.BadRequestError = BadRequestError;
  Groq.AuthenticationError = AuthenticationError;
  Groq.InternalServerError = InternalServerError;
  Groq.PermissionDeniedError = PermissionDeniedError;
  Groq.UnprocessableEntityError = UnprocessableEntityError;
  Groq.toFile = toFile;
  Groq.fileFromPath = fileFromPath;
  var { GroqError: GroqError2, APIError: APIError2, APIConnectionError: APIConnectionError2, APIConnectionTimeoutError: APIConnectionTimeoutError2, APIUserAbortError: APIUserAbortError2, NotFoundError: NotFoundError2, ConflictError: ConflictError2, RateLimitError: RateLimitError2, BadRequestError: BadRequestError2, AuthenticationError: AuthenticationError2, InternalServerError: InternalServerError2, PermissionDeniedError: PermissionDeniedError2, UnprocessableEntityError: UnprocessableEntityError2 } = error_exports;
  (function(Groq2) {
    Groq2.Completions = Completions2;
    Groq2.Chat = Chat;
    Groq2.Embeddings = Embeddings;
    Groq2.Audio = Audio;
    Groq2.Models = Models;
  })(Groq || (Groq = {}));
  var groq_sdk_default = Groq;

  // src/journal.js
  var groq = new groq_sdk_default({ apiKey: "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", dangerouslyAllowBrowser: true });
  var journalData = [
    {
      text: "wasdsadsa",
      name: "Journal 1",
      reflection: ""
    },
    {
      text: "hello",
      name: "Journal 2",
      reflection: ""
    }
  ];
  document.getElementById("journalTest").remove();
  async function getGroqChatCompletion() {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Reflect on my journal, keep it sweet and short and give ways to improve ${journalData[currentIndex].text}. You're not in an active chat. Only provide advice, summarize, and point out key important details. Be empathetic and sympathetic.`
        }
      ],
      model: "llama-3.1-70b-versatile"
    });
  }
  var array = document.getElementsByClassName("journalButton");
  var currentIndex = 0;
  var element = document.getElementsByClassName("journal")[currentIndex];
  element.value = journalData[currentIndex].text;
  var resultArray = [];
  document.getElementById("reflectButton").onclick = async function() {
    document.getElementById("reflection").classList.add("show");
    const chatCompletion = await getGroqChatCompletion();
    var result = chatCompletion.choices[0].message.content;
    result = result.replaceAll("\n", "<br>");
    resultArray = result.split(" ");
    document.getElementById("reflectionParagraph").innerHTML = "";
    for (let i = 0; i < resultArray.length; i++) {
      setTimeout(() => {
        document.getElementById("reflectionParagraph").innerHTML += resultArray[i] + " ";
        if (i == resultArray.length - 1) {
          document.getElementById("reflectionParagraph").innerHTML += "<br>";
        }
      }, 50 * i);
    }
    document.getElementById("reflection").classList.add("show");
  };
  document.getElementById("reflectExpand").onclick = function() {
    document.getElementById("reflection").classList.add("show");
  };
  document.getElementById("xButton").onclick = function() {
    document.getElementById("reflection").classList.remove("show");
    document.getElementById("reflection").classList.add("hidden");
    document.getElementById("reflectExpand").classList.remove("hideReflect");
    document.getElementById("reflectExpand").classList.add("showReflect");
  };
  setInterval(() => {
    var element2 = document.getElementsByClassName("journal");
    journalData[currentIndex].text = element2[0].value;
  }, 1 / 60);
})();
