/**
 * @file Embedded Perl grammar for tree-sitter
 * @author Michael Budde <mbu@jobindex.dk>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "embedded_perl",

  extras: _ => [],

  rules: {
    source_file: $ => seq(
      repeat(choice($.directive_line, $.content_line, $.whitespace_line, $.newline)),
      optional(choice($.final_directive_line, $.final_content_line, $.line_indent))
    ),

    directive_line: $ => prec(2, seq(
      optional($.line_indent),
      $.line_statement,
      $.newline
    )),

    final_directive_line: $ => prec(2, seq(
      optional($.line_indent),
      $.line_statement
    )),

    line_statement: $ => choice(
      $.line_raw_expression,
      $.line_expression,
      $.line_comment,
      $.line_escaped_percent,
      $.line_code
    ),

    line_raw_expression: $ => seq("%==", optional(field("code", $.line_content))),
    line_expression: $ => seq("%=", optional(field("code", $.line_content))),
    line_comment: $ => seq("%#", optional(field("text", $.line_content))),
    line_escaped_percent: $ => seq("%%", optional(field("text", $.line_content))),
    line_code: $ => seq("%", optional(field("code", $.line_content))),

    content_line: $ => prec(1, seq(
      $._content_start,
      repeat($._content_piece),
      $.newline
    )),

    final_content_line: $ => prec(1, seq($._content_start, repeat($._content_piece))),

    whitespace_line: $ => seq($.line_indent, $.newline),

    _content_start: $ => choice(
      $.non_directive_text,
      seq(optional($.line_indent), choice($.tag, $.escaped_open_tag, "<"))
    ),

    _content_piece: $ => choice($.tag, $.escaped_open_tag, $.non_directive_text, $.text, "<"),

    tag: $ => choice(
      $.raw_expression_tag,
      $.expression_tag,
      $.comment_tag,
      $.code_tag
    ),

    raw_expression_tag: $ => seq("<%==", optional(field("code", $.tag_content)), $.tag_close),
    expression_tag: $ => seq("<%=", optional(field("code", $.tag_content)), $.tag_close),
    comment_tag: $ => seq("<%#", optional(field("text", $.tag_content)), $.tag_close),
    code_tag: $ => seq("<%", optional(field("code", $.tag_content)), $.tag_close),

    escaped_open_tag: _ => "<%%",

    tag_content: _ => repeat1(choice(
      token(prec(1, /[^%]+/)),
      token(prec(1, /%[^>]/))
    )),

    tag_close: _ => seq(optional("="), "%>"),

    line_indent: _ => /[ \t]+/,
    line_content: _ => /[^\r\n]+/,
    text: _ => token(prec(1, /([^<\r\n]|<[^%\r\n])+/)),
    non_directive_text: _ => token(prec(2, /[ \t]*(?:[^<%\s\r\n]|<[^%\r\n])(?:[^<\r\n]|<[^%\r\n])*/)),
    newline: _ => /\r?\n/
  }
});
