export const jmespath = async (path: string, json: any) => {
  function isObject(obj: any) {
    return obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
  }

  function strictDeepEqual(first: any, second: any) {
    if (first === second) {
      return true;
    }
    const firstType = Object.prototype.toString.call(first);
    if (firstType !== Object.prototype.toString.call(second)) {
      return false;
    }
    if (Array.isArray(first)) {
      if (first.length !== second.length) {
        return false;
      }
      for (let i = 0; i < first.length; i += 1) {
        if (!strictDeepEqual(first[i], second[i])) {
          return false;
        }
      }
      return true;
    }
    if (isObject(first)) {
      const keysSeen = {};
      for (const key in first) {
        if (Object.hasOwnProperty.call(first, key)) {
          if (!strictDeepEqual(first[key], second[key])) {
            return false;
          }
          keysSeen[key] = true;
        }
      }
      for (const key2 in second) {
        if (Object.hasOwnProperty.call(second, key2)) {
          if (keysSeen[key2] !== true) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  function isFalse(obj: any) {
    if (obj === '' || obj === false || obj === null || obj === undefined) {
      return true;
    }
    if (Array.isArray(obj) && obj.length === 0) {
      return true;
    }
    if (isObject(obj)) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  function objValues(obj: any) {
    const keys = Object.keys(obj);
    const values = [];
    for (let i = 0; i < keys.length; i += 1) {
      values.push(obj[keys[i]]);
    }
    return values;
  }

  let trimLeft: (str: string) => string;
  if (typeof String.prototype.trimLeft === 'function') {
    trimLeft = (str: string) => {
      return str.trimLeft();
    };
  } else {
    trimLeft = (str: string): string => {
      const match = str.match(/^\s*(.*)/);
      return (match && match[1]) as string;
    };
  }

  const typesAsString = {
    0: 'NUMBER',
    1: 'ANY',
    2: 'STRING',
    3: 'ARRAY',
    4: 'OBJECT',
    5: 'BOOLEAN',
    6: 'EXPREF',
    7: 'NULL',
    8: 'ARRAY_NUMBER',
    9: 'ARRAY_STRING',
  };

  const TYPE_NUMBER = 0;
  const TYPE_ANY = 1;
  const TYPE_STRING = 2;
  const TYPE_ARRAY = 3;
  const TYPE_OBJECT = 4;
  const TYPE_BOOLEAN = 5;
  const TYPE_EXPREF = 6;
  const TYPE_NULL = 7;
  const TYPE_ARRAY_NUMBER = 8;
  const TYPE_ARRAY_STRING = 9;

  const TOK_EOF = 'EOF';
  const TOK_UNQUOTEDIDENTIFIER = 'UnquotedIdentifier';
  const TOK_QUOTEDIDENTIFIER = 'QuotedIdentifier';
  const TOK_RBRACKET = 'Rbracket';
  const TOK_RPAREN = 'Rparen';
  const TOK_COMMA = 'Comma';
  const TOK_COLON = 'Colon';
  const TOK_RBRACE = 'Rbrace';
  const TOK_NUMBER = 'Number';
  const TOK_CURRENT = 'Current';
  const TOK_EXPREF = 'Expref';
  const TOK_PIPE = 'Pipe';
  const TOK_OR = 'Or';
  const TOK_AND = 'And';
  const TOK_EQ = 'EQ';
  const TOK_GT = 'GT';
  const TOK_LT = 'LT';
  const TOK_GTE = 'GTE';
  const TOK_LTE = 'LTE';
  const TOK_NE = 'NE';
  const TOK_FLATTEN = 'Flatten';
  const TOK_STAR = 'Star';
  const TOK_FILTER = 'Filter';
  const TOK_DOT = 'Dot';
  const TOK_NOT = 'Not';
  const TOK_LBRACE = 'Lbrace';
  const TOK_LBRACKET = 'Lbracket';
  const TOK_LPAREN = 'Lparen';
  const TOK_LITERAL = 'Literal';

  const basicTokens = {
    '(': TOK_LPAREN,
    ')': TOK_RPAREN,
    '*': TOK_STAR,
    ',': TOK_COMMA,
    '.': TOK_DOT,
    ':': TOK_COLON,
    '@': TOK_CURRENT,
    ']': TOK_RBRACKET,
    '{': TOK_LBRACE,
    '}': TOK_RBRACE,
  };

  const operatorStartToken = {
    '!': true,
    '<': true,
    '=': true,
    '>': true,
  };

  const skipChars = {
    '\t': true,
    '\n': true,
    ' ': true,
  };

  interface Token {
    type: string;
    value: string | number;
    start: number;
  }

  function isAlpha(ch: string) {
    // tslint:disable-next-line: strict-comparisons
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_';
  }

  function isNum(ch: string) {
    // tslint:disable-next-line: strict-comparisons
    return (ch >= '0' && ch <= '9') || ch === '-';
  }
  function isAlphaNum(ch: string) {
    // tslint:disable-next-line: strict-comparisons
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '_';
  }

  class Lexer {
    _current = 0;
    tokenize(stream: string) {
      const tokens: Token[] = [];

      let start;
      let identifier;
      let token;
      while (this._current < stream.length) {
        if (isAlpha(stream[this._current])) {
          start = this._current;
          identifier = this.consumeUnquotedIdentifier(stream);
          tokens.push({
            start,
            type: TOK_UNQUOTEDIDENTIFIER,
            value: identifier,
          });
        } else if (basicTokens[stream[this._current]] !== undefined) {
          tokens.push({
            start: this._current,
            type: basicTokens[stream[this._current]],
            value: stream[this._current],
          });
          this._current += 1;
        } else if (isNum(stream[this._current])) {
          token = this.consumeNumber(stream);
          tokens.push(token);
        } else if (stream[this._current] === '[') {
          token = this.consumeLBracket(stream);
          tokens.push(token);
        } else if (stream[this._current] === '"') {
          start = this._current;
          identifier = this.consumeQuotedIdentifier(stream);
          tokens.push({
            start,
            type: TOK_QUOTEDIDENTIFIER,
            value: identifier,
          });
        } else if (stream[this._current] === `'`) {
          start = this._current;
          identifier = this.consumeRawStringLiteral(stream);
          tokens.push({
            start,
            type: TOK_LITERAL,
            value: identifier,
          });
        } else if (stream[this._current] === '`') {
          start = this._current;
          const literal = this.consumeLiteral(stream);
          tokens.push({
            start,
            type: TOK_LITERAL,
            value: literal,
          });
        } else if (operatorStartToken[stream[this._current]] !== undefined) {
          token = this.consumeOperator(stream);
          token && tokens.push(token);
        } else if (skipChars[stream[this._current]] !== undefined) {
          this._current += 1;
        } else if (stream[this._current] === '&') {
          start = this._current;
          this._current += 1;
          if (stream[this._current] === '&') {
            this._current += 1;
            tokens.push({ start, type: TOK_AND, value: '&&' });
          } else {
            tokens.push({ start, type: TOK_EXPREF, value: '&' });
          }
        } else if (stream[this._current] === '|') {
          start = this._current;
          this._current += 1;
          if (stream[this._current] === '|') {
            this._current += 1;
            tokens.push({ start, type: TOK_OR, value: '||' });
          } else {
            tokens.push({ start, type: TOK_PIPE, value: '|' });
          }
        } else {
          const error = new Error(`Unknown character: ${stream[this._current]}`);
          error.name = 'LexerError';
          throw error;
        }
      }
      return tokens;
    }

    private consumeUnquotedIdentifier(stream: string): string {
      const start = this._current;
      this._current += 1;
      while (this._current < stream.length && isAlphaNum(stream[this._current])) {
        this._current += 1;
      }
      return stream.slice(start, this._current);
    }

    private consumeQuotedIdentifier(stream: string): string {
      const start = this._current;
      this._current += 1;
      const maxLength = stream.length;
      while (stream[this._current] !== '"' && this._current < maxLength) {
        let current = this._current;
        if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '"')) {
          current += 2;
        } else {
          current += 1;
        }
        this._current = current;
      }
      this._current += 1;
      return JSON.parse(stream.slice(start, this._current));
    }

    private consumeRawStringLiteral(stream: string): string {
      const start = this._current;
      this._current += 1;
      const maxLength = stream.length;
      while (stream[this._current] !== `'` && this._current < maxLength) {
        let current = this._current;
        if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === `'`)) {
          current += 2;
        } else {
          current += 1;
        }
        this._current = current;
      }
      this._current += 1;
      const literal = stream.slice(start + 1, this._current - 1);
      return literal.replace(`\\'`, `'`);
    }

    private consumeNumber(stream: string): Token {
      const start = this._current;
      this._current += 1;
      const maxLength = stream.length;
      while (isNum(stream[this._current]) && this._current < maxLength) {
        this._current += 1;
      }
      const value = parseInt(stream.slice(start, this._current), 10);
      return { start, value, type: TOK_NUMBER };
    }

    private consumeLBracket(stream: string): Token {
      const start = this._current;
      this._current += 1;
      if (stream[this._current] === '?') {
        this._current += 1;
        return { start, type: TOK_FILTER, value: '[?' };
      }
      if (stream[this._current] === ']') {
        this._current += 1;
        return { start, type: TOK_FLATTEN, value: '[]' };
      }
      return { start, type: TOK_LBRACKET, value: '[' };
    }

    private consumeOperator(stream: string): Token | undefined {
      const start = this._current;
      const startingChar = stream[start];
      this._current += 1;
      if (startingChar === '!') {
        if (stream[this._current] === '=') {
          this._current += 1;
          return { start, type: TOK_NE, value: '!=' };
        }
        return { start, type: TOK_NOT, value: '!' };
      }
      if (startingChar === '<') {
        if (stream[this._current] === '=') {
          this._current += 1;
          return { start, type: TOK_LTE, value: '<=' };
        }
        return { start, type: TOK_LT, value: '<' };
      }
      if (startingChar === '>') {
        if (stream[this._current] === '=') {
          this._current += 1;
          return { start, type: TOK_GTE, value: '>=' };
        }
        return { start, type: TOK_GT, value: '>' };
      }
      if (startingChar === '=' && stream[this._current] === '=') {
        this._current += 1;
        return { start, type: TOK_EQ, value: '==' };
      }
      return;
    }

    private consumeLiteral(stream: string): any {
      this._current += 1;
      const start = this._current;
      const maxLength = stream.length;
      let literal;
      while (stream[this._current] !== '`' && this._current < maxLength) {
        let current = this._current;
        if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '`')) {
          current += 2;
        } else {
          current += 1;
        }
        this._current = current;
      }
      let literalString = trimLeft(stream.slice(start, this._current));
      literalString = literalString.replace('\\`', '`');
      literal = (this.looksLikeJSON(literalString) && JSON.parse(literalString)) || JSON.parse(`"${literalString}"`);
      this._current += 1;
      return literal;
    }

    private looksLikeJSON(literalString: string): boolean {
      const startingChars = '[{"';
      const jsonLiterals = ['true', 'false', 'null'];
      const numberLooking = '-0123456789';

      if (literalString === '') {
        return false;
      }
      if (startingChars.indexOf(literalString[0]) >= 0) {
        return true;
      }
      if (jsonLiterals.indexOf(literalString) >= 0) {
        return true;
      }
      if (numberLooking.indexOf(literalString[0]) >= 0) {
        try {
          JSON.parse(literalString);
          return true;
        } catch (ex) {
          return false;
        }
      }
      return false;
    }
  }

  const bindingPower: { [token: string]: number } = {
    [TOK_EOF]: 0,
    [TOK_UNQUOTEDIDENTIFIER]: 0,
    [TOK_QUOTEDIDENTIFIER]: 0,
    [TOK_RBRACKET]: 0,
    [TOK_RPAREN]: 0,
    [TOK_COMMA]: 0,
    [TOK_RBRACE]: 0,
    [TOK_NUMBER]: 0,
    [TOK_CURRENT]: 0,
    [TOK_EXPREF]: 0,
    [TOK_PIPE]: 1,
    [TOK_OR]: 2,
    [TOK_AND]: 3,
    [TOK_EQ]: 5,
    [TOK_GT]: 5,
    [TOK_LT]: 5,
    [TOK_GTE]: 5,
    [TOK_LTE]: 5,
    [TOK_NE]: 5,
    [TOK_FLATTEN]: 9,
    [TOK_STAR]: 20,
    [TOK_FILTER]: 21,
    [TOK_DOT]: 40,
    [TOK_NOT]: 45,
    [TOK_LBRACE]: 50,
    [TOK_LBRACKET]: 55,
    [TOK_LPAREN]: 60,
  };

  class Parser {
    index = 0;
    tokens: Token[] = [];
    parse(expression: string) {
      this.loadTokens(expression);
      this.index = 0;
      const ast = this.expression(0);
      if (this.lookahead(0) !== TOK_EOF) {
        const token = this.lookaheadToken(0);
        const error = new Error(`Unexpected token type: ${token.type}, value: ${token.value}`);
        error.name = 'ParserError';
        throw error;
      }
      return ast;
    }

    private loadTokens(expression: string) {
      const lexer = new Lexer();
      const tokens = lexer.tokenize(expression);
      tokens.push({ type: TOK_EOF, value: '', start: expression.length });
      this.tokens = tokens;
    }

    expression(rbp: number): any {
      const leftToken = this.lookaheadToken(0);
      this.advance();
      let left = this.nud(leftToken);
      let currentTokenType = this.lookahead(0);
      while (rbp < bindingPower[currentTokenType]) {
        this.advance();
        left = this.led(currentTokenType, left);
        currentTokenType = this.lookahead(0);
      }
      return left;
    }

    private lookahead(offset: number) {
      return this.tokens[this.index + offset].type;
    }

    private lookaheadToken(offset: number) {
      return this.tokens[this.index + offset];
    }

    private advance() {
      this.index += 1;
    }

    nud(token: any): any {
      let left;
      let right;
      let expression;
      switch (token.type) {
        case TOK_LITERAL:
          return { type: 'Literal', value: token.value };
        case TOK_UNQUOTEDIDENTIFIER:
          return { type: 'Field', name: token.value };
        case TOK_QUOTEDIDENTIFIER:
          const node = { type: 'Field', name: token.value };
          if (this.lookahead(0) === TOK_LPAREN) {
            throw new Error('Quoted identifier not allowed for function names.');
          } else {
            return node;
          }
        case TOK_NOT:
          right = this.expression(bindingPower.Not);
          return { type: 'NotExpression', children: [right] };
        case TOK_STAR:
          left = { type: 'Identity' };
          right =
            (this.lookahead(0) === TOK_RBRACKET && { type: 'Identity' }) || this.parseProjectionRHS(bindingPower.Star);
          return { type: 'ValueProjection', children: [left, right] };
        case TOK_FILTER:
          return this.led(token.type, { type: 'Identity' });
        case TOK_LBRACE:
          return this.parseMultiselectHash();
        case TOK_FLATTEN:
          left = { type: TOK_FLATTEN, children: [{ type: 'Identity' }] };
          right = this.parseProjectionRHS(bindingPower.Flatten);
          return { type: 'Projection', children: [left, right] };
        case TOK_LBRACKET:
          if (this.lookahead(0) === TOK_NUMBER || this.lookahead(0) === TOK_COLON) {
            right = this.parseIndexExpression();
            return this.projectIfSlice({ type: 'Identity' }, right);
          }
          if (this.lookahead(0) === TOK_STAR && this.lookahead(1) === TOK_RBRACKET) {
            this.advance();
            this.advance();
            right = this.parseProjectionRHS(bindingPower.Star);
            return {
              children: [{ type: 'Identity' }, right],
              type: 'Projection',
            };
          }
          return this.parseMultiselectList();
        case TOK_CURRENT:
          return { type: TOK_CURRENT };
        case TOK_EXPREF:
          expression = this.expression(bindingPower.Expref);
          return { type: 'ExpressionReference', children: [expression] };
        case TOK_LPAREN:
          const args = [];
          while (this.lookahead(0) !== TOK_RPAREN) {
            if (this.lookahead(0) === TOK_CURRENT) {
              expression = { type: TOK_CURRENT };
              this.advance();
            } else {
              expression = this.expression(0);
            }
            args.push(expression);
          }
          this.match(TOK_RPAREN);
          return args[0];
        default:
          this.errorToken(token);
      }
    }

    led(tokenName: string, left: any): any {
      let right;
      switch (tokenName) {
        case TOK_DOT:
          const rbp = bindingPower.Dot;
          if (this.lookahead(0) !== TOK_STAR) {
            right = this.parseDotRHS(rbp);
            return { type: 'Subexpression', children: [left, right] };
          }
          this.advance();
          right = this.parseProjectionRHS(rbp);
          return { type: 'ValueProjection', children: [left, right] };

        case TOK_PIPE:
          right = this.expression(bindingPower.Pipe);
          return { type: TOK_PIPE, children: [left, right] };
        case TOK_OR:
          right = this.expression(bindingPower.Or);
          return { type: 'OrExpression', children: [left, right] };
        case TOK_AND:
          right = this.expression(bindingPower.And);
          return { type: 'AndExpression', children: [left, right] };
        case TOK_LPAREN:
          const name = left.name;
          const args = [];
          let expression;
          let node;
          while (this.lookahead(0) !== TOK_RPAREN) {
            if (this.lookahead(0) === TOK_CURRENT) {
              expression = { type: TOK_CURRENT };
              this.advance();
            } else {
              expression = this.expression(0);
            }
            if (this.lookahead(0) === TOK_COMMA) {
              this.match(TOK_COMMA);
            }
            args.push(expression);
          }
          this.match(TOK_RPAREN);
          node = { name, type: 'Function', children: args };
          return node;
        case TOK_FILTER:
          const condition = this.expression(0);
          this.match(TOK_RBRACKET);
          right =
            (this.lookahead(0) === TOK_FLATTEN && { type: 'Identity' }) || this.parseProjectionRHS(bindingPower.Filter);
          return { type: 'FilterProjection', children: [left, right, condition] };
        case TOK_FLATTEN:
          const leftNode = { type: TOK_FLATTEN, children: [left] };
          const rightNode = this.parseProjectionRHS(bindingPower.Flatten);
          return { type: 'Projection', children: [leftNode, rightNode] };
        case TOK_EQ:
        case TOK_NE:
        case TOK_GT:
        case TOK_GTE:
        case TOK_LT:
        case TOK_LTE:
          return this.parseComparator(left, tokenName);
        case TOK_LBRACKET:
          const token = this.lookaheadToken(0);
          if (token.type === TOK_NUMBER || token.type === TOK_COLON) {
            right = this.parseIndexExpression();
            return this.projectIfSlice(left, right);
          }
          this.match(TOK_STAR);
          this.match(TOK_RBRACKET);
          right = this.parseProjectionRHS(bindingPower.Star);
          return { type: 'Projection', children: [left, right] };

        default:
          this.errorToken(this.lookaheadToken(0));
      }
    }

    private match(tokenType: any) {
      if (this.lookahead(0) === tokenType) {
        this.advance();
      } else {
        const token = this.lookaheadToken(0);
        const error = new Error(`Expected ${tokenType}, got: ${token.type}`);
        error.name = 'ParserError';
        throw error;
      }
    }

    private errorToken(token: any) {
      const error = new Error(`Invalid token (${token.type}): "${token.value}"`);
      error.name = 'ParserError';
      throw error;
    }

    private parseIndexExpression() {
      if (this.lookahead(0) === TOK_COLON || this.lookahead(1) === TOK_COLON) {
        return this.parseSliceExpression();
      }
      {
        const node = {
          type: 'Index',
          value: this.lookaheadToken(0).value,
        };
        this.advance();
        this.match(TOK_RBRACKET);
        return node;
      }
    }

    private projectIfSlice(left: any, right: any) {
      const indexExpr = { type: 'IndexExpression', children: [left, right] };
      if (right.type === 'Slice') {
        return {
          children: [indexExpr, this.parseProjectionRHS(bindingPower.Star)],
          type: 'Projection',
        };
      }
      return indexExpr;
    }

    private parseSliceExpression() {
      const parts: (string | number | null)[] = [null, null, null];
      let index = 0;
      let currentTokenType = this.lookahead(0);
      while (currentTokenType !== TOK_RBRACKET && index < 3) {
        if (currentTokenType === TOK_COLON) {
          index += 1;
          this.advance();
        } else if (currentTokenType === TOK_NUMBER) {
          parts[index] = this.lookaheadToken(0).value;
          this.advance();
        } else {
          const token = this.lookaheadToken(0);
          const error = new Error(`Syntax error, unexpected token: ${token.value}(${token.type})`);
          error.name = 'Parsererror';
          throw error;
        }
        currentTokenType = this.lookahead(0);
      }
      this.match(TOK_RBRACKET);
      return {
        children: parts,
        type: 'Slice',
      };
    }

    private parseComparator(left: any, comparator: any) {
      const right = this.expression(bindingPower[comparator]);
      return { type: 'Comparator', name: comparator, children: [left, right] };
    }

    private parseDotRHS(rbp: number) {
      const lookahead = this.lookahead(0);
      const exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
      if (exprTokens.indexOf(lookahead) >= 0) {
        return this.expression(rbp);
      }
      if (lookahead === TOK_LBRACKET) {
        this.match(TOK_LBRACKET);
        return this.parseMultiselectList();
      }
      if (lookahead === TOK_LBRACE) {
        this.match(TOK_LBRACE);
        return this.parseMultiselectHash();
      }
    }

    private parseProjectionRHS(rbp: number) {
      let right;
      if (bindingPower[this.lookahead(0)] < 10) {
        right = { type: 'Identity' };
      } else if (this.lookahead(0) === TOK_LBRACKET) {
        right = this.expression(rbp);
      } else if (this.lookahead(0) === TOK_FILTER) {
        right = this.expression(rbp);
      } else if (this.lookahead(0) === TOK_DOT) {
        this.match(TOK_DOT);
        right = this.parseDotRHS(rbp);
      } else {
        const token = this.lookaheadToken(0);
        const error = new Error(`Sytanx error, unexpected token: ${token.value}(${token.type})`);
        error.name = 'ParserError';
        throw error;
      }
      return right;
    }

    private parseMultiselectList() {
      const expressions = [];
      while (this.lookahead(0) !== TOK_RBRACKET) {
        const expression = this.expression(0);
        expressions.push(expression);
        if (this.lookahead(0) === TOK_COMMA) {
          this.match(TOK_COMMA);
          if (this.lookahead(0) === TOK_RBRACKET) {
            throw new Error('Unexpected token Rbracket');
          }
        }
      }
      this.match(TOK_RBRACKET);
      return { type: 'MultiSelectList', children: expressions };
    }

    private parseMultiselectHash() {
      const pairs = [];
      const identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
      let keyToken;
      let keyName;
      let value;
      let node;
      // tslint:disable-next-line: prettier
      for (; ;) {
        keyToken = this.lookaheadToken(0);
        if (identifierTypes.indexOf(keyToken.type) < 0) {
          throw new Error(`Expecting an identifier token, got: ${keyToken.type}`);
        }
        keyName = keyToken.value;
        this.advance();
        this.match(TOK_COLON);
        value = this.expression(0);
        node = { value, type: 'KeyValuePair', name: keyName };
        pairs.push(node);
        if (this.lookahead(0) === TOK_COMMA) {
          this.match(TOK_COMMA);
        } else if (this.lookahead(0) === TOK_RBRACE) {
          this.match(TOK_RBRACE);
          break;
        }
      }
      return { type: 'MultiSelectHash', children: pairs };
    }
  }

  class TreeInterpreter {
    runtime: any;

    constructor(runtime: any) {
      this.runtime = runtime;
    }

    search(node: any, value: any) {
      return this.visit(node, value);
    }

    visit(node: any, value: any): any {
      let matched;
      let current;
      let result;
      let first;
      let second;
      let field;
      let left;
      let right;
      let collected;
      let i;
      let base;
      switch (node.type) {
        case 'Field':
          if (value === null) {
            return null;
          }
          if (isObject(value)) {
            field = value[node.name];
            if (field === undefined) {
              return null;
            }
            return field;
          }
          return null;
        case 'Subexpression':
          result = this.visit(node.children[0], value);
          for (i = 1; i < node.children.length; i += 1) {
            result = this.visit(node.children[1], result);
            if (result === null) {
              return null;
            }
          }
          return result;
        case 'IndexExpression':
          left = this.visit(node.children[0], value);
          right = this.visit(node.children[1], left);
          return right;
        case 'Index':
          if (!Array.isArray(value)) {
            return null;
          }
          let index = node.value;
          if (index < 0) {
            index = value.length + index;
          }
          result = value[index];
          if (result === undefined) {
            result = null;
          }
          return result;
        case 'Slice':
          if (!Array.isArray(value)) {
            return null;
          }
          const sliceParams = node.children.slice(0);
          const computed = this.computeSliceParams(value.length, sliceParams);
          const start = computed[0];
          const stop = computed[1];
          const step = computed[2];
          result = [];
          if (start === null || stop === null || step === null) return;
          if (step > 0) {
            for (i = start; i < stop; i += step) {
              result.push(value[i]);
            }
          } else {
            for (i = start; i > stop; i += step) {
              result.push(value[i]);
            }
          }
          return result;
        case 'Projection':
          base = this.visit(node.children[0], value);
          if (!Array.isArray(base)) {
            return null;
          }
          collected = [];
          for (i = 0; i < base.length; i += 1) {
            current = this.visit(node.children[1], base[i]);
            if (current !== null) {
              collected.push(current);
            }
          }
          return collected;
        case 'ValueProjection':
          base = this.visit(node.children[0], value);
          if (!isObject(base)) {
            return null;
          }
          collected = [];
          const values = objValues(base);
          for (i = 0; i < values.length; i += 1) {
            current = this.visit(node.children[1], values[i]);
            if (current !== null) {
              collected.push(current);
            }
          }
          return collected;
        case 'FilterProjection':
          base = this.visit(node.children[0], value);
          if (!Array.isArray(base)) {
            return null;
          }
          const filtered = [];
          const finalResults = [];
          for (i = 0; i < base.length; i += 1) {
            matched = this.visit(node.children[2], base[i]);
            if (!isFalse(matched)) {
              filtered.push(base[i]);
            }
          }
          for (let j = 0; j < filtered.length; j += 1) {
            current = this.visit(node.children[1], filtered[j]);
            if (current !== null) {
              finalResults.push(current);
            }
          }
          return finalResults;
        case 'Comparator':
          first = this.visit(node.children[0], value);
          second = this.visit(node.children[1], value);
          switch (node.name) {
            case TOK_EQ:
              result = strictDeepEqual(first, second);
              break;
            case TOK_NE:
              result = !strictDeepEqual(first, second);
              break;
            case TOK_GT:
              result = first > second;
              break;
            case TOK_GTE:
              result = first >= second;
              break;
            case TOK_LT:
              result = first < second;
              break;
            case TOK_LTE:
              result = first <= second;
              break;
            default:
              throw new Error(`Unknown comparator: ${node.name}`);
          }
          return result;
        case TOK_FLATTEN:
          const original = this.visit(node.children[0], value);
          if (!Array.isArray(original)) {
            return null;
          }
          const merged = [];
          for (i = 0; i < original.length; i += 1) {
            current = original[i];
            if (Array.isArray(current)) {
              merged.push.apply(merged, current);
            } else {
              merged.push(current);
            }
          }
          return merged;
        case 'Identity':
          return value;
        case 'MultiSelectList':
          if (value === null) {
            return null;
          }
          collected = [];
          for (i = 0; i < node.children.length; i += 1) {
            collected.push(this.visit(node.children[i], value));
          }
          return collected;
        case 'MultiSelectHash':
          if (value === null) {
            return null;
          }
          collected = {};
          let child;
          for (i = 0; i < node.children.length; i += 1) {
            child = node.children[i];
            collected[child.name] = this.visit(child.value, value);
          }
          return collected;
        case 'OrExpression':
          matched = this.visit(node.children[0], value);
          if (isFalse(matched)) {
            matched = this.visit(node.children[1], value);
          }
          return matched;
        case 'AndExpression':
          first = this.visit(node.children[0], value);

          if (isFalse(first)) {
            return first;
          }
          return this.visit(node.children[1], value);
        case 'NotExpression':
          first = this.visit(node.children[0], value);
          return isFalse(first);
        case 'Literal':
          return node.value;
        case TOK_PIPE:
          left = this.visit(node.children[0], value);
          return this.visit(node.children[1], left);
        case TOK_CURRENT:
          return value;
        case 'Function':
          const resolvedArgs = [];
          for (let j = 0; j < node.children.length; j += 1) {
            resolvedArgs.push(this.visit(node.children[j], value));
          }
          return this.runtime.callFunction(node.name, resolvedArgs);
        case 'ExpressionReference':
          const refNode = node.children[0];
          refNode.jmespathType = TOK_EXPREF;
          return refNode;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    }

    computeSliceParams(arrayLength: number, sliceParams: number[]): (number | null)[] {
      let start = sliceParams[0];
      let stop = sliceParams[1];
      let step = sliceParams[2];
      if (step === null) {
        step = 1;
      } else if (step === 0) {
        const error = new Error('Invalid slice, step cannot be 0');
        error.name = 'RuntimeError';
        throw error;
      }
      const stepValueNegative = step < 0 ? true : false;
      start =
        (start === null && (stepValueNegative ? arrayLength - 1 : 0)) || this.capSliceRange(arrayLength, start, step);
      stop = (stop === null && (stepValueNegative ? -1 : arrayLength)) || this.capSliceRange(arrayLength, stop, step);

      return [start, stop, step];
    }

    capSliceRange(arrayLength: number, actualValue: number, step: number): number {
      let nextActualValue = actualValue;
      if (nextActualValue < 0) {
        nextActualValue += arrayLength;
        if (nextActualValue < 0) {
          nextActualValue = step < 0 ? -1 : 0;
        }
      } else if (nextActualValue >= arrayLength) {
        nextActualValue = step < 0 ? arrayLength - 1 : arrayLength;
      }
      return nextActualValue;
    }
  }

  class Runtime {
    _interpreter?: TreeInterpreter;

    constructor(interpreter?: any) {
      this._interpreter = interpreter;
    }

    private functionTable = {
      abs: { _func: this.functionAbs, _signature: [{ types: [TYPE_NUMBER] }] },
      avg: { _func: this.functionAvg, _signature: [{ types: [TYPE_ARRAY_NUMBER] }] },
      ceil: { _func: this.functionCeil, _signature: [{ types: [TYPE_NUMBER] }] },
      contains: {
        _func: this.functionContains,
        _signature: [{ types: [TYPE_STRING, TYPE_ARRAY] }, { types: [TYPE_ANY] }],
      },
      ends_with: {
        _func: this.functionEndsWith,
        _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }],
      },
      floor: { _func: this.functionFloor, _signature: [{ types: [TYPE_NUMBER] }] },
      join: {
        _func: this.functionJoin,
        _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_ARRAY_STRING] }],
      },
      keys: { _func: this.functionKeys, _signature: [{ types: [TYPE_OBJECT] }] },
      length: {
        _func: this.functionLength,
        _signature: [{ types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT] }],
      },
      map: {
        _func: this.functionMap,
        _signature: [{ types: [TYPE_EXPREF] }, { types: [TYPE_ARRAY] }],
      },
      max: {
        _func: this.functionMax,
        _signature: [{ types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING] }],
      },
      max_by: {
        _func: this.functionMaxBy,
        _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }],
      },
      merge: {
        _func: this.functionMerge,
        _signature: [{ types: [TYPE_OBJECT], variadic: true }],
      },
      min: {
        _func: this.functionMin,
        _signature: [{ types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING] }],
      },
      min_by: {
        _func: this.functionMinBy,
        _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }],
      },
      not_null: {
        _func: this.functionNotNull,
        _signature: [{ types: [TYPE_ANY], variadic: true }],
      },
      reverse: {
        _func: this.functionReverse,
        _signature: [{ types: [TYPE_STRING, TYPE_ARRAY] }],
      },
      sort: { _func: this.functionSort, _signature: [{ types: [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER] }] },
      sort_by: {
        _func: this.functionSortBy,
        _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }],
      },
      starts_with: {
        _func: this.functionStartsWith,
        _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }],
      },
      sum: { _func: this.functionSum, _signature: [{ types: [TYPE_ARRAY_NUMBER] }] },
      to_array: { _func: this.functionToArray, _signature: [{ types: [TYPE_ANY] }] },
      to_number: { _func: this.functionToNumber, _signature: [{ types: [TYPE_ANY] }] },
      to_string: { _func: this.functionToString, _signature: [{ types: [TYPE_ANY] }] },
      type: { _func: this.functionType, _signature: [{ types: [TYPE_ANY] }] },
      values: { _func: this.functionValues, _signature: [{ types: [TYPE_OBJECT] }] },
    };

    registerFunction(
      name: string,
      functionGenerator: (ctx: any) => { _func: (...args: any[]) => any; _signature: any },
    ) {
      this.functionTable[name] = functionGenerator(this);
    }

    callFunction(name: string, resolvedArgs: any) {
      const functionEntry = this.functionTable[name];
      if (functionEntry === undefined) {
        throw new Error(`Unknown function: ${name}()`);
      }
      this.validateArgs(name, resolvedArgs, functionEntry._signature);
      return functionEntry._func.call(this, resolvedArgs);
    }

    private validateArgs(name: string, args: any[], signature: any[]) {
      let pluralized;
      if (signature[signature.length - 1].variadic) {
        if (args.length < signature.length) {
          pluralized = signature.length === 1 ? ' argument' : ' arguments';
          throw new Error(
            `ArgumentError: ${name}() takes at least ${signature.length} ${pluralized} but received ${args.length}`,
          );
        }
      } else if (args.length !== signature.length) {
        pluralized = signature.length === 1 ? ' argument' : ' arguments';
        throw new Error(`ArgumentError: ${name}() takes ${signature.length} ${pluralized} but received ${args.length}`);
      }
      let currentSpec;
      let actualType;
      let typeMatched;
      for (let i = 0; i < signature.length; i += 1) {
        typeMatched = false;
        currentSpec = signature[i].types;
        actualType = this.getTypeName(args[i]);
        for (let j = 0; j < currentSpec.length; j += 1) {
          if (actualType !== undefined && this.typeMatches(actualType, currentSpec[j], args[i])) {
            typeMatched = true;
            break;
          }
        }
        if (!typeMatched) {
          throw new Error(`
          TypeError: ${name}()
            expected argument ${i + 1} to be type ${currentSpec}(${
            typesAsString[currentSpec]
            // tslint:disable-next-line: prettier
            }) but received type ${actualType}(${(actualType && typesAsString[actualType]) || 'UNDEFINED'}) instead.`);
        }
      }
    }

    private typeMatches(actual: number, expected: number, argValue: any[]) {
      if (expected === TYPE_ANY) {
        return true;
      }
      if (expected === TYPE_ARRAY_STRING || expected === TYPE_ARRAY_NUMBER || expected === TYPE_ARRAY) {
        if (expected === TYPE_ARRAY) {
          return actual === TYPE_ARRAY;
        }
        if (actual === TYPE_ARRAY) {
          let subtype;
          if (expected === TYPE_ARRAY_NUMBER) {
            subtype = TYPE_NUMBER;
          } else if (expected === TYPE_ARRAY_STRING) {
            subtype = TYPE_STRING;
          }
          for (let i = 0; i < argValue.length; i += 1) {
            const typeName = this.getTypeName(argValue[i]);
            if (typeName !== undefined && subtype !== undefined && !this.typeMatches(typeName, subtype, argValue[i])) {
              return false;
            }
          }
          return true;
        }
      } else {
        return actual === expected;
      }
      return false;
    }
    private getTypeName(obj: any) {
      switch (Object.prototype.toString.call(obj)) {
        case '[object String]':
          return TYPE_STRING;
        case '[object Number]':
          return TYPE_NUMBER;
        case '[object Array]':
          return TYPE_ARRAY;
        case '[object Boolean]':
          return TYPE_BOOLEAN;
        case '[object Null]':
          return TYPE_NULL;
        case '[object Object]':
          if (obj.jmespathType === TOK_EXPREF) {
            return TYPE_EXPREF;
          }
          return TYPE_OBJECT;

        default:
          return;
      }
    }

    private functionStartsWith(resolvedArgs: any[]) {
      return resolvedArgs[0].lastIndexOf(resolvedArgs[1]) === 0;
    }

    private functionEndsWith(resolvedArgs: any[]) {
      const searchStr = resolvedArgs[0];
      const suffix = resolvedArgs[1];
      return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
    }

    private functionReverse(resolvedArgs: any[]) {
      const typeName = this.getTypeName(resolvedArgs[0]);
      if (typeName === TYPE_STRING) {
        const originalStr = resolvedArgs[0];
        let reversedStr = '';
        for (let i = originalStr.length - 1; i >= 0; i -= 1) {
          reversedStr += originalStr[i];
        }
        return reversedStr;
      }
      {
        const reversedArray = resolvedArgs[0].slice(0);
        reversedArray.reverse();
        return reversedArray;
      }
    }

    private functionAbs(resolvedArgs: any[]) {
      return Math.abs(resolvedArgs[0]);
    }

    private functionCeil(resolvedArgs: any[]) {
      return Math.ceil(resolvedArgs[0]);
    }

    private functionAvg(resolvedArgs: any[]) {
      let sum = 0;
      const inputArray = resolvedArgs[0];
      for (let i = 0; i < inputArray.length; i += 1) {
        sum += inputArray[i];
      }
      return sum / inputArray.length;
    }

    private functionContains(resolvedArgs: any[]) {
      return resolvedArgs[0].indexOf(resolvedArgs[1]) >= 0;
    }

    private functionFloor(resolvedArgs: any[]) {
      return Math.floor(resolvedArgs[0]);
    }

    private functionLength(resolvedArgs: any[]) {
      if (!isObject(resolvedArgs[0])) {
        return resolvedArgs[0].length;
      }
      return Object.keys(resolvedArgs[0]).length;
    }

    private functionMap(resolvedArgs: any[]) {
      if (!this._interpreter) return [];
      const mapped = [];
      const interpreter = this._interpreter;
      const exprefNode = resolvedArgs[0];
      const elements = resolvedArgs[1];
      for (let i = 0; i < elements.length; i += 1) {
        mapped.push(interpreter.visit(exprefNode, elements[i]));
      }
      return mapped;
    }

    private functionMerge(resolvedArgs: any[]) {
      const merged = {};
      for (let i = 0; i < resolvedArgs.length; i += 1) {
        const current = resolvedArgs[i];
        for (const key in current) {
          merged[key] = current[key];
        }
      }
      return merged;
    }

    private functionMax(resolvedArgs: any[]) {
      if (resolvedArgs[0].length > 0) {
        const typeName = this.getTypeName(resolvedArgs[0][0]);
        if (typeName === TYPE_NUMBER) {
          return Math.max.apply(Math, resolvedArgs[0]);
        }
        {
          const elements = resolvedArgs[0];
          let maxElement = elements[0];
          for (let i = 1; i < elements.length; i += 1) {
            if (maxElement.localeCompare(elements[i]) < 0) {
              maxElement = elements[i];
            }
          }
          return maxElement;
        }
      }
      return null;
    }

    private functionMin(resolvedArgs: any[]) {
      if (resolvedArgs[0].length > 0) {
        const typeName = this.getTypeName(resolvedArgs[0][0]);
        if (typeName === TYPE_NUMBER) {
          return Math.min.apply(Math, resolvedArgs[0]);
        }
        {
          const elements = resolvedArgs[0];
          let minElement = elements[0];
          for (let i = 1; i < elements.length; i += 1) {
            if (elements[i].localeCompare(minElement) < 0) {
              minElement = elements[i];
            }
          }
          return minElement;
        }
      }
      return null;
    }

    private functionSum(resolvedArgs: any[]) {
      let sum = 0;
      const listToSum = resolvedArgs[0];
      for (let i = 0; i < listToSum.length; i += 1) {
        sum += listToSum[i];
      }
      return sum;
    }

    private functionType(resolvedArgs: any[]) {
      switch (this.getTypeName(resolvedArgs[0])) {
        case TYPE_NUMBER:
          return 'number';
        case TYPE_STRING:
          return 'string';
        case TYPE_ARRAY:
          return 'array';
        case TYPE_OBJECT:
          return 'object';
        case TYPE_BOOLEAN:
          return 'boolean';
        case TYPE_EXPREF:
          return 'expref';
        case TYPE_NULL:
          return 'null';
        default:
          return;
      }
    }

    private functionKeys(resolvedArgs: any[]) {
      return Object.keys(resolvedArgs[0]);
    }

    private functionValues(resolvedArgs: any[]) {
      const obj = resolvedArgs[0];
      const keys = Object.keys(obj);
      const values = [];
      for (let i = 0; i < keys.length; i += 1) {
        values.push(obj[keys[i]]);
      }
      return values;
    }

    private functionJoin(resolvedArgs: any[]) {
      const joinChar = resolvedArgs[0];
      const listJoin = resolvedArgs[1];
      return listJoin.join(joinChar);
    }

    private functionToArray(resolvedArgs: any[]) {
      if (this.getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
        return resolvedArgs[0];
      }
      return [resolvedArgs[0]];
    }

    private functionToString(resolvedArgs: any[]) {
      if (this.getTypeName(resolvedArgs[0]) === TYPE_STRING) {
        return resolvedArgs[0];
      }
      return JSON.stringify(resolvedArgs[0]);
    }

    private functionToNumber(resolvedArgs: any[]) {
      const typeName = this.getTypeName(resolvedArgs[0]);
      let convertedValue;
      if (typeName === TYPE_NUMBER) {
        return resolvedArgs[0];
      }
      if (typeName === TYPE_STRING) {
        convertedValue = +resolvedArgs[0];
        if (!isNaN(convertedValue)) {
          return convertedValue;
        }
      }
      return null;
    }

    private functionNotNull(resolvedArgs: any[]) {
      for (let i = 0; i < resolvedArgs.length; i += 1) {
        if (this.getTypeName(resolvedArgs[i]) !== TYPE_NULL) {
          return resolvedArgs[i];
        }
      }
      return null;
    }

    private functionSort(resolvedArgs: any[]) {
      const sortedArray = resolvedArgs[0].slice(0);
      sortedArray.sort();
      return sortedArray;
    }

    private functionSortBy(resolvedArgs: any[]) {
      if (!this._interpreter) return [];
      const sortedArray = resolvedArgs[0].slice(0);
      if (sortedArray.length === 0) {
        return sortedArray;
      }
      const interpreter = this._interpreter;
      const exprefNode = resolvedArgs[1];
      const requiredType = this.getTypeName(interpreter.visit(exprefNode, sortedArray[0]));
      if (requiredType !== undefined && [TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
        throw new Error('TypeError');
      }
      const decorated = [];
      for (let i = 0; i < sortedArray.length; i += 1) {
        decorated.push([i, sortedArray[i]]);
      }
      decorated.sort((a, b) => {
        const exprA = interpreter.visit(exprefNode, a[1]);
        const exprB = interpreter.visit(exprefNode, b[1]);
        if (this.getTypeName(exprA) !== requiredType) {
          throw new Error(`TypeError: expected ${requiredType}, received ${this.getTypeName(exprA)}`);
        } else if (this.getTypeName(exprB) !== requiredType) {
          throw new Error(`TypeError: expected ${requiredType}, received ${this.getTypeName(exprB)}`);
        }
        if (exprA > exprB) {
          return 1;
        }
        if (exprA < exprB) {
          return -1;
        }
        return a[0] - b[0];
      });
      for (let j = 0; j < decorated.length; j += 1) {
        sortedArray[j] = decorated[j][1];
      }
      return sortedArray;
    }

    private functionMaxBy(resolvedArgs: any[]) {
      const exprefNode = resolvedArgs[1];
      const resolvedArray = resolvedArgs[0];
      const keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
      let maxNumber = -Infinity;
      let maxRecord;
      let current;
      for (let i = 0; i < resolvedArray.length; i += 1) {
        current = keyFunction && keyFunction(resolvedArray[i]);
        if (current > maxNumber) {
          maxNumber = current;
          maxRecord = resolvedArray[i];
        }
      }
      return maxRecord;
    }

    private functionMinBy(resolvedArgs: any[]) {
      const exprefNode = resolvedArgs[1];
      const resolvedArray = resolvedArgs[0];
      const keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
      let minNumber = Infinity;
      let minRecord;
      let current;
      for (let i = 0; i < resolvedArray.length; i += 1) {
        current = keyFunction && keyFunction(resolvedArray[i]);
        if (current < minNumber) {
          minNumber = current;
          minRecord = resolvedArray[i];
        }
      }
      return minRecord;
    }

    createKeyFunction(exprefNode: any, allowedTypes: any) {
      if (!this._interpreter) return;
      const interpreter = this._interpreter;
      const keyFunc = (x: any) => {
        const current = interpreter.visit(exprefNode, x);
        if (allowedTypes.indexOf(this.getTypeName(current)) < 0) {
          const msg = `TypeError: expected one of ${allowedTypes}, received ${this.getTypeName(current)}`;
          throw new Error(msg);
        }
        return current;
      };
      return keyFunc;
    }
  }

  // function compile(stream: string) {
  //   const parser = new Parser();
  //   const ast = parser.parse(stream);
  //   return ast;
  // }

  // function tokenize(stream: string) {
  //   const lexer = new Lexer();
  //   return lexer.tokenize(stream);
  // }

  function search(data: any, expression: string) {
    const parser = new Parser();
    const runtime = new Runtime();

    runtime.registerFunction('divide', () => ({
      _func: (resolvedArgs: number[]) => {
        const [divisor, dividend] = resolvedArgs;
        return divisor / dividend;
      },
      _signature: [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }],
    }));

    const interpreter = new TreeInterpreter(runtime);
    runtime._interpreter = interpreter;
    const node = parser.parse(expression);
    // console.info('WORKER::EXPRESSION', node, expression)
    return interpreter.search(node, data);
  }

  return search(json, path);
};
