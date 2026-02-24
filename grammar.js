/**
 * @file Embedded Perl grammar for tree-sitter
 * @author Michael Budde <mbu@jobindex.dk>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const line_directive = (prefix, fieldName) =>
  $ => seq(prefix, optional(field(fieldName, $.line_content)));

const tag_rule = (prefix, fieldName) =>
  $ => seq(prefix, optional(field(fieldName, $.tag_content)), $.tag_close);

module.exports = grammar({
  name: "embedded_perl",

  extras: _ => [],

  rules: {
    source_file: $ => seq(
      repeat(choice($.directive_line, $.content_line, $.whitespace_line, $.newline)),
      optional(choice(
        alias($._final_directive_line, $.directive_line),
        alias($._final_content_line, $.content_line),
        $.line_indent
      ))
    ),

    directive_line: $ => prec(2, seq(
      optional($.line_indent),
      $._line_statement,
      $.newline
    )),

    _final_directive_line: $ => prec(2, seq(
      optional($.line_indent),
      $._line_statement
    )),

    _line_statement: $ => choice(
      $.line_raw_expression,
      $.line_expression,
      $.line_comment,
      $.line_escaped_percent,
      $.line_code
    ),

    line_raw_expression: line_directive("%==", "code"),
    line_expression: line_directive("%=", "code"),
    line_comment: line_directive("%#", "text"),
    line_escaped_percent: line_directive("%%", "text"),
    line_code: line_directive("%", "code"),

    content_line: $ => prec(1, seq(
      $._content_start,
      repeat($._content_piece),
      $.newline
    )),

    _final_content_line: $ => prec(1, seq($._content_start, repeat($._content_piece))),

    whitespace_line: $ => seq($.line_indent, $.newline),

    _content_start: $ => choice(
      $.non_directive_text,
      seq(optional($.line_indent), choice($._tag, $.escaped_open_tag, "<"))
    ),

    _content_piece: $ => choice($._tag, $.escaped_open_tag, $.non_directive_text, $.text, "<"),

    _tag: $ => choice(
      $.raw_expression_tag,
      $.expression_tag,
      $.comment_tag,
      $.code_tag
    ),

    raw_expression_tag: tag_rule("<%==", "code"),
    expression_tag: tag_rule("<%=", "code"),
    comment_tag: tag_rule("<%#", "text"),
    code_tag: tag_rule("<%", "code"),

    escaped_open_tag: _ => "<%%",

    tag_content: _ => token(prec(1, /([^%=]|=[^%]|=%[^>]|%[^>])+/)),

    tag_close: _ => seq(optional("="), "%>"),

    line_indent: _ => /[ \t]+/,
    line_content: _ => /[^\r\n]+/,
    text: _ => token(prec(1, /([^<\r\n]|<[^%\r\n])+/)),
    non_directive_text: _ => token(prec(2, /[ \t]*(?:[^<%\s\r\n]|<[^%\r\n])(?:[^<\r\n]|<[^%\r\n])*/)),
    newline: _ => /\r?\n/
  }
});
